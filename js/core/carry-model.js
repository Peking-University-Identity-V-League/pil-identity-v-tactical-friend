import { TAC_TALENT_TYPES } from '../data/talents.js';
// 牵气球挂椅时间模型 —— 移植自 maps-3d 运行页内嵌 worker
// （CARRY_RULES_VERSION = balloon-planning-2026-11-17-ui-v4），保持参数与公式一致。
// 二维近似：不含楼层与翻窗，色带按地面栅格的绕行路径时间划分。

export const CARRY_RULES_VERSION = 'balloon-planning-2026-11-17-ui-v4';

// 前锋的强力挣扎是角色特质，与人格等级无关
// https://wiki.biligame.com/dwrg/前锋 (checked 2026-11-16)
export const CARRY_SURVIVORS = Object.freeze({
  ordinary: { key: 'ordinary', struggleBonus: 0 },
  forward: { key: 'forward', struggleBonus: 0.10 },
});

// 无巨钳时每次放下增加的挣扎进度（百分点）
// https://wiki.biligame.com/dwrg/巨钳 (checked 2026-11-11)
export const CARRY_DROP_PROGRESS_DEFAULT = 25;

// 天赋加成。数据源统一在 talents.js 的 buff 字段（速度类 speedBuff / 牵起类 pickupBuff /
// 挣扎类 struggleBuff / 放下加进度类 dropBuff），此处派生成既有形状。
// group：survivor=求生者挣扎 / hunterStruggle=监管者挣扎与牵起 / hunterSpeed=监管者速度
// levels 按层数索引（从 1 层开始）；duration 为限时秒数（0 = 时间不限）
const round4 = (v) => Math.round(v * 10000) / 10000;

export const CARRY_TALENTS = Object.freeze(Object.fromEntries(
  Object.entries(TAC_TALENT_TYPES).flatMap(([key, t]) => {
    const b = t.buff || {};
    // 求生者挣扎类
    if (t.camp === 'survivor' && b.struggleBuff) {
      return [[key, { group: 'survivor', levels: b.struggleBuff.levels }]];
    }
    // 监管者挣扎类与牵起类（牵起速度只影响牵起用时，与挣扎进度分列展示）
    if (t.camp === 'hunter' && (b.struggleBuff || b.pickupBuff)) {
      const src = b.pickupBuff || b.struggleBuff;
      const def = { group: 'hunterStruggle', levels: src.levels };
      if (b.dropBuff) def.dropProgress = b.dropBuff.levels;
      return [[key, def]];
    }
    // 监管者速度类中标记了 carry 的（牵气球移动时同样生效）
    if (t.camp === 'hunter' && b.speedBuff && b.speedBuff.carry) {
      const src = b.speedBuff;
      const def = { group: 'hunterSpeed', levels: (src.levels || [src.mult]).map((v) => round4(v - 1)) };
      if (src.duration) def.duration = src.duration;
      return [[key, def]];
    }
    return [];
  })));

export const CARRY_DEFAULTS = Object.freeze({
  survivorId: 'ordinary',
  baseSpeed: 4.64,        // 牵气球基础移速 m/s
  baseStruggleSeconds: 16,
  initialProgress: 0,
  pickupSeconds: 2,
});

const clampNum = (v, min, max, fallback) => {
  const n = Number.isFinite(v) ? v : fallback;
  return Math.min(max, Math.max(min, n));
};

// 加成列表项：{ key, level }，level 从 1 起；非法项被丢弃而不是报错
export function normalizeCarryBuffs(buffs) {
  if (!Array.isArray(buffs)) return [];
  const out = [];
  for (const b of buffs) {
    const def = CARRY_TALENTS[b?.key];
    if (!def) continue;
    const level = clampNum(Math.round(b.level), 1, def.levels.length, def.levels.length);
    out.push({ key: b.key, level });
  }
  return out;
}

export function normalizeCarrySelection(input = {}) {
  const survivorId = Object.hasOwn(CARRY_SURVIVORS, input.survivorId)
    ? input.survivorId : CARRY_DEFAULTS.survivorId;
  return {
    survivorId,
    baseSpeed: clampNum(input.baseSpeed, 0.1, 40, CARRY_DEFAULTS.baseSpeed),
    baseStruggleSeconds: clampNum(input.baseStruggleSeconds, 0.1, 300, CARRY_DEFAULTS.baseStruggleSeconds),
    initialProgress: clampNum(input.initialProgress, 0, 100, CARRY_DEFAULTS.initialProgress),
    pickupSeconds: clampNum(input.pickupSeconds, 0, 20, CARRY_DEFAULTS.pickupSeconds),
    buffs: normalizeCarryBuffs(input.buffs),
  };
}

export function createCarryProfile(input = {}) {
  const selection = normalizeCarrySelection(input);
  let struggleBonus = CARRY_SURVIVORS[selection.survivorId].struggleBonus;
  let speedBonus = 0;
  let pickupSpeedup = 0;
  let dropProgressPercent = CARRY_DROP_PROGRESS_DEFAULT;
  let controlBonus = 0;
  for (const { key, level } of selection.buffs) {
    const def = CARRY_TALENTS[key];
    const value = def.levels[level - 1];
    if (def.group === 'survivor') struggleBonus += value;
    else if (def.group === 'hunterSpeed') {
      if (key === 'controlFreak') controlBonus += value; // 掌控欲：牵起后 3 秒（二维近似为前 3 秒）
      else speedBonus += value;                          // 狂欢 120s 远大于挂椅时间，按常驻处理
    } else if (key === 'mischievous') pickupSpeedup += value;
    else if (key === 'giantClaw') {
      struggleBonus += value;
      dropProgressPercent = def.dropProgress[level - 1]; // 同名多层取最高层
    }
  }
  const struggleRate = 1 + struggleBonus;
  const remainingSeconds = selection.baseStruggleSeconds
    * (1 - selection.initialProgress / 100) / struggleRate;
  const controlDuration = CARRY_TALENTS.controlFreak.duration;
  return {
    version: CARRY_RULES_VERSION,
    selection,
    struggleRate,
    remainingSeconds,
    dropProgressPercent,
    pickupSeconds: selection.pickupSeconds / (1 + pickupSpeedup),
    speedAt(seconds) {
      const bonus = seconds < controlDuration ? controlBonus : 0;
      return selection.baseSpeed * (1 + speedBonus + bonus);
    },
  };
}

// 搬运 seconds 秒后的挣扎进度与可放下次数（与 worker 的 carryDropBudget 一致）
export function carryDropBudget(profile, seconds) {
  const progressPercent = profile.selection.initialProgress
    + seconds * 100 * profile.struggleRate / profile.selection.baseStruggleSeconds;
  const canHang = progressPercent < 100 - 1e-7;
  const drops = canHang
    ? Math.max(0, Math.ceil((100 - progressPercent - 1e-7) / profile.dropProgressPercent) - 1)
    : null;
  return { progressPercent, drops, canHang, risk: canHang && progressPercent >= 90 - 1e-7 };
}

// 色带（与 worker 的 rangeBands carry 分支一致）：
// 可再放3次 / 可再放2次 / 可再放1次 / 不可再放 / 90%–100% 风险区
export const CARRY_BAND_COLORS = Object.freeze(
  ['#328bff', '#20d6a0', '#ffc247', '#f16ba8', '#fff0b3']);
export const CARRY_BAND_OPACITY = Object.freeze([0.45, 0.45, 0.45, 0.45, 0.22]);

export function carryRangeBands(profile) {
  const rate = 100 * profile.struggleRate / profile.selection.baseStruggleSeconds;
  const budget = profile.remainingSeconds;
  const initial = profile.selection.initialProgress;
  const drop = profile.dropProgressPercent;
  const at = (progress) => Math.max(0, Math.min(budget, (progress - initial) / rate));
  const riskAt = at(90);
  const safeAt = (progress) => Math.min(riskAt, at(progress));
  const cuts = [0, safeAt(100 - 3 * drop), safeAt(100 - 2 * drop), safeAt(100 - drop), riskAt, budget];
  return [0, 1, 2, 3, 4].map((i) => ({
    band: i,
    minSeconds: cuts[i],
    maxSeconds: cuts[i + 1],
    empty: cuts[i + 1] - cuts[i] < 1e-9,
  }));
}

// 时间 t 落在哪个色带；超出预算返回 -1（cuts 单调递增，空带宽度为 0 自动跳过）
export function carryBandAt(bands, seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return -1;
  if (seconds >= bands[4].maxSeconds) return -1; // 达到预算即挣扎满，不可再挂
  for (let i = 0; i < 5; i++) {
    if (!bands[i].empty && seconds < bands[i].maxSeconds + 1e-9) return i;
  }
  return -1;
}
