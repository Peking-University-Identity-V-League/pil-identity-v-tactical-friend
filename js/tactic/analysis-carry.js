import {
  CARRY_BAND_COLORS,
  CARRY_BAND_OPACITY,
  CARRY_DEFAULTS,
  CARRY_SURVIVORS,
  CARRY_TALENTS,
  carryBandAt,
  carryDropBudget,
  createCarryProfile,
} from '../core/carry-model.js';
import {
  showToast,
  tacCarryBasementNextBtn,
  tacCarryBasementPrevBtn,
  tacCarryBoxBasementEl,
  tacCarryBuffBody,
  tacCarryBuffToggleEl,
  tacCarryCard,
  tacCarryChairAllEl,
  tacCarryChairBasementEl,
  tacCarryChairCountEl,
  tacCarryChairName,
  tacCarryChairNextBtn,
  tacCarryChairPrevBtn,
  tacCarryChairSizeDefEl,
  tacCarryChairSizeEl,
  tacCarryChairText,
  tacCarryClearBtn,
  tacCarryDetailBodyEl,
  tacCarryDetailBoxEl,
  tacCarryDetailToggleEl,
  tacCarryHideRingEl,
  tacCarryHideRingLabelEl,
  tacCarryHuntClose,
  tacCarryHunterEl,
  tacCarryHunterFormEl,
  tacCarryHunterSpeedEl,
  tacCarryHuntList,
  tacCarryHuntModal,
  tacCarryHuntTalentBtn,
  tacCarryInitialEl,
  tacCarryInitialVal,
  tacCarryLegend,
  tacCarryModeChairEl,
  tacCarryModePointEl,
  tacCarryNote,
  tacCarryOpacityEl,
  tacCarryOpacityRowEl,
  tacCarryPickBtn,
  tacCarryPickupEl,
  tacCarryPickupModeEl,
  tacCarryProgressBar,
  tacCarryProgressBox,
  tacCarryResultBodyEl,
  tacCarryResultBoxEl,
  tacCarryResultToggleEl,
  tacCarryRunBtn,
  tacCarrySettingsBodyEl,
  tacCarrySettingsToggleEl,
  tacCarryShowChairsEl,
  tacCarrySpeedClose,
  tacCarrySpeedList,
  tacCarrySpeedModal,
  tacCarrySpeedTalentBtn,
  tacCarrySummary,
  tacCarrySurvClose,
  tacCarrySurvivorEl,
  tacCarrySurvList,
  tacCarrySurvModal,
  tacCarrySurvTalentBtn,
  tacDedScenarioCarryEl,
  tacDedScenarioTideEl,
  tacDedSettingsCarryEl,
  tacDedSettingsTideEl,
  tacPathCard,
  tacPathFixNote,
  tacPathNote,
  tacPathResultBoxEl,
  tacPathSummary,
  tacShowBoxBasementEl,
  tacShowChairBasementEl,
  tacSnapRipple,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { computeCarryField, loadNavGrid, navGridAvailable, snapToWalkable } from '../core/nav-grid.js';
import { tacDisplay, tacSave } from '../core/persist.js';
import { S } from '../core/state.js';
import { MAPS_DATA, rocketChairGroups } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_DISPLAY_DEFAULT, TAC_MOVEMENT_SURVIVOR } from '../data/tactic-data.js';
import {
  renderTacPathOverlay,
  syncTacPathPickUI,
  syncTacPathResultBox,
  tacPathClearResult,
  tacPathDisarm,
  tacPathState,
} from './analysis-path.js';
import {
  buildTacTideSettings,
  renderTacTideDetail,
  renderTacTideLegend,
  renderTacTideOverlay,
  tacTideRun,
} from './analysis-tide.js';
import {
  renderTacBoxes,
  renderTacChairs,
  switchTacBasement,
  switchTacChair,
  syncTacBasementText,
  tacBasementList,
  tacLayer,
  tacUpRot,
} from './board.js';
import { tacSpeedForms } from './measure.js';
import { bindTacDisplayRow, syncTacDisplayUI } from './settings.js';

// ---- 狂欢之椅推算（挂人范围二维近似，数据来自三维导航栅格） ----
const tacCarryState = {
  scenario: 'carry',          // 'carry' 牵气球-上椅 | 'tide' 化险为夷-下椅（两场景共用选中/结果/图例）
  mode: 'chair',              // 'chair' 选椅看范围 | 'point' 选点看挂椅/可达椅
  armed: false,               // 选择模式：点击地图椅子/任意点进行选择
  chair: null,                // { kind:'fixed'|'set'|'basement', index, x, z } 或选点 { kind:'point', x, z }（底图像素坐标）
  running: false,
  cancel: null,
  resultMapId: null,          // 结果所属地图；切图后失效
  buffs: [],                  // 加成明细（carry 场景）：[{ id, key, level }]
  hiddenBands: new Set(),     // 图例中被用户关掉的色带
  cache: null,                // 上次计算结果 { scenario, g, field, profile, chairRows? }，用于切换色带时免重算重绘
  detailMark: null,           // 明细中被点击框选的行下标（chairRows 下标），null = 无
  // tide 场景私有的求生者移速（不与其它卡片共享）：base 结构与测算 tacPending.base 一致
  tide: {
    base: { name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed, camp: 'survivor', role: null, form: 0, stKey: 'run' },
    buffs: [],                // [{ id, type, key, name, mult, postMult?, duration }]
  },
};

let tacCarryBuffId = 0;

let tacCarryCanvas = null;

/* ---- 推算绘制按地图各自保留（切图保存 / 切回恢复，move 语义） ---- */
const tacDedStore = new Map();

// mapId -> { carry: {chair, cache, hiddenBands, detailMark}|null, path: {points, cache}|null }
let tacDedLiveMapId = null;

// 实时选中/结果当前所属的地图

function tacDedSaveCurrent() {
  if (tacDedLiveMapId == null) return;
  const carry = (tacCarryState.chair || tacCarryState.cache) ? {
    chair: tacCarryState.chair && { ...tacCarryState.chair },
    cache: tacCarryState.cache,
    hiddenBands: new Set(tacCarryState.hiddenBands),
    detailMark: tacCarryState.detailMark,
  } : null;
  const path = (tacPathState.points.a || tacPathState.points.b || tacPathState.cache) ? {
    points: {
      a: tacPathState.points.a && { ...tacPathState.points.a },
      b: tacPathState.points.b && { ...tacPathState.points.b },
    },
    cache: tacPathState.cache,
  } : null;
  if (carry || path) tacDedStore.set(tacDedLiveMapId, { carry, path });
  else tacDedStore.delete(tacDedLiveMapId);
}

// 场景/模式切换会清除计算结果：仓库里其它地图暂存的推算结果也一并作废
function tacDedStoreClearCarry() {
  for (const [id, e] of tacDedStore) {
    e.carry = null;
    if (!e.path) tacDedStore.delete(id);
  }
}

function tacDedOnMapSwitch() {
  if (tacDedLiveMapId === S.currentMapId) return;
  tacDedSaveCurrent();
  // 清空实时视觉与状态（不触碰仓库）
  tacCarryDisarm();
  tacCarryState.chair = null;
  tacCarryClearResult();
  tacPathDisarm();
  tacPathState.points = { a: null, b: null };
  tacPathClearResult();
  // 恢复目标图暂存的选中与结果
  const entry = tacDedStore.get(S.currentMapId);
  if (entry) {
    tacDedStore.delete(S.currentMapId);
    if (entry.carry) {
      tacCarryState.chair = entry.carry.chair;
      tacCarryState.hiddenBands = entry.carry.hiddenBands;
      tacCarryState.detailMark = entry.carry.detailMark;
      const c = entry.carry.cache;
      if (c) {
        tacCarryState.cache = c;
        tacCarryState.resultMapId = S.currentMapId;
        renderTacDedOverlay(c);
        const tide = c.scenario === 'tide';
        tacCarrySummary.textContent = tide
          ? translate('ui.tac.rocketChair.tideTurner.result.summary', { cells: c.field.reached })
          : translate('ui.tac.rocketChair.balloon.result.summary', {
            seconds: c.profile.remainingSeconds.toFixed(1),
            pickup: c.profile.pickupSeconds.toFixed(1),
            cells: c.field.reached,
          });
        if (tide) renderTacTideLegend(c.field.bands);
        else renderTacCarryLegend(c.field.bands);
        syncTacCarryResultBox();
        tacCarryResultBoxEl.style.display = '';
        tacCarryNote.dataset.i18n = tide ? 'ui.tac.rocketChair.tideTurner.result.note' : 'ui.tac.rocketChair.balloon.result.note';
        tacCarryNote.textContent = translate(tacCarryNote.dataset.i18n);
        tacCarryNote.style.display = '';
      }
    }
    if (entry.path) {
      tacPathState.points = entry.path.points;
      const c = entry.path.cache;
      if (c) {
        tacPathState.cache = c;
        tacPathState.resultMapId = S.currentMapId;
        renderTacPathOverlay(c.g, c.result, c.sA, c.sB);
        tacPathSummary.textContent = translate('ui.tac.path.result.summary', {
          dist: c.totalMeters.toFixed(1),
          seconds: c.totalSeconds.toFixed(1),
        });
        syncTacPathResultBox();
        tacPathResultBoxEl.style.display = '';
        // 起终点修正说明行随结果恢复
        const fixLines = [];
        for (const which of ['a', 'b']) {
          const fx = c.fixed?.[which];
          if (!fx) continue;
          fixLines.push(translate('ui.tac.path.result.note.fixed', {
            name: translate(which === 'a' ? 'ui.tac.path.map.point.A' : 'ui.tac.path.map.piont.B'),
            fx: Math.round(fx.from.x), fy: Math.round(fx.from.z),
            tx: Math.round(fx.to.x), ty: Math.round(fx.to.z),
          }));
        }
        tacPathFixNote.textContent = fixLines.join('\n');
        tacPathFixNote.style.display = fixLines.length ? '' : 'none';
        tacPathNote.dataset.i18n = 'ui.tac.path.result.note';
        tacPathNote.textContent = translate('ui.tac.path.result.note');
        tacPathNote.style.display = '';
      }
    }
  }
  tacDedLiveMapId = S.currentMapId;
  if (tacCarryCard) { syncTacCarryChairName(); syncTacCarryPickBtn(); }
  if (tacPathCard) syncTacPathPickUI();
}

// 当前地图上显示的可选椅子（与显示设置共享刷点组与开关；
// 地下室椅子仅在「地下室」显示开启时纳入，x/z 投影到地面层做二维近似）
function tacCarryGroundChairs() {
  const map = MAPS_DATA[S.currentMapId];
  const ch = rocketChairGroups(map);
  if (!ch) return [];
  const out = [];
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const ground = (pt) => (pt.length > 2 ? pt[1] > -5 : true);
  if (tacDisplay.chairAll) {
    map.rocketChairs.forEach((rc, i) => {
      if (ground(rc.location)) out.push({ kind: 'all', index: i, x: xz(rc.location)[0], z: xz(rc.location)[1] });
    });
  } else {
    ch.fixed.forEach((pt, i) => {
      if (ground(pt)) out.push({ kind: 'fixed', index: i, x: xz(pt)[0], z: xz(pt)[1] });
    });
    const setIdx = ch.sets.length ? S.tacChairIndex % ch.sets.length : -1;
    if (setIdx >= 0) {
      ch.sets[setIdx].forEach((pt, i) => {
        if (ground(pt)) out.push({ kind: 'set', index: i, x: xz(pt)[0], z: xz(pt)[1] });
      });
    }
  }
  if (tacDisplay.rocketChairsBasement) {
    const bs = tacBasementList();
    if (bs.length) {
      const bIdx = S.tacChairBasementIndex % bs.length;
      bs[bIdx].rocketChairs.forEach((pt, i) => {
        const [px, pz] = xz(pt);
        out.push({ kind: 'basement', index: i, x: px, z: pz });
      });
    }
  }
  return out;
}

function syncTacCarryChairRow() {
  if (!tacCarryCard) return;
  tacCarryShowChairsEl.checked = tacDisplay.rocketChairs;
  if (tacCarryChairAllEl) tacCarryChairAllEl.checked = !!tacDisplay.chairAll;
  tacCarryChairSizeEl.value = tacDisplay.rocketChairSize;
  tacCarryChairSizeDefEl.checked = tacDisplay.rocketChairSize === TAC_DISPLAY_DEFAULT.rocketChairSize;
  const ch = rocketChairGroups(MAPS_DATA[S.currentMapId]);
  tacCarryChairText.textContent = (!ch || !ch.sets.length) ? '--'
    : translate('ui.tac.display.rocketChair.layout', { index: S.tacChairIndex + 1, count: ch.sets.length });
  tacCarryChairBasementEl.checked = tacDisplay.rocketChairsBasement;
  tacCarryBoxBasementEl.checked = tacDisplay.boxesBasement;
  syncTacBasementText();
}

function syncTacCarryChairName() {
  const point = tacCarryState.mode === 'point';
  if (tacCarryState.armed) {
    tacCarryChairName.textContent = translate(point ? 'ui.tac.rocketChair.common.point.pick.status.picking' : 'ui.tac.rocketChair.common.rc.pick.status.picking');
  } else if (tacCarryState.chair) {
    tacCarryChairName.textContent = translate(point ? 'ui.tac.rocketChair.common.point.pick.status.selected' : 'ui.tac.rocketChair.common.rc.pick.status.selected', {
      x: Math.round(tacCarryState.chair.x), y: Math.round(tacCarryState.chair.z),
    });
  } else {
    tacCarryChairName.textContent = translate(point ? 'ui.tac.rocketChair.common.point.pick.status.no' : 'ui.tac.rocketChair.common.rc.pick.status.no');
  }
}

// 选择按钮文案：待命时「点我选择…」，点选状态下「点我取消选择」
function syncTacCarryPickBtn() {
  const key = tacCarryState.armed ? 'ui.tac.rocketChair.common.pick.cancel'
    : (tacCarryState.mode === 'point' ? 'ui.tac.rocketChair.common.point.pick.button' : 'ui.tac.rocketChair.common.rc.pick.button');
  tacCarryPickBtn.dataset.i18n = key;
  tacCarryPickBtn.textContent = translate(key);
}

// 选椅看范围 / 选点看挂椅 切换：清除计算结果并回到未选中状态，设置区保持不变
function tacCarrySetMode(mode) {
  if (tacCarryState.mode === mode) return;
  tacCarryState.mode = mode;
  tacCarryState.chair = null;
  tacCarryDisarm();
  tacCarryClearResult();
  tacDedStoreClearCarry();
  tacCarryModeChairEl.classList.toggle('active', mode === 'chair');
  tacCarryModePointEl.classList.toggle('active', mode === 'point');
  syncTacCarryPickBtn();
  tacCarryHideRingLabelEl.style.display = mode === 'point' ? 'none' : '';
  syncTacCarryChairName();
  renderTacChairs();
  syncTacDedRunBtn();
}

// 计算按钮文案四态：场景 × 模式
function syncTacDedRunBtn() {
  const tide = tacCarryState.scenario === 'tide';
  const point = tacCarryState.mode === 'point';
  const key = tide
    ? (point ? 'ui.tac.rocketChair.tideTurner.point.run' : 'ui.tac.rocketChair.tideTurner.rc.run')
    : (point ? 'ui.tac.rocketChair.balloon.point.run' : 'ui.tac.rocketChair.balloon.rc.run');
  tacCarryRunBtn.dataset.i18n = key;
  tacCarryRunBtn.textContent = translate(key);
}

// 牵气球-上椅 / 化险为夷-下椅 场景切换：保留选中的椅子/起点与模式，清除计算结果
function tacDedSetScenario(scenario) {
  if (tacCarryState.scenario === scenario) return;
  tacCarryState.scenario = scenario;
  tacCarryClearResult();
  tacDedStoreClearCarry();
  const tide = scenario === 'tide';
  tacDedScenarioCarryEl.classList.toggle('active', !tide);
  tacDedScenarioTideEl.classList.toggle('active', tide);
  tacDedSettingsCarryEl.style.display = tide ? 'none' : '';
  tacDedSettingsTideEl.style.display = tide ? '' : 'none';
  // 模式按钮的文案随场景变化（选椅看范围 / 选点看可挂椅 / 选点看可达椅）
  const mkChair = tide ? 'ui.tac.rocketChair.tideTurner.mode.rc' : 'ui.tac.rocketChair.balloon.mode.rc';
  tacCarryModeChairEl.dataset.i18n = mkChair;
  tacCarryModeChairEl.textContent = translate(mkChair);
  const mk = tide ? 'ui.tac.rocketChair.tideTurner.mode.point' : 'ui.tac.rocketChair.balloon.mode.point';
  tacCarryModePointEl.dataset.i18n = mk;
  tacCarryModePointEl.textContent = translate(mk);
  renderTacChairs();  // 起点文字随场景切换（牵气球起点 ↔ 起点）
  syncTacDedRunBtn();
}

function tacCarryDisarm() {
  if (!tacCarryState.armed) return;
  tacCarryState.armed = false;
  tacCarryPickBtn.classList.remove('active');
  tacSnapRipple?.classList.remove('show', 'chair');
  syncTacCarryPickBtn();
  syncTacCarryChairName();
}

function tacCarrySelect(kind, index) {
  const found = tacCarryGroundChairs().find((c) => c.kind === kind && c.index === index);
  if (!found) return;
  tacCarryState.chair = found;
  tacCarryDisarm();
  syncTacCarryChairName();
  renderTacChairs();
}

// 选点看挂椅：记录地图任意点为起点（底图像素坐标）
function tacCarrySelectPoint(x, z) {
  tacCarryState.chair = { kind: 'point', x, z };
  tacCarryDisarm();
  syncTacCarryChairName();
  renderTacChairs();
}

function tacCarryClearResult() {
  tacCarryState.cancel?.();
  tacCarryState.running = false;
  tacCarryState.resultMapId = null;
  tacCarryState.cache = null;
  tacCarryState.hiddenBands.clear();
  tacCarryState.detailMark = null;
  if (tacCarryCanvas) { tacCarryCanvas.remove(); tacCarryCanvas = null; }
  tacLayer().querySelectorAll('.tac-carry-times, .tac-carry-mark-ring').forEach((el) => el.remove());
  tacCarryResultBoxEl.style.display = 'none';
  tacCarryLegend.style.display = 'none';
  tacCarryLegend.innerHTML = '';
  tacCarryOpacityRowEl.style.display = 'none';
  tacCarrySummary.textContent = '';
  tacCarryChairCountEl.style.display = 'none';
  tacCarryDetailBoxEl.style.display = 'none';
  tacCarryDetailBodyEl.innerHTML = '';
  tacCarryNote.style.display = 'none';
  tacCarryProgressBox.style.display = 'none';
}

function readTacCarryParams() {
  // 数字框始终是当前基础移速的镜像（手改数字时下拉自动跳到「自定义」）
  const baseSpeed = parseFloat(tacCarryHunterSpeedEl.value) || CARRY_DEFAULTS.baseSpeed;
  const pickupSeconds = tacCarryPickupModeEl.value === 'custom'
    ? (parseFloat(tacCarryPickupEl.value) || CARRY_DEFAULTS.pickupSeconds)
    : CARRY_DEFAULTS.pickupSeconds;
  return {
    survivorId: tacCarrySurvivorEl.value,
    initialProgress: parseFloat(tacCarryInitialEl.value) || 0,
    baseSpeed,
    pickupSeconds,
    buffs: tacCarryState.buffs.map(({ key, level }) => ({ key, level })),
  };
}

async function tacCarryRun() {
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
  tacCarryRunBtn.textContent = translate('ui.tac.rocketChair.balloon.running');
  tacCarryProgressBox.style.display = '';
  tacCarryProgressBar.style.width = '0%';
  try {
    const g = await loadNavGrid(S.currentMapId);
    if (!g) { tacCarrySummary.textContent = translate('ui.tac.rocketChair.noGrid'); return; }
    const profile = createCarryProfile(readTacCarryParams());
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
    const run = computeCarryField(g, start, profile, {
      initialSeconds,
      onProgress: (p) => { tacCarryProgressBar.style.width = `${Math.round(p * 100)}%`; },
    });
    tacCarryState.cancel = run.cancel;
    const field = await run.promise;
    if (field.cancelled) return;
    tacCarryState.hiddenBands.clear();
    tacCarryState.cache = { scenario: 'carry', g, field, profile };
    renderTacCarryOverlay(g, field);
    tacCarryState.resultMapId = S.currentMapId;
    tacCarrySummary.textContent = translate('ui.tac.rocketChair.balloon.result.summary', {
      seconds: profile.remainingSeconds.toFixed(1),
      pickup: profile.pickupSeconds.toFixed(1),
      cells: field.reached,
    });
    renderTacCarryLegend(field.bands);
    syncTacCarryResultBox();
    tacCarryResultBoxEl.style.display = '';
    tacCarryNote.dataset.i18n = 'ui.tac.rocketChair.balloon.result.note';
    tacCarryNote.textContent = translate('ui.tac.rocketChair.balloon.result.note');
    tacCarryNote.style.display = '';
  } finally {
    tacCarryState.running = false;
    syncTacDedRunBtn();
    tacCarryProgressBar.style.width = '100%';
    setTimeout(() => { if (!tacCarryState.running) tacCarryProgressBox.style.display = 'none'; }, 400);
  }
}

function renderTacCarryOverlay(g, field) {
  // 被关掉的色带，其格子改用最邻近的外侧点亮色带颜色（3次<2次<1次<不可再放<风险区）
  const resolveBand = (band) => {
    let b = band;
    while (b < CARRY_BAND_COLORS.length && tacCarryState.hiddenBands.has(b)) b++;
    return b < CARRY_BAND_COLORS.length ? b : -1;
  };
  // 选点看挂椅不画颜色覆盖层，只标注各椅挂椅时间
  if (tacCarryState.mode === 'point') {
    tacCarryCanvas?.remove();
    tacCarryCanvas = null;
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
      const color = CARRY_BAND_COLORS[band];
      const r = parseInt(color.slice(1, 3), 16);
      const gg = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      px[i * 4] = r;
      px[i * 4 + 1] = gg;
      px[i * 4 + 2] = b;
      px[i * 4 + 3] = Math.round(CARRY_BAND_OPACITY[band] * factor * 255);
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
    tacCarryCanvas = canvas;
    tacLayer().appendChild(canvas);
  }
  renderTacCarryChairTimes(g, field, resolveBand);
}

// 选点看挂椅：在每把椅子上标注起点搬过去的秒数（与 3D「从起点挂椅」一致），
// 文字颜色取所在色带；未到达的椅子标「未确认」；起点处标「牵气球起点」。
function renderTacCarryChairTimes(g, field, resolveBand) {
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
    const band = carryBandAt(field.bands, t);
    // 挂不上的椅子不标注
    if (band < 0) continue;
    const shown = resolveBand(band);
    const risk = carryDropBudget(profile, t).risk;
    addLabel(c.x, c.z,
      translate(risk ? 'ui.tac.rocketChair.balloon.point.map.timeRisk' : 'ui.tac.rocketChair.balloon.point.map.timeSeconds',
        { seconds: t.toFixed(1) }),
      shown >= 0 ? CARRY_BAND_COLORS[shown] : '#a4afbb');
    rows.push({ x: c.x, z: c.z, t, band });
  }
  tacLayer().appendChild(layer);
  // 挂椅明细：按最短挂椅时间升序，缓存供明细表重开时复用
  rows.sort((a, b) => a.t - b.t);
  if (tacCarryState.cache) tacCarryState.cache.chairRows = rows;
  if (tacCarryState.mode === 'point') {
    tacCarryChairCountEl.textContent = translate('ui.tac.rocketChair.balloon.result.chairCount', { count: rows.length });
    tacCarryChairCountEl.style.display = '';
    renderTacCarryDetail(rows);
  } else {
    tacCarryChairCountEl.style.display = 'none';
    tacCarryDetailBoxEl.style.display = 'none';
  }
}

// 挂椅明细表（仅选点模式）：默认展开，按时间升序列出各可挂椅；
// 点击行在地图上用正圆红框框出对应椅子，再点取消，点别的行切换
let tacCarryDetailOpen = true;

function renderTacCarryDetail(rows) {
  tacCarryDetailToggleEl.textContent = translate('ui.tac.rocketChair.balloon.result.table.title', { value: tacCarryDetailOpen ? '▾' : '▸' });
  tacCarryDetailBoxEl.style.display = rows.length ? '' : 'none';
  tacCarryDetailBodyEl.style.display = tacCarryDetailOpen ? '' : 'none';
  if (!rows.length) return;
  if (tacCarryDetailOpen) {
    tacCarryDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
      + `<th>${translate('ui.tac.rocketChair.balloon.result.table.detailPos')}</th>`
      + `<th>${translate('ui.tac.rocketChair.balloon.result.table.detailTime')}</th>`
      + `<th>${translate('ui.tac.rocketChair.balloon.result.table.detailType')}</th></tr></thead><tbody>`
      + rows.map((r, i) =>
        `<tr data-row="${i}"${tacCarryState.detailMark === i ? ' class="marked"' : ''}>`
        + `<td>${Math.round(r.x)}, ${Math.round(r.z)}</td><td>${r.t.toFixed(1)}</td>`
        + `<td>${translate(`ui.tac.rocketChair.balloon.band${r.band}`)}</td></tr>`).join('')
      + '</tbody></table>';
  }
  renderTacCarryMark();
}

// 计算结果区 / 设置区：整体可收起（结果区默认展开，设置区默认收起）
let tacCarryResultOpen = true;

function syncTacCarryResultBox() {
  tacCarryResultToggleEl.textContent = translate('ui.tac.measure.result.title', { value: tacCarryResultOpen ? '▾' : '▸' });
  tacCarryResultBodyEl.style.display = tacCarryResultOpen ? '' : 'none';
}

let tacCarrySettingsOpen = false;

function syncTacCarrySettingsBox() {
  tacCarrySettingsToggleEl.textContent = translate('ui.tac.rocketChair.balloon.setting.title', { value: tacCarrySettingsOpen ? '▾' : '▸' });
  tacCarrySettingsBodyEl.style.display = tacCarrySettingsOpen ? '' : 'none';
}

// 明细行点击后的椅子标记红圈（正圆，与选中椅红框同款）
function renderTacCarryMark() {
  tacLayer().querySelectorAll('.tac-carry-mark-ring').forEach((el) => el.remove());
  const rows = tacCarryState.cache?.chairRows;
  const i = tacCarryState.detailMark;
  if (i == null || !rows?.[i] || tacCarryState.mode !== 'point') return;
  const [imgW, imgH] = MAPS_DATA[S.currentMapId].mapSize;
  const ring = document.createElement('div');
  ring.className = 'tac-carry-mark-ring';
  ring.style.left = `${(rows[i].x / imgW) * 100}%`;
  ring.style.top = `${(rows[i].z / imgH) * 100}%`;
  ring.style.width = `${tacDisplay.rocketChairSize * 1.5}%`;
  tacLayer().appendChild(ring);
}

function renderTacCarryLegend(bands) {
  tacCarryLegend.innerHTML = '';
  // 选点看挂椅：图例只是颜色含义说明，不是可点击按钮
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
    el.innerHTML = `<span class="tac-carry-swatch" style="background:${CARRY_BAND_COLORS[b.band]}"></span>`
      + `<span>${translate(`ui.tac.rocketChair.balloon.band${b.band}`)}</span>`;
    tacCarryLegend.appendChild(el);
  });
  tacCarryLegend.style.display = '';
  tacCarryOpacityRowEl.style.display = tacCarryState.mode === 'point' ? 'none' : '';
}

// 重绘缓存的计算结果（透明度/色带开关变化时免重算）
function renderTacDedOverlay(cache) {
  if (cache.scenario === 'tide') renderTacTideOverlay(cache.g, cache.field);
  else renderTacCarryOverlay(cache.g, cache.field);
}

function tacDedToggleBand(band) {
  if (tacCarryState.hiddenBands.has(band)) tacCarryState.hiddenBands.delete(band);
  else tacCarryState.hiddenBands.add(band);
  tacCarryLegend.querySelector(`[data-band="${band}"]`)?.classList
    .toggle('off', tacCarryState.hiddenBands.has(band));
  // 用缓存重绘，不重新计算
  const cache = tacCarryState.cache;
  if (cache && tacCarryState.resultMapId === S.currentMapId) renderTacDedOverlay(cache);
}

function tacCarryHunterBaseSpeed() {
  const info = tacSpeedForms(tacCarryHunterEl.value);
  if (!info) return CARRY_DEFAULTS.baseSpeed;
  const fi = info.dual ? Math.min(info.forms.length - 1, +tacCarryHunterFormEl.value || 0) : 0;
  return info.forms[fi].speed;
}

function buildTacCarryHunterOptions() {
  let opts = '';
  for (const [key, def] of Object.entries(TAC_ROLES)) {
    if (def.camp !== 'hunter') continue;
    const sp0 = (def.speed != null && typeof def.speed === 'object')
      ? Object.values(def.speed)[0] : def.speed;
    opts += sp0
      ? `<option value="${key}">${translate("application.velocity.base.choose", { name: def.name, sp0 })}</option>`
      : `<option value="${key}" disabled>${translate("application.velocity.base.choose.default", { name: def.name })}</option>`;
  }
  tacCarryHunterEl.innerHTML = opts + `<option value="custom">${translate("common.custom")}</option>`;
  tacCarryHunterEl.value = 'hellEmber';
}

function syncTacCarryHunterForm() {
  const key = tacCarryHunterEl.value;
  const info = tacSpeedForms(key);
  if (info && info.dual) {
    if (tacCarryHunterFormEl.dataset.sig !== key) {
      tacCarryHunterFormEl.innerHTML = info.forms.map((f, i) =>
        `<option value="${i}">${translate("application.velocity.base.choose.two", { name: f.name, speed: f.speed })}</option>`).join('');
      tacCarryHunterFormEl.dataset.sig = key;
    }
    tacCarryHunterFormEl.style.display = '';
  } else {
    tacCarryHunterFormEl.style.display = 'none';
    tacCarryHunterFormEl.dataset.sig = key;
  }
}

function syncTacCarryHunterUI() {
  // 数字框始终可改；下拉选中监管者时把基础移速写入数字框
  syncTacCarryHunterForm();
  if (tacCarryHunterEl.value !== 'custom') {
    tacCarryHunterFormEl.value = '0';
    tacCarryHunterSpeedEl.value = tacCarryHunterBaseSpeed();
  }
}

function syncTacCarryPickupUI() {
  if (tacCarryPickupModeEl.value === 'default') tacCarryPickupEl.value = CARRY_DEFAULTS.pickupSeconds;
}

// 天赋弹窗列表：group = survivor / hunterStruggle / hunterSpeed
// CARRY_TALENTS 内部键与语言包键名一致：survivor 组 → talent.survivor.<key>，其余 → talent.hunter.<key>
function carryTalentLocaleKey(key, def) {
  return `talent.${def.group === 'survivor' ? 'survivor' : 'hunter'}.${key}`;
}

// 天赋描述按 buff 类型组合：类型 + 数值 + 层数 + 时限 + 条件（替代原来的整句 desc 键）
// 个别天赋的类型/条件文案覆盖（展示用，不参与计算）
const CARRY_TALENT_META = {
  huntersInstinct: { type: 'talent.hunter.huntersInstinct.type.desc', condition: 'talent.hunter.huntersInstinct.condition.desc' },
  mock: { condition: 'talent.hunter.mock.condition.desc' },
};

function carryTalentDesc(key, def) {
  const pct = (arr) => arr.map((v) => `${Math.round(v * 1000) / 10}%`).join('/');
  const layer = def.levels.length > 1
    ? translate('application.buff.common.desc.level', { count: def.levels.length }) : '';
  const dur = def.kind === 'speed'
    ? (def.duration ? ` ${def.duration}s` : translate('application.buff.common.desc.duration')) : '';
  const meta = CARRY_TALENT_META[key] || {};
  const speedType = translate(meta.type || 'talent.common.type.velocity.desc2');
  const parts = [];
  if (def.kind === 'struggle') parts.push(`${translate('talent.common.type.balloon.desc1')} ${pct(def.levels)}`);
  if (def.dropProgress) parts.push(`${translate('talent.common.type.balloon.desc3')} ${def.dropProgress.map((v) => `${v}%`).join('/')}`);
  if (def.kind === 'pickup') parts.push(`${translate('talent.common.type.balloon.desc2')} ${pct(def.levels)}`);
  if (def.kind === 'speed') parts.push(`${speedType} ${pct(def.levels)}${dur}`);
  const cond = meta.condition ? ` ${translate(meta.condition)}` : '';
  return `${parts.join(' ')}${layer}${cond}`;
}

function buildTacCarryModalList(listEl, group) {
  listEl.innerHTML = Object.entries(CARRY_TALENTS)
    .filter(([, d]) => d.group === group)
    .map(([key, d]) => {
      const name = translate(carryTalentLocaleKey(key, d));
      const lv = d.levels.length > 1
        ? `<select data-clv="${key}">`
          + d.levels.map((_, i) =>
            `<option value="${i + 1}"${i === d.levels.length - 1 ? ' selected' : ''}>${translate("application.buff.common.level", { value: i + 1 })}</option>`).join('')
          + '</select>'
        : '';
      return `<div class="tac-talent-row"><span class="tac-talent-name">${name}`
        + `<small>${carryTalentDesc(key, d)}</small></span>${lv}`
        + `<button type="button" class="tac-talent-add" data-ck="${key}">${translate('common.add')}</button></div>`;
    }).join('');
}

function bindTacCarryModal(btn, modal, listEl, close, group) {
  btn.addEventListener('click', () => {
    buildTacCarryModalList(listEl, group);
    modal.style.display = 'flex';
  });
  close.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
  listEl.addEventListener('click', (e) => {
    const add = e.target.closest('.tac-talent-add');
    if (!add) return;
    const key = add.dataset.ck;
    const def = CARRY_TALENTS[key];
    if (!def) return;
    const lvSel = listEl.querySelector(`select[data-clv="${key}"]`);
    const level = lvSel ? +lvSel.value : 1;
    tacCarryState.buffs.push({ id: ++tacCarryBuffId, key, level });
    modal.style.display = 'none';
    renderTacCarryBuffs();
  });
}

// 加成明细表：巨钳一行拆成「挣扎 + 放下进度」两行显示，共享同一个条目
// 结构对齐测算卡片：tac-detail-toggle 开关 + tac-detail-body + tac-detail-tbl
let tacCarryBuffOpen = true;

function renderTacCarryBuffs() {
  tacCarryBuffToggleEl.textContent = translate('application.velocity.buff.detail', { value: tacCarryBuffOpen ? '▾' : '▸' });
  tacCarryBuffBody.style.display = tacCarryBuffOpen ? '' : 'none';
  if (!tacCarryBuffOpen) return;
  const pct = (v) => `${Math.round(v * 1000) / 10}%`;
  const rows = [];
  for (const b of tacCarryState.buffs) {
    const def = CARRY_TALENTS[b.key];
    const base = translate(carryTalentLocaleKey(b.key, def));
    const name = def.levels.length > 1 ? `${base} ${b.level}层` : base;
    const dur = def.duration ? ` · ${def.duration}s` : '';
    // 按 buff 类型拆行：挣扎类 / 放下加进度类 / 牵起类 / 速度类，一个天赋可占多行
    if (def.kind === 'struggle') {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]) + dur, type: translate('talent.common.type.balloon.desc1') });
    }
    if (def.dropProgress) {
      rows.push({ id: b.id, name, value: pct(def.dropProgress[b.level - 1] / 100), type: translate('talent.common.type.balloon.desc3') });
    }
    if (def.kind === 'pickup') {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]), type: translate('talent.common.type.balloon.desc2') });
    }
    if (def.kind === 'speed') {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]) + dur, type: translate('talent.common.type.velocity.desc2') });
    }
  }
  if (!rows.length) {
    tacCarryBuffBody.innerHTML = `<div class="tac-detail-empty">${translate('application.velocity.buff.detail.hint.none')}</div>`;
    return;
  }
  tacCarryBuffBody.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th class="tac-cb-name">${translate('ui.tac.rocketChair.balloon.setting.balloon.buff.detail.table.buffColName')}</th>`
    + `<th class="tac-cb-value">${translate('ui.tac.rocketChair.balloon.setting.balloon.buff.detail.table.buffColValue')}</th>`
    + `<th>${translate('ui.tac.rocketChair.balloon.setting.balloon.buff.detail.table.buffColType')}</th>`
    + `<th class="tac-col-del"></th></tr></thead><tbody>`
    + rows.map((r) =>
      `<tr><td>${r.name}</td><td>${r.value}</td><td>${r.type}</td>`
      + `<td class="tac-col-del"><button type="button" class="tac-buff-del tac-carry-buff-del" data-cbid="${r.id}">×</button></td></tr>`).join('')
    + '</tbody></table>';
}

function buildTacCarryCard() {
  if (!tacCarryCard) return;
  // 前锋选项的挣扎加成值跟随角色数据（survivor.js traits.struggle），不写死在文案里
  document.getElementById('tacCarrySurvivorForward').textContent =
    translate("ui.tac.rocketChair.balloon.setting.balloon.survivor.base.choose",
      { name: TAC_ROLES.forward.name, value: Math.round(CARRY_SURVIVORS.forward.struggleBonus * 100) });
  // 与显示设置共享的椅子行
  tacCarryChairSizeDefEl._default = TAC_DISPLAY_DEFAULT.rocketChairSize;
  bindTacDisplayRow(tacCarryShowChairsEl, tacCarryChairSizeEl, tacCarryChairSizeDefEl,
    (v) => { tacDisplay.rocketChairs = v; renderTacChairs(); syncTacDisplayUI(); },
    (v) => { tacDisplay.rocketChairSize = v; renderTacChairs(); syncTacDisplayUI(); });
  tacCarryChairPrevBtn.addEventListener('click', () => { switchTacChair(-1); syncTacCarryChairRow(); });
  tacCarryChairNextBtn.addEventListener('click', () => { switchTacChair(1); syncTacCarryChairRow(); });

  // 监管者基础移速（与速度设置的监管者选择一致）：数字框可直改，直改后下拉跳到自定义
  buildTacCarryHunterOptions();
  tacCarryHunterEl.addEventListener('change', syncTacCarryHunterUI);
  tacCarryHunterFormEl.addEventListener('change', () => {
    tacCarryHunterSpeedEl.value = tacCarryHunterBaseSpeed();
  });
  tacCarryHunterSpeedEl.addEventListener('input', () => {
    const v = parseFloat(tacCarryHunterSpeedEl.value);
    if (!(v > 0) || tacCarryHunterEl.value === 'custom') return;
    const sp = tacCarryHunterBaseSpeed();
    if (Math.abs(sp - v) > 1e-9) {
      tacCarryHunterEl.value = 'custom';
      syncTacCarryHunterForm();
    }
  });
  syncTacCarryHunterUI();
  tacCarryPickupModeEl.addEventListener('change', syncTacCarryPickupUI);
  tacCarryPickupEl.addEventListener('input', () => { tacCarryPickupModeEl.value = 'custom'; });
  syncTacCarryPickupUI();

  // 三个天赋弹窗
  bindTacCarryModal(tacCarrySurvTalentBtn, tacCarrySurvModal, tacCarrySurvList, tacCarrySurvClose, 'survivor');
  bindTacCarryModal(tacCarryHuntTalentBtn, tacCarryHuntModal, tacCarryHuntList, tacCarryHuntClose, 'hunterStruggle');
  bindTacCarryModal(tacCarrySpeedTalentBtn, tacCarrySpeedModal, tacCarrySpeedList, tacCarrySpeedClose, 'hunterSpeed');
  tacCarryBuffToggleEl.addEventListener('click', () => {
    tacCarryBuffOpen = !tacCarryBuffOpen;
    renderTacCarryBuffs();
  });
  tacCarryDetailToggleEl.addEventListener('click', () => {
    tacCarryDetailOpen = !tacCarryDetailOpen;
    const rows = tacCarryState.cache?.chairRows ?? [];
    if (tacCarryState.cache?.scenario === 'tide') renderTacTideDetail(rows);
    else renderTacCarryDetail(rows);
  });
  tacCarryResultToggleEl.addEventListener('click', () => {
    tacCarryResultOpen = !tacCarryResultOpen;
    syncTacCarryResultBox();
  });
  tacCarrySettingsToggleEl.addEventListener('click', () => {
    tacCarrySettingsOpen = !tacCarrySettingsOpen;
    syncTacCarrySettingsBox();
  });
  syncTacCarrySettingsBox();
  // 明细行点击：框出对应椅子；再点同一行取消，点别的行切换
  tacCarryDetailBodyEl.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-row]');
    if (!tr) return;
    const i = +tr.dataset.row;
    tacCarryState.detailMark = tacCarryState.detailMark === i ? null : i;
    tacCarryDetailBodyEl.querySelectorAll('tr[data-row]').forEach((el) => {
      el.classList.toggle('marked', +el.dataset.row === tacCarryState.detailMark);
    });
    renderTacCarryMark();
  });
  tacCarryBuffBody.addEventListener('click', (e) => {
    const del = e.target.closest('.tac-carry-buff-del');
    if (!del) return;
    const id = +del.dataset.cbid;
    tacCarryState.buffs = tacCarryState.buffs.filter((b) => b.id !== id);
    renderTacCarryBuffs();
  });
  renderTacCarryBuffs();

  tacCarryOpacityEl.addEventListener('input', () => {
    const cache = tacCarryState.cache;
    if (cache && tacCarryState.resultMapId === S.currentMapId) renderTacDedOverlay(cache);
  });

  // 地下室椅子/箱子开关与组切换（与显示设置的地下室行共享状态）
  tacCarryChairBasementEl.addEventListener('change', () => {
    tacDisplay.rocketChairsBasement = tacCarryChairBasementEl.checked;
    tacShowChairBasementEl.checked = tacDisplay.rocketChairsBasement;
    renderTacChairs();
    tacSave();
  });
  tacCarryBoxBasementEl.addEventListener('change', () => {
    tacDisplay.boxesBasement = tacCarryBoxBasementEl.checked;
    tacShowBoxBasementEl.checked = tacDisplay.boxesBasement;
    renderTacBoxes();
    tacSave();
  });
  tacCarryBasementPrevBtn.addEventListener('click', () => switchTacBasement(-1));
  tacCarryBasementNextBtn.addEventListener('click', () => switchTacBasement(1));

  tacCarryHideRingEl.addEventListener('change', () => {
    tacDisplay.carryHideRing = tacCarryHideRingEl.checked;
    renderTacChairs();
    tacSave();
  });

  tacCarryPickBtn.addEventListener('click', () => {
    tacCarryState.armed = !tacCarryState.armed;
    if (tacCarryState.armed) tacPathDisarm();  // 与两点最优路径规划的点选互斥
    tacCarryPickBtn.classList.toggle('active', tacCarryState.armed);
    syncTacCarryPickBtn();
    syncTacCarryChairName();
  });
  tacCarryModeChairEl.addEventListener('click', () => tacCarrySetMode('chair'));
  tacCarryModePointEl.addEventListener('click', () => tacCarrySetMode('point'));
  // 场景切换：牵气球-上椅 / 化险为夷-下椅
  tacDedScenarioCarryEl.addEventListener('click', () => tacDedSetScenario('carry'));
  tacDedScenarioTideEl.addEventListener('click', () => tacDedSetScenario('tide'));
  tacCarryRunBtn.addEventListener('click', () => {
    if (tacCarryState.scenario === 'tide') tacTideRun();
    else tacCarryRun();
  });
  tacCarryClearBtn.addEventListener('click', () => {
    tacCarryState.chair = null;
    tacCarryClearResult();
    syncTacCarryChairName();
    renderTacChairs();
  });
  tacCarryInitialEl.addEventListener('input', () => {
    tacCarryInitialVal.textContent = `${tacCarryInitialEl.value}%`;
  });
  syncTacCarryChairRow();
  syncTacCarryChairName();
  syncTacDedRunBtn();
  buildTacTideSettings();
}

export function setTacCarryCanvas(value) {
  tacCarryCanvas = value;
  return value;
}

export {
  buildTacCarryCard,
  renderTacCarryMark,
  syncTacCarryChairName,
  syncTacCarryChairRow,
  syncTacCarryResultBox,
  syncTacDedRunBtn,
  tacCarryCanvas,
  tacCarryClearResult,
  tacCarryDetailOpen,
  tacCarryDisarm,
  tacCarryGroundChairs,
  tacCarrySelect,
  tacCarrySelectPoint,
  tacCarryState,
  tacDedOnMapSwitch,
  tacDedToggleBand,
};
