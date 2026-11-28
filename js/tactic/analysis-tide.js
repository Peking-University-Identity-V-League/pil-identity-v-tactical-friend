import {
  showToast,
  tacCarryChairCountEl,
  tacCarryDetailBodyEl,
  tacCarryDetailBoxEl,
  tacCarryDetailToggleEl,
  tacCarryLegend,
  tacCarryNote,
  tacCarryOpacityEl,
  tacCarryOpacityRowEl,
  tacCarryProgressBar,
  tacCarryProgressBox,
  tacCarryResultBoxEl,
  tacCarryRunBtn,
  tacCarrySummary,
  tacTideBaseDetailBodyEl,
  tacTideBaseDetailToggleEl,
  tacTideBaseSpeedEl,
  tacTideBuffAddBtn,
  tacTideBuffBodyEl,
  tacTideBuffClose,
  tacTideBuffDur,
  tacTideBuffModal,
  tacTideBuffName,
  tacTideBuffOk,
  tacTideBuffPct,
  tacTideBuffToggleEl,
  tacTideOtherAddBtn,
  tacTideOtherClose,
  tacTideOtherList,
  tacTideOtherModal,
  tacTideSpeedFormEl,
  tacTideSpeedRoleEl,
  tacTideTalentAddBtn,
  tacTideTalentClose,
  tacTideTalentList,
  tacTideTalentModal,
  tacTideTraitAddBtn,
  tacTideTraitClose,
  tacTideTraitList,
  tacTideTraitModal,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { computeTideField, loadNavGrid, navGridAvailable, snapToWalkable } from '../core/nav-grid.js';
import { S } from '../core/state.js';
import {
  createTideProfile,
  TIDE_BAND_COLORS,
  TIDE_BAND_OPACITY,
  TIDE_SECONDS,
  tideBandAt,
} from '../core/tide-model.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_MOVEMENT_BUFFS, TAC_MOVEMENT_SURVIVOR } from '../data/tactic-data.js';
import {
  renderTacCarryMark,
  setTacCarryCanvas,
  syncTacCarryResultBox,
  syncTacDedRunBtn,
  tacCarryCanvas,
  tacCarryClearResult,
  tacCarryDetailOpen,
  tacCarryGroundChairs,
  tacCarryState,
  tacDedToggleBand,
} from './analysis-carry.js';
import { tacLayer, tacUpRot } from './board.js';
import { tacLevelLabel, tacStateMatches, tacStateOf } from './measure.js';

/* ================= 化险为夷推算（狂欢之椅推算卡片的 tide 场景） ================= */
// 与 carry 场景共用选中/结果/图例控件；仅求生者移速（基础移速 + 加成）为场景私有，
// 不与其它卡片共享；设置区 UI 结构与测算卡片速度设置区对齐。

let tacTideBuffId = 0;

// 从场景私有的求生者移速状态构建计算档案（与测算同语义：1+Σ(mult-1)，postMult 再乘）
function readTacTideProfile() {
  return createTideProfile({
    baseSpeed: tacCarryState.tide.base.speed,
    buffs: tacCarryState.tide.buffs.map(({ mult, postMult, duration }) => ({ mult, postMult, duration })),
  });
}

async function tacTideRun() {
  if (tacCarryState.running) return;
  const sel = tacCarryState.chair;
  if (!sel) {
    showToast(translate(tacCarryState.mode === 'point' ? 'ui.tac.rocketChair.common.point.pick.status.picking' : 'ui.tac.rocketChair.common.rc.pick.status.picking'));
    return;
  }
  if (!navGridAvailable(S.currentMapId)) {
    tacCarrySummary.textContent = translate('ui.tac.rocketChair.noGrid');
    return;
  }
  tacCarryClearResult();
  tacCarryState.running = true;
  tacCarryRunBtn.textContent = translate('ui.tac.rocketChair.tideTurner.running');
  tacCarryProgressBox.style.display = '';
  tacCarryProgressBar.style.width = '0%';
  try {
    const g = await loadNavGrid(S.currentMapId);
    if (!g) { tacCarrySummary.textContent = translate('ui.tac.rocketChair.noGrid'); return; }
    const profile = readTacTideProfile();
    // 地下室椅子：从楼梯出口格起搜，椅子→出口（水平 + 坡道斜面附加）折算为已耗时
    let start = snapToWalkable(g, sel.x, sel.z);
    let initialSeconds = 0;
    if (sel.kind === 'basement' && g.basements?.length) {
      let best = null, bestD = Infinity;
      for (const b of g.basements) {
        const d = Math.hypot(b.center[0] - sel.x, b.center[1] - sel.z);
        if (d < bestD) { bestD = d; best = b; }
      }
      const exitStart = best && snapToWalkable(g, best.exit[0], best.exit[1]);
      if (exitStart) {
        const metersPerPx = g.metersPerCell / g.cellPx;
        const distM = Math.hypot(best.exit[0] - sel.x, best.exit[1] - sel.z) * metersPerPx
          + best.slopeExtraM;
        initialSeconds = distM / profile.speedAt(0);
        start = exitStart;
      }
    }
    if (!start) {
      tacCarrySummary.textContent = translate(sel.kind === 'point'
        ? 'ui.tac.rocketChair.error.unsupportedPoint' : 'ui.tac.rocketChair.error.unsupportedChair');
      return;
    }
    const run = computeTideField(g, start, profile, {
      initialSeconds,
      onProgress: (p) => { tacCarryProgressBar.style.width = `${Math.round(p * 100)}%`; },
    });
    tacCarryState.cancel = run.cancel;
    const field = await run.promise;
    if (field.cancelled) return;
    tacCarryState.hiddenBands.clear();
    tacCarryState.cache = { scenario: 'tide', g, field, profile };
    renderTacTideOverlay(g, field);
    tacCarryState.resultMapId = S.currentMapId;
    tacCarrySummary.textContent = translate('ui.tac.rocketChair.tideTurner.result.summary', { cells: field.reached });
    renderTacTideLegend(field.bands);
    syncTacCarryResultBox();
    tacCarryResultBoxEl.style.display = '';
    tacCarryNote.dataset.i18n = 'ui.tac.rocketChair.tideTurner.result.note';
    tacCarryNote.textContent = translate('ui.tac.rocketChair.tideTurner.result.note');
    tacCarryNote.style.display = '';
  } finally {
    tacCarryState.running = false;
    syncTacDedRunBtn();
    tacCarryProgressBar.style.width = '100%';
    setTimeout(() => { if (!tacCarryState.running) tacCarryProgressBox.style.display = 'none'; }, 400);
  }
}

function renderTacTideOverlay(g, field) {
  // 被关掉的色带，其格子改用最邻近的外侧点亮色带颜色（0–5<5–10<10–15<15–20<余量）
  const resolveBand = (band) => {
    let b = band;
    while (b < TIDE_BAND_COLORS.length && tacCarryState.hiddenBands.has(b)) b++;
    return b < TIDE_BAND_COLORS.length ? b : -1;
  };
  // 选点看可达椅不画颜色覆盖层，只标注各椅到达时间
  if (tacCarryState.mode === 'point') {
    tacCarryCanvas?.remove();
    setTacCarryCanvas(null);
  } else {
    const [W0, H0] = MAPS_DATA[S.currentMapId].mapSize;
    const off = document.createElement('canvas');
    off.width = g.gridW;
    off.height = g.gridH;
    const octx = off.getContext('2d');
    const img = octx.createImageData(g.gridW, g.gridH);
    const px = img.data;
    const factor = (parseFloat(tacCarryOpacityEl.value) || 65) / 100;
    for (let i = 0; i < field.bandOf.length; i++) {
      const band = resolveBand(field.bandOf[i]);
      if (band < 0) continue;
      const color = TIDE_BAND_COLORS[band];
      const r = parseInt(color.slice(1, 3), 16);
      const gg = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      px[i * 4] = r;
      px[i * 4 + 1] = gg;
      px[i * 4 + 2] = b;
      px[i * 4 + 3] = Math.round(TIDE_BAND_OPACITY[band] * factor * 255);
    }
    octx.putImageData(img, 0, 0);
    const canvas = document.createElement('canvas');
    canvas.width = W0;
    canvas.height = H0;
    canvas.className = 'tac-carry-canvas';
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, W0, H0);
    tacCarryCanvas?.remove();
    setTacCarryCanvas(canvas);
    tacLayer().appendChild(canvas);
  }
  renderTacTideChairTimes(g, field, resolveBand);
}

// 选点看可达椅：在每把椅子上标注起点跑过去的秒数（与 3D「选点查椅子」一致），
// 文字颜色取所在色带；超过 21 秒的椅子不标注；起点处标「起点」。
function renderTacTideChairTimes(g, field, resolveBand) {
  tacLayer().querySelectorAll('.tac-carry-times').forEach((el) => el.remove());
  if (tacCarryState.mode !== 'point') return;
  const profile = tacCarryState.cache?.profile;
  if (!profile) return;
  const [W0, H0] = MAPS_DATA[S.currentMapId].mapSize;
  const layer = document.createElement('div');
  layer.className = 'tac-carry-times';
  const addLabel = (x, z, text, color, cls = '') => {
    const el = document.createElement('span');
    el.className = cls ? `tac-carry-time ${cls}` : 'tac-carry-time';
    el.textContent = text;
    el.style.left = `${(x / W0) * 100}%`;
    el.style.top = `${(z / H0) * 100}%`;
    el.style.color = color;
    // rotate 之后 translateY，保证文字正立且标签位于图标正上方
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg) translateY(-15px)`;
    layer.appendChild(el);
  };
  const cellIndex = (x, z) => {
    const gx = Math.round(x / g.cellPx - 0.5), gy = Math.round(z / g.cellPx - 0.5);
    return (gx >= 0 && gy >= 0 && gx < g.gridW && gy < g.gridH) ? gy * g.gridW + gx : -1;
  };
  const rows = [];
  for (const c of tacCarryGroundChairs()) {
    let t = Infinity;
    if (c.kind === 'basement' && g.basements?.length) {
      // 地下室椅：出口格时间 + 出口→椅子（水平 + 坡道附加）折算
      let best = null, bestD = Infinity;
      for (const b of g.basements) {
        const d = Math.hypot(b.center[0] - c.x, b.center[1] - c.z);
        if (d < bestD) { bestD = d; best = b; }
      }
      const ei = best && cellIndex(best.exit[0], best.exit[1]);
      const tExit = ei >= 0 ? field.time[ei] : Infinity;
      if (Number.isFinite(tExit)) {
        const distM = Math.hypot(best.exit[0] - c.x, best.exit[1] - c.z)
          * (g.metersPerCell / g.cellPx) + best.slopeExtraM;
        t = tExit + distM / profile.speedAt(tExit);
      }
    } else {
      const i = cellIndex(c.x, c.z);
      if (i >= 0) t = field.time[i];
    }
    const band = tideBandAt(field.bands, t);
    // 超过 21 秒的椅子不标注
    if (band < 0) continue;
    const shown = resolveBand(band);
    addLabel(c.x, c.z,
      translate(band === 4 ? 'ui.tac.rocketChair.tideTurner.point.map.timeMargin' : 'ui.tac.rocketChair.tideTurner.point.map.timeSeconds',
        { seconds: t.toFixed(1) }),
      shown >= 0 ? TIDE_BAND_COLORS[shown] : '#a4afbb');
    rows.push({ x: c.x, z: c.z, t, band });
  }
  tacLayer().appendChild(layer);
  // 椅子明细：按到达时间升序，缓存供明细表重开时复用
  rows.sort((a, b) => a.t - b.t);
  if (tacCarryState.cache) tacCarryState.cache.chairRows = rows;
  if (tacCarryState.mode === 'point') {
    // 统计只计 20 秒内可达（余量带需额外加速，不计入）
    const reachable = rows.filter((r) => r.band < 4).length;
    tacCarryChairCountEl.textContent = translate('ui.tac.rocketChair.tideTurner.result.chairCount', { count: reachable });
    tacCarryChairCountEl.style.display = '';
    renderTacTideDetail(rows);
  } else {
    tacCarryChairCountEl.style.display = 'none';
    tacCarryDetailBoxEl.style.display = 'none';
  }
}

// 椅子明细表（仅选点模式）：与 carry 场景共用折叠开关与表格容器；
// 点击行在地图上用正圆红框框出对应椅子，再点取消，点别的行切换
function renderTacTideDetail(rows) {
  tacCarryDetailToggleEl.textContent = translate('ui.tac.rocketChair.tideTurner.result.table.title', { value: tacCarryDetailOpen ? '▾' : '▸' });
  tacCarryDetailBoxEl.style.display = rows.length ? '' : 'none';
  tacCarryDetailBodyEl.style.display = tacCarryDetailOpen ? '' : 'none';
  if (!rows.length) return;
  if (tacCarryDetailOpen) {
    tacCarryDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
      + `<th>${translate('ui.tac.rocketChair.tideTurner.result.table.detailPos')}</th>`
      + `<th>${translate('ui.tac.rocketChair.tideTurner.result.table.detailTime')}</th>`
      + `<th>${translate('ui.tac.rocketChair.tideTurner.result.table.detailType')}</th></tr></thead><tbody>`
      + rows.map((r, i) =>
        `<tr data-row="${i}"${tacCarryState.detailMark === i ? ' class="marked"' : ''}>`
        + `<td>${Math.round(r.x)}, ${Math.round(r.z)}</td><td>${r.t.toFixed(1)}</td>`
        + `<td>${translate(`ui.tac.rocketChair.tideTurner.band${r.band}`)}</td></tr>`).join('')
      + '</tbody></table>';
  }
  renderTacCarryMark();
}

function renderTacTideLegend(bands) {
  tacCarryLegend.innerHTML = '';
  // 选点看可达椅：图例只是颜色含义说明，不是可点击按钮
  const staticLegend = tacCarryState.mode === 'point';
  bands.forEach((b) => {
    if (b.empty) return;
    const el = document.createElement(staticLegend ? 'span' : 'button');
    if (!staticLegend) el.type = 'button';
    el.className = 'tac-carry-band';
    if (!staticLegend) {
      el.dataset.band = b.band;
      if (tacCarryState.hiddenBands.has(b.band)) el.classList.add('off');
      el.title = translate('ui.tac.rocketChair.common.band.message');
      el.addEventListener('click', () => tacDedToggleBand(b.band));
    }
    el.innerHTML = `<span class="tac-carry-swatch" style="background:${TIDE_BAND_COLORS[b.band]}"></span>`
      + `<span>${translate(`ui.tac.rocketChair.tideTurner.band${b.band}`)}</span>`;
    tacCarryLegend.appendChild(el);
  });
  tacCarryLegend.style.display = '';
  tacCarryOpacityRowEl.style.display = tacCarryState.mode === 'point' ? 'none' : '';
}

/* ---- tide 场景求生者移速设置区（私有状态，结构与测算卡片对齐） ---- */

// 基础移速下拉：求生者姿态 + 角色移速 + 固定移速 + 自定义（测算求生者分支同款）
function buildTacTideRoleOptions() {
  let opts = Object.entries(TAC_MOVEMENT_SURVIVOR.states).map(([k, st]) =>
    `<option value="${k}">${st.name} ${st.speed}m/s</option>`).join('');
  opts += `<option value="role">${translate("common.roles")}</option>`;
  opts += `<option value="fixed">${translate("application.common.fixed")}</option>`;
  tacTideSpeedRoleEl.innerHTML = opts + `<option value="custom">${translate("common.custom")}</option>`;
  tacTideSpeedRoleEl.value = 'run';
}

function syncTacTideSpeedForm() {
  const key = tacTideSpeedRoleEl.value;
  if (key === 'role') {
    if (tacTideSpeedFormEl.dataset.sig !== 'role') {
      tacTideSpeedFormEl.innerHTML = Object.entries(TAC_MOVEMENT_SURVIVOR.roles).map(([k, d]) =>
        `<option value="${k}">${d.name} ${d.speed}m/s</option>`).join('');
      tacTideSpeedFormEl.dataset.sig = 'role';
    }
    tacTideSpeedFormEl.style.display = '';
    return;
  }
  if (key === 'fixed') {
    if (tacTideSpeedFormEl.dataset.sig !== 'fixed') {
      tacTideSpeedFormEl.innerHTML = Object.entries(TAC_MOVEMENT_SURVIVOR.fixed).map(([k, d]) =>
        `<option value="${k}">${d.name} ${d.speed}m/s</option>`).join('');
      tacTideSpeedFormEl.dataset.sig = 'fixed';
    }
    tacTideSpeedFormEl.style.display = '';
    return;
  }
  tacTideSpeedFormEl.style.display = 'none';
  tacTideSpeedFormEl.dataset.sig = key;
}

// 当前面板选择对应的基础移速条目（测算 tacPanelBase 求生者分支同款）
function tacTidePanelBase() {
  const v = parseFloat(tacTideBaseSpeedEl.value);
  const speed = v > 0 ? v : TAC_MOVEMENT_SURVIVOR.states.run.speed;
  const key = tacTideSpeedRoleEl.value;
  if (key === 'custom') {
    return { name: translate("common.custom"), speed, camp: 'survivor', role: null, form: 0, stKey: 'custom' };
  }
  if (TAC_MOVEMENT_SURVIVOR.states[key]) {
    return { name: TAC_MOVEMENT_SURVIVOR.states[key].name, speed: TAC_MOVEMENT_SURVIVOR.states[key].speed,
      camp: 'survivor', role: null, form: 0, stKey: key };
  }
  if (key === 'role') {
    const rb = TAC_MOVEMENT_SURVIVOR.roles[tacTideSpeedFormEl.value] || TAC_MOVEMENT_SURVIVOR.roles.survivor;
    return { name: rb.name, speed: rb.speed, camp: 'survivor',
      role: rb.role, form: rb.form || 0, stKey: 'role' };
  }
  const fd = TAC_MOVEMENT_SURVIVOR.fixed[tacTideSpeedFormEl.value] || Object.values(TAC_MOVEMENT_SURVIVOR.fixed)[0];
  return { name: fd.name, speed: fd.speed, camp: 'survivor',
    role: fd.role, form: fd.form || 0, stKey: 'fixed', fixed: true };
}

function tacTideApplyBase(base) {
  tacCarryState.tide.base = { ...base };
  // 姿态切换后，不再匹配新姿态的加成移除
  const state = tacStateOf(tacCarryState.tide.base);
  const keep = (b) => {
    if (tacCarryState.tide.base.fixed) return false;
    const def = b.type === 'trait'
      ? (TAC_MOVEMENT_BUFFS.trait.survivor || []).find((t) => t.key === b.key)
      : b.type === 'talent' ? TAC_MOVEMENT_BUFFS.talent[b.key]
        : b.type === 'other'
          ? (TAC_MOVEMENT_BUFFS.other.survivor || []).find((t) => t.key === b.key) : null;
    if (b.type === 'talent' && b.key === 'borrowedTime' && b.name !== def?.name) return true; // 回光返照额外条
    return !def?.states || tacStateMatches(def.states, state);
  };
  tacCarryState.tide.buffs = tacCarryState.tide.buffs.filter(keep);
  renderTacTideBaseDetail();
  renderTacTideBuffs();
}

// 基础明细：基础移速 / 速度 / 20 秒移动距离（默认展开）
let tacTideBaseDetailOpen = true;

function renderTacTideBaseDetail() {
  tacTideBaseDetailToggleEl.textContent = translate("application.velocity.base.detail", { value: tacTideBaseDetailOpen ? '▾' : '▸' });
  tacTideBaseDetailBodyEl.style.display = tacTideBaseDetailOpen ? '' : 'none';
  if (!tacTideBaseDetailOpen) return;
  const b = tacCarryState.tide.base;
  tacTideBaseDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th>${translate('application.velocity.base.detail.table.name')}</th>`
    + `<th>${translate('application.velocity.base.detail.table.speed')}</th>`
    + `<th>${translate('ui.tac.rocketChair.tideTurner.setting.velocity.base.detail.table.distance')}</th></tr></thead><tbody>`
    + `<tr><td>${b.name}</td><td class="tac-col-speed"><b>${Math.round(b.speed * 100) / 100}</b></td>`
    + `<td>${Math.round(b.speed * TIDE_SECONDS * 10) / 10}</td></tr></tbody></table>`;
}

// 加成明细表（默认展开）：加成 / 加成值 / 时间 s / 删除（格式对齐测算卡片加成明细，表内不带 s 单位）
let tacTideBuffOpen = true;

function renderTacTideBuffs() {
  tacTideBuffToggleEl.textContent = translate('application.velocity.buff.detail', { value: tacTideBuffOpen ? '▾' : '▸' });
  tacTideBuffBodyEl.style.display = tacTideBuffOpen ? '' : 'none';
  if (!tacTideBuffOpen) return;
  const pct = (v) => `${Math.round((v - 1) * 1000) / 10}%`;
  const rows = tacCarryState.tide.buffs.map((b) => ({
    id: b.id,
    name: b.name,
    value: pct(b.mult) + (b.postMult ? translate("application.buff.common.desc.multi") : ''),
    duration: b.duration ? b.duration : translate("application.buff.common.desc.duration"),
  }));
  if (!rows.length) {
    tacTideBuffBodyEl.innerHTML = `<div class="tac-detail-empty">${translate('application.velocity.buff.detail.hint.none')}</div>`;
    return;
  }
  tacTideBuffBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th class="tac-cb-name">${translate('application.velocity.buff.detail.table.name')}</th>`
    + `<th class="tac-cb-value">${translate('application.velocity.buff.detail.table.value')}</th>`
    + `<th>${translate('application.velocity.buff.detail.table.duration')}</th>`
    + `<th class="tac-col-del"></th></tr></thead><tbody>`
    + rows.map((r) =>
      `<tr><td>${r.name}</td><td>${r.value}</td><td>${r.duration}</td>`
      + `<td class="tac-col-del"><button type="button" class="tac-buff-del tac-tide-buff-del" data-tbid="${r.id}">×</button></td></tr>`).join('')
    + '</tbody></table>';
}

function tacTideAddBuff(entry) {
  const rows = [{ ...entry }];
  delete rows[0].extra;
  if (entry.extra) rows.push({ ...entry.extra, type: entry.type, key: entry.key });
  if (tacCarryState.tide.base.fixed) {
    showToast(translate("application.velocity.buff.note.false3"));
    return false;
  }
  const states = entry.type === 'talent' ? (TAC_MOVEMENT_BUFFS.talent[entry.key] || {}).states
    : entry.type === 'other'
      ? ((TAC_MOVEMENT_BUFFS.other.survivor || []).find((t) => t.key === entry.key) || {}).states
      : entry.type === 'trait'
        ? ((TAC_MOVEMENT_BUFFS.trait.survivor || []).find((t) => t.key === entry.key) || {}).states
        : null;
  const state = tacStateOf(tacCarryState.tide.base);
  if (!tacStateMatches(states, state)) {
    showToast(translate("application.velocity.buff.note.false4", { name: TAC_MOVEMENT_SURVIVOR.stateNames[state] || state }));
    return false;
  }
  rows.forEach((r) => tacCarryState.tide.buffs.push({ ...r, id: ++tacTideBuffId }));
  return true;
}

// 三个加成弹窗列表：求生者阵营（测算列表渲染同款）
function buildTacTideTraitList() {
  const rows = TAC_MOVEMENT_BUFFS.trait.survivor || [];
  tacTideTraitList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.buff.common.desc.level", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.buff.common.desc.duration"))
      : `${Math.round((t.mult - 1) * 100)}%${t.postMult ? translate("application.buff.common.desc.multi") : ''}`
        + (t.duration ? ` ${t.duration}s` : translate("application.buff.common.desc.duration"));
    if (t.states) {
      desc += translate("application.buff.common.condition.desc1", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
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

function buildTacTideTalentList() {
  const rows = Object.entries(TAC_MOVEMENT_BUFFS.talent)
    .filter(([, b]) => !b.camp || b.camp === 'survivor');
  tacTideTalentList.innerHTML = rows.map(([k, b]) => {
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

function buildTacTideOtherList() {
  const rows = TAC_MOVEMENT_BUFFS.other.survivor || [];
  tacTideOtherList.innerHTML = rows.map((t) => {
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

function bindTacTideModal(btn, modal, close) {
  btn.addEventListener('click', () => { modal.style.display = 'flex'; });
  close.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// tide 场景设置区绑定（由 buildTacCarryCard 末尾调用）
function buildTacTideSettings() {
  if (!tacTideBaseSpeedEl) return;
  // 求生者移速：基础移速数字框 + 下拉（数字框直改后下拉跳到自定义）
  buildTacTideRoleOptions();
  tacTideSpeedRoleEl.addEventListener('change', () => {
    syncTacTideSpeedForm();
    const base = tacTidePanelBase();
    tacTideBaseSpeedEl.value = base.speed;
    tacTideApplyBase(base);
  });
  tacTideSpeedFormEl.addEventListener('change', () => {
    const base = tacTidePanelBase();
    tacTideBaseSpeedEl.value = base.speed;
    tacTideApplyBase(base);
  });
  tacTideBaseSpeedEl.addEventListener('input', () => {
    const v = parseFloat(tacTideBaseSpeedEl.value);
    if (!(v > 0) || tacTideSpeedRoleEl.value === 'custom') return;
    if (Math.abs(tacTidePanelBase().speed - v) > 1e-9) {
      tacTideSpeedRoleEl.value = 'custom';
      syncTacTideSpeedForm();
    }
    tacTideApplyBase(tacTidePanelBase());
  });
  syncTacTideSpeedForm();
  // 初始基础移速与下拉（跑动 3.8 m/s）对齐
  tacTideApplyBase(tacTidePanelBase());
  bindTacTideModal(tacTideTraitAddBtn, tacTideTraitModal, tacTideTraitClose);
  bindTacTideModal(tacTideTalentAddBtn, tacTideTalentModal, tacTideTalentClose);
  bindTacTideModal(tacTideOtherAddBtn, tacTideOtherModal, tacTideOtherClose);
  bindTacTideModal(tacTideBuffAddBtn, tacTideBuffModal, tacTideBuffClose);
  tacTideTraitAddBtn.addEventListener('click', buildTacTideTraitList);
  tacTideTalentAddBtn.addEventListener('click', buildTacTideTalentList);
  tacTideOtherAddBtn.addEventListener('click', buildTacTideOtherList);

  tacTideTraitList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const def = (TAC_MOVEMENT_BUFFS.trait.survivor || []).find((t) => t.key === btn.dataset.tk);
    if (!def) return;
    // 角色移速（如野人骑乘）只能用本角色特质
    if (tacCarryState.tide.base.stKey === 'role' && tacCarryState.tide.base.role) {
      const roleName = (TAC_ROLES[tacCarryState.tide.base.role] || {}).name;
      if (roleName && def.role !== roleName) {
        tacTideTraitModal.style.display = 'none';
        showToast(translate("application.velocity.buff.note.false2"));
        return;
      }
    }
    const lvSel = tacTideTraitList.querySelector(`select[data-tlv="${def.key}"]`);
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
    tacTideTraitModal.style.display = 'none';
    // 同角色特质互斥（与测算一致）：移除该角色其它特质后加入
    tacCarryState.tide.buffs = tacCarryState.tide.buffs.filter((b) => {
      if (b.type !== 'trait') return true;
      const td = (TAC_MOVEMENT_BUFFS.trait.survivor || []).find((t) => t.key === b.key);
      const bRole = td ? td.role : (b.name || '').split(' · ')[0];
      return bRole === def.role;
    });
    if (tacTideAddBuff(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name: entry.name }));
      renderTacTideBuffs();
    }
  });

  tacTideTalentList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const k = btn.dataset.k;
    const def = TAC_MOVEMENT_BUFFS.talent[k];
    if (!def) return;
    const lvSel = tacTideTalentList.querySelector(`select[data-lv="${k}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const mult = def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult;
    const name = def.levels ? translate("application.buff.common.name.level", { name: def.name, value: lv + 1 }) : def.name;
    const entry = { type: 'talent', key: k, name, mult, duration: def.duration || 0 };
    if (def.extra) entry.extra = { name: def.extra.name, mult: def.extra.mult, duration: 0 };
    tacTideTalentModal.style.display = 'none';
    if (tacTideAddBuff(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name }));
      renderTacTideBuffs();
    }
  });

  tacTideOtherList.addEventListener('click', (e) => {
    const btn = e.target.closest('.tac-talent-add');
    if (!btn) return;
    const def = (TAC_MOVEMENT_BUFFS.other.survivor || []).find((t) => t.key === btn.dataset.ok);
    if (!def) return;
    const lvSel = tacTideOtherList.querySelector(`select[data-olv="${def.key}"]`);
    const lv = lvSel ? +lvSel.value : null;
    const name = def.levels ? translate("application.buff.common.name.level", { name: def.name, value: lv + 1 }) : def.name;
    const entry = {
      type: 'other', key: def.key, name,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    tacTideOtherModal.style.display = 'none';
    if (tacTideAddBuff(entry)) {
      showToast(translate("application.velocity.buff.note.true", { name }));
      renderTacTideBuffs();
    }
  });

  tacTideBuffOk.addEventListener('click', () => {
    const pct = parseFloat(tacTideBuffPct.value);
    tacTideBuffModal.style.display = 'none';
    if (!pct) { showToast(translate("application.velocity.buff.note.false5")); return; }
    const dur = parseFloat(tacTideBuffDur.value) || 0;
    const name = (tacTideBuffName.value || '').trim() || translate("common.custom");
    const ok = tacTideAddBuff({ type: 'custom', key: '', name, mult: 1 + pct / 100, duration: dur });
    if (ok) {
      tacTideBuffName.value = '';
      tacTideBuffPct.value = '';
      tacTideBuffDur.value = '';
      showToast(translate("application.velocity.buff.note.true", { name }));
      renderTacTideBuffs();
    }
  });

  // 明细删除与折叠
  tacTideBuffBodyEl.addEventListener('click', (e) => {
    const del = e.target.closest('.tac-tide-buff-del');
    if (!del) return;
    const id = +del.dataset.tbid;
    tacCarryState.tide.buffs = tacCarryState.tide.buffs.filter((b) => b.id !== id);
    renderTacTideBuffs();
  });
  tacTideBaseDetailToggleEl.addEventListener('click', () => {
    tacTideBaseDetailOpen = !tacTideBaseDetailOpen;
    renderTacTideBaseDetail();
  });
  tacTideBuffToggleEl.addEventListener('click', () => {
    tacTideBuffOpen = !tacTideBuffOpen;
    renderTacTideBuffs();
  });
  renderTacTideBaseDetail();
  renderTacTideBuffs();
}

export {
  buildTacTideSettings,
  renderTacTideDetail,
  renderTacTideLegend,
  renderTacTideOverlay,
  tacTideRun,
};
