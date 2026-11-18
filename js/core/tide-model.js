// 化险为夷（搏命）范围模型 —— 与 maps-3d mod_range-bands.js 的 tide 区对齐：
// 搏命时长 20 秒，20–21 秒为 5% 估算余量带（只计一次，是否实际可达取决于额外加速）。
// 二维近似：不含楼层、板窗翻越与下落，色带按地面栅格的绕行路径时间划分。

export const TIDE_SECONDS = 20;
// 20 秒仍是搏命时长；20–21 秒为额外 5% 估算余量
export const TIDE_MAX_SECONDS = 21;

// 色带（与 3D range-bands 的 tide 分支一致）：
// 0–5秒 / 5–10秒 / 10–15秒 / 15–20秒 / 20–21秒（5% 余量）
export const TIDE_BAND_COLORS = Object.freeze(
  ['#328bff', '#20d6a0', '#ffc247', '#f16ba8', '#fff0b3']);
export const TIDE_BAND_OPACITY = Object.freeze([0.45, 0.45, 0.45, 0.45, 0.22]);

export function tideRangeBands() {
  const cuts = [0, 5, 10, 15, TIDE_SECONDS, TIDE_MAX_SECONDS];
  return [0, 1, 2, 3, 4].map((i) => ({
    band: i,
    minSeconds: cuts[i],
    maxSeconds: cuts[i + 1],
    empty: false,
  }));
}

// 时间 t 落在哪个色带；达到 21 秒上限返回 -1（20–21 秒为余量带，超过即不可达）
export function tideBandAt(bands, seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return -1;
  if (seconds >= bands[4].maxSeconds) return -1;
  for (let i = 0; i < 5; i++) {
    if (seconds < bands[i].maxSeconds + 1e-9) return i;
  }
  return -1;
}

// 求生者移速档案：基础移速 + 加成列表（语义与测算卡片 simulateMovement 一致——
// 非乘算加成按 1 + Σ(mult-1) 叠加，乘算加成（postMult）再整体相乘；
// duration 为限时秒数（0 = 时间不限），时限从起算起算）。
// buffs: [{ mult, postMult?, duration? }]
export function createTideProfile({ baseSpeed, buffs = [] } = {}) {
  const base = Number.isFinite(baseSpeed) && baseSpeed > 0 ? baseSpeed : 3.8;
  const list = buffs.filter((b) => Number.isFinite(b?.mult));
  return {
    remainingSeconds: TIDE_MAX_SECONDS,
    baseSpeed: base,
    speedAt(seconds) {
      const active = list.filter((b) => !b.duration || seconds < b.duration - 1e-9);
      const addMult = Math.max(0.01, 1 + active.filter((b) => !b.postMult)
        .reduce((sum, b) => sum + (b.mult - 1), 0));
      const mult = active.filter((b) => b.postMult)
        .reduce((product, b) => product * b.mult, addMult);
      return base * mult;
    },
  };
}
