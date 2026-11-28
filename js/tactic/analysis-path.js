import {
  showToast,
  tacMapWrap,
  tacPathBaseDetailBodyEl,
  tacPathBaseDetailToggleEl,
  tacPathBaseSpeedEl,
  tacPathBuffAddBtn,
  tacPathBuffBodyEl,
  tacPathBuffClose,
  tacPathBuffDur,
  tacPathBuffModal,
  tacPathBuffName,
  tacPathBuffOk,
  tacPathBuffPct,
  tacPathBuffToggleEl,
  tacPathCampToggle,
  tacPathCard,
  tacPathClearBtn,
  tacPathFixEl,
  tacPathFixNote,
  tacPathNote,
  tacPathOtherAddBtn,
  tacPathOtherClose,
  tacPathOtherList,
  tacPathOtherModal,
  tacPathPickA,
  tacPathPickB,
  tacPathProgressBar,
  tacPathProgressBox,
  tacPathResultBodyEl,
  tacPathResultBoxEl,
  tacPathResultToggleEl,
  tacPathRunBtn,
  tacPathSettingsBodyEl,
  tacPathSettingsToggleEl,
  tacPathSpeedFormEl,
  tacPathSpeedRoleEl,
  tacPathStatusA,
  tacPathStatusB,
  tacPathSummary,
  tacPathTalentAddBtn,
  tacPathTalentClose,
  tacPathTalentList,
  tacPathTalentModal,
  tacPathTraitAddBtn,
  tacPathTraitClose,
  tacPathTraitList,
  tacPathTraitModal,
  tacPathVaultEl,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import {
  computePath,
  loadNavGrid,
  navGridAvailable,
  smoothPathOnGrid,
  snapToWalkable,
} from '../core/nav-grid.js';
import { S } from '../core/state.js';
import { createTideProfile } from '../core/tide-model.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_MOVEMENT_BUFFS, TAC_MOVEMENT_SURVIVOR } from '../data/tactic-data.js';
import { tacCarryDisarm } from './analysis-carry.js';
import { renderTacChairs, tacLayer, tacUpRot } from './board.js';
import { tacBuffAppliesToBase, tacLevelLabel, tacSpeedForms, tacStateOf } from './measure.js';

/* ================= 两点最优路径规划 ================= */
// 状态与推算卡片完全私有（含移速设置区），不与其它卡片共享
const tacPathState = {
  armed: null,                // null | 'a' | 'b'：选择模式，点击地图选起点 A / 终点 B
  points: { a: null, b: null }, // { x, z } 底图像素坐标
  running: false,
  cancel: null,
  resultMapId: null,          // 结果所属地图；切图后失效
  cache: null,                // { g, result, sA, sB, profile, totalSeconds, totalMeters }
  camp: 'survivor',           // 设置区阵营：survivor | hunter
  base: { name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed, camp: 'survivor', role: null, form: 0, stKey: 'run' },
  buffs: [],                  // [{ id, type, key, name, mult, postMult?, duration }]
};

let tacPathBuffId = 0;

let tacPathCanvas = null;

/* ================= 两点最优路径规划（tacPathCard） ================= */
// 布局与狂欢之椅推算卡片对齐：选择起点 A / 终点 B → 计算最优路径 / 清除 →
// 计算结果（默认展开）→ 设置区（默认收起，移速设置与测算卡片同构但状态私有）。

// 选择按钮与状态栏（A/B 通用）
function syncTacPathPickUI() {
  for (const which of ['a', 'b']) {
    const A = which === 'a';
    const btn = A ? tacPathPickA : tacPathPickB;
    const st = A ? tacPathStatusA : tacPathStatusB;
    const armed = tacPathState.armed === which;
    const key = armed ? 'ui.tac.path.pick.cancel' : (A ? 'ui.tac.path.pick.button.A' : 'ui.tac.path.pick.button.B');
    btn.dataset.i18n = key;
    btn.textContent = translate(key);
    btn.classList.toggle('active', armed);
    const pt = tacPathState.points[which];
    if (armed) st.textContent = translate(A ? 'ui.tac.path.pick.status.picking.A' : 'ui.tac.path.pick.status.picking.B');
    else if (pt) st.textContent = translate(A ? 'ui.tac.path.pick.status.selected.A' : 'ui.tac.path.pick.status.selected.B',
      { x: Math.round(pt.x), y: Math.round(pt.z) });
    else st.textContent = translate(A ? 'ui.tac.path.pick.status.no.A' : 'ui.tac.path.pick.status.no.B');
  }
}

function tacPathDisarm() {
  if (!tacPathState.armed) return;
  tacPathState.armed = null;
  syncTacPathPickUI();
}

function tacPathArm(which) {
  if (tacPathState.armed === which) { tacPathDisarm(); return; }
  tacCarryDisarm();  // 与狂欢之椅推算的点选互斥
  tacPathState.armed = which;
  syncTacPathPickUI();
}

// 点击地图选中起点/终点（底图像素坐标）
function tacPathSelectPoint(which, x, z) {
  tacPathState.points[which] = { x, z };
  tacPathState.armed = null;
  syncTacPathPickUI();
  renderTacChairs();
}

// 起点 A（红）/ 终点 B（蓝）圆点与文字标注；由 renderTacChairs 末尾统一调用
function renderTacPathPoints() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-path-point, .tac-path-label').forEach((el) => el.remove());
  const [imgW, imgH] = MAPS_DATA[S.currentMapId].mapSize;
  for (const which of ['a', 'b']) {
    const A = which === 'a';
    const pt = tacPathState.points[which];
    if (!pt) continue;
    const dot = document.createElement('div');
    dot.className = `tac-path-point ${which}`;
    dot.style.left = `${(pt.x / imgW) * 100}%`;
    dot.style.top = `${(pt.z / imgH) * 100}%`;
    tacLayer().appendChild(dot);
    const label = document.createElement('span');
    label.className = 'tac-carry-time tac-path-label';
    label.textContent = translate(A ? 'ui.tac.path.map.point.A' : 'ui.tac.path.map.piont.B');
    label.style.left = dot.style.left;
    label.style.top = dot.style.top;
    label.style.color = A ? '#ff5252' : '#328bff';
    // rotate 之后 translateY，保证文字正立且标签位于圆点正上方
    label.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg) translateY(-15px)`;
    tacLayer().appendChild(label);
  }
  // 起终点自动修正标记：修正后位置画空心圆环 + 文字标签（数据随结果 cache 按图保存/恢复）
  tacMapWrap.querySelectorAll('.tac-path-fix, .tac-path-fix-label').forEach((el) => el.remove());
  const fixedInfo = tacPathState.resultMapId === S.currentMapId ? tacPathState.cache?.fixed : null;
  for (const which of ['a', 'b']) {
    const fx = fixedInfo?.[which];
    if (!fx) continue;
    const A = which === 'a';
    const ring = document.createElement('div');
    ring.className = `tac-path-fix ${which}`;
    ring.style.left = `${(fx.to.x / imgW) * 100}%`;
    ring.style.top = `${(fx.to.z / imgH) * 100}%`;
    tacLayer().appendChild(ring);
    const fl = document.createElement('span');
    fl.className = 'tac-carry-time tac-path-label tac-path-fix-label';
    fl.textContent = translate(A ? 'ui.tac.path.map.fixedPoint.A' : 'ui.tac.path.map.fixedPoint.B');
    fl.style.left = ring.style.left;
    fl.style.top = ring.style.top;
    fl.style.color = A ? '#ff5252' : '#328bff';
    fl.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg) translateY(15px)`;
    tacLayer().appendChild(fl);
  }
}

function tacPathClearResult() {
  tacPathState.cancel?.();
  tacPathState.running = false;
  tacPathState.resultMapId = null;
  tacPathState.cache = null;
  if (tacPathCanvas) { tacPathCanvas.remove(); tacPathCanvas = null; }
  tacMapWrap?.querySelectorAll('.tac-path-fix, .tac-path-fix-label').forEach((el) => el.remove());
  tacPathResultBoxEl.style.display = 'none';
  tacPathSummary.textContent = '';
  tacPathFixNote.style.display = 'none';
  tacPathFixNote.textContent = '';
  tacPathNote.style.display = 'none';
  tacPathProgressBox.style.display = 'none';
  tacPathRunBtn.dataset.i18n = 'ui.tac.path.run';
  tacPathRunBtn.textContent = translate('ui.tac.path.run');
}

// 从私有移速状态构建计算档案（与测算同语义：1+Σ(mult-1)，postMult 再乘）
function readTacPathProfile() {
  return createTideProfile({
    baseSpeed: tacPathState.base.speed,
    buffs: tacPathState.buffs.map(({ mult, postMult, duration }) => ({ mult, postMult, duration })),
  });
}

// 端点吸附：优先直接吸附最近可走格；失败且点位靠近地下室中心时，
// 走楼梯出口近似（端点→出口水平距离 + 坡道附加折算为附加距离/耗时）。
// maxBasementDist 限制地下室近似的生效范围（防止远离地下室的墙体误点被静默折算）。
function tacPathSnap(g, pt, profile, maxBasementDist = Infinity) {
  const direct = snapToWalkable(g, pt.x, pt.z);
  if (direct) return { cell: direct, extraMeters: 0, extraSeconds: 0 };
  if (g.basements?.length) {
    let best = null, bestD = Infinity;
    for (const bs of g.basements) {
      const d = Math.hypot(bs.center[0] - pt.x, bs.center[1] - pt.z);
      if (d < bestD) { bestD = d; best = bs; }
    }
    if (!best || bestD > maxBasementDist) return null;
    const exitCell = snapToWalkable(g, best.exit[0], best.exit[1]);
    if (exitCell) {
      const metersPerPx = g.metersPerCell / g.cellPx;
      const extraMeters = Math.hypot(best.exit[0] - pt.x, best.exit[1] - pt.z) * metersPerPx
        + best.slopeExtraM;
      return { cell: exitCell, extraMeters, extraSeconds: extraMeters / profile.speedAt(0) };
    }
  }
  return null;
}

// 沿路径距离对时间依赖速度积分求用时：限时加成在到期时刻变速，
// 按到期时间点分段精确积分（速度在段内恒定）。
function tacPathSecondsFor(profile, distM) {
  const breaks = [...new Set(tacPathState.buffs
    .map((b) => b.duration).filter((d) => d > 0))].sort((x, y) => x - y);
  let t = 0, rem = distM, bi = 0;
  while (rem > 1e-9) {
    const v = Math.max(profile.speedAt(t), 1e-6);
    while (bi < breaks.length && breaks[bi] <= t + 1e-9) bi++;
    const next = bi < breaks.length ? breaks[bi] : Infinity;
    if (!Number.isFinite(next)) return t + rem / v;
    const cover = v * (next - t);
    if (cover >= rem) return t + rem / v;
    rem -= cover; t = next;
  }
  return t;
}

async function tacPathRun() {
  if (tacPathState.running) return;
  const { a, b } = tacPathState.points;
  if (!a) { showToast(translate('ui.tac.path.pick.status.picking.A')); return; }
  if (!b) { showToast(translate('ui.tac.path.pick.status.picking.B')); return; }
  if (!navGridAvailable(S.currentMapId)) {
    tacPathSummary.textContent = translate('ui.tac.path.noGrid');
    syncTacPathResultBox();
    tacPathResultBoxEl.style.display = '';
    return;
  }
  tacPathClearResult();
  tacPathState.running = true;
  tacPathRunBtn.textContent = translate('ui.tac.path.run.running');
  tacPathProgressBox.style.display = '';
  tacPathProgressBar.style.width = '0%';
  try {
    const g = await loadNavGrid(S.currentMapId);
    if (!g) {
      tacPathSummary.textContent = translate('ui.tac.path.noGrid');
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      return;
    }
    const profile = readTacPathProfile();
    const showResult = (result, sA, sB, totalSeconds, totalMeters, fixed = null) => {
      tacPathState.cache = { g, result, sA, sB, profile, totalSeconds, totalMeters, fixed };
      renderTacPathOverlay(g, result, sA, sB);
      tacPathState.resultMapId = S.currentMapId;
      tacPathSummary.textContent = translate('ui.tac.path.result.summary', {
        dist: totalMeters.toFixed(1),
        seconds: totalSeconds.toFixed(1),
      });
      // 起终点修正说明行：修正发生的端点各一行
      const fixLines = [];
      for (const which of ['a', 'b']) {
        const fx = fixed?.[which];
        if (!fx) continue;
        fixLines.push(translate('ui.tac.path.result.note.fixed', {
          name: translate(which === 'a' ? 'ui.tac.path.map.point.A' : 'ui.tac.path.map.piont.B'),
          fx: Math.round(fx.from.x), fy: Math.round(fx.from.z),
          tx: Math.round(fx.to.x), ty: Math.round(fx.to.z),
        }));
      }
      tacPathFixNote.textContent = fixLines.join('\n');
      tacPathFixNote.style.display = fixLines.length ? '' : 'none';
      renderTacPathPoints();
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      tacPathNote.dataset.i18n = 'ui.tac.path.result.note';
      tacPathNote.textContent = translate('ui.tac.path.result.note');
      tacPathNote.style.display = '';
    };
    // 栅格寻路（1px 精确栅格，由 3D 碰撞数据逐像素烘焙）+ 栅格视线拉直
    const autoFix = !!tacPathFixEl?.checked;
    // 起终点自动修正：严格吸附（含地下室楼梯折算）失败时，扩大半径吸附最近可走区域，
    // 修正信息写入结果 cache 供标记与说明行使用
    const fixed = { a: null, b: null };
    const snapEndpoint = (which, pt) => {
      if (autoFix) {
        // 直接吸附 → 点附近 40px 内视为点地下室 → 扩大半径自动修正
        const strict = tacPathSnap(g, pt, profile, 40);
        if (strict) return strict;
        const wide = snapToWalkable(g, pt.x, pt.z, 150);
        if (!wide) return null;
        fixed[which] = {
          from: { x: pt.x, z: pt.z },
          to: { x: (wide.x + 0.5) * g.cellPx, z: (wide.y + 0.5) * g.cellPx },
        };
        return { cell: wide, extraMeters: 0, extraSeconds: 0 };
      }
      return tacPathSnap(g, pt, profile);
    };
    const sA = snapEndpoint('a', a);
    if (!sA) {
      tacPathSummary.textContent = translate('ui.tac.path.unsupported.A');
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      return;
    }
    const sB = snapEndpoint('b', b);
    if (!sB) {
      tacPathSummary.textContent = translate('ui.tac.path.unsupported.B');
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      return;
    }
    const vault = !!tacPathVaultEl?.checked;
    const run = computePath(g, sA.cell, sB.cell, profile, {
      initialSeconds: sA.extraSeconds,
      vault,
      onProgress: (p) => { tacPathProgressBar.style.width = `${Math.round(p * 100)}%`; },
    });
    tacPathState.cancel = run.cancel;
    let result = await run.promise;
    if (result.cancelled) return;
    if (result.unreachable) {
      tacPathSummary.textContent = translate('ui.tac.path.unreachable');
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      return;
    }
    let resultSeconds = result.seconds;
    let resultMeters = result.distM;
    // 栅格视线拉直：去掉 8 连通锯齿，按折线实长重算距离与用时
    if (result.path.length > 2) {
      const smoothedCells = smoothPathOnGrid(g, result.path, vault);
      const metersPerPx = g.metersPerCell / g.cellPx;
      const smoothed = smoothedCells.map((c) => [(c.x + 0.5) * g.cellPx, (c.y + 0.5) * g.cellPx]);
      if (smoothed.length >= 2) {
        let d = 0;
        for (let i = 1; i < smoothed.length; i++) {
          d += Math.hypot(smoothed[i][0] - smoothed[i - 1][0], smoothed[i][1] - smoothed[i - 1][1]);
        }
        resultMeters = d * metersPerPx;
        resultSeconds = tacPathSecondsFor(profile, resultMeters);
        result = { ...result, pathPx: smoothed };
      }
    }
    const totalSeconds = resultSeconds + sB.extraSeconds;
    const totalMeters = resultMeters + sA.extraMeters + sB.extraMeters;
    showResult(result, sA, sB, totalSeconds, totalMeters, fixed);
  } finally {
    tacPathState.running = false;
    tacPathRunBtn.dataset.i18n = 'ui.tac.path.run';
    tacPathRunBtn.textContent = translate('ui.tac.path.run');
    tacPathProgressBar.style.width = '100%';
    setTimeout(() => { if (!tacPathState.running) tacPathProgressBox.style.display = 'none'; }, 400);
  }
}

// 栅格路径折线化简：8 连通步进中仅保留方向改变的拐点（共线判断用叉积）
function tacPathSimplify(pts) {
  if (pts.length < 3) return pts.slice();
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = out[out.length - 1];
    const d1x = pts[i].x - p.x, d1y = pts[i].y - p.y;
    const d2x = pts[i + 1].x - pts[i].x, d2y = pts[i + 1].y - pts[i].y;
    if (d1x * d2y !== d1y * d2x) out.push(pts[i]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function renderTacPathOverlay(g, result, sA, sB) {
  tacPathCanvas?.remove();
  tacPathCanvas = null;
  const [W0, H0] = MAPS_DATA[S.currentMapId].mapSize;
  const canvas = document.createElement('canvas');
  canvas.width = W0;
  canvas.height = H0;
  canvas.className = 'tac-carry-canvas tac-path-canvas';
  const ctx = canvas.getContext('2d');
  const seq = result.pathPx
    ? result.pathPx.map((p) => [p[0], p[1]])
    : tacPathSimplify(result.path).map((c) => [(c.x + 0.5) * g.cellPx, (c.y + 0.5) * g.cellPx]);
  const a = tacPathState.points.a, b = tacPathState.points.b;
  // 地下室近似段：端点与楼梯出口之间补直线段
  if (sA.extraMeters && a) seq.unshift([a.x, a.z]);
  if (sB.extraMeters && b) seq.push([b.x, b.z]);
  ctx.strokeStyle = '#22c55e';
  ctx.fillStyle = '#22c55e';
  ctx.lineWidth = Math.max(2, W0 * 0.0025);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(34, 197, 94, 0.7)';
  ctx.shadowBlur = Math.max(3, W0 * 0.003);
  if (seq.length === 1) {
    ctx.beginPath();
    ctx.arc(seq[0][0], seq[0][1], ctx.lineWidth, 0, Math.PI * 2);
    ctx.fill();
  } else if (seq.length > 1) {
    ctx.beginPath();
    ctx.moveTo(seq[0][0], seq[0][1]);
    for (let i = 1; i < seq.length; i++) ctx.lineTo(seq[i][0], seq[i][1]);
    ctx.stroke();
  }
  tacLayer().appendChild(canvas);
  tacPathCanvas = canvas;
}

// 计算结果区 / 设置区：整体可收起（结果区默认展开，设置区默认收起）
let tacPathResultOpen = true;

function syncTacPathResultBox() {
  tacPathResultToggleEl.textContent = translate('ui.tac.measure.result.title', { value: tacPathResultOpen ? '▾' : '▸' });
  tacPathResultBodyEl.style.display = tacPathResultOpen ? '' : 'none';
}

let tacPathSettingsOpen = false;

function syncTacPathSettingsBox() {
  tacPathSettingsToggleEl.textContent = translate('ui.tac.path.setting.title', { value: tacPathSettingsOpen ? '▾' : '▸' });
  tacPathSettingsBodyEl.style.display = tacPathSettingsOpen ? '' : 'none';
}

/* ---- 移速设置区（私有状态，结构与测算卡片速度设置区对齐，含双阵营） ---- */

// 基础移速下拉：求生者=姿态+角色移速+固定移速+自定义；监管者=角色（含双形态）+自定义
function buildTacPathRoleOptions() {
  if (tacPathState.camp === 'survivor') {
    let opts = Object.entries(TAC_MOVEMENT_SURVIVOR.states).map(([k, st]) =>
      `<option value="${k}">${st.name} ${st.speed}m/s</option>`).join('');
    opts += `<option value="role">${translate("common.roles")}</option>`;
    opts += `<option value="fixed">${translate("application.common.fixed")}</option>`;
    tacPathSpeedRoleEl.innerHTML = opts + `<option value="custom">${translate("common.custom")}</option>`;
    tacPathSpeedRoleEl.value = 'run';
    return;
  }
  let opts = '';
  for (const [key, def] of Object.entries(TAC_ROLES)) {
    if (def.camp !== 'hunter') continue;
    const sp0 = (def.speed != null && typeof def.speed === 'object')
      ? Object.values(def.speed)[0] : def.speed;
    opts += sp0
      ? `<option value="${key}"${key === 'hellEmber' ? ' selected' : ''}>${translate("application.velocity.base.choose", { name: def.name, sp0 })}</option>`
      : `<option value="${key}" disabled>${translate("application.velocity.base.choose.default", { name: def.name })}</option>`;
  }
  tacPathSpeedRoleEl.innerHTML = opts + `<option value="custom">${translate("common.custom")}</option>`;
  tacPathSpeedRoleEl.value = 'hellEmber';
}

function syncTacPathSpeedForm() {
  const key = tacPathSpeedRoleEl.value;
  if (key === 'role') {
    if (tacPathSpeedFormEl.dataset.sig !== 'role') {
      tacPathSpeedFormEl.innerHTML = Object.entries(TAC_MOVEMENT_SURVIVOR.roles).map(([k, d]) =>
        `<option value="${k}">${d.name} ${d.speed}m/s</option>`).join('');
      tacPathSpeedFormEl.dataset.sig = 'role';
    }
    tacPathSpeedFormEl.style.display = '';
    return;
  }
  if (key === 'fixed') {
    if (tacPathSpeedFormEl.dataset.sig !== 'fixed') {
      tacPathSpeedFormEl.innerHTML = Object.entries(TAC_MOVEMENT_SURVIVOR.fixed).map(([k, d]) =>
        `<option value="${k}">${d.name} ${d.speed}m/s</option>`).join('');
      tacPathSpeedFormEl.dataset.sig = 'fixed';
    }
    tacPathSpeedFormEl.style.display = '';
    return;
  }
  const info = tacSpeedForms(key);
  if (info && info.dual) {
    if (tacPathSpeedFormEl.dataset.sig !== key) {
      tacPathSpeedFormEl.innerHTML = info.forms.map((f, i) =>
        `<option value="${i}">${translate("application.velocity.base.choose.two", { name: f.name, speed: f.speed })}</option>`).join('');
      tacPathSpeedFormEl.dataset.sig = key;
    }
    tacPathSpeedFormEl.style.display = '';
  } else {
    tacPathSpeedFormEl.style.display = 'none';
    tacPathSpeedFormEl.dataset.sig = key;
  }
}

// 当前下拉选择对应的基础移速（custom 时返回 null，数字框直改后下拉跳到自定义）
function tacPathRoleDefSpeed() {
  const key = tacPathSpeedRoleEl.value;
  if (key === 'custom') return null;
  if (TAC_MOVEMENT_SURVIVOR.states[key]) return TAC_MOVEMENT_SURVIVOR.states[key].speed;
  if (key === 'role') {
    const rb = TAC_MOVEMENT_SURVIVOR.roles[tacPathSpeedFormEl.value] || TAC_MOVEMENT_SURVIVOR.roles.survivor;
    return rb.speed;
  }
  if (key === 'fixed') {
    const fd = TAC_MOVEMENT_SURVIVOR.fixed[tacPathSpeedFormEl.value] || Object.values(TAC_MOVEMENT_SURVIVOR.fixed)[0];
    return fd.speed;
  }
  const info = tacSpeedForms(key);
  if (info) {
    const fi = info.dual ? Math.min(info.forms.length - 1, +tacPathSpeedFormEl.value || 0) : 0;
    return info.forms[fi].speed;
  }
  return null;
}

// 当前面板选择对应的基础移速条目（测算 tacPanelBase 同款，数字框为速度真源）
function tacPathPanelBase() {
  const v = parseFloat(tacPathBaseSpeedEl.value);
  const speed = v > 0 ? v : TAC_MOVEMENT_SURVIVOR.states.run.speed;
  const key = tacPathSpeedRoleEl.value;
  const camp = tacPathState.camp;
  if (key === 'custom') {
    return { name: translate("common.custom"), speed, camp, role: null, form: 0, stKey: 'custom' };
  }
  if (camp === 'survivor' && TAC_MOVEMENT_SURVIVOR.states[key]) {
    return { name: TAC_MOVEMENT_SURVIVOR.states[key].name, speed: TAC_MOVEMENT_SURVIVOR.states[key].speed,
      camp: 'survivor', role: null, form: 0, stKey: key };
  }
  if (camp === 'survivor' && key === 'role') {
    const rb = TAC_MOVEMENT_SURVIVOR.roles[tacPathSpeedFormEl.value] || TAC_MOVEMENT_SURVIVOR.roles.survivor;
    return { name: rb.name, speed: rb.speed, camp: 'survivor',
      role: rb.role, form: rb.form || 0, stKey: 'role' };
  }
  if (camp === 'survivor' && key === 'fixed') {
    const fd = TAC_MOVEMENT_SURVIVOR.fixed[tacPathSpeedFormEl.value] || Object.values(TAC_MOVEMENT_SURVIVOR.fixed)[0];
    return { name: fd.name, speed: fd.speed, camp: 'survivor',
      role: fd.role, form: fd.form || 0, stKey: 'fixed', fixed: true };
  }
  const def = TAC_ROLES[key] || {};
  const info = tacSpeedForms(key);
  if (info && info.dual) {
    const fi = Math.min(info.forms.length - 1, +tacPathSpeedFormEl.value || 0);
    const fn = info.forms[fi].name;
    return { name: fn === (def.name || key) ? fn : (def.name || key) + ' ' + fn,
      speed, camp: 'hunter', role: key, form: fi };
  }
  return { name: def.name || key, speed, camp: 'hunter', role: key, form: 0 };
}

function tacPathApplyBase(base) {
  tacPathState.base = { ...base };
  // 基础移速切换后，不再匹配新条目（姿态/角色/形态）的加成移除
  tacPathState.buffs = tacPathState.buffs.filter((b) => tacBuffAppliesToBase(b, tacPathState.base));
  renderTacPathBaseDetail();
  renderTacPathBuffs();
}

function tacPathSetCamp(camp) {
  if (tacPathState.camp === camp) return;
  tacPathState.camp = camp;
  tacPathCampToggle.querySelectorAll('.side-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.camp === camp));
  buildTacPathRoleOptions();
  syncTacPathSpeedForm();
  // 切阵营后把新选中条目的基础移速写入数字框（与下拉切换行为一致）
  const sp = tacPathRoleDefSpeed();
  if (sp != null) tacPathBaseSpeedEl.value = sp;
  tacPathApplyBase(tacPathPanelBase());
}

// 基础明细：名称 / 速度（默认展开）
let tacPathBaseDetailOpen = true;

function renderTacPathBaseDetail() {
  tacPathBaseDetailToggleEl.textContent = translate("application.velocity.base.detail", { value: tacPathBaseDetailOpen ? '▾' : '▸' });
  tacPathBaseDetailBodyEl.style.display = tacPathBaseDetailOpen ? '' : 'none';
  if (!tacPathBaseDetailOpen) return;
  const b = tacPathState.base;
  tacPathBaseDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th>${translate('ui.tac.path.setting.velocity.base.table.name')}</th>`
    + `<th>${translate('ui.tac.path.setting.velocity.base.table.speed')}</th></tr></thead><tbody>`
    + `<tr><td>${b.name}</td><td class="tac-col-speed"><b>${Math.round(b.speed * 100) / 100}</b></td></tr></tbody></table>`;
}

// 加成明细表（默认展开）：加成 / 加成值 / 时长 / 删除
let tacPathBuffOpen = true;

function renderTacPathBuffs() {
  tacPathBuffToggleEl.textContent = translate('application.velocity.buff.detail', { value: tacPathBuffOpen ? '▾' : '▸' });
  tacPathBuffBodyEl.style.display = tacPathBuffOpen ? '' : 'none';
  if (!tacPathBuffOpen) return;
  const pct = (v) => `${Math.round((v - 1) * 1000) / 10}%`;
  const rows = tacPathState.buffs.map((b) => ({
    id: b.id,
    name: b.name,
    value: pct(b.mult) + (b.postMult ? translate("application.buff.common.desc.multi") : ''),
    duration: b.duration ? `${b.duration}s` : translate("application.buff.common.desc.duration"),
  }));
  if (!rows.length) {
    tacPathBuffBodyEl.innerHTML = `<div class="tac-detail-empty">${translate('application.velocity.buff.detail.hint.none')}</div>`;
    return;
  }
  tacPathBuffBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th class="tac-cb-name">${translate('ui.tac.path.setting.velocity.buff.table.name')}</th>`
    + `<th class="tac-cb-value">${translate('ui.tac.path.setting.velocity.buff.table.value')}</th>`
    + `<th>${translate('ui.tac.path.setting.velocity.buff.table.duration')}</th>`
    + `<th class="tac-col-del"></th></tr></thead><tbody>`
    + rows.map((r) =>
      `<tr><td>${r.name}</td><td>${r.value}</td><td>${r.duration}</td>`
      + `<td class="tac-col-del"><button type="button" class="tac-buff-del tac-path-buff-del" data-pbid="${r.id}">×</button></td></tr>`).join('')
    + '</tbody></table>';
}

function tacPathAddBuff(entry) {
  const rows = [{ ...entry }];
  delete rows[0].extra;
  if (entry.extra) rows.push({ ...entry.extra, type: entry.type, key: entry.key });
  if (tacPathState.base.fixed) {
    showToast(translate("application.velocity.buff.note.false3"));
    return false;
  }
  // 姿态/角色/形态匹配校验（与测算 tacBuffAppliesToBase 同规则，双阵营通用）
  if (!tacBuffAppliesToBase(rows[0], tacPathState.base)) {
    const st = tacStateOf(tacPathState.base);
    showToast(translate("application.velocity.buff.note.false4", { name: TAC_MOVEMENT_SURVIVOR.stateNames[st] || st }));
    return false;
  }
  rows.forEach((r) => tacPathState.buffs.push({ ...r, id: ++tacPathBuffId }));
  return true;
}

// 三个加成弹窗列表：按当前阵营（测算列表渲染同款）
function buildTacPathTraitList() {
  const rows = TAC_MOVEMENT_BUFFS.trait[tacPathState.camp] || [];
  tacPathTraitList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.buff.common.desc.level", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.buff.common.desc.duration"))
      : `${Math.round((t.mult - 1) * 100)}%${t.postMult ? translate("application.buff.common.desc.multi") : ''}`
        + (t.duration ? ` ${t.duration}s` : translate("application.buff.common.desc.duration"));
    if (t.states) {
      desc += translate("application.buff.common.condition.desc1", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    if (t.forms) {
      // 按 forms 索引取该角色速度形态名：如摄魂 forms:[0]→谢必安
      const roleDef = Object.values(TAC_ROLES).find((r) => r.name === t.role);
      const formNames = roleDef && typeof roleDef.speed === 'object'
        ? t.forms.map((fi) => Object.keys(roleDef.speed)[fi]).filter(Boolean).join('/')
        : '';
      desc += t.key === 'windWings' ? translate("application.buff.common.condition.desc1", { name: translate("items.smileyFace.rocketDash.name") })
        : translate("application.buff.common.condition.desc2", { name: formNames });
    }
    const lv = t.levels
      ? `<select data-tlv="${t.key}">`
        + t.levels.map((_, i) =>
          `<option value="${i}"${i === t.levels.length - 1 ? ' selected' : ''}>${tacLevelLabel(t.key, i)}</option>`).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.role} · ${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + `<button type="button" class="tac-talent-add" data-tk="${t.key}">${translate("common.add")}</button></div>`;
  }).join('');
}

function buildTacPathTalentList() {
  const rows = Object.entries(TAC_MOVEMENT_BUFFS.talent)
    .filter(([, b]) => !b.camp || b.camp === tacPathState.camp);
  tacPathTalentList.innerHTML = rows.map(([k, b]) => {
    let desc = b.levels
      ? `${b.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.buff.common.desc.level", { count: b.levels.length }) + (b.duration ? ` ${b.duration}s` : translate("application.buff.common.desc.duration"))
      : `${Math.round((b.mult - 1) * 100)}%` + (b.duration ? ` ${b.duration}s` : translate("application.buff.common.desc.duration"));
    const lv = b.levels
      ? `<select data-lv="${k}">`
        + b.levels.map((_, i) =>
          `<option value="${i}"${i === b.levels.length - 1 ? ' selected' : ''}>${translate("application.buff.common.level", { value: i + 1 })}</option>`).join('')
        + '</select>'
      : '';
    if (b.states) {
      desc += translate("application.buff.common.condition.desc1", { name: b.states.map((k2) => (TAC_MOVEMENT_SURVIVOR.states[k2] || {}).name || k2).join('/') });
    }
    return `<div class="tac-talent-row"><span class="tac-talent-name">${b.name}`
      + `<small>${desc}${b.extra ? translate("talent.common.involve.desc1", { name: b.extra.name }) : ''}</small></span>${lv}`
      + `<button type="button" class="tac-talent-add" data-k="${k}">${translate("common.add")}</button></div>`;
  }).join('');
}

function buildTacPathOtherList() {
  const rows = TAC_MOVEMENT_BUFFS.other[tacPathState.camp] || [];
  tacPathOtherList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.buff.common.desc.level", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.buff.common.desc.duration"))
      : `${Math.round((t.mult - 1) * 100)}%`
        + (t.duration ? ` ${t.duration}s` : translate("application.buff.common.desc.duration"));
    if (t.states) {
      desc += translate("application.buff.common.condition.desc1", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    const lv = t.levels
      ? `<select data-olv="${t.key}">`
        + t.levels.map((_, i) =>
          `<option value="${i + 1}"${i === t.levels.length - 1 ? ' selected' : ''}>${translate("application.buff.common.level", { value: i + 1 })}</option>`).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + `<button type="button" class="tac-talent-add" data-ok="${t.key}">${translate("common.add")}</button></div>`;
  }).join('');
}

function bindTacPathModal(btn, modal, close) {
  btn.addEventListener('click', () => { modal.style.display = 'flex'; });
  close.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// 两点最优路径规划卡片绑定（由初始化统一调用，须在全部 let 声明之后）
function buildTacPathCard() {
  if (!tacPathCard) return;
  tacPathPickA.addEventListener('click', () => tacPathArm('a'));
  tacPathPickB.addEventListener('click', () => tacPathArm('b'));
  tacPathRunBtn.addEventListener('click', tacPathRun);
  tacPathClearBtn.addEventListener('click', () => {
    tacPathState.points = { a: null, b: null };
    tacPathState.armed = null;
    tacPathClearResult();
    syncTacPathPickUI();
    renderTacChairs();
  });
  tacPathResultToggleEl.addEventListener('click', () => {
    tacPathResultOpen = !tacPathResultOpen;
    syncTacPathResultBox();
  });
  tacPathSettingsToggleEl.addEventListener('click', () => {
    tacPathSettingsOpen = !tacPathSettingsOpen;
    syncTacPathSettingsBox();
  });
  // 允许翻窗开关：切换后清除旧结果，避免与开关状态不一致
  tacPathVaultEl?.addEventListener('change', () => tacPathClearResult());
  // 起终点自动修正开关：同上
  tacPathFixEl?.addEventListener('change', () => tacPathClearResult());

  // 阵营切换
  tacPathCampToggle.querySelectorAll('.side-btn').forEach((b) =>
    b.addEventListener('click', () => tacPathSetCamp(b.dataset.camp)));

  // 基础移速：数字框 + 下拉（数字框直改后下拉跳到自定义）
  buildTacPathRoleOptions();
  tacPathSpeedRoleEl.addEventListener('change', () => {
    syncTacPathSpeedForm();
    const sp = tacPathRoleDefSpeed();
    if (sp != null) tacPathBaseSpeedEl.value = sp;
    tacPathApplyBase(tacPathPanelBase());
  });
  tacPathSpeedFormEl.addEventListener('change', () => {
    const sp = tacPathRoleDefSpeed();
    if (sp != null) tacPathBaseSpeedEl.value = sp;
    tacPathApplyBase(tacPathPanelBase());
  });
  tacPathBaseSpeedEl.addEventListener('input', () => {
    const v = parseFloat(tacPathBaseSpeedEl.value);
    if (!(v > 0) || tacPathSpeedRoleEl.value === 'custom') return;
    const sp = tacPathRoleDefSpeed();
    if (sp != null && Math.abs(sp - v) > 1e-9) {
      tacPathSpeedRoleEl.value = 'custom';
      syncTacPathSpeedForm();
    }
    tacPathApplyBase(tacPathPanelBase());
  });
  syncTacPathSpeedForm();
  // 初始基础移速与下拉（跑动 3.8 m/s）对齐
  tacPathApplyBase(tacPathPanelBase());

  // 四个加成弹窗
  bindTacPathModal(tacPathTraitAddBtn, tacPathTraitModal, tacPathTraitClose);
  bindTacPathModal(tacPathTalentAddBtn, tacPathTalentModal, tacPathTalentClose);
  bindTacPathModal(tacPathOtherAddBtn, tacPathOtherModal, tacPathOtherClose);
  bindTacPathModal(tacPathBuffAddBtn, tacPathBuffModal, tacPathBuffClose);
  tacPathTraitAddBtn.addEventListener('click', buildTacPathTraitList);
  tacPathTalentAddBtn.addEventListener('click', buildTacPathTalentList);
  tacPathOtherAddBtn.addEventListener('click', buildTacPathOtherList);

  tacPathTraitList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const def = (TAC_MOVEMENT_BUFFS.trait[tacPathState.camp] || []).find((t) => t.key === btn.dataset.tk);
    if (!def) return;
    // 角色移速（如野人骑乘）只能用本角色特质
    if (tacPathState.camp === 'survivor'
        && tacPathState.base.stKey === 'role' && tacPathState.base.role) {
      const roleName = (TAC_ROLES[tacPathState.base.role] || {}).name;
      if (roleName && def.role !== roleName) {
        tacPathTraitModal.style.display = 'none';
        showToast(translate("application.velocity.buff.note.false2"));
        return;
      }
    }
    const lvSel = tacPathTraitList.querySelector(`select[data-tlv="${def.key}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const entry = {
      type: 'trait', key: def.key,
      name: def.levels
        ? `${def.role} · ${def.name} ${tacLevelLabel(def.key, lv)}`
        : `${def.role} · ${def.name}`,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    if (def.postMult) entry.postMult = true;
    tacPathTraitModal.style.display = 'none';
    // 同角色特质互斥（与测算一致）：移除其它角色特质后加入
    tacPathState.buffs = tacPathState.buffs.filter((b) => {
      if (b.type !== 'trait') return true;
      const td = Object.values(TAC_MOVEMENT_BUFFS.trait).flat().find((t) => t.key === b.key);
      const bRole = td ? td.role : (b.name || '').split(' · ')[0];
      return bRole === def.role;
    });
    if (tacPathAddBuff(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name: entry.name }));
      renderTacPathBuffs();
    }
  });

  tacPathTalentList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const k = btn.dataset.k;
    const def = TAC_MOVEMENT_BUFFS.talent[k];
    if (!def) return;
    const lvSel = tacPathTalentList.querySelector(`select[data-lv="${k}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const mult = def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult;
    const name = def.levels ? translate("application.buff.common.name.level", { name: def.name, value: lv + 1 }) : def.name;
    const entry = { type: 'talent', key: k, name, mult, duration: def.duration || 0 };
    if (def.extra) entry.extra = { name: def.extra.name, mult: def.extra.mult, duration: 0 };
    tacPathTalentModal.style.display = 'none';
    if (tacPathAddBuff(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name }));
      renderTacPathBuffs();
    }
  });

  tacPathOtherList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const def = (TAC_MOVEMENT_BUFFS.other[tacPathState.camp] || []).find((t) => t.key === btn.dataset.ok);
    if (!def) return;
    const lvSel = tacPathOtherList.querySelector(`select[data-olv="${def.key}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const name = def.levels ? translate("application.buff.common.name.level", { name: def.name, value: lv + 1 }) : def.name;
    const entry = {
      type: 'other', key: def.key, name,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    tacPathOtherModal.style.display = 'none';
    if (tacPathAddBuff(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name }));
      renderTacPathBuffs();
    }
  });

  tacPathBuffOk.addEventListener('click', () => {
    const pct = parseFloat(tacPathBuffPct.value);
    tacPathBuffModal.style.display = 'none';
    if (!pct) { showToast(translate("application.velocity.buff.note.false5")); return; }
    const dur = parseFloat(tacPathBuffDur.value) || 0;
    const name = (tacPathBuffName.value || '').trim() || translate("common.custom");
    const ok = tacPathAddBuff({ type: 'custom', key: '', name, mult: 1 + pct / 100, duration: dur });
    if (ok) {
      tacPathBuffName.value = '';
      tacPathBuffPct.value = '';
      tacPathBuffDur.value = '';
      showToast(translate("application.velocity.buff.note.true", { name }));
      renderTacPathBuffs();
    }
  });

  // 明细删除与折叠
  tacPathBuffBodyEl.addEventListener('click', (e) => {
    const del = e.target.closest('.tac-path-buff-del');
    if (!del) return;
    const id = +del.dataset.pbid;
    tacPathState.buffs = tacPathState.buffs.filter((b) => b.id !== id);
    renderTacPathBuffs();
  });
  tacPathBaseDetailToggleEl.addEventListener('click', () => {
    tacPathBaseDetailOpen = !tacPathBaseDetailOpen;
    renderTacPathBaseDetail();
  });
  tacPathBuffToggleEl.addEventListener('click', () => {
    tacPathBuffOpen = !tacPathBuffOpen;
    renderTacPathBuffs();
  });
  renderTacPathBaseDetail();
  renderTacPathBuffs();
  syncTacPathPickUI();
  syncTacPathResultBox();
  syncTacPathSettingsBox();
}

export {
  buildTacPathCard,
  renderTacPathOverlay,
  renderTacPathPoints,
  syncTacPathPickUI,
  syncTacPathResultBox,
  tacPathCanvas,
  tacPathClearResult,
  tacPathDisarm,
  tacPathSelectPoint,
  tacPathState,
};
