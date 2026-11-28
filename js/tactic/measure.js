import {
  showToast,
  tacBaseDetailBody,
  tacBaseDetailToggle,
  tacBaseMerge,
  tacBaseMergeBox,
  tacBaseSpeedEl,
  tacBuffAddBtn,
  tacBuffClose,
  tacBuffDetailBody,
  tacBuffDetailToggle,
  tacBuffDur,
  tacBuffFilterBox,
  tacBuffModal,
  tacBuffName,
  tacBuffOk,
  tacBuffPct,
  tacCampToggle,
  tacDeselectBtn,
  tacDrawOtherBody,
  tacDrawOtherToggle,
  tacDrawSettingsBody,
  tacDrawSettingsToggle,
  tacDrawStyleToggle,
  tacMeasureCancelEl,
  tacMeasureColorsEl,
  tacMeasureModesEl,
  tacMeasureVaultWrapEl,
  tacMeasureWidthEl,
  tacMeasureWidthVal,
  tacMStyleBody,
  tacOtherAddBtn,
  tacOtherClose,
  tacOtherList,
  tacOtherModal,
  tacResult,
  tacResultBody,
  tacResultToggle,
  tacScopeToggle,
  tacScopeWrap,
  tacShapeStyleBody,
  tacShapeStyleToggle,
  tacSpeedForm,
  tacSpeedRole,
  tacSpeedSettingsBodyEl,
  tacSpeedSettingsToggleEl,
  tacStatus2El,
  tacStatusEl,
  tacTalentAddBtn,
  tacTalentClose,
  tacTalentList,
  tacTalentModal,
  tacTextStyleBody,
  tacTextStyleToggle,
  tacTraitAddBtn,
  tacTraitClose,
  tacTraitList,
  tacTraitModal,
} from '../core/dom.js';
import { getActiveLocale, translate } from '../core/i18n.js';
import { measureBaseAt, simulateMovement } from '../core/measurements.js';
import {
  computePath,
  loadNavGrid,
  navGridAvailable,
  smoothPathOnGrid,
  snapToWalkable,
} from '../core/nav-grid.js';
import {
  restoredMeasureIds,
  tacBoard,
  tacDrawSettings,
  tacMeasureStyle,
  tacSave,
} from '../core/persist.js';
import { S } from '../core/state.js';
import { createTideProfile } from '../core/tide-model.js';
import { $ } from '../core/utils.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import {
  TAC_MEASURE_DEFAULT,
  TAC_MOVEMENT_BUFFS,
  TAC_MOVEMENT_SURVIVOR,
  TAC_SVG_NS,
} from '../data/tactic-data.js';
import { tacAnimGeom } from './animation.js';
import { renderTacArrows, renderTacBoard, tacUprightSvgText } from './board.js';
import { tacTool } from './panel.js';
import {
  setTacDrawOtherOpen,
  setTacDrawSettingsOpen,
  setTacSpeedSettingsOpen,
  tacDrawOtherOpen,
  tacDrawSettingsOpen,
  tacSpeedSettingsOpen,
} from './settings.js';

function tacStateOf(base) {
  if (!base) return 'run';
  if (base.fixed) return 'fixed';
  if (base.stKey) return base.stKey;
  return base.camp === 'hunter' ? 'hunter' : 'run';
}

function tacStateMatches(buffStates, state) {

  if (!buffStates) return state === 'run' || state === 'walk' || state === 'crouch'
    || state === 'role' || state === 'hunter' || state === 'custom';
  return buffStates.includes(state);
}

function tacLevelLabel(key, i) {
  return key === 'stratus' ? [translate("application.buff.common.level.min"), translate("application.buff.common.level.max")][i] : translate("application.buff.common.level", { value: i + 1 });
}

let tacMeasurePending = null;

let tacMeasureHover = null;

let tacMeasureMode = 'single';

// 折线/路径线都是连续分段模式（链），路径线的段内按最优路径连接
const tacMeasureIsChain = () => tacMeasureMode === 'chain' || tacMeasureMode === 'route';

let tacCamp = 'survivor';

let tacApplyScope = 'chain';

let tacBuffSeq = restoredMeasureIds.buff;

let tacLcSeq = restoredMeasureIds.config;

const tacPending = { base: { name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed }, buffs: [] };

let tacBaseDetailOpen = true;

let tacBaseMergeOn = true;

let tacLastRoleVal = null;

let tacBuffDetailOpen = true;

let tacResultOpen = true;

const tacBuffFilter = { from: 0, to: 0, all: true };

let tacTargetSig = '';

const tacSegExpanded = new Set();

let tacChainRoute = null;

let tacRouteSeq = restoredMeasureIds.route;

let tacSelMeasure = null;

let tacGreenSegs = new Map();

function tacMeasureLen(m) {
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  // 路径线：长度按最优路径折线的弧长计算
  if (Array.isArray(m.path) && m.path.length >= 2) {
    let units = 0;
    for (let i = 1; i < m.path.length; i++) {
      units += Math.hypot((m.path[i].x - m.path[i - 1].x) * dw,
        (m.path[i].y - m.path[i - 1].y) * dh);
    }
    return { units, dw };
  }
  return { units: Math.hypot((m.x2 - m.x1) * dw, (m.y2 - m.y1) * dh), dw };
}

// 测距线的显示折线（含路径线的最优路径；无路径时为两端点直线），返回显示像素坐标
function tacMeasurePolyline(m, W, H) {
  const rel = (Array.isArray(m.path) && m.path.length >= 2)
    ? m.path : [{ x: m.x1, y: m.y1 }, { x: m.x2, y: m.y2 }];
  return rel.map((p) => ({ x: p.x * W, y: p.y * H }));
}

// 沿测距线按弧长比例取点：返回 {x, y, nx, ny}（nx/ny 为左侧单位法向）
function tacMeasurePointAt(m, W, H, frac) {
  const pts = tacMeasurePolyline(m, W, H);
  const lens = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lens.push(l);
    total += l;
  }
  const last = pts[pts.length - 1];
  if (!total) return { x: pts[0].x, y: pts[0].y, nx: 0, ny: 1 };
  const target = Math.min(1, Math.max(0, frac)) * total;
  let acc = 0;
  for (let i = 0; i < lens.length; i++) {
    if (acc + lens[i] >= target || i === lens.length - 1) {
      const a = pts[i], b = pts[i + 1];
      const l = lens[i] || 1;
      const t = lens[i] ? (target - acc) / lens[i] : 0;
      return {
        x: a.x + (b.x - a.x) * Math.min(1, Math.max(0, t)),
        y: a.y + (b.y - a.y) * Math.min(1, Math.max(0, t)),
        nx: -(b.y - a.y) / l, ny: (b.x - a.x) / l,
      };
    }
    acc += lens[i];
  }
  return { x: last.x, y: last.y, nx: 0, ny: 1 };
}

// 测距线在弧长比例 [f1, f2] 之间的子折线（显示像素坐标），用于加成分段上色
function tacMeasureSubPath(m, W, H, f1, f2) {
  const pts = tacMeasurePolyline(m, W, H);
  const lens = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lens.push(l);
    total += l;
  }
  if (!total || f2 <= f1) return [tacMeasurePointAt(m, W, H, f1), tacMeasurePointAt(m, W, H, f2)];
  const out = [tacMeasurePointAt(m, W, H, f1)];
  let acc = 0;
  for (let i = 0; i < lens.length; i++) {
    acc += lens[i];
    const f = acc / total;
    if (f > f1 && f < f2) out.push(pts[i + 1]);
  }
  out.push(tacMeasurePointAt(m, W, H, f2));
  return out;
}

function tacMeasureText(m) {
  const { units, dw } = tacMeasureLen(m);
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  return widthM ? `${(units / dw * widthM).toFixed(1)}m` : units.toFixed(1);
}

// 线的显示开关解析：lc.style 覆盖 → 全局绘制设置
function tacLineStyle(m) {
  const st = (m && m.lc && m.lc.style) || {};
  return {
    showEndpoints: st.showEndpoints ?? !!tacDrawSettings.showEndpoints,
    showDist: st.showDist ?? (tacDrawSettings.showDist !== false),
    showTime: st.showTime ?? !!tacDrawSettings.showTime,
  };
}

// 单段用时（秒）：有速度配置时按 simulateMovement 精算，否则按求生者跑速
function tacMeasureTime(m) {
  const { units, dw } = tacMeasureLen(m);
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!widthM) return null;
  if (m.lc) {
    const sim = tacSimLine([m], m.lc);
    return sim.segs[0] ? sim.segs[0].t : null;
  }
  return (units / dw * widthM) / TAC_MOVEMENT_SURVIVOR.states.run.speed;
}

// 线旁标签文本：按显示开关组合距离与时间
function tacMeasureLabelText(m) {
  const st = tacLineStyle(m);
  const parts = [];
  if (st.showDist) parts.push(tacMeasureText(m));
  if (st.showTime) {
    const t = tacMeasureTime(m);
    if (t != null) parts.push(`${t.toFixed(1)}s`);
  }
  return parts.join(' ');
}

function tacMeasureSegColor(m) {
  return m.color || TAC_MEASURE_DEFAULT[m.chain != null ? 'chain' : 'single'].color;
}

function tacShadeColor(hex, f) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (f <= 1) { r *= f; g *= f; b *= f; }
  else {
    const t = Math.min(1, f - 1);
    r += (255 - r) * t; g += (255 - g) * t; b += (255 - b) * t;
  }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function tacBuffSegColor(segColor, pct) {
  const k = Math.min(1, Math.abs(pct) / 120);
  return pct > 0
    ? tacShadeColor(segColor, 1 + 0.25 + 0.35 * k)
    : tacShadeColor(segColor, 1 - (0.25 + 0.35 * k));
}

function measureNode(m, W, H, idx, chain, sel) {
  const pts = tacMeasurePolyline(m, W, H);
  const isPath = pts.length > 2;
  const ptsStr = () => pts.map((p) => `${p.x},${p.y}`).join(' ');
  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.midx = idx;

  const segWidth = m.width || TAC_MEASURE_DEFAULT[chain ? 'chain' : 'single'].width;

  const hit = document.createElementNS(TAC_SVG_NS, isPath ? 'polyline' : 'line');
  if (isPath) hit.setAttribute('points', ptsStr());
  else {
    hit.setAttribute('x1', pts[0].x); hit.setAttribute('y1', pts[0].y);
    hit.setAttribute('x2', pts[1].x); hit.setAttribute('y2', pts[1].y);
  }
  hit.setAttribute('fill', 'none');
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, segWidth * 4));

  const segColor = tacMeasureSegColor(m);

  const line = document.createElementNS(TAC_SVG_NS, isPath ? 'polyline' : 'line');
  if (isPath) line.setAttribute('points', ptsStr());
  else {
    line.setAttribute('x1', pts[0].x); line.setAttribute('y1', pts[0].y);
    line.setAttribute('x2', pts[1].x); line.setAttribute('y2', pts[1].y);
  }
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', segColor);
  line.setAttribute('stroke-width', sel ? segWidth + 1 : segWidth);
  line.setAttribute('stroke-dasharray', `${segWidth * 8 / 3} ${segWidth * 2}`);
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-linejoin', 'round');
  line.setAttribute('opacity', sel ? '1' : '0.7');



  const buffRanges = tacGreenSegs.get(m) || [];
  const greenLines = buffRanges.map(([f1, f2, pct]) => {
    const sub = tacMeasureSubPath(m, W, H, f1, f2);
    const gl = document.createElementNS(TAC_SVG_NS, 'polyline');
    gl.setAttribute('points', sub.map((p) => `${p.x},${p.y}`).join(' '));
    gl.setAttribute('fill', 'none');
    gl.setAttribute('stroke', tacBuffSegColor(segColor, pct));
    gl.setAttribute('stroke-width', sel ? segWidth + 1 : segWidth);
    gl.setAttribute('stroke-dasharray', `${segWidth * 8 / 3} ${segWidth * 2}`);
    gl.setAttribute('stroke-linecap', 'round');
    gl.setAttribute('stroke-linejoin', 'round');
    gl.setAttribute('opacity', sel ? '1' : '0.85');
    return gl;
  });

  if (chain) {
    g.append(hit, line, ...greenLines);
    return g;
  }


  // 标签沿弧长中点放置，法向取该处切线的左法向（与直线段行为一致）
  const mid = tacMeasurePointAt(m, W, H, 0.5);
  const s = ((W / 2 - mid.x) * mid.nx + (H / 2 - mid.y) * mid.ny) >= 0 ? 1 : -1;
  const text = document.createElementNS(TAC_SVG_NS, 'text');
  const tx = mid.x + mid.nx * 14 * s, ty = mid.y + mid.ny * 14 * s;
  text.setAttribute('x', tx);
  text.setAttribute('y', ty);
  text.setAttribute('class', 'tac-measure-label');
  text.style.fill = segColor;
  tacUprightSvgText(text, tx, ty);
  text.textContent = tacMeasureLabelText(m);

  if (text.textContent) g.append(hit, line, ...greenLines, text);
  else g.append(hit, line, ...greenLines);
  return g;
}

function chainTotalNode(segs, W, H, sel) {
  // 每段长度按弧长计算（路径线沿最优路径折线）
  const lens = segs.map((m) => {
    const pts = tacMeasurePolyline(m, W, H);
    let l = 0;
    for (let i = 1; i < pts.length; i++) {
      l += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return l;
  });
  const total = lens.reduce((a, b) => a + b, 0) || 1;

  let acc = 0, px = 0, py = 0, nx = 0, ny = 1;
  for (let i = 0; i < segs.length; i++) {
    if (acc + lens[i] >= total / 2) {
      const t = lens[i] ? (total / 2 - acc) / lens[i] : 0;
      const p = tacMeasurePointAt(segs[i], W, H, t);
      px = p.x; py = p.y; nx = p.nx; ny = p.ny;
      break;
    }
    acc += lens[i];
  }
  const s = ((W / 2 - px) * nx + (H / 2 - py) * ny) >= 0 ? 1 : -1;
  let units = 0, dw = 1;
  segs.forEach((m) => {
    const r = tacMeasureLen(m);
    units += r.units; dw = r.dw;
  });
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  const text = document.createElementNS(TAC_SVG_NS, 'text');
  const ctx = px + nx * 14 * s, cty = py + ny * 14 * s;
  text.setAttribute('x', ctx);
  text.setAttribute('y', cty);
  tacUprightSvgText(text, ctx, cty);
  text.setAttribute('class', 'tac-measure-label tac-chain-label');
  text.style.fill = tacMeasureSegColor(segs[0]);
  if (sel) text.setAttribute('style',
    `fill:${text.style.fill};stroke:#1e3a8a;stroke-width:4;`
      + 'paint-order:stroke;font-size:15px;');
  const cst = tacLineStyle(segs[0]);
  const cparts = [];
  if (cst.showDist) cparts.push(widthM
    ? `${(units / dw * widthM).toFixed(1)}m` : units.toFixed(1));
  if (cst.showTime && segs[0].lc) {
    const simT = tacSimLine(segs, segs[0].lc);
    cparts.push(`${simT.segs.reduce((acc2, sg) => acc2 + sg.t, 0).toFixed(1)}s`);
  }
  text.textContent = cparts.join(' ');
  return text;
}

// 自动规划最优路线：异步计算 anim.points[segIdx]→[segIdx+1] 的最优路径并写入 anim.paths[segIdx]。
// 复用两点最优路径规划（computePath + smoothPathOnGrid）；恒速 profile 下 Dijkstra 退化为
// 最短距离路径（即直觉上的「最优路线」），速度值只影响快慢、不影响路径形状。
// 计算期间造物可能已被继续编辑：返回后校验该段端点未变，变了则丢弃，避免覆盖后续操作。
// 通用：计算 from→to 的最优路径（复用两点最优路径规划），返回 0~1 相对坐标折线；失败返回 null。
// vault 为 true 时窗带视为可走。恒速 profile 下 Dijkstra 退化为最短距离路径（即直觉上的「最优路线」）。
async function tacRouteBetween(from, to, vault) {
  if (!navGridAvailable(S.currentMapId)) return null;
  const geom = tacAnimGeom();
  const g = await loadNavGrid(S.currentMapId);
  if (!g) return null;
  const profile = createTideProfile({ baseSpeed: TAC_MOVEMENT_SURVIVOR.states.run.speed, buffs: [] });
  const cellOf = (pt) => snapToWalkable(g, pt.x * geom.dw, pt.y * geom.dh);
  const sA = cellOf(from);
  const sB = cellOf(to);
  if (!sA || !sB) return null;
  const result = await computePath(g, sA, sB, profile, { vault: !!vault }).promise;
  if (!result || result.cancelled || result.unreachable || result.path.length < 2) return null;
  // 栅格视线拉直去锯齿，再换算回 0~1 相对坐标
  const smoothed = smoothPathOnGrid(g, result.path, !!vault);
  const pts = smoothed.map((c) => ({
    x: ((c.x + 0.5) * g.cellPx) / geom.dw,
    y: ((c.y + 0.5) * g.cellPx) / geom.dh,
  }));
  return pts.length >= 2 ? pts : null;
}

function tacLetter(i) {
  let s = '';
  let k = i + 1;
  while (k > 0) {
    s = String.fromCharCode(65 + ((k - 1) % 26)) + s;
    k = Math.floor((k - 1) / 26);
  }
  return s;
}

function tacLetterNode(x, y, txt) {
  const t = document.createElementNS(TAC_SVG_NS, 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y - 11);
  tacUprightSvgText(t, x, y - 11);
  t.setAttribute('class', 'tac-mletter');
  t.textContent = txt;
  return t;
}

function tacFmtD(v) {
  return (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
}

function tacSelLine() {
  const all = tacBoard().measures;
  const m = tacSelMeasure && tacSelMeasure.idx != null ? all[tacSelMeasure.idx] : null;
  if (!m || !m.lc) return null;
  if (m.chain == null) return { segs: [m], lc: m.lc, n: 1, selSeg: 0, chain: null };
  const segs = all.filter((x) => x.chain === m.chain && x.lc === m.lc);
  return { segs, lc: m.lc, n: segs.length,
    selSeg: Math.max(0, segs.indexOf(m)), chain: m.chain };
}

function tacEditTarget() {
  const L = tacSelLine();
  if (!L) return { pending: true };
  if (L.chain == null) return { pending: false, lc: L.lc, from: 0, to: 1, n: 1 };
  if (tacApplyScope === 'chain') return { pending: false, lc: L.lc, from: 0, to: L.n, n: L.n };
  return { pending: false, lc: L.lc, from: L.selSeg, to: L.selSeg + 1, n: L.n };
}

function tacBaseAt(lc, i) {
  return measureBaseAt(lc, i);
}

function tacApplyBase(lc, from, to, base) {
  const nb = [];
  for (const b of lc.bases) {
    if (b.to <= from || b.from >= to) { nb.push(b); continue; }
    if (b.from < from) nb.push({ ...b, to: from });
    if (b.to > to) nb.push({ ...b, from: to });
  }
  nb.push({ from, to, ...base });
  nb.sort((a, b) => a.from - b.from);
  lc.bases = nb;
  tacNormLc(lc);
}

function tacRemoveBuffsIn(lc, from, to, pred) {
  const nb = [];
  for (const b of lc.buffs) {
    if (!pred(b) || b.to <= from || b.from >= to) { nb.push(b); continue; }
    if (b.from < from) nb.push({ ...b, id: ++tacBuffSeq, to: from });
    if (b.to > to) nb.push({ ...b, id: ++tacBuffSeq, from: to });
  }
  lc.buffs = nb;
}

function tacTraitRoleInTarget() {
  const tgt = tacEditTarget();
  const bs = tgt.pending
    ? tacPending.buffs
    : tgt.lc.buffs.filter((b) => b.from < tgt.to && b.to > tgt.from);
  const tr = bs.find((b) => b.type === 'trait');
  if (!tr) return null;
  const td = Object.values(TAC_MOVEMENT_BUFFS.trait).flat().find((t) => t.key === tr.key);
  return td ? td.role : (tr.name || '').split(' · ')[0];
}

function tacClearTraitOfRole(roleName) {
  if (!roleName) return;
  const tgt = tacEditTarget();
  const match = (b) => {
    if (b.type !== 'trait') return false;
    if (b.name === roleName || String(b.name || '').indexOf(roleName + ' · ') === 0) return true;
    return Object.values(TAC_MOVEMENT_BUFFS.trait).flat()
      .some((t) => t.key === b.key && t.role === roleName);
  };
  if (tgt.pending) {
    tacPending.buffs = tacPending.buffs.filter((b) => !match(b));
  } else {
    tacRemoveBuffsIn(tgt.lc, tgt.from, tgt.to, match);
  }
}

function tacApplyTrait(lc, from, to, def, roleName) {
  tacRemoveBuffsIn(lc, from, to, (b) => {
    if (b.type !== 'trait') return false;
    const td = Object.values(TAC_MOVEMENT_BUFFS.trait).flat().find((t) => t.key === b.key);
    const bRole = td ? td.role : (b.name || '').split(' · ')[0];
    return bRole !== roleName;
  });
  if (def) {
    lc.buffs.push({
      id: ++tacBuffSeq, type: 'trait', key: def.key, name: def.name,
      mult: def.mult, duration: def.duration || 0,
      from, to,
    });
  }
}

function tacAddBuffEntry(entry) {
  const rows = [{ ...entry }];
  delete rows[0].extra;
  if (entry.extra) rows.push({ ...entry.extra, type: entry.type, key: entry.key });
  const linkId = rows.length > 1 ? ++tacBuffSeq : null;
  const tgt = tacEditTarget();
  const bases = tgt.pending ? [tacPending.base]
    : Array.from({ length: tgt.to - tgt.from }, (_, i) => tacBaseAt(tgt.lc, tgt.from + i));
  if (bases.every((base) => base.fixed)) {
    showToast(translate("application.velocity.buff.note.false3"));
    return false;
  }

  let states = null;
  if (entry.type === 'talent') states = (TAC_MOVEMENT_BUFFS.talent[entry.key] || {}).states;
  else if (entry.type === 'other') {
    states = (Object.values(TAC_MOVEMENT_BUFFS.other).flat()
      .find((t) => t.key === entry.key) || {}).states;
  }
  const state = tacStateOf(bases[0]);
  if (!bases.some((base) => !base.fixed && tacStateMatches(states, tacStateOf(base)))) {
    showToast(translate("application.velocity.buff.note.false4", { name: TAC_MOVEMENT_SURVIVOR.stateNames[state] || state }));
    return false;
  }
  if (tgt.pending) {
    rows.forEach((r) => tacPending.buffs.push(
      { ...r, id: ++tacBuffSeq, from: null, to: null, linkId }));
    return true;
  }
  const { lc, from, to } = tgt;
  rows.forEach((r) => lc.buffs.push({ ...r, id: ++tacBuffSeq, from, to, linkId }));
  return true;
}

function tacNewLineCfg(n) {
  const lc = {
    lid: ++tacLcSeq,
    bases: [{ from: 0, to: n, ...tacPending.base }],
    buffs: tacPending.buffs.map((b) => ({ ...b, id: ++tacBuffSeq, from: 0, to: n })),
  };
  tacNormLc(lc);
  return lc;
}

function tacExtendLineCfg(lc, oldN) {
  const newN = oldN + 1;
  lc.bases.forEach((b) => { if (b.to === oldN) b.to = newN; });
  lc.buffs.forEach((b) => { if (b.to === oldN) b.to = newN; });
  tacNormLc(lc);
}

function tacAppendSegCfg(lc, oldN) {
  lc.bases.push({ from: oldN, to: oldN + 1, ...tacPending.base });
  lc.bases.sort((a, b) => a.from - b.from);
  tacNormLc(lc);
  for (const b of tacPending.buffs) {
    lc.buffs.push({ ...b, id: ++tacBuffSeq, from: oldN, to: oldN + 1 });
  }
}

function tacSimLine(segs, lc) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  const dists = segs.map((m) => {
    const { units, dw } = tacMeasureLen(m);
    return units / dw * widthM;
  });
  return simulateMovement(dists, lc, tacBuffAppliesToBase);
}

function tacSpeedForms(key) {
  if (key === 'survivor') return { forms: [{ name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed }], dual: false };
  const sp = (TAC_ROLES[key] || {}).speed;
  if (sp == null) return null;
  if (typeof sp === 'number') return { forms: [{ name: '', speed: sp }], dual: false };
  const forms = Object.entries(sp).map(([name, speed]) => ({ name, speed }));
  return { forms, dual: true };
}

function syncTacSpeedForm() {
  const key = tacSpeedRole.value;
  if (key === 'role') {
    const sig = 'role';
    if (tacSpeedForm.dataset.sig !== sig) {
      tacSpeedForm.innerHTML = Object.entries(TAC_MOVEMENT_SURVIVOR.roles).map(([k, d]) =>
        `<option value="${k}">${d.name} ${d.speed}m/s</option>`).join('');
      tacSpeedForm.dataset.sig = sig;
    }
    tacSpeedForm.style.display = '';
    return;
  }
  if (key === 'fixed') {
    const sig = 'fixed';
    if (tacSpeedForm.dataset.sig !== sig) {
      tacSpeedForm.innerHTML = Object.entries(TAC_MOVEMENT_SURVIVOR.fixed).map(([k, d]) =>
        `<option value="${k}">${d.name} ${d.speed}m/s</option>`).join('');
      tacSpeedForm.dataset.sig = sig;
    }
    tacSpeedForm.style.display = '';
    return;
  }
  const info = tacSpeedForms(key);
  if (info && info.dual) {
    if (tacSpeedForm.dataset.sig !== key) {
      tacSpeedForm.innerHTML = info.forms.map((f, i) =>
        `<option value="${i}">${translate("application.velocity.base.choose.two", { name: f.name, speed: f.speed })}</option>`).join('');
      tacSpeedForm.dataset.sig = key;
    }
    tacSpeedForm.style.display = '';
  } else {
    tacSpeedForm.style.display = 'none';
    tacSpeedForm.dataset.sig = key;
  }
}

function tacBuildRoleOptions() {
  if (tacCamp === 'survivor') {

    let opts = Object.entries(TAC_MOVEMENT_SURVIVOR.states).map(([k, st]) =>
      `<option value="${k}">${st.name} ${st.speed}m/s</option>`).join('');
    opts += `<option value="role">${translate("common.roles")}</option>`;
    opts += `<option value="fixed">${translate("application.common.fixed")}</option>`;
    tacSpeedRole.innerHTML = opts + `<option value="custom">${translate("common.custom")}</option>`;
    tacSpeedRole.value = 'run';
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
  tacSpeedRole.innerHTML = opts + `<option value="custom">${translate("common.custom")}</option>`;
  tacSpeedRole.value = 'hellEmber';
}

function tacSetCamp(camp) {
  if (tacCamp === camp) return;
  tacCamp = camp;
  tacCampToggle.querySelectorAll('.side-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.camp === camp));
  tacBuildRoleOptions();
}

function tacPanelBase() {
  const v = parseFloat(tacBaseSpeedEl.value);
  const speed = v > 0 ? v : TAC_MOVEMENT_SURVIVOR.states.run.speed;
  const key = tacSpeedRole.value;
  if (key === 'custom') {
    return { name: translate("common.custom"), speed, camp: tacCamp, role: null, form: 0, stKey: 'custom' };
  }
  if (tacCamp === 'survivor' && TAC_MOVEMENT_SURVIVOR.states[key]) {
    return { name: TAC_MOVEMENT_SURVIVOR.states[key].name, speed: TAC_MOVEMENT_SURVIVOR.states[key].speed,
      camp: 'survivor', role: null, form: 0, stKey: key };
  }
  if (key === 'role') {
    const rb = TAC_MOVEMENT_SURVIVOR.roles[tacSpeedForm.value] || TAC_MOVEMENT_SURVIVOR.roles.survivor;
    return { name: rb.name, speed: rb.speed, camp: 'survivor',
      role: rb.role, form: rb.form || 0, stKey: 'role' };
  }
  if (key === 'fixed') {
    const fd = TAC_MOVEMENT_SURVIVOR.fixed[tacSpeedForm.value] || Object.values(TAC_MOVEMENT_SURVIVOR.fixed)[0];
    return { name: fd.name, speed: fd.speed, camp: 'survivor',
      role: fd.role, form: fd.form || 0, stKey: 'fixed', fixed: true };
  }
  const role = key;
  const def = TAC_ROLES[role] || {};
  const camp = def.camp || tacCamp;
  const info = tacSpeedForms(role);
  if (info && info.dual) {
    const fi = Math.min(info.forms.length - 1, +tacSpeedForm.value || 0);
    const fn = info.forms[fi].name;
    return { name: fn === (def.name || role) ? fn : (def.name || role) + ' ' + fn,
      speed, camp, role, form: fi };
  }
  return { name: def.name || role, speed, camp, role, form: 0 };
}

function tacApplyBaseInput(base) {
  const tgt = tacEditTarget();
  if (tgt.pending) tacPending.base = { ...base };
  else tacApplyBase(tgt.lc, tgt.from, tgt.to, base);
  tacPurgeInvalidBuffs();
  updateTacMeasureInfo();
  renderTacArrows();
}

function tacBuffAppliesToBase(b, base) {
  const state = tacStateOf(base);
  if (base.fixed) return false;
  if (b.type === 'trait') {
    const td = Object.values(TAC_MOVEMENT_BUFFS.trait).flat().find((t) => t.key === b.key);
    if (!td) return true;
    if (td.roles && td.roles.length && !td.roles.includes(base.role)) return false;
    if (td.forms && td.forms.length && !td.forms.includes(base.form || 0)) return false;
    if (base.stKey === 'role' && base.camp === 'survivor' && base.role) {
      const roleName = (TAC_ROLES[base.role] || {}).name;
      if (roleName && td.role !== roleName) return false;
    }
    return tacStateMatches(td.states, state);
  }
  if (b.type === 'talent') {
    const tb = TAC_MOVEMENT_BUFFS.talent[b.key];
    return !tb || tacStateMatches(tb.states, state);
  }
  if (b.type === 'other') {
    const ob = Object.values(TAC_MOVEMENT_BUFFS.other).flat().find((t) => t.key === b.key);
    return !ob || tacStateMatches(ob.states, state);
  }
  return true;
}

function tacPurgeInvalidBuffs() {
  const tgt = tacEditTarget();
  const base = tgt.pending ? tacPending.base : tacBaseAt(tgt.lc, tgt.from);
  const keep = (buff) => tacBuffAppliesToBase(buff, base);
  if (tgt.pending) {
    tacPending.buffs = tacPending.buffs.filter(keep);
  } else {
    const { lc, from, to } = tgt;
    tacRemoveBuffsIn(lc, from, to, (b) => !keep(b));
  }
}

function tacSyncSpeedPanel() {
  const tgt = tacEditTarget();
  const sig = tgt.pending ? 'pending' : `L${tgt.lc.lid}:${tgt.from}-${tgt.to}`;
  const base = tgt.pending ? tacPending.base : tacBaseAt(tgt.lc, tgt.from);
  if (sig !== tacTargetSig) {
    tacTargetSig = sig;
    if (base.camp && base.camp !== tacCamp) tacSetCamp(base.camp);
    if (tacCamp === 'survivor') {
      if (base.stKey && TAC_MOVEMENT_SURVIVOR.states[base.stKey]) {
        tacSpeedRole.value = base.stKey;
        syncTacSpeedForm();
      } else if (base.fixed || base.stKey === 'fixed') {
        tacSpeedRole.value = 'fixed';
        syncTacSpeedForm();
        tacSpeedForm.value = `${base.role}:${base.form || 0}`;
        if (!tacSpeedForm.value) tacSpeedForm.selectedIndex = 0;
      } else if (base.stKey === 'role' || (base.role && TAC_ROLES[base.role])) {
        tacSpeedRole.value = 'role';
        syncTacSpeedForm();
        tacSpeedForm.value = base.role ? `${base.role}:${base.form || 0}` : 'survivor';
        if (!tacSpeedForm.value) tacSpeedForm.selectedIndex = 0;
      } else if (base.name === translate("common.custom")) {
        tacSpeedRole.value = 'custom';
        syncTacSpeedForm();
      }
    } else if (base.role) {
      tacSpeedRole.value = base.role;
      syncTacSpeedForm();
      tacSpeedForm.value = String(base.form || 0);
    } else if (base.name === translate("common.custom")) {
      tacSpeedRole.value = 'custom';
      syncTacSpeedForm();
    }
    tacBaseSpeedEl.value = Math.round(base.speed * 100) / 100;
  } else {
    if (document.activeElement !== tacBaseSpeedEl) {
      tacBaseSpeedEl.value = Math.round(base.speed * 100) / 100;
    }
    let wantRole;
    if (tacCamp === 'survivor') {
      wantRole = (base.stKey && TAC_MOVEMENT_SURVIVOR.states[base.stKey]) ? base.stKey
        : (base.fixed || base.stKey === 'fixed') ? 'fixed'
        : (base.stKey === 'role' || (base.role && TAC_ROLES[base.role])) ? 'role'
        : (base.name === translate("common.custom") ? 'custom' : null);
    } else {
      wantRole = base.role || (base.name === translate("common.custom") ? 'custom' : null);
    }
    if (wantRole && tacSpeedRole.value !== wantRole
        && tacSpeedRole.querySelector(`option[value="${wantRole}"]`)) {
      tacSpeedRole.value = wantRole;
      syncTacSpeedForm();
      if ((wantRole === 'role' || wantRole === 'fixed') && tacCamp === 'survivor') {
        tacSpeedForm.value = base.role ? `${base.role}:${base.form || 0}` : 'survivor';
        if (!tacSpeedForm.value) tacSpeedForm.selectedIndex = 0;
      } else if (base.role) tacSpeedForm.value = String(base.form || 0);
    }
  }
  {
    const info = tacSpeedForms(tacSpeedRole.value);
    tacLastRoleVal = (info && info.dual)
      ? `${tacSpeedRole.value}:${tacSpeedForm.value || 0}`
      : tacSpeedRole.value;
  }
}

function tacSyncStatus() {
  const L = tacSelLine();
  const isRoute = tacMeasureMode === 'route';
  let s1, s2;
  if (L) {
    s1 = (L.chain != null && tacApplyScope === 'seg')
      ? `${translate("ui.tac.measure.line.status.choose")}<b>${tacLetter(L.selSeg)}${tacLetter(L.selSeg + 1)}</b>`
      : `${translate("ui.tac.measure.line.status.choose")}<b>${tacLetter(0)}${tacLetter(L.n)}</b>`;
    s2 = L.chain == null
      ? translate("ui.tac.measure.line.status.hint.straightline2")
      : (tacApplyScope === 'chain'
        ? translate(isRoute ? "ui.tac.measure.line.status.hint.routeline3" : "ui.tac.measure.line.status.hint.polyline3")
        : translate(isRoute ? "ui.tac.measure.line.status.hint.routeline4" : "ui.tac.measure.line.status.hint.polyline4"));
  } else {
    s1 = translate("ui.tac.measure.line.status.choose.none");
    s2 = tacMeasureIsChain()
      ? (tacApplyScope === 'chain'
        ? translate(isRoute ? "ui.tac.measure.line.status.hint.routeline1" : "ui.tac.measure.line.status.hint.polyline1")
        : translate(isRoute ? "ui.tac.measure.line.status.hint.routeline2" : "ui.tac.measure.line.status.hint.polyline2"))
      : translate("ui.tac.measure.line.status.hint.straightline1");
  }
  tacStatusEl.innerHTML = s1;
  tacStatus2El.textContent = s2;
  tacDeselectBtn.disabled = !L;
}

function tacSplitBases(lc) {
  const nb = [];
  lc.bases.forEach((b) => {
    for (let i = b.from; i < b.to; i++) nb.push({ ...b, from: i, to: i + 1 });
  });
  lc.bases = nb;
}

function tacMergeBases(lc) {
  const nb = [];
  lc.bases.forEach((b) => {
    const last = nb[nb.length - 1];
    if (last && last.to === b.from && last.name === b.name
        && Math.abs(last.speed - b.speed) < 1e-9) last.to = b.to;
    else nb.push({ ...b });
  });
  lc.bases = nb;
}

function tacNormLc(lc) {
  if (tacBaseMergeOn) tacMergeBases(lc); else tacSplitBases(lc);
}

function tacNormalizeBases() {
  const seen = new Set();
  tacBoard().measures.forEach((m) => {
    if (m.lc && !seen.has(m.lc)) { seen.add(m.lc); tacNormLc(m.lc); }
  });
}

function tacBaseDisplayRows(lc) {
  const out = [];
  lc.bases.forEach((b, i) => {
    const last = out[out.length - 1];
    if (tacBaseMergeOn && last && last.to === b.from && last.name === b.name
        && Math.abs(last.speed - b.speed) < 1e-9) {
      last.to = b.to;
      last.idxs.push(i);
    } else {
      out.push({ from: b.from, to: b.to, name: b.name, speed: b.speed, idxs: [i] });
    }
  });
  return out;
}

function tacDeleteBase(lc, idxs) {
  const b = lc.bases[idxs[0]];
  if (!b) return;
  const { from } = b;
  const to = lc.bases[idxs[idxs.length - 1]].to;
  const prev = lc.bases.filter((x) => x.to === from)[0];
  if (prev) {
    prev.to = to;
    lc.bases = lc.bases.filter((x, i) => !idxs.includes(i));
  } else {
    const dft = b.camp === 'hunter'
      ? { name: TAC_ROLES.hellEmber.name, speed: TAC_ROLES.hellEmber.speed,
          camp: 'hunter', role: 'hellEmber', form: 0 }
      : { name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed,
          camp: 'survivor', role: null, form: 0 };
    lc.bases = lc.bases.filter((x, i) => !idxs.includes(i));
    for (let i = from; i < to; i++) {
      lc.bases.push({ from: i, to: i + 1, ...dft });
    }
  }
  lc.bases.sort((a, c) => a.from - c.from);
  tacNormLc(lc);
}

function renderTacBaseDetail() {
  tacBaseDetailToggle.textContent = translate("application.velocity.base.detail", { value: tacBaseDetailOpen ? '▾' : '▸' });
  tacBaseDetailBody.style.display = tacBaseDetailOpen ? '' : 'none';
  if (!tacBaseDetailOpen) {
    tacBaseMergeBox.style.display = 'none';
    return;
  }
  const tgt = tacEditTarget();
  if (tgt.pending) {
    tacBaseMergeBox.style.display = 'none';
    const b = tacPending.base;
    tacBaseDetailBody.innerHTML =
      `<table class="tac-detail-tbl"><tr><th>${translate("application.velocity.base.detail.table.name")}</th><th class="tac-col-speed">${translate("application.velocity.base.detail.table.speed")}</th><th class="tac-col-pt">${translate("ui.tac.measure.startPoint")}</th><th class="tac-col-pt">${translate("ui.tac.measure.endPoint")}</th><th class="tac-col-del"></th></tr>`
      + `<tr><td>${b.name}</td><td class="tac-col-speed"><b>${Math.round(b.speed * 100) / 100}</b></td>`
      + '<td class="tac-col-pt">—</td><td class="tac-col-pt">—</td><td class="tac-col-del"></td></tr></table>';
    return;
  }
  tacBaseMergeBox.style.display = '';
  const L = tacSelLine();
  const rows = tacBaseDisplayRows(tgt.lc);
  tacBaseDetailBody.innerHTML =
    `<table class="tac-detail-tbl"><tr><th>${translate("application.velocity.base.detail.table.name")}</th><th class="tac-col-speed">${translate("application.velocity.base.detail.table.speed")}</th><th class="tac-col-pt">${translate("ui.tac.measure.startPoint")}</th><th class="tac-col-pt">${translate("ui.tac.measure.endPoint")}</th><th class="tac-col-del"></th></tr>`
    + rows.map((r, i) => `<tr class="tac-base-row" data-brow="${i}"><td>${r.name}</td>`
      + `<td class="tac-col-speed"><b>${Math.round(r.speed * 100) / 100}</b></td>`
      + `<td class="tac-col-pt">${tacLetter(r.from)}</td>`
      + `<td class="tac-col-pt">${tacLetter(r.to)}</td>`
      + `<td class="tac-col-del"><button type="button" class="tac-buff-del" data-basedel="${i}" title="${translate("common.delete")}">×</button></td></tr>`).join('')
    + '</table>';

  tacBaseDetailBody.querySelectorAll('[data-brow]').forEach((tr) => {
    tr.addEventListener('click', (e) => {
      if (e.target.closest('[data-basedel]')) return;
      const r = rows[+tr.dataset.brow];
      if (!r || !L) return;
      const segIdx = tacApplyScope === 'seg' ? r.from : 0;
      const m = L.segs[Math.min(segIdx, L.segs.length - 1)];
      const idx = tacBoard().measures.indexOf(m);
      if (idx < 0) return;
      tacSelMeasure = { idx };
      renderTacArrows();
      updateTacMeasureInfo();
    });
  });

  tacBaseDetailBody.querySelectorAll('[data-basedel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t2 = tacEditTarget();
      if (t2.pending) return;
      const r = rows[+btn.dataset.basedel];
      if (!r) return;
      tacDeleteBase(t2.lc, r.idxs);
      updateTacMeasureInfo();
      renderTacArrows();
    });
  });
}

function tacLetterOptions(n, sel) {
  let s = '';
  for (let i = 0; i <= n; i++) {
    s += `<option value="${i}"${i === sel ? ' selected' : ''}>${tacLetter(i)}</option>`;
  }
  return s;
}

function renderTacBuffDetail() {
  tacBuffDetailToggle.textContent = translate("application.velocity.buff.detail", { value: tacBuffDetailOpen ? '▾' : '▸' });
  tacBuffDetailBody.style.display = tacBuffDetailOpen ? '' : 'none';
  if (!tacBuffDetailOpen) {
    tacBuffFilterBox.style.display = 'none';
    tacBuffFilterBox.innerHTML = '';
    return;
  }
  const tgt = tacEditTarget();
  const buffs = tgt.pending ? tacPending.buffs : tgt.lc.buffs;
  const n = tgt.pending ? 0 : tgt.n;


  let shown = buffs;
  if (tgt.pending) {
    tacBuffFilterBox.style.display = 'none';
    tacBuffFilterBox.innerHTML = '';
  } else {
    if (tacBuffFilter.all || tacBuffFilter.to > n || tacBuffFilter.from >= n) {
      tacBuffFilter.from = 0;
      tacBuffFilter.to = n;
      tacBuffFilter.all = true;
    }
    tacBuffFilterBox.innerHTML = `<span>${translate("ui.tac.measure.setting.velocity.buff.detail.seg.button")}</span>`
      + `<select id="tacBuffFilterFrom"${tacBuffFilter.all ? ' disabled' : ''}>${tacLetterOptions(n, tacBuffFilter.from)}</select>`
      + `<select id="tacBuffFilterTo"${tacBuffFilter.all ? ' disabled' : ''}>${tacLetterOptions(n, tacBuffFilter.to)}</select>`
      + `<label><input type="checkbox" id="tacBuffFilterAll"${tacBuffFilter.all ? ' checked' : ''}>${translate("ui.tac.measure.setting.velocity.buff.detail.all.button")}</label>`;
    tacBuffFilterBox.style.display = '';
    if (!tacBuffFilter.all) {
      shown = buffs.filter((b) =>
        b.from >= tacBuffFilter.from && b.to <= tacBuffFilter.to);
    }
  }

  const rowsHtml = shown.map((b) => {

    const amp = b.postMult
      ? `×${Math.round(b.mult * 100)}%`
      : `${Math.round((b.mult - 1) * 100)}%`;
    const dur = b.duration ? b.duration : '—';
    const fromCell = tgt.pending ? '—'
      : `<select data-bfrom="${b.id}">${tacLetterOptions(n, Math.min(b.from, n))}</select>`;
    const toCell = tgt.pending ? '—'
      : `<select data-bto="${b.id}">${tacLetterOptions(n, Math.min(b.to, n))}</select>`;
    return `<tr><td>${b.name}</td><td class="tac-col-speed2">${amp}</td><td class="tac-col-speed2">${dur}</td>`
      + `<td class="tac-col-pt">${fromCell}</td><td class="tac-col-pt">${toCell}</td>`
      + `<td class="tac-col-del"><button type="button" class="tac-buff-del" data-bdel="${b.id}" title="${translate("common.delete")}">×</button></td></tr>`;
  }).join('');

  tacBuffDetailBody.innerHTML =
    (shown.length
      ? `<table class="tac-detail-tbl"><tr><th>${translate("application.velocity.buff.detail.table.name")}</th><th class="tac-col-speed2">${translate("application.velocity.buff.detail.table.value")}</th><th class="tac-col-speed2">${translate("application.velocity.buff.detail.table.duration")}</th><th class="tac-col-pt">${translate("ui.tac.measure.startPoint")}</th><th class="tac-col-pt">${translate("ui.tac.measure.endPoint")}</th><th class="tac-col-del"></th></tr>`
        + rowsHtml + '</table>'
      : `<div class="tac-detail-empty">${buffs.length ? translate("ui.tac.measure.setting.velocity.buff.detail.hint.none") : translate("application.velocity.buff.detail.hint.none")}</div>`);


  const fromSel = $('tacBuffFilterFrom');
  const allCb = $('tacBuffFilterAll');
  if (fromSel) {
    fromSel.addEventListener('change', () => {
      tacBuffFilter.from = +fromSel.value;
      if (tacBuffFilter.to <= tacBuffFilter.from) {
        tacBuffFilter.to = tacBuffFilter.from + 1;
      }
      tacBuffFilter.all = false;
      renderTacBuffDetail();
    });
    $('tacBuffFilterTo').addEventListener('change', () => {
      tacBuffFilter.to = +$('tacBuffFilterTo').value;
      if (tacBuffFilter.to <= tacBuffFilter.from) {
        tacBuffFilter.from = tacBuffFilter.to - 1;
      }
      tacBuffFilter.all = false;
      renderTacBuffDetail();
    });
    allCb.addEventListener('change', () => {
      tacBuffFilter.all = allCb.checked;
      renderTacBuffDetail();
    });
  }

  tacBuffDetailBody.querySelectorAll('select[data-bfrom]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const t2 = tacEditTarget();
      if (t2.pending) return;
      const b = t2.lc.buffs.find((x) => x.id === +sel.dataset.bfrom);
      if (!b) return;
      b.from = +sel.value;
      if (b.to <= b.from) b.to = b.from + 1;
      updateTacMeasureInfo();
      renderTacArrows();
    });
  });
  tacBuffDetailBody.querySelectorAll('select[data-bto]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const t2 = tacEditTarget();
      if (t2.pending) return;
      const b = t2.lc.buffs.find((x) => x.id === +sel.dataset.bto);
      if (!b) return;
      b.to = +sel.value;
      if (b.to <= b.from) b.from = b.to - 1;
      updateTacMeasureInfo();
      renderTacArrows();
    });
  });

  tacBuffDetailBody.querySelectorAll('[data-bdel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t2 = tacEditTarget();
      const list = t2.pending ? tacPending.buffs : t2.lc.buffs;
      const b = list.find((x) => x.id === +btn.dataset.bdel);
      if (!b) return;
      const keep = b.linkId ? (x) => x.linkId !== b.linkId : (x) => x.id !== b.id;
      if (t2.pending) tacPending.buffs = list.filter(keep);
      else t2.lc.buffs = list.filter(keep);
      updateTacMeasureInfo();
      renderTacArrows();
    });
  });
}

function buildTacTraitList() {
  const rows = TAC_MOVEMENT_BUFFS.trait[tacCamp] || [];
  tacTraitList.innerHTML = rows.map((t) => {
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
      // 按 forms 索引取该角色速度形态名：如摄魂 forms:[0]→谢必安、信徒超出 forms:[1]→信徒
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

function buildTacOtherList() {
  const rows = TAC_MOVEMENT_BUFFS.other[tacCamp] || [];
  tacOtherList.innerHTML = rows.map((t) => {
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
          `<option value="${i}"${i === t.levels.length - 1 ? ' selected' : ''}>${translate("application.buff.common.level", { value: i + 1 })}</option>`).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + `<button type="button" class="tac-talent-add" data-ok="${t.key}">${translate("common.add")}</button></div>`;
  }).join('');
}

function buildTacTalentList() {
  const rows = Object.entries(TAC_MOVEMENT_BUFFS.talent)
    .filter(([, b]) => !b.camp || b.camp === tacCamp);
  tacTalentList.innerHTML = rows.map(([k, b]) => {
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

function updateTacMeasureInfo() {

  if (tacTool !== 'measure') return;
  tacSyncMeasureArm();
  tacSave();
  tacSyncStatus();
  tacSyncSpeedPanel();
  renderTacBaseDetail();
  renderTacBuffDetail();

  const all = tacBoard().measures;
  const widthM = MAPS_DATA[S.currentMapId].widthM;


  let single = null, chainSegs = null, selIdx = null;
  if (tacSelMeasure && tacSelMeasure.idx != null && all[tacSelMeasure.idx]) {
    const m = all[tacSelMeasure.idx];
    if (m.chain != null) {
      chainSegs = all.map((x, i) => ({ m: x, i })).filter((x) => x.m.chain === m.chain);
      selIdx = tacSelMeasure.idx;
    } else {
      single = { m, i: tacSelMeasure.idx };
    }
  }
  if (!single && !chainSegs) {
    if (tacMeasureIsChain()) {
      const lastChain = all.length ? all[all.length - 1].chain : null;
      const activeChain = tacChainRoute !== null ? tacChainRoute : lastChain;
      if (activeChain !== null && activeChain !== undefined) {
        chainSegs = all.map((m, i) => ({ m, i })).filter((x) => x.m.chain === activeChain);
      }
    } else {
      for (let i = all.length - 1; i >= 0; i--) {
        if (all[i].chain == null) { single = { m: all[i], i }; break; }
      }
    }
  }

  const fmt = (v) => (v == null ? '--' : (Math.round(v * 100) / 100).toFixed(2));
  const headHtml = `<table><tr><th></th><th>${translate("ui.tac.measure.result.table.distance")}</th><th>${translate("ui.tac.measure.result.table.time")}</th>`
    + `<th>${translate("ui.tac.measure.result.table.speed")}</th><th>${translate("application.velocity.buff.detail.table.name")}</th><th>${translate("ui.tac.measure.result.table.baseTime")}</th></tr>`;
  const segRow = (label, s, mIdx, sel) => {
    const multi = s.parts.length > 1;
    const part = s.parts[0];
    const open = tacSegExpanded.has(mIdx);
    let r = `<tr class="tac-seg-sum${multi ? '' : ' no-exp'}${sel ? ' sel' : ''}" data-seg="${mIdx}">`
      + `<td>${label}${multi ? `<i class="tac-expand">${open ? '↑' : '↓'}</i>` : ''}</td>`
      + `<td><b>${tacFmtD(s.dist)}</b></td><td><b>${fmt(s.t)}</b></td>`
      + `<td>${multi || !part ? '--' : `<b>${fmt(part.v)}</b>`}</td>`
      + `<td>${multi || !part ? '--' : `<b>${Math.round(part.pct)}%</b>`}</td>`
      + `<td>${fmt(s.t0)}</td></tr>`;
    if (multi && open) {
      const baseSpeed = s.dist / s.t0;
      r += s.parts.map((p) => `<tr class="tac-sub-row"><td></td>`
        + `<td>${tacFmtD(p.dist)}</td><td>${fmt(p.t)}</td>`
        + `<td>${fmt(p.v)}</td><td>${Math.round(p.pct)}%</td>`
        + `<td>${fmt(p.dist / baseSpeed)}</td></tr>`).join('');
    }
    return r;
  };
  // 折线分段编号：中文界面用中文数字（审美习惯），其它语言用阿拉伯数字
  const CN_NUMERALS = '一二三四五六七八九十';
  const segNumeral = (i) => (getActiveLocale() === 'zh-CN' ? CN_NUMERALS[i] || (i + 1) : i + 1);

  let html;
  if (chainSegs && chainSegs.length) {
    if (!widthM || !chainSegs[0].m.lc) {
      html = `<div class="tac-result-empty">${translate("ui.tac.measure.false.note")}</div>`;
    } else {
      const sim = tacSimLine(chainSegs.map((x) => x.m), chainSegs[0].m.lc);
      html = headHtml
        + `<tr class="tac-result-total"><td>${translate("ui.tac.measure.result.polyline.name.all", { value: tacLetter(0), count: tacLetter(sim.segs.length) })}</td>`
        + `<td><b>${tacFmtD(sim.dist)}</b></td><td><b>${fmt(sim.total)}</b></td>`
        + '<td>--</td><td>--</td>'
        + `<td>${fmt(sim.t0)}</td></tr>`
        + sim.segs.map((s, si) => segRow(
            translate("ui.tac.measure.result.polyline.name.single", { value: segNumeral(si), valueSecondary: tacLetter(si), valueTertiary: tacLetter(si + 1) }),
            s, chainSegs[si].i, selIdx === chainSegs[si].i)).join('')
        + '</table>';
      if (tacMeasurePending) {
        html += '<div class="tac-result-empty" style="margin-top:6px">'
          + translate("ui.tac.measure.draw.hint2") + '</div>';
      }
    }
  } else if (single) {
    if (!widthM || !single.m.lc) {
      html = `<div class="tac-result-empty">${translate("ui.tac.measure.false.note")}</div>`;
    } else {
      const sim = tacSimLine([single.m], single.m.lc);
      html = headHtml
        + segRow(translate("ui.tac.measure.result.straightline.name", { value: tacLetter(0), valueSecondary: tacLetter(1) }), sim.segs[0], single.i,
            !!(tacSelMeasure && tacSelMeasure.idx === single.i))
        + '</table>';
    }
  } else {
    html = `<div class="tac-result-empty">${tacMeasureIsChain()
      ? translate("ui.tac.measure.draw.hint1")
      : translate("ui.tac.measure.result.hint")}</div>`;
  }
  tacResult.innerHTML = html;

  tacResult.querySelectorAll('tr.tac-seg-sum[data-seg]').forEach((tr) => {
    tr.addEventListener('click', () => {
      const idx = +tr.dataset.seg;

      if (!tr.classList.contains('no-exp')) {
        if (tacSegExpanded.has(idx)) tacSegExpanded.delete(idx);
        else tacSegExpanded.add(idx);
      }
      tacSelMeasure = { idx };
      renderTacArrows();
      updateTacMeasureInfo();
    });
  });
}

function buildTacSpeedPanel() {
  tacBuildRoleOptions();


  function tacSyncScopeVis() {
    tacScopeWrap.style.display = tacMeasureIsChain() ? '' : 'none';
    // 路径线模式下「应用到折线」变为「应用到路径线」
    const label = tacScopeWrap.querySelector('.tac-scope-label');
    if (label) {
      const key = tacMeasureMode === 'route'
        ? 'ui.tac.measure.setting.line.label.route' : 'ui.tac.measure.setting.line.label';
      label.dataset.i18n = key;
      label.textContent = translate(key);
    }
  }


  tacCampToggle.querySelectorAll('.side-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (tacCamp === btn.dataset.camp) return;
      tacSetCamp(btn.dataset.camp);

      {
        const tgt = tacEditTarget();
        if (tgt.pending) {
          tacPending.buffs = tacPending.buffs.filter((b) => b.type !== 'trait' && b.type !== 'talent');
        } else {
          tacRemoveBuffsIn(tgt.lc, tgt.from, tgt.to,
            (b) => b.type === 'trait' || b.type === 'talent');
        }
      }
      let dft;
      if (tacCamp === 'survivor') {
        dft = { name: TAC_MOVEMENT_SURVIVOR.states.run.name, speed: TAC_MOVEMENT_SURVIVOR.states.run.speed, camp: 'survivor', role: null, form: 0, stKey: 'run' };
      } else {
        const info = tacSpeedForms(tacSpeedRole.value);
        const f0 = info ? info.forms[0] : { name: '', speed: TAC_MOVEMENT_SURVIVOR.states.run.speed };
        tacSpeedForm.value = '0';
        dft = { name: (TAC_ROLES[tacSpeedRole.value] || {}).name + (info && info.dual ? ' ' + f0.name : ''),
          speed: f0.speed, camp: 'hunter', role: tacSpeedRole.value, form: 0 };
      }
      tacBaseSpeedEl.value = dft.speed;
      syncTacSpeedForm();
      tacApplyBaseInput(dft);
    });
  });

  tacScopeToggle.querySelectorAll('.side-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (tacApplyScope === btn.dataset.scope) return;
      tacApplyScope = btn.dataset.scope;
      tacScopeToggle.querySelectorAll('.side-btn').forEach((b) =>
        b.classList.toggle('active', b === btn));
      if (tacApplyScope === 'seg') {
        const L = tacSelLine();
        if (L && L.chain != null) {
          const all = tacBoard().measures;
          tacSelMeasure = { idx: all.indexOf(L.segs[0]) };
        }
      }
      tacTargetSig = '';
      updateTacMeasureInfo();
      renderTacArrows();
    });
  });

  tacDeselectBtn.addEventListener('click', () => {
    tacSelMeasure = null;
    renderTacArrows();
    updateTacMeasureInfo();
  });




  tacSpeedRole.addEventListener('change', () => {
    const prev = tacLastRoleVal;
    const prevKey = String(prev || '').split(':')[0];
    const prevName = tacCamp === 'hunter'
      ? ((TAC_ROLES[prevKey] || {}).name
        || (TAC_MOVEMENT_SURVIVOR.states[prevKey] ? null : (tacTraitRoleInTarget() || null)))
      : null;
    syncTacSpeedForm();
    const info = tacSpeedForms(tacSpeedRole.value);
    if (info) {
      tacSpeedForm.value = '0';
      tacBaseSpeedEl.value = info.forms[0].speed;
    }
    if (tacSpeedRole.value === 'role' || tacSpeedRole.value === 'fixed') {

      if (!tacSpeedForm.value) tacSpeedForm.selectedIndex = 0;
      tacBaseSpeedEl.value = tacPanelBase().speed;
    }
    if (prevName && tacSpeedRole.value !== prevKey) tacClearTraitOfRole(prevName);
    tacApplyBaseInput(tacPanelBase());
  });
  tacSpeedForm.addEventListener('change', () => {
    if (tacSpeedRole.value === 'role' || tacSpeedRole.value === 'fixed') {

      const pb = tacPanelBase();
      tacBaseSpeedEl.value = pb.speed;
      tacApplyBaseInput(pb);
      return;
    }

    const info = tacSpeedForms(tacSpeedRole.value);
    const fi = Math.min(info.forms.length - 1, +tacSpeedForm.value || 0);
    if (info) tacBaseSpeedEl.value = info.forms[fi].speed;
    tacApplyBaseInput(tacPanelBase());
  });

  tacBaseSpeedEl.addEventListener('input', () => {
    const v = parseFloat(tacBaseSpeedEl.value);
    if (!(v > 0)) return;
    const cur = tacSpeedRole.value;
    if (cur !== 'custom') {
      let info, sp;
      if (TAC_MOVEMENT_SURVIVOR.states[cur]) { info = null; sp = TAC_MOVEMENT_SURVIVOR.states[cur].speed; }
      else if (cur === 'role' || cur === 'fixed') { info = null; sp = tacPanelBase().speed; }
      else {
        info = tacSpeedForms(cur);
        const fi = info && info.dual ? (Math.min(info.forms.length - 1, +tacSpeedForm.value || 0)) : 0;
        sp = info ? info.forms[fi].speed : null;
      }
      if (sp == null || Math.abs(sp - v) > 1e-9) {

        const prevName = tacCamp === 'hunter'
          ? ((TAC_ROLES[cur] || {}).name || (TAC_ROLES[tacLastRoleVal] || {}).name)
          : null;
        tacSpeedRole.value = 'custom';
        syncTacSpeedForm();
        if (prevName) tacClearTraitOfRole(prevName);
      } else {
        tacApplyBaseInput(tacPanelBase());
        return;
      }
    }
    tacApplyBaseInput({ name: translate("common.custom"), speed: v, camp: tacCamp, role: null, form: 0 });
  });

  tacTraitAddBtn.addEventListener('click', () => {
    buildTacTraitList();
    tacTraitModal.style.display = 'flex';
  });
  tacTraitClose.addEventListener('click', () => {
    tacTraitModal.style.display = 'none';
  });
  tacTraitModal.addEventListener('click', (e) => {
    if (e.target === tacTraitModal) tacTraitModal.style.display = 'none';
  });
  tacTraitList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const def = (TAC_MOVEMENT_BUFFS.trait[tacCamp] || []).find((t) => t.key === btn.dataset.tk);
    if (!def) return;
    const tgt0 = tacEditTarget();
    const base0 = tgt0.pending ? tacPending.base : tacBaseAt(tgt0.lc, tgt0.from);

    if (base0.fixed) {
      tacTraitModal.style.display = 'none';
      showToast(translate("application.velocity.buff.note.false3"));
      return;
    }

    const state0 = tacStateOf(base0);
    if (!tacStateMatches(def.states, state0)) {
      tacTraitModal.style.display = 'none';
      if (tacCamp === 'survivor') {
        showToast(translate("application.velocity.buff.note.false4", { name: TAC_MOVEMENT_SURVIVOR.stateNames[state0] || state0 }));
      } else {
        showToast(translate("application.velocity.buff.note.false1", { role: def.role, name: def.name, nameSecondary: (def.states || []).map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') }));
      }
      return;
    }


    if (tacCamp === 'survivor' && base0.stKey === 'role' && base0.role) {
      const roleName = (TAC_ROLES[base0.role] || {}).name;
      if (roleName && def.role !== roleName) {
        tacTraitModal.style.display = 'none';
        showToast(translate("application.velocity.buff.note.false2"));
        return;
      }
    }
    const lvSel = tacTraitList.querySelector(`select[data-tlv="${def.key}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const entry = {
      key: def.key,
      name: def.levels
        ? `${def.role} · ${def.name} ${tacLevelLabel(def.key, lv)}`
        : `${def.role} · ${def.name}`,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    if (def.postMult) entry.postMult = true;


    let rKey = null, traitBase = null;
    if (tacCamp === 'hunter') {
      rKey = Object.keys(TAC_ROLES).find((k) => TAC_ROLES[k].name === def.role) || null;
      if (rKey) {
        const sp = TAC_ROLES[rKey].speed;
        const forms = typeof sp === 'object' ? Object.entries(sp) : [[def.role, sp]];
        let fi = 0;
        if (def.forms && def.forms.length) fi = def.forms[0];
        traitBase = { name: `${def.role}${forms.length > 1 ? ' ' + forms[fi][0] : ''}`,
          speed: forms[fi][1], camp: 'hunter', role: rKey, form: fi };
      }
    }
    const tgt = tacEditTarget();
    if (tgt.pending) {

      tacPending.buffs = tacPending.buffs.filter((b) => {
        if (b.type !== 'trait') return true;
        const td = Object.values(TAC_MOVEMENT_BUFFS.trait).flat().find((t) => t.key === b.key);
        const bRole = td ? td.role : (b.name || '').split(' · ')[0];
        return bRole === def.role;
      });
      tacPending.buffs.push({
        id: ++tacBuffSeq, type: 'trait', ...entry, from: null, to: null,
      });
      if (traitBase) {
        tacPending.base = { ...traitBase };
        tacTargetSig = '';
      }
    } else {
      tacApplyTrait(tgt.lc, tgt.from, tgt.to, entry, def.role);
      if (traitBase) {
        tacApplyBase(tgt.lc, tgt.from, tgt.to, traitBase);
        tacTargetSig = '';
      }
    }

    if (tacCamp === 'hunter' && rKey
        && tacSpeedRole.querySelector(`option[value="${rKey}"]`)) {
      tacSpeedRole.value = rKey;
      syncTacSpeedForm();
      if (traitBase) tacSpeedForm.value = String(traitBase.form || 0);
      const info2 = tacSpeedForms(tacSpeedRole.value);
      tacLastRoleVal = (info2 && info2.dual)
        ? `${tacSpeedRole.value}:${tacSpeedForm.value || 0}`
        : tacSpeedRole.value;
    }
    tacTraitModal.style.display = 'none';
    showToast(translate("application.velocity.buff.note.true", { name: entry.name }));
    updateTacMeasureInfo();
    renderTacArrows();
  });

  tacOtherAddBtn.addEventListener('click', () => {
    buildTacOtherList();
    tacOtherModal.style.display = 'flex';
  });
  tacOtherClose.addEventListener('click', () => {
    tacOtherModal.style.display = 'none';
  });
  tacOtherModal.addEventListener('click', (e) => {
    if (e.target === tacOtherModal) tacOtherModal.style.display = 'none';
  });
  tacOtherList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const def = (TAC_MOVEMENT_BUFFS.other[tacCamp] || []).find((t) => t.key === btn.dataset.ok);
    if (!def) return;
    const lvSel = tacOtherList.querySelector(`select[data-olv="${def.key}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const name = def.levels ? translate("application.buff.common.name.level", { name: def.name, value: lv + 1 }) : def.name;
    const entry = {
      type: 'other', key: def.key, name,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    tacOtherModal.style.display = 'none';
    if (tacAddBuffEntry(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name: name }));
      updateTacMeasureInfo();
      renderTacArrows();
    }
  });

  tacTalentAddBtn.addEventListener('click', () => {
    buildTacTalentList();
    tacTalentModal.style.display = 'flex';
  });
  tacTalentClose.addEventListener('click', () => {
    tacTalentModal.style.display = 'none';
  });
  tacTalentModal.addEventListener('click', (e) => {
    if (e.target === tacTalentModal) tacTalentModal.style.display = 'none';
  });
  tacTalentList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const k = btn.dataset.k;
    const def = TAC_MOVEMENT_BUFFS.talent[k];
    if (!def) return;
    const lvSel = tacTalentList.querySelector(`select[data-lv="${k}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const mult = def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult;
    const name = def.levels ? translate("application.buff.common.name.level", { name: def.name, value: lv + 1 }) : def.name;
    const entry = { type: 'talent', key: k, name, mult, duration: def.duration || 0 };
    if (def.extra) entry.extra = { name: def.extra.name, mult: def.extra.mult, duration: 0 };
    tacTalentModal.style.display = 'none';
    if (tacAddBuffEntry(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name: name }));
      updateTacMeasureInfo();
      renderTacArrows();
    }
  });

  tacBuffAddBtn.addEventListener('click', () => {
    tacBuffModal.style.display = 'flex';
  });
  tacBuffClose.addEventListener('click', () => {
    tacBuffModal.style.display = 'none';
  });
  tacBuffModal.addEventListener('click', (e) => {
    if (e.target === tacBuffModal) tacBuffModal.style.display = 'none';
  });
  tacBuffOk.addEventListener('click', () => {
    const pct = parseFloat(tacBuffPct.value);
    tacBuffModal.style.display = 'none';
    if (!pct) { showToast(translate("application.velocity.buff.note.false5")); return; }
    const dur = parseFloat(tacBuffDur.value) || 0;
    const name = (tacBuffName.value || '').trim() || translate("common.custom");
    const ok = tacAddBuffEntry({ type: 'custom', key: '', name, mult: 1 + pct / 100, duration: dur });
    if (ok) {
      tacBuffName.value = '';
      tacBuffPct.value = '';
      tacBuffDur.value = '';
      showToast(translate("application.velocity.buff.note.true", { name: name }));
      updateTacMeasureInfo();
      renderTacArrows();
    }
  });

  $('tacHelpBtn').addEventListener('click', () => {
    $('tacHelpModal').style.display = 'flex';
  });
  $('tacHelpClose').addEventListener('click', () => {
    $('tacHelpModal').style.display = 'none';
  });
  $('tacHelpModal').addEventListener('click', (e) => {
    if (e.target === $('tacHelpModal')) $('tacHelpModal').style.display = 'none';
  });

  tacBaseDetailToggle.addEventListener('click', () => {
    tacBaseDetailOpen = !tacBaseDetailOpen;
    renderTacBaseDetail();
  });
  tacBaseMerge.addEventListener('change', () => {
    tacBaseMergeOn = tacBaseMerge.checked;
    tacNormalizeBases();
    tacTargetSig = '';
    renderTacBaseDetail();
    updateTacMeasureInfo();
    renderTacArrows();
  });
  tacBuffDetailToggle.addEventListener('click', () => {
    tacBuffDetailOpen = !tacBuffDetailOpen;
    renderTacBuffDetail();
  });
  tacResultToggle.addEventListener('click', () => {
    tacResultOpen = !tacResultOpen;
    tacResultToggle.textContent = translate("ui.tac.measure.result.title", { value: tacResultOpen ? '▾' : '▸' });
    tacResultBody.style.display = tacResultOpen ? '' : 'none';
  });
  tacResultToggle.textContent = translate("ui.tac.measure.result.title", { value: tacResultOpen ? '▾' : '▸' });
  // 速度设置区：整体可收起，默认展开
  const syncTacSpeedSettings = () => {
    tacSpeedSettingsToggleEl.textContent = translate("ui.tac.measure.setting.velocity.title", { value: tacSpeedSettingsOpen ? '▾' : '▸' });
    tacSpeedSettingsBodyEl.style.display = tacSpeedSettingsOpen ? '' : 'none';
  };
  tacSpeedSettingsToggleEl.addEventListener('click', () => {
    setTacSpeedSettingsOpen(!tacSpeedSettingsOpen);
    syncTacSpeedSettings();
  });
  syncTacSpeedSettings();

  syncTacSpeedForm();
  tacBaseSpeedEl.value = tacPending.base.speed;

  // 通用「样式设置」折叠开关：测算卡片的样式设置、图形绘制卡片、文本书写卡片共用
  const makeStyleToggle = (toggleEl, bodyEl) => {
    let open = true;
    const sync = () => {
      toggleEl.textContent = translate("application.draw.style.title", { value: open ? '▾' : '▸' });
      bodyEl.style.display = open ? '' : 'none';
    };
    toggleEl.addEventListener('click', () => { open = !open; sync(); });
    sync();
  };

  // 绘制设置区：整体可收起，默认收起；样式设置、其它设置默认展开
  const syncTacDrawSettings = () => {
    tacDrawSettingsToggle.textContent = translate("ui.tac.measure.setting.draw.title", { value: tacDrawSettingsOpen ? '▾' : '▸' });
    tacDrawSettingsBody.style.display = tacDrawSettingsOpen ? '' : 'none';
  };
  const syncTacDrawOther = () => {
    tacDrawOtherToggle.textContent = translate("application.draw.other.title", { value: tacDrawOtherOpen ? '▾' : '▸' });
    tacDrawOtherBody.style.display = tacDrawOtherOpen ? '' : 'none';
  };
  tacDrawSettingsToggle.addEventListener('click', () => {
    setTacDrawSettingsOpen(!tacDrawSettingsOpen);
    syncTacDrawSettings();
  });
  tacDrawOtherToggle.addEventListener('click', () => {
    setTacDrawOtherOpen(!tacDrawOtherOpen);
    syncTacDrawOther();
  });
  syncTacDrawSettings();
  syncTacDrawOther();
  makeStyleToggle(tacDrawStyleToggle, tacMStyleBody);
  makeStyleToggle(tacShapeStyleToggle, tacShapeStyleBody);
  makeStyleToggle(tacTextStyleToggle, tacTextStyleBody);

  tacMeasureModesEl.querySelectorAll('.side-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tacMeasureMode = btn.dataset.mmode;
      tacMeasureModesEl.querySelectorAll('.side-btn').forEach((b) =>
        b.classList.toggle('active', b === btn));
      tacChainRoute = null;
      tacMeasurePending = null;
      tacMeasureHover = null;
      tacSelMeasure = null;
      tacSyncScopeVis();
      syncTacMeasureStyleUI();
      tacSyncMeasureArm();
      renderTacBoard();
      updateTacMeasureInfo();
    });
  });

  // 取消连续绘制：与 Esc 等价（按钮仅在绘制中出现）
  tacMeasureCancelEl?.addEventListener('click', () => {
    if (!tacMeasurePending) return;
    tacMeasurePending = null;
    tacChainRoute = null;
    tacMeasureHover = null;
    renderTacArrows();
    updateTacMeasureInfo();
  });

  tacMeasureColorsEl.querySelectorAll('.tac-color').forEach((btn) => {
    btn.addEventListener('click', () => {
      tacMeasureStyle[tacMeasureMode].color = btn.dataset.color;
      tacMeasureColorsEl.querySelectorAll('.tac-color').forEach((b) =>
        b.classList.toggle('active', b === btn));
      const L = tacSelLine();
      if (L) { L.segs.forEach((m) => { m.color = btn.dataset.color; }); renderTacBoard(); }
      tacSave();
    });
  });
  tacMeasureWidthEl.addEventListener('input', () => {
    const w = parseInt(tacMeasureWidthEl.value, 10);
    tacMeasureStyle[tacMeasureMode].width = w;
    tacMeasureWidthVal.textContent = tacMeasureWidthEl.value;
    const L = tacSelLine();
    if (L) { L.segs.forEach((m) => { m.width = w; }); renderTacBoard(); }
    tacSave();
  });
  syncTacMeasureStyleUI();
  tacSyncScopeVis();
  tacSyncMeasureArm();
}

function syncTacMeasureStyleUI() {
  const st = tacMeasureStyle[tacMeasureMode];
  tacMeasureColorsEl.querySelectorAll('.tac-color').forEach((b) =>
    b.classList.toggle('active', b.dataset.color === st.color));
  tacMeasureWidthEl.value = st.width;
  tacMeasureWidthVal.textContent = st.width;
  // 「允许翻窗」仅路径线模式可见
  if (tacMeasureVaultWrapEl) {
    tacMeasureVaultWrapEl.style.display = tacMeasureMode === 'route' ? '' : 'none';
  }
}

// 「点此取消添加」按钮：仅在折线/路径线连续绘制中出现（挨着「取消选中」），其余时刻隐藏
function tacSyncMeasureArm() {
  if (tacMeasureCancelEl) {
    tacMeasureCancelEl.style.display = tacMeasurePending ? '' : 'none';
  }
}

function tacDeleteMeasureAt(idx) {
  const board = tacBoard();
  const m = board.measures[idx];
  if (!m) return null;

  const sliceCfg = (lc, off, len) => {
    const nl = {
      lid: ++tacLcSeq,
      bases: lc.bases
        .filter((b) => b.to > off && b.from < off + len)
        .map((b) => ({ ...b, from: Math.max(0, b.from - off), to: Math.min(len, b.to - off) })),
      buffs: lc.buffs
        .filter((b) => b.to > off && b.from < off + len)
        .map((b) => ({ ...b, id: ++tacBuffSeq,
          from: Math.max(0, b.from - off), to: Math.min(len, b.to - off) })),
    };
    tacNormLc(nl);
    return nl;
  };
  if (m.chain == null) {
    board.measures.splice(idx, 1);
  } else {
    const chainIdxs = board.measures
      .map((x, i) => ({ x, i }))
      .filter((p) => p.x.chain === m.chain)
      .map((p) => p.i);
    const pos = chainIdxs.indexOf(idx);
    const leftIdxs = chainIdxs.slice(0, pos);
    const rightIdxs = chainIdxs.slice(pos + 1);
    board.measures.splice(idx, 1);
    if (leftIdxs.length) {
      const lc = board.measures[leftIdxs[0]].lc;
      const cfg = sliceCfg(lc, 0, leftIdxs.length);
      if (rightIdxs.length) {

        const chainL = leftIdxs.length > 1
          ? ++tacRouteSeq : null;
        leftIdxs.forEach((mi) => {
          const mm = board.measures[mi];
          mm.chain = chainL; mm.lc = cfg;
          mm.color = tacMeasureStyle[tacMeasureMode].color;
          mm.width = tacMeasureStyle[tacMeasureMode].width;
        });
      } else {

        leftIdxs.forEach((mi) => { board.measures[mi].lc = cfg; });
      }
    }
    if (rightIdxs.length) {
      const lc = board.measures[rightIdxs[0] - 1].lc;
      const cfg = sliceCfg(lc, pos + 1, rightIdxs.length);
      const chain = rightIdxs.length > 1 ? ++tacRouteSeq : null;
      rightIdxs.forEach((ri) => {
        const mm = board.measures[ri - 1];
        mm.chain = chain; mm.lc = cfg;
        mm.color = tacMeasureStyle[tacMeasureMode].color;
        mm.width = tacMeasureStyle[tacMeasureMode].width;
      });
    }
  }
  tacSegExpanded.clear();
  tacSelMeasure = null;
  return m;
}

export function setTacChainRoute(value) {
  tacChainRoute = value;
  return value;
}

export function setTacGreenSegs(value) {
  tacGreenSegs = value;
  return value;
}

export function setTacMeasureHover(value) {
  tacMeasureHover = value;
  return value;
}

export function setTacMeasurePending(value) {
  tacMeasurePending = value;
  return value;
}

export function setTacRouteSeq(value) {
  tacRouteSeq = value;
  return value;
}

export function setTacSelMeasure(value) {
  tacSelMeasure = value;
  return value;
}

export function initializeSpeedPanel() {
  buildTacSpeedPanel();
}

export {
  buildTacOtherList,
  buildTacSpeedPanel,
  buildTacTalentList,
  buildTacTraitList,
  chainTotalNode,
  measureNode,
  renderTacBaseDetail,
  renderTacBuffDetail,
  syncTacMeasureStyleUI,
  syncTacSpeedForm,
  tacAddBuffEntry,
  tacAppendSegCfg,
  tacApplyBase,
  tacApplyBaseInput,
  tacApplyScope,
  tacApplyTrait,
  tacBaseAt,
  tacBaseDetailOpen,
  tacBaseDisplayRows,
  tacBaseMergeOn,
  tacBuffAppliesToBase,
  tacBuffDetailOpen,
  tacBuffFilter,
  tacBuffSegColor,
  tacBuffSeq,
  tacBuildRoleOptions,
  tacCamp,
  tacChainRoute,
  tacClearTraitOfRole,
  tacDeleteBase,
  tacDeleteMeasureAt,
  tacEditTarget,
  tacExtendLineCfg,
  tacFmtD,
  tacGreenSegs,
  tacLastRoleVal,
  tacLcSeq,
  tacLetter,
  tacLetterNode,
  tacLetterOptions,
  tacLevelLabel,
  tacLineStyle,
  tacMeasureHover,
  tacMeasureIsChain,
  tacMeasureLabelText,
  tacMeasureLen,
  tacMeasureMode,
  tacMeasurePending,
  tacMeasureSegColor,
  tacMeasureText,
  tacMeasureTime,
  tacMergeBases,
  tacNewLineCfg,
  tacNormLc,
  tacNormalizeBases,
  tacPanelBase,
  tacPending,
  tacPurgeInvalidBuffs,
  tacRemoveBuffsIn,
  tacResultOpen,
  tacRouteBetween,
  tacRouteSeq,
  tacSegExpanded,
  tacSelLine,
  tacSelMeasure,
  tacSetCamp,
  tacShadeColor,
  tacSimLine,
  tacSpeedForms,
  tacSplitBases,
  tacStateMatches,
  tacStateOf,
  tacSyncMeasureArm,
  tacSyncSpeedPanel,
  tacSyncStatus,
  tacTargetSig,
  tacTraitRoleInTarget,
  updateTacMeasureInfo,
};
