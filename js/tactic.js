
import { showToast, tacArrowSvg, tacBaseDetailBody, tacBaseDetailToggle, tacBaseMerge, tacBaseMergeBox, tacBaseSpeedEl, tacBuffAddBtn, tacBuffClose, tacBuffDetailBody, tacBuffDetailToggle, tacBuffDur, tacBuffFilterBox, tacBuffModal, tacBuffName, tacBuffOk, tacBuffPct, tacCampToggle, tacCipherSizeDefEl, tacCipherSizeEl, tacCipherCard, tacCipherCardShowEl, tacCipherCardPrevBtn, tacCipherCardNextBtn, tacCipherCardText, tacCipherCardSizeEl, tacCipherCardSizeDefEl, tacCipherList, tacClearBtn, tacColorsEl, tacCoordsTip, tacDelSegOnlyEl, tacDeselectBtn, tacDispCipherText, tacDisplayCard, tacDoorLockEl, tacDoorSizeDefEl, tacDoorSizeEl, tacDrawCard, tacDungeonSizeDefEl, tacDungeonSizeEl, tacDungeonText, tacExportBtn, tacHideEndpointsEl, tacItemSection, tacMStyleBody, tacMStyleToggle, tacManageCard, tacManageList, tacMapImage, tacMapTitle, tacMapTitleEn, tacMapWrap, tacRot, tacMeasureCard, tacMeasureColorsEl, tacMeasureModesEl, tacMeasureWidthEl, tacMeasureWidthVal, tacOtherAddBtn, tacOtherClose, tacOtherList, tacOtherModal, tacResult, tacResultBody, tacResultToggle, tacRolesCard, tacRolesEl, tacRolesHunterEl, tacRolesOtherEl, tacSaveClose, tacSaveImg, tacSaveOverlay, tacScopeToggle, tacScopeWrap, tacSelGlowEl, tacShapesEl, tacShowCiphersEl, tacShowChairsEl, tacChairSizeEl, tacChairSizeDefEl, tacChairText, tacCarryBuffBody, tacCarryCard, tacCarryChairName, tacCarryChairNextBtn, tacCarryChairPrevBtn, tacCarryChairSizeDefEl, tacCarryChairSizeEl, tacCarryChairText, tacCarryClearBtn, tacCarryBuffToggleEl, tacCarryHuntClose, tacCarryHuntList, tacCarryHuntModal, tacCarryHuntTalentBtn, tacCarryHunterEl, tacCarryHunterFormEl, tacCarryHunterSpeedEl, tacCarryInitialEl, tacCarryInitialVal, tacCarryLegend, tacCarryNote, tacCarryOpacityEl, tacCarryOpacityRowEl, tacCarryHideRingEl, tacCarryChairBasementEl, tacCarryBoxBasementEl, tacCarryBasementPrevBtn, tacCarryBasementNextBtn, tacCarryBasementTextEl, tacCarryPickBtn, tacCarryPickupEl, tacCarryResultBoxEl, tacCarryResultToggleEl, tacCarryResultBodyEl, tacCarrySettingsToggleEl, tacCarrySettingsBodyEl, tacCarryModeChairEl, tacCarryModePointEl, tacCarryHideRingLabelEl, tacCarryChairCountEl, tacCarryDetailBoxEl, tacCarryDetailToggleEl, tacCarryDetailBodyEl, tacCarryPickupModeEl, tacCarryProgressBar, tacCarryProgressBox, tacCarryRunBtn, tacCarryShowChairsEl, tacCarrySpeedClose, tacCarrySpeedList, tacCarrySpeedModal, tacCarrySpeedTalentBtn, tacCarrySummary, tacCarrySurvClose, tacCarrySurvList, tacCarrySurvModal, tacCarrySurvTalentBtn, tacCarrySurvivorEl, tacShowChairBasementEl, tacBasementText, tacShowSpawnsEl, tacSpawnSizeEl, tacSpawnSizeDefEl, tacSpawnText, tacSnapBoxEl, tacShowBoxesEl, tacBoxSizeEl, tacBoxSizeDefEl, tacShowBoxBasementEl, tacShowCoordsEl, tacShowDoorsEl, tacShowDungeonEl, tacShowZonesEl, tacSnapCipherEl, tacSnapDoorEl, tacSnapChairEl, tacSnapDungeonEl, tacSnapPointEl, tacSnapRipple, tacSpeedForm, tacSpeedRole, tacSpeedSettingsToggleEl, tacSpeedSettingsBodyEl, tacStatus2El, tacStatusEl, tacTalentAddBtn, tacTalentClose, tacTalentList, tacTalentModal, tacTextAddBtn, tacTextCard, tacTextColorsEl, tacTextHint, tacTextInput, tacTextList, tacTextSizeEl, tacTextSizeVal, tacTextStyle, tacTraitAddBtn, tacTraitClose, tacTraitList, tacTraitModal, tacUndoBtn, tacWidthEl, tacWidthVal, tacDedScenarioCarryEl, tacDedScenarioTideEl, tacDedSettingsCarryEl, tacDedSettingsTideEl, tacTideBaseSpeedEl, tacTideSpeedRoleEl, tacTideSpeedFormEl, tacTideTraitAddBtn, tacTideTalentAddBtn, tacTideOtherAddBtn, tacTideBuffAddBtn, tacTideBaseDetailToggleEl, tacTideBaseDetailBodyEl, tacTideBuffToggleEl, tacTideBuffBodyEl, tacTideTraitModal, tacTideTraitList, tacTideTraitClose, tacTideTalentModal, tacTideTalentList, tacTideTalentClose, tacTideOtherModal, tacTideOtherList, tacTideOtherClose, tacTideBuffModal, tacTideBuffName, tacTideBuffPct, tacTideBuffDur, tacTideBuffOk, tacTideBuffClose, tacPathCard, tacPathPickA, tacPathPickB, tacPathStatusA, tacPathStatusB, tacPathRunBtn, tacPathClearBtn, tacPathProgressBox, tacPathProgressBar, tacPathResultBoxEl, tacPathResultToggleEl, tacPathResultBodyEl, tacPathSummary, tacPathNote, tacPathFixNote, tacPathSettingsToggleEl, tacPathSettingsBodyEl, tacPathVaultEl, tacPathFixEl, tacPathCampToggle, tacPathBaseSpeedEl, tacPathSpeedRoleEl, tacPathSpeedFormEl, tacPathTraitAddBtn, tacPathTalentAddBtn, tacPathOtherAddBtn, tacPathBuffAddBtn, tacPathBaseDetailToggleEl, tacPathBaseDetailBodyEl, tacPathBuffToggleEl, tacPathBuffBodyEl, tacPathTraitModal, tacPathTraitList, tacPathTraitClose, tacPathTalentModal, tacPathTalentList, tacPathTalentClose, tacPathOtherModal, tacPathOtherList, tacPathOtherClose, tacPathBuffModal, tacPathBuffName, tacPathBuffPct, tacPathBuffDur, tacPathBuffOk, tacPathBuffClose, tacticView } from './core/dom.js';
import { restoredMeasureIds, saveRegionSel, savedRot, tacBoard, tacDisplay, tacMeasureStyle, tacPersisted, tacSave, flushSave } from './core/persist.js';
import { measureBaseAt, simulateMovement } from './core/measurements.js';
import { measurementEndpoints, resolveMap3dTarget, isExternalMap3dEntry } from './core/map-handoff.js';
import { CARRY_BAND_COLORS, CARRY_BAND_OPACITY, CARRY_DEFAULTS, CARRY_TALENTS, carryBandAt, carryDropBudget, createCarryProfile } from './core/carry-model.js';
import { computeCarryField, computePath, computeTideField, loadNavGrid, navGridAvailable, snapToWalkable, smoothPathOnGrid } from './core/nav-grid.js';
import { TIDE_BAND_COLORS, TIDE_BAND_OPACITY, TIDE_SECONDS, createTideProfile, tideBandAt } from './core/tide-model.js';
import { getTreasureRings } from './core/treasure.js';
import { S } from './core/state.js';
import { $, loadImageWithStatus, mountImageOverlays } from './core/utils.js';
import { cipherOf, mapsZonesRelative } from './data/geo.js';
import { MAPS_DATA, getImageUrl } from './data/maps.js';
import { BOX_ICON_URL, CHAIR_ICON_URL, DUNGEON_ICON_URL, ESCAPE_DOOR_ICON_URL, SPAWN_HUNTER_ICON_URL, SPAWN_SURVIVOR_ICON_URL, TAC_ABYSS_MAX_M, TAC_DISPLAY_DEFAULT, TAC_FIXED_SPAWN_ICONS, TAC_MANAGE_DEFAULT, TAC_MEASURE_DEFAULT, TAC_MOVEMENT_SURVIVOR, TAC_MOVEMENT_BUFFS, TAC_SVG_NS, TAC_TREASURE_RULE, TAC_ZOOM_LOCK_ICONS, TAC_ZOOM_MAX, TAC_ZOOM_MIN } from './data/tactic-data.js';
import { TAC_ITEM_TYPES } from './data/items.js';
import { TAC_ROLES } from './data/roles.js';
import { CIPHER_ICON_URL, cipherIcon } from './region.js';

import { translate } from './core/i18n.js';

export const { loading: tacLoading, error: tacImageError } =
  mountImageOverlays(tacMapWrap);




export function tacItemMetersToPercent(meters) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  return widthM ? (meters * 2 / widthM) * 100 : null;
}


function tacCrossSvg(opt, meters, angle) {
  const w = Math.max(0.5, (opt.crossWidth / (meters * 2)) * 100);
  const y = (100 - w) / 2;
  return '<svg class="tac-item-cross-svg" viewBox="0 0 100 100" aria-hidden="true">'
    + `<g transform="rotate(${((angle || 0) % 360 + 360) % 360} 50 50)">`
    + `<rect x="0" y="${y.toFixed(3)}" width="100" height="${w.toFixed(3)}"/>`
    + `<rect x="${y.toFixed(3)}" y="0" width="${w.toFixed(3)}" height="100"/>`
    + '</g></svg>';
}


function tacRingSvg(opt) {
  const ratio = Math.min(0.95, Math.max(0, opt.ringInner / opt.size_m));
  const rIn = 45 * ratio;
  const yIn = 50 - rIn;
  return '<svg class="tac-role-ring-svg" viewBox="0 0 100 100" aria-hidden="true">'
    + '<path fill-rule="evenodd" d="'
    + 'M50 5 A45 45 0 1 1 49.99 5 Z '
    + `M50 ${yIn.toFixed(3)} A${rIn.toFixed(3)} ${rIn.toFixed(3)} 0 1 1 49.99 ${yIn.toFixed(3)} Z"/>`
    + '</svg>';
}


export function tacRangeDefaultKey(cfg, hideByDefault) {
  // 新格式 ranges 无 key 语义：返回 null 表示「无默认显示」
  return null;
}


export function tacRangeModeOf(cfg, inst, hideByDefault) {
  if (!cfg) return null;
  const e = tacRangeEntries(cfg, inst, hideByDefault);
  return e.length ? e[0].opt : null;
}


const TAC_RANGE_DEFAULT_FILL = 'rgba(226, 232, 240, 0.1)';
const TAC_TALENTS_BY_CAMP = {
  survivor: ['fearRadius', 'webersLaw', 'sneak'],
  hunter: ['tinnitus', 'fearRadius', 'addiction', 'nostalgic', 'skittish',
    'deerHunt', 'streetSweeper', 'wither', 'obsession', 'famine'],
};


function tacRangeFmt(m) {
  return String(Math.round(m * 100) / 100);
}


function tacOptionMeters(opt, rb, cfg) {
  const s = opt && opt.size_m;
  if (s == null) return null;
  let base;
  if (typeof s === 'number') {
    base = s;
  } else if (Array.isArray(s)) {
    // 档位模式：[9,12,15]，rb.gear 为当前挡位索引
    const gi = rb && Number.isInteger(rb.gear) ? rb.gear : 0;
    base = s[Math.min(Math.max(gi, 0), s.length - 1)];
  } else if (typeof s === 'object') {
    // 滑杆模式：{min,max}，max 为 null 时取地图宽
    const dynMax = s.max != null ? s.max
      : (MAPS_DATA[S.currentMapId] && MAPS_DATA[S.currentMapId].widthM) || 100;
    base = rb && rb.m != null ? rb.m : dynMax;
  } else {
    return null;
  }
  if (!(base > 0)) return null; // 半径 0 等价于隐藏范围
  if (cfg && cfg.fearMods) {
    const pick = (opts, v) => (opts.find((o) => o[0] === v) || opts[0])[2];
    base *= pick(cfg.fearMods.hunter, rb && rb.fearH)
      * pick(cfg.fearMods.survivor, rb && rb.fearS);
  }
  return base;
}


function tacRangeEntries(cfg, inst, hideByDefault) {
  if (!cfg || !Array.isArray(cfg.options)) return [];
  const rb = tacRbEnsure(cfg, inst, hideByDefault, false);
  const out = [];
  const subs = Array.isArray(rb.subs) ? rb.subs : [];
  for (const i of subs) {
    if (i < 0 || i >= cfg.options.length) continue;
    const opt = cfg.options[i];
    const meters = tacOptionMeters(opt, rb, cfg);
    if (meters == null) continue;
    out.push({ opt, i, meters });
  }
  return out;
}


function tacRbEnsure(cfg, inst, hideByDefault, defFill) {
  if (inst.rangeBox && !inst.rangeBox.modes) {
    // 新结构 rangeBox：{ tab, subs, talents, fill, m, fearH, fearS }
    const rb = inst.rangeBox;
    if (!Array.isArray(rb.subs)) rb.subs = [];
    if (!rb.talents) rb.talents = {};
    if (rb.tab === undefined) rb.tab = null;
    if (rb.fill === undefined) rb.fill = !!defFill;
    return rb;
  }
  // 迁移旧 rangeBox（modes 结构）或 legacy 字段（rangeMode/hideRange/rangeMeters）
  const n = (cfg.options || []).length;
  let tab = null;
  let subs = [];
  let m;
  let fearH;
  let fearS;
  const talents = {};
  const old = inst.rangeBox;
  if (old && old.modes) {
    for (const k of Object.keys(old.modes)) {
      const st = old.modes[k];
      if (!st) continue;
      if (st.m != null) m = st.m;
      if (st.fearH) fearH = st.fearH;
      if (st.fearS) fearS = st.fearS;
    }
    const hadSubs = Object.keys(old.modes).length > 0;
    const hadTalents = !!(old.talents && Object.keys(old.talents).length);
    tab = old.activeGroup === '__talents' || (hadTalents && !hadSubs) ? 'talents'
      : (hadSubs || old.activeGroup ? 'range' : null);
    for (const tk of Object.keys(old.talents || {})) talents[tk] = old.talents[tk];
    if (old.fill !== undefined) defFill = old.fill;
    if (tab === 'range') subs = n ? [0] : [];
  } else {
    const legacyKey = inst.rangeMode || (inst.hideRange ? 'off' : null);
    if (n && (legacyKey ? legacyKey !== 'off' : !hideByDefault)) {
      // 道具新创建默认显示第一个范围；角色默认隐藏
      tab = 'range';
      subs = [0];
    }
    if (inst.rangeMeters != null) m = inst.rangeMeters;
  }
  const rb = inst.rangeBox = { tab, subs, talents };
  if (defFill) rb.fill = true;
  if (m != null) rb.m = m;
  if (fearH) rb.fearH = fearH;
  if (fearS) rb.fearS = fearS;
  return rb;
}


function tacHostCamp(role) {
  return (TAC_ROLES[role] || {}).camp === 'hunter' ? 'hunter' : 'survivor';
}


function tacTalentButtons(hostRole, camp) {
  const list = TAC_TALENTS_BY_CAMP[camp] || TAC_TALENTS_BY_CAMP.survivor;
  const out = [];
  for (const kind of list) {
    const def = TAC_ITEM_TYPES[kind];
    if (!def || !def.ranges || !Array.isArray(def.ranges.options)) continue;
    const opt = def.ranges.options[0];
    if (!opt || opt.size_m == null) continue;
    if (kind === 'fearRadius') {
      if (camp === 'hunter' && hostRole === 'geisha') {
        out.push({
          tk: 'fearRadius', kind, label: def.name, base: opt.size_m,
          variants: [
            { key: 'beauty', label: translate("ui.tacRangeBox.beautyForm"), mult: 0.8 },
            { key: 'prajna', label: translate("ui.tacRangeBox.prajnaForm"), mult: 1.1 },
          ],
        });
        continue;
      }
      let mult = 1;
      if (camp !== 'hunter') {
        if (hostRole === 'prisoner') mult = 0.8;
        else if (hostRole === 'archer') mult = 0.76;
      }
      out.push({ tk: 'fearRadius', kind, label: def.name, base: opt.size_m, mult });
      continue;
    }
    out.push({ tk: kind, kind, label: def.name, opt });
  }
  return out;
}


function tacTalentRanges(inst, hostRole) {
  const rb = inst && inst.rangeBox;
  if (!rb || !rb.talents) return [];
  const camp = tacHostCamp(hostRole);
  const out = [];
  for (const b of tacTalentButtons(hostRole, camp)) {
    const sel = rb.talents[b.tk];
    if (!sel) continue;
    let meters;
    let sub = null;
    if (b.variants) {
      const v = b.variants.find((x) => x.key === sel.variant) || b.variants[0];
      sub = v.label;
      meters = b.base * v.mult;
    } else if (b.base != null) {
      meters = b.base * b.mult;
    } else {
      meters = tacOptionMeters(b.opt, sel, null);
    }
    if (meters == null) continue;
    out.push({ ...b, meters, sel, sub });
  }
  return out;
}



export function tacRangeMetersOf(cfg, inst, hideByDefault) {
  const e = tacRangeEntries(cfg, inst, hideByDefault);
  return e.length ? e[0].meters : null;
}


export function tacItemMeters(it) {
  return tacRangeMetersOf((TAC_ITEM_TYPES[it.kind] || {}).ranges, it, false);
}



export function tacItemSizePercent(it) {
  const meters = tacItemMeters(it);
  return meters === null ? null : tacItemMetersToPercent(meters);
}


export function tacStateOf(base) {
  if (!base) return 'run';
  if (base.fixed) return 'fixed';
  if (base.stKey) return base.stKey;
  return base.camp === 'hunter' ? 'hunter' : 'run';
}

export function tacStateMatches(buffStates, state) {
  
  if (!buffStates) return state === 'run' || state === 'walk' || state === 'crouch'
    || state === 'role' || state === 'hunter' || state === 'custom';
  return buffStates.includes(state);
}


export function tacLevelLabel(key, i) {
  return key === 'stratus' ? [translate("application.entriesZero"), translate("application.entriesOne")][i] : translate("application.tacLevelLabel", { value: i + 1 });
}



export function tacRoleRangeMode(role, token) {
  return tacRangeModeOf((TAC_ROLES[role] || {}).ranges, token, true);
}


export function tacRoleRangeMeters(role, token) {
  return tacRangeMetersOf((TAC_ROLES[role] || {}).ranges, token, true);
}


export function syncTacDisplayUI() {
  tacShowZonesEl.checked = tacDisplay.zones;
  tacShowCiphersEl.checked = tacDisplay.ciphers;
  tacCipherSizeEl.value = tacDisplay.cipherSize;
  tacCipherSizeDefEl.checked = tacDisplay.cipherSize === TAC_DISPLAY_DEFAULT.cipherSize;
  tacShowDungeonEl.checked = tacDisplay.dungeon;
  tacDungeonSizeEl.value = tacDisplay.dungeonSize;
  tacDungeonSizeDefEl.checked = tacDisplay.dungeonSize === TAC_DISPLAY_DEFAULT.dungeonSize;
  tacShowSpawnsEl.checked = tacDisplay.spawns;
  tacSpawnSizeEl.value = tacDisplay.spawnSize;
  tacSpawnSizeDefEl.checked = tacDisplay.spawnSize === TAC_DISPLAY_DEFAULT.spawnSize;
  tacShowChairsEl.checked = tacDisplay.chairs;
  tacChairSizeEl.value = tacDisplay.chairSize;
  tacChairSizeDefEl.checked = tacDisplay.chairSize === TAC_DISPLAY_DEFAULT.chairSize;
  tacShowChairBasementEl.checked = tacDisplay.chairsBasement;
  tacShowBoxesEl.checked = tacDisplay.boxes;
  tacBoxSizeEl.value = tacDisplay.boxSize;
  tacBoxSizeDefEl.checked = tacDisplay.boxSize === TAC_DISPLAY_DEFAULT.boxSize;
  tacShowBoxBasementEl.checked = tacDisplay.boxesBasement;
  tacShowDoorsEl.checked = tacDisplay.doors;
  tacDoorSizeEl.value = tacDisplay.doorSize;
  tacDoorSizeDefEl.checked = tacDisplay.doorSize === TAC_DISPLAY_DEFAULT.doorSize;
  tacDoorLockEl.checked = tacDisplay.doorLock;
  tacSnapCipherEl.checked = tacDisplay.snap.cipher;
  tacSnapDungeonEl.checked = tacDisplay.snap.dungeon;
  tacSnapDoorEl.checked = tacDisplay.snap.door;
  tacSnapChairEl.checked = tacDisplay.snap.chair;
  tacSnapBoxEl.checked = tacDisplay.snap.box;
  tacSnapPointEl.checked = tacDisplay.snap.point;
  tacDelSegOnlyEl.checked = tacDisplay.delSegOnly;
  tacShowCoordsEl.checked = tacDisplay.showCoords;
  tacSelGlowEl.checked = tacDisplay.selGlow;
  tacHideEndpointsEl.checked = !!tacDisplay.hideEndpoints;
  tacCarryHideRingEl.checked = !!tacDisplay.carryHideRing;
  const cropEl = $('tacExportCrop');
  if (cropEl) cropEl.checked = tacDisplay.exportCrop;
  const exportRotEl = $('tacExportRot');
  if (exportRotEl) exportRotEl.checked = tacDisplay.exportRot;
}

export let tacTool = 'select';

      
export let tacPlaceRole = null;

     
export let tacPlaceItem = null;

     
export let tacSelected = null;


// —— 多实例角色：tokens 为数组，tacSelected 存 tid ——
export function tacTokenByTid(tid) {
  return tacBoard().tokens.find((t) => t.tid === tid) || null;
}

export function tacTokenByRole(role) {
  return tacBoard().tokens.find((t) => t.role === role) || null;
}

export function tacItemByIid(iid) {
  return tacBoard().items.find((it) => it.iid === iid) || null;
}

export function tacSelRole() {
  const t = tacSelected != null ? tacTokenByTid(tacSelected) : null;
  return t ? t.role : null;
}

      
export let tacSelectedItem = null;

  
export let tacArrowColor = '#ef4444';

export let tacArrowWidth = 4;

export let tacDrawShape = 'arrow';

   
export let tacDrawing = null;

       
export let tacMeasurePending = null;

 
export let tacMeasureHover = null;

  

export let tacMeasureMode = 'single';


export let tacCamp = 'survivor';

   
export let tacApplyScope = 'chain';


export let tacBuffSeq = restoredMeasureIds.buff;

         
export let tacLcSeq = restoredMeasureIds.config;

           

export const tacPending = { base: { name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed }, buffs: [] };

export let tacBaseDetailOpen = true;

 
export let tacBaseMergeOn = true;

   
export let tacLastRoleVal = null;

 
export let tacBuffDetailOpen = true;

 
export let tacResultOpen = true;

let tacSpeedSettingsOpen = true;

    

export const tacBuffFilter = { from: 0, to: 0, all: true };

export let tacTargetSig = '';

      
export const tacSegExpanded = new Set();

 
export let tacChainRoute = null;

    
export let tacRouteSeq = restoredMeasureIds.route;

         
export let tacSelMeasure = null;

    
export let tacDragMeasure = null;

   
export let tacGreenSegs = new Map();

 
export let tacDrag = null;

          
export let tacDragItem = null;

      
export let tacSelectedText = null;

  
export let tacDragText = null;

      
export let tacTextPlacing = false;

  
export let tacItemRole = null;

      
export let tacManageSel = null;

     

export const tacImageState = { url: null, timer: null, loaded: null };

export const tacUndoStack = [];

     



export function syncTacImage() {
  const url = getImageUrl(S.currentMapId);

  // 推算绘制按地图各自保留：保存旧图的选中与结果，恢复目标图的（无则清空）
  tacDedOnMapSwitch();
  if (tacCarryCard) syncTacCarryChairRow();

  // 先同步当前地图的旋转角，保证后续渲染使用正确的 tacRotK
  tacApplyRotation();
  renderTacCiphers();
  syncTacCipherCard();
  renderTacZones();
  renderTacLandmarks();
  renderTacChairs();
  syncTacChairText();
  syncTacBasementText();
  const chairEntry = $('tacChairEntry');
  if (chairEntry) chairEntry.style.display = MAPS_DATA[S.currentMapId].rocketChairs ? '' : 'none';
  renderTacBoxes();
  const boxEntry = $('tacBoxEntry');
  if (boxEntry) boxEntry.style.display = MAPS_DATA[S.currentMapId].chests ? '' : 'none';
  const basementEntry = $('tacBasementEntry');
  if (basementEntry) {
    const map = MAPS_DATA[S.currentMapId];
    const hasBasement = tacBasementList().length > 0;
    basementEntry.style.display = hasBasement ? '' : 'none';
  }
  syncTacDungeonText();
  renderTacSpawns();
  syncTacSpawnText();
  const spawnEntry = $('tacSpawnEntry');
  if (spawnEntry) spawnEntry.style.display = (MAPS_DATA[S.currentMapId].spawns || []).length ? '' : 'none';
  if (url === tacImageState.loaded) return;
  tacImageState.loaded = url;
  const [mw, mh] = MAPS_DATA[S.currentMapId].mapSize;
  tacMapWrap.style.aspectRatio = `${mw} / ${mh}`;
  tacApplyRotation();
  loadImageWithStatus({
    url,
    img: tacMapImage,
    loading: tacLoading,
    error: tacImageError,
    state: tacImageState,
    onReady: (w, h) => {
      tacMapWrap.style.aspectRatio = `${w} / ${h}`;
      tacApplyRotation();
    },
  });
}



function setTacFontSize(el, units, cap) {
  const w = tacMapWrap ? tacMapWrap.clientWidth : 360;
  const px = units * w / 100;
  el.style.fontSize = cap == null ? `${px}px` : `${Math.min(cap, px)}px`;
  el.style.fontSize = cap == null ? `${units}cqw` : `min(${cap}px, ${units}cqw)`;
}


const TAC_CIPHER_PROGRESS_LS_KEY = 'tacCipherProgressV1';
export const TAC_CIPHER_DONE_ICON_URL = 'https://i0.hdslb.com/bfs/new_dyn/470e117efe38e8ff949c47249932ec73262863779.png@1192w_1192h.avif';

// 每张地图各密码机的破译进度（0-100；null/0 表示未开启进度显示）
export let tacCipherProgress = {};
try {
  tacCipherProgress = JSON.parse(localStorage.getItem(TAC_CIPHER_PROGRESS_LS_KEY) || '{}') || {};
} catch (err) { tacCipherProgress = {}; }

function tacCipherProgressSave() {
  try { localStorage.setItem(TAC_CIPHER_PROGRESS_LS_KEY, JSON.stringify(tacCipherProgress)); } catch (err) { /* ignore */ }
}

export function tacCipherPctOf(mapId, cid) {
  const v = tacCipherProgress[mapId] ? tacCipherProgress[mapId][cid] : null;
  if (typeof v !== 'number' || !isFinite(v) || v < 0) return null;
  return Math.min(100, Math.round(v));
}

function tacCipherSetPct(mapId, cid, pct) {
  if (!tacCipherProgress[mapId]) tacCipherProgress[mapId] = {};
  if (pct == null) delete tacCipherProgress[mapId][cid];
  else tacCipherProgress[mapId][cid] = Math.min(100, Math.max(0, Math.round(pct)));
  tacCipherProgressSave();
}

function tacCipherIconFor(pct) {
  if (pct != null && pct >= 100) return TAC_CIPHER_DONE_ICON_URL;
  return CIPHER_ICON_URL;
}

export function renderTacCiphers() {
  if (!tacMapWrap) return;
  // The prediction remains visible and must update even when cipher icons do not.
  renderTacTreasure();
  tacMapWrap.querySelectorAll('.tac-cipher, .tac-cipher-pct').forEach((el) => el.remove());
  if (!tacDisplay.ciphers || !cipherIcon.loaded) return;
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  map.cipherCombinations[S.currentCipherIndex].forEach((cid) => {
    const c = cipherOf(S.currentMapId, cid);
    if (!c) return;
    const pct = tacCipherPctOf(S.currentMapId, cid);
    const el = document.createElement('img');
    el.className = 'tac-cipher';
    el.src = tacCipherIconFor(pct);
    el.alt = c.name;
    el.title = c.name;
    el.draggable = false;
    el.style.left = `${(c.location[0] / imgW) * 100}%`;
    el.style.top = `${(c.location[1] / imgH) * 100}%`;
    el.style.width = `${tacDisplay.cipherSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
    if (pct != null) {
      const txt = document.createElement('span');
      txt.className = 'tac-cipher-pct';
      txt.textContent = `${pct}%`;
      txt.style.left = `${(c.location[0] / imgW) * 100}%`;
      txt.style.top = `${(c.location[1] / imgH) * 100}%`;
      txt.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg) translateY(${tacDisplay.cipherSize / 2 + 0.05}cqw)`;
      tacLayer().appendChild(txt);
    }
  });
}


export function switchTacCipher(step) {
  const count = MAPS_DATA[S.currentMapId].cipherCombinations.length;
  S.currentCipherIndex = (S.currentCipherIndex + step + count) % count;
  syncTacImage();
  saveRegionSel();
}


// 密码机卡片：与显示设置共享「显示 / 切组 / 图标大小」，下方列出当前组 5 台密码机的进度设置
export function syncTacCipherCard() {
  if (!tacCipherCard) return;
  const map = MAPS_DATA[S.currentMapId];
  const count = map.cipherCombinations.length;
  const text = translate("region.updateCipherText", { index: S.currentCipherIndex + 1, count: count });
  tacDispCipherText.textContent = text;
  tacCipherCardText.textContent = text;
  tacCipherCardShowEl.checked = !!tacDisplay.ciphers;
  tacShowCiphersEl.checked = !!tacDisplay.ciphers;
  tacCipherCardSizeEl.value = tacDisplay.cipherSize;
  tacCipherSizeEl.value = tacDisplay.cipherSize;
  tacCipherCardSizeDefEl.checked = tacDisplay.cipherSize === TAC_DISPLAY_DEFAULT.cipherSize;
  tacCipherSizeDefEl.checked = tacCipherCardSizeDefEl.checked;
  tacCipherList.innerHTML = '';
  map.cipherCombinations[S.currentCipherIndex].forEach((cid) => {
    const c = cipherOf(S.currentMapId, cid);
    if (!c) return;
    const pct = tacCipherPctOf(S.currentMapId, cid);
    const row = document.createElement('div');
    row.className = 'tac-cipher-row';
    const icon = document.createElement('img');
    icon.className = 'tac-cipher-row-icon';
    icon.src = tacCipherIconFor(pct);
    icon.alt = c.name;
    icon.draggable = false;
    const name = document.createElement('span');
    name.className = 'tac-cipher-row-name';
    name.textContent = c.name;
    const enableLabel = document.createElement('label');
    enableLabel.className = 'tac-display-toggle';
    const enable = document.createElement('input');
    enable.type = 'checkbox';
    enable.checked = pct != null;
    const enableText = document.createElement('span');
    enableText.textContent = translate("ui.tacCipherCard.enableProgress");
    enableLabel.appendChild(enable);
    enableLabel.appendChild(enableText);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = pct != null ? pct : 0;
    slider.disabled = pct == null;
    slider.className = 'tac-cipher-row-slider';
    const val = document.createElement('span');
    val.className = 'tac-cipher-row-val';
    val.textContent = pct != null ? `${pct}%` : '';
    enable.addEventListener('change', () => {
      if (enable.checked) {
        slider.disabled = false;
        tacCipherSetPct(S.currentMapId, cid, parseInt(slider.value, 10));
      } else {
        slider.disabled = true;
        tacCipherSetPct(S.currentMapId, cid, null);
      }
      syncTacCipherCard();
      renderTacCiphers();
    });
    slider.addEventListener('input', () => {
      tacCipherSetPct(S.currentMapId, cid, parseInt(slider.value, 10));
      const p = tacCipherPctOf(S.currentMapId, cid);
      val.textContent = p != null ? `${p}%` : '';
      icon.src = tacCipherIconFor(p);
      renderTacCiphers();
    });
    row.appendChild(icon);
    row.appendChild(name);
    row.appendChild(enableLabel);
    row.appendChild(slider);
    row.appendChild(val);
    tacCipherList.appendChild(row);
  });
}

if (tacCipherCard) {
  tacCipherCardSizeDefEl._default = TAC_DISPLAY_DEFAULT.cipherSize;
  tacCipherCardShowEl.addEventListener('change', () => {
    tacDisplay.ciphers = tacCipherCardShowEl.checked;
    tacShowCiphersEl.checked = tacCipherCardShowEl.checked;
    renderTacCiphers();
    tacSave();
  });
  tacCipherCardPrevBtn.addEventListener('click', () => switchTacCipher(-1));
  tacCipherCardNextBtn.addEventListener('click', () => switchTacCipher(1));
  tacCipherCardSizeEl.addEventListener('input', () => {
    tacDisplay.cipherSize = parseFloat(tacCipherCardSizeEl.value);
    tacCipherSizeEl.value = tacCipherCardSizeEl.value;
    const isDef = tacDisplay.cipherSize === TAC_DISPLAY_DEFAULT.cipherSize;
    tacCipherCardSizeDefEl.checked = isDef;
    tacCipherSizeDefEl.checked = isDef;
    renderTacCiphers();
    tacSave();
  });
  tacCipherCardSizeDefEl.addEventListener('change', () => {
    if (!tacCipherCardSizeDefEl.checked) return;
    tacCipherCardSizeEl.value = TAC_DISPLAY_DEFAULT.cipherSize;
    tacCipherCardSizeEl.dispatchEvent(new Event('input'));
  });
}

 


export function renderTacZones() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-zone').forEach((el) => el.remove());
  if (!tacDisplay.zones) return;
  mapsZonesRelative[S.currentMapId].forEach((z) => {
    const el = document.createElement('div');
    el.className = 'tac-zone';
    el.style.left = `${z.x * 100}%`;
    el.style.top = `${z.y * 100}%`;
    el.style.width = `${z.width * 100}%`;
    el.style.height = `${z.height * 100}%`;
    tacLayer().appendChild(el);
  });
}


export function tacDoorPoints(map) {
  const d = map.escapeDoors;
  if (tacDisplay.doorLock && d.length >= 4) return [d[2], d[3]];
  return d.slice(0, 2);
}


export function renderTacSpawns() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-spawn').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const groups = map.spawns || [];
  if (!tacDisplay.spawns || !groups.length) return;
  const group = groups[S.tacSpawnIndex % groups.length];
  const [imgW, imgH] = map.mapSize;
  const place = (pt, iconUrl, alt) => {
    const el = document.createElement('img');
    el.className = 'tac-spawn';
    el.src = iconUrl;
    el.alt = alt;
    el.title = alt;
    el.draggable = false;
    el.style.left = `${(pt[0] / imgW) * 100}%`;
    el.style.top = `${(pt[1] / imgH) * 100}%`;
    el.style.width = `${tacDisplay.spawnSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
  };
  group.survivor.forEach((pt) => place(pt, SPAWN_SURVIVOR_ICON_URL, translate("game.spawnPoint")));
  place(group.hunter, SPAWN_HUNTER_ICON_URL, translate("game.spawnPoint"));
}

export function syncTacSpawnText() {
  const n = (MAPS_DATA[S.currentMapId].spawns || []).length;
  tacSpawnText.textContent = translate("application.syncTacDungeonText", { index: S.tacSpawnIndex + 1, value: n });
}

export function switchTacSpawn(step) {
  const n = (MAPS_DATA[S.currentMapId].spawns || []).length;
  if (!n) return;
  S.tacSpawnIndex = (S.tacSpawnIndex + step + n) % n;
  syncTacSpawnText();
  renderTacSpawns();
  saveRegionSel();
}


export function renderTacLandmarks() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-dungeon, .tac-door').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  if (tacDisplay.dungeon && map.dungeons.length) {
    const pt = map.dungeons[S.tacDungeonIndex % map.dungeons.length];
    const el = document.createElement('img');
    el.className = 'tac-dungeon';
    el.src = DUNGEON_ICON_URL;
    el.alt = translate("game.dungeon");
    el.title = translate("application.renderTacLandmarks", { index: S.tacDungeonIndex + 1, count: map.dungeons.length });
    el.draggable = false;
    el.style.left = `${(pt[0] / imgW) * 100}%`;
    el.style.top = `${(pt[1] / imgH) * 100}%`;
    el.style.width = `${tacDisplay.dungeonSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
  }
  if (tacDisplay.doors) {
    const lockMode = tacDisplay.doorLock && map.escapeDoors.length >= 4;
    tacDoorPoints(map).forEach((pt, i) => {
      const el = document.createElement('img');
      el.className = 'tac-door';
      el.src = ESCAPE_DOOR_ICON_URL;
      el.alt = translate("application.renderTacLandmarksAlternate", { value: i + 1 });
      el.title = translate("application.renderTacLandmarksFourth", { value: i + 1, valueSecondary: lockMode ? translate("application.renderTacLandmarksThird") : '' });
      el.draggable = false;
      el.style.left = `${(pt[0] / imgW) * 100}%`;
      el.style.top = `${(pt[1] / imgH) * 100}%`;
      el.style.width = `${tacDisplay.doorSize}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
      tacLayer().appendChild(el);
    });
  }
  renderTacFixedSpawns(); 
}


export function renderTacFixedSpawns() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-fixed-spawn, .tac-fixed-spawn-range').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  for (const [role, cfg] of Object.entries(map.fixedSpawns || {})) {
    const token = tacTokenByRole(role);
    if (!token) continue;
    const items = (Array.isArray(cfg.item) ? cfg.item : [cfg.item]).filter(Boolean);

    if (token.showFixedSpawnRange) {
      items.forEach((item) => {
        if (!item.rangeM || !item.rangeScreenM || !map.widthM) return;
        const [screenW, screenH] = item.rangeScreenM[token.fixedSpawnDevice === 'ios' ? 'ios' : 'pc'];
        const outerW = item.rangeM * 2 + screenW;
        const outerH = item.rangeM * 2 + screenH;
        const sizePct = (outerW / map.widthM) * 100;
        const radiusXPct = (item.rangeM / outerW) * 100;
        const radiusYPct = (item.rangeM / outerH) * 100;
        item.points.forEach((pt) => {
          const p = item.flag_orientation ? pt.p : pt;
          const rangeEl = document.createElement('div');
          rangeEl.className = 'tac-fixed-spawn-range';
          rangeEl.style.width = `${sizePct}%`;
          rangeEl.style.aspectRatio = `${outerW} / ${outerH}`;
          rangeEl.style.borderRadius = `${radiusXPct}% / ${radiusYPct}%`;
          rangeEl.style.left = `${(p[0] / imgW) * 100}%`;
          rangeEl.style.top = `${(p[1] / imgH) * 100}%`;
          tacLayer().appendChild(rangeEl);
        });
      });
    }
    if (!token.showFixedSpawns) continue;
    items.forEach((item) => {
      item.points.forEach((pt) => {
        const p = Array.isArray(pt) ? pt : pt.p;
        let el;
        if (item.flag_orientation) {
          const iconUrl = TAC_FIXED_SPAWN_ICONS[item.icon] || item.icon;
          el = document.createElement('div');
          const dirSvg = token.showSpawnDir
            ? (() => {
              const deg = Math.atan2(pt.d[1], pt.d[0]) * 180 / Math.PI;
              const dirs = ['right', 'down', 'left', 'up'];
              const dir = dirs[((Math.round(deg / 90) % 4) + 4) % 4];
              return `<svg class="cam-dir ${dir}" viewBox="0 0 16 16" aria-hidden="true">`
                + '<path d="M5 2 L12 8 L5 14" fill="none" stroke="#7dd3fc"'
                + ' stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            })()
            : '';
          el.innerHTML = dirSvg
            + (iconUrl
              ? `<img class="cam-icon" src="${iconUrl}" alt="${cfg.label}" draggable="false">`
              : '<div class="cam-dot"></div>');
        } else {
          const spawnDef = TAC_ITEM_TYPES[item.icon] || {};
          const iconUrl = spawnDef.icon || '';
          if (iconUrl) {
            el = document.createElement('img');
            el.src = iconUrl;
            el.alt = cfg.label;
            el.draggable = false;
            if (spawnDef.iconSize) el.style.width = `${spawnDef.iconSize}%`;
          } else {
            el = document.createElement('div');
            el.className = 'cam-dot';
          }
        }
        el.className = 'tac-fixed-spawn';
        el.style.left = `${(p[0] / imgW) * 100}%`;
        el.style.top = `${(p[1] / imgH) * 100}%`;
        const camIcon = el.querySelector('.cam-icon');
        if (camIcon) {
          camIcon.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
        } else if (el.tagName === 'IMG') {
          // 零件/鳞片图标原本无 transform（左上角锚点），绕锚点反向旋转
          el.style.transformOrigin = '0 0';
          el.style.transform = tacUpRot() ? `rotate(${tacUpRot()}deg)` : '';
        }
        tacLayer().appendChild(el);
      });
    });
  }
}


export function renderTacTreasure() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-treasure-ring').forEach((el) => el.remove());
  // 书页管理不共享：只取当前开启书页管理的那个冒险家，以其位置推算
  const token = tacBoard().tokens.find((t) => t.role === 'explorer' && t.showTreasureRange) || null;
  const rings = getTreasureRings(MAPS_DATA[S.currentMapId], token,
    S.currentCipherIndex, TAC_TREASURE_RULE);
  rings.forEach((ring) => {
    const el = document.createElement('div');
    el.className = 'tac-treasure-ring' + (ring.excluded ? ' excluded' : '');
    el.style.left = `${ring.x * 100}%`;
    el.style.top = `${ring.y * 100}%`;
    el.style.width = `${ring.outerRadius * 200}%`;
    el.style.setProperty('--treasure-inner', `${ring.innerRadius / ring.outerRadius * 100}%`);
    tacLayer().appendChild(el);
  });
}

export function syncTacDungeonText() {
  const n = MAPS_DATA[S.currentMapId].dungeons.length;
  tacDungeonText.textContent = translate("application.syncTacDungeonText", { index: S.tacDungeonIndex + 1, value: n });
}

export function switchTacDungeon(step) {
  const n = MAPS_DATA[S.currentMapId].dungeons.length;
  if (!n) return;
  S.tacDungeonIndex = (S.tacDungeonIndex + step + n) % n;
  syncTacDungeonText();
  renderTacLandmarks();
  saveRegionSel(); 
}


function tacBasementList() {
  return Object.values((MAPS_DATA[S.currentMapId] || {}).basements || {});
}

export function renderTacChairs() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-chair, .tac-carry-point, .tac-carry-time-start, .tac-path-point, .tac-path-label').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const ch = map.rocketChairs;
  if (!ch) return;
  const [imgW, imgH] = map.mapSize;
  // 椅子点格式：[x, z]（地面）或 [x, y, z]（地下室，y 为高度）
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const draw = (pt, title, kind, index) => {
    const [px, pz] = xz(pt);
    const el = document.createElement('img');
    el.className = 'tac-chair';
    if (kind) {
      el.dataset.chairKind = kind;
      el.dataset.chairIndex = index;
      if (tacCarryState.chair?.kind === kind && tacCarryState.chair?.index === index) {
        el.classList.add('tac-carry-selected');
      }
    }
    el.src = CHAIR_ICON_URL;
    el.alt = translate("game.rocketChair");
    el.title = title;
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.chairSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
    // 选中椅子的正圆红框：img 是替换元素不支持伪元素，用独立 div 画正圆
    if (el.classList.contains('tac-carry-selected') && !tacDisplay.carryHideRing) {
      const ring = document.createElement('div');
      ring.className = 'tac-chair tac-carry-ring';
      ring.style.left = el.style.left;
      ring.style.top = el.style.top;
      ring.style.width = `${tacDisplay.chairSize * 1.5}%`;
      tacLayer().appendChild(ring);
    }
  };
  if (tacDisplay.chairs) {
    ch.fixed.forEach((pt, i) => draw(pt, translate("application.renderTacChairsFixed"), 'fixed', i));
    const setIdx = ch.sets.length ? S.tacChairIndex % ch.sets.length : -1;
    if (setIdx >= 0) {
      ch.sets[setIdx].forEach((pt, i) => draw(pt,
        translate("application.renderTacChairs", { index: setIdx + 1, count: ch.sets.length }), 'set', i));
    }
  }
  const bs = tacBasementList();
  if (tacDisplay.chairsBasement && bs.length) {
    const bIdx = S.tacChairBasementIndex % bs.length;
    bs[bIdx].rocketChairs.forEach((pt, i) => draw(pt,
      translate("application.renderTacChairsBasement", { index: bIdx + 1, count: bs.length }),
      'basement', i));
  }
  // 选点看挂椅/可达椅的起点标记（红色圆点 + 起点文字，随选中立即显示）
  if (tacCarryState.chair?.kind === 'point') {
    const dot = document.createElement('div');
    dot.className = 'tac-carry-point';
    dot.style.left = `${(tacCarryState.chair.x / imgW) * 100}%`;
    dot.style.top = `${(tacCarryState.chair.z / imgH) * 100}%`;
    tacLayer().appendChild(dot);
    const startLabel = document.createElement('span');
    startLabel.className = 'tac-carry-time tac-carry-time-start';
    startLabel.textContent = translate(tacCarryState.scenario === 'tide'
      ? 'ui.tacTide.startLabel' : 'ui.tacCarry.startLabel');
    startLabel.style.left = dot.style.left;
    startLabel.style.top = dot.style.top;
    startLabel.style.color = '#ff5252';
    // rotate 之后 translateY，保证文字正立且标签位于圆点正上方
    startLabel.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg) translateY(-15px)`;
    tacLayer().appendChild(startLabel);
  }
  // 两点最优路径规划的 A/B 端点标记
  renderTacPathPoints();
}

export function syncTacChairText() {
  const ch = MAPS_DATA[S.currentMapId].rocketChairs;
  if (!ch || !ch.sets.length) { tacChairText.textContent = '--'; return; }
  tacChairText.textContent = translate("application.syncTacChairText",
    { index: S.tacChairIndex + 1, count: ch.sets.length });
}

// 切换刷点组/地下室位置后，已选椅子不再属于当前显示组时，取消选中并清除计算结果
function tacCarryDeselectIfGone(kind) {
  if (tacCarryState.chair?.kind !== kind) return;
  tacCarryState.chair = null;
  tacCarryDisarm();
  tacCarryClearResult();
  syncTacCarryChairName();
}

export function switchTacChair(step) {
  const ch = MAPS_DATA[S.currentMapId].rocketChairs;
  if (!ch || !ch.sets.length) return;
  S.tacChairIndex = (S.tacChairIndex + step + ch.sets.length) % ch.sets.length;
  tacCarryDeselectIfGone('set');
  syncTacChairText();
  renderTacChairs();
  saveRegionSel();
}

export function syncTacBasementText() {
  const count = tacBasementList().length;
  const txt = !count ? '--' : translate("application.syncTacBasementText",
    { index: S.tacChairBasementIndex + 1, count });
  tacBasementText.textContent = txt;
  if (tacCarryBasementTextEl) tacCarryBasementTextEl.textContent = txt;
}

export function switchTacBasement(step) {
  const count = tacBasementList().length;
  if (!count) return;
  S.tacChairBasementIndex = (S.tacChairBasementIndex + step + count) % count;
  S.tacBoxBasementIndex = S.tacChairBasementIndex;
  tacCarryDeselectIfGone('basement');
  syncTacBasementText();
  renderTacChairs();
  renderTacBoxes();
  saveRegionSel();
}

export function renderTacBoxes() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-box').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const bx = map.chests;
  if (!bx) return;
  const [imgW, imgH] = map.mapSize;
  // 箱子点格式与椅子相同：[x, z]（地面）或 [x, y, z]（带高度，如地下室/二楼）
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const draw = (pt, title) => {
    const [px, pz] = xz(pt);
    const el = document.createElement('img');
    el.className = 'tac-box';
    el.src = BOX_ICON_URL;
    el.alt = translate("game.box");
    el.title = title;
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.boxSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
  };
  if (tacDisplay.boxes) {
    bx.fixed.forEach((pt) => draw(pt, translate("application.renderTacBoxesFixed")));
  }
  const bs = tacBasementList();
  if (tacDisplay.boxesBasement && bs.length) {
    const bIdx = S.tacChairBasementIndex % bs.length;
    bs[bIdx].chest.forEach((pt) => draw(pt,
      translate("application.renderTacBoxesBasement", { index: bIdx + 1, count: bs.length })));
  }
}



export function tacSnapTarget(p, excl) {
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  const pts = [];
  if (tacDisplay.snap.cipher && tacDisplay.ciphers) {
    map.cipherCombinations[S.currentCipherIndex].forEach((cid) => {
      const c = cipherOf(S.currentMapId, cid);
      if (c) pts.push({
        x: c.location[0] / imgW, y: c.location[1] / imgH,
        size: tacDisplay.cipherSize, kind: 'cipher',
      });
    });
  }
  if (tacDisplay.snap.dungeon && tacDisplay.dungeon && map.dungeons.length) {
    const pt = map.dungeons[S.tacDungeonIndex % map.dungeons.length];
    pts.push({
      x: pt[0] / imgW, y: pt[1] / imgH,
      size: tacDisplay.dungeonSize, kind: 'dungeon',
    });
  }
  if (tacDisplay.snap.door && tacDisplay.doors) {
    tacDoorPoints(map).forEach((pt) =>
      pts.push({
        x: pt[0] / imgW, y: pt[1] / imgH,
        size: tacDisplay.doorSize, kind: 'door',
      }));
  }
  if (tacDisplay.snap.chair && map.rocketChairs) {
    const ch = map.rocketChairs;
    const pushChair = (pt) => {
      const px = pt[0], pz = pt.length > 2 ? pt[2] : pt[1];
      pts.push({ x: px / imgW, y: pz / imgH, size: tacDisplay.chairSize, kind: 'chair' });
    };
    if (tacDisplay.chairs) {
      ch.fixed.forEach(pushChair);
      if (ch.sets.length) ch.sets[S.tacChairIndex % ch.sets.length].forEach(pushChair);
    }
    const bs = tacBasementList();
    if (tacDisplay.chairsBasement && bs.length) {
      bs[S.tacChairBasementIndex % bs.length].rocketChairs.forEach(pushChair);
    }
  }
  if (tacDisplay.snap.box && map.chests) {
    const bx = map.chests;
    const pushBox = (pt) => {
      const px = pt[0], pz = pt.length > 2 ? pt[2] : pt[1];
      pts.push({ x: px / imgW, y: pz / imgH, size: tacDisplay.boxSize, kind: 'box' });
    };
    if (tacDisplay.boxes) {
      bx.fixed.forEach(pushBox);
    }
    const bs = tacBasementList();
    if (tacDisplay.boxesBasement && bs.length) {
      bs[S.tacChairBasementIndex % bs.length].chest.forEach(pushBox);
    }
  }
  if (tacDisplay.snap.point) {
    const b = tacBoard();
    
    b.arrows.forEach((a) => {
      if (a.shape !== 'arrow') return;
      pts.push({ x: a.x1, y: a.y1, kind: 'point', color: a.color });
      pts.push({ x: a.x2, y: a.y2, kind: 'point', color: a.color });
    });
    
    b.measures.forEach((m, mi) => {
      pts.push({ x: m.x1, y: m.y1, kind: 'point', color: m.color, seg: mi, which: 'a' });
      pts.push({ x: m.x2, y: m.y2, kind: 'point', color: m.color, seg: mi, which: 'b' });
    });
  }
  const near = (pt, q) => Math.abs(pt.x - q.x) < 1e-6 && Math.abs(pt.y - q.y) < 1e-6;
  let best = null, bestD = Infinity;
  pts.forEach((pt) => {
    if (excl) {
      
      if (excl.seg != null && pt.seg === excl.seg && pt.which === excl.which) return;
      if (near(pt, excl)) return;
    }
    const d = Math.hypot((p.x - pt.x) * p.W, (p.y - pt.y) * p.H);
    if (d < bestD) { bestD = d; best = pt; }
  });
  if (!best) return null;
  
  const radius = best.kind === 'point' ? 12 : (best.size / 100) * p.W / 2 + 10;
  return bestD <= radius ? best : null;
}

export function tacSnapLandmark(p, excl) {
  const t = tacSnapTarget(p, excl);
  return t ? { ...p, x: t.x, y: t.y } : p;
}


export const tacZoomState = { scale: 1, tx: 0, ty: 0, pan: false, locked: true };

export let tacPanDrag = null;

// ---- 地图旋转（逆时针 90° 步进，0-3，每张地图各自记忆并随存档持久化）----
// 存储坐标始终是地图原始坐标（x 右 / y 下，0-1 分数）。
// 显示时把内容挂到 #tacRot 层，整层 rotate(-90k)；
// 指针坐标经 tacPos 逆变换回地图坐标。
export let tacRotK = 0;

export function tacSetRot(k) {
  tacRotK = ((k % 4) + 4) % 4;
  savedRot[S.currentMapId] = tacRotK;
  tacSave();
  tacApplyRotation();
  // 正立补偿写在各元素的内联 transform 里，角度变化后需要重渲染
  renderTacCiphers();
  renderTacZones();
  renderTacLandmarks();
  renderTacSpawns();
  renderTacChairs();
  renderTacBoxes();
  renderTacBoard();
}

// 正立补偿角（度）：地图内容随层逆时针转了 90k，图标/文字反向转回
export function tacUpRot() {
  return 90 * (tacRotK & 3);
}

// SVG 文字正立补偿：绕自身锚点反向旋转
export function tacUprightSvgText(el, x, y) {
  if (tacUpRot()) el.setAttribute('transform', `rotate(${tacUpRot()} ${x} ${y})`);
  else el.removeAttribute('transform');
}

export function tacRotate() {
  tacSetRot(tacRotK + 1);
}

// 地图坐标分数 -> 视觉（wrap）坐标分数
export function tacRotPt(x, y) {
  switch (tacRotK & 3) {
    case 1: return [y, 1 - x];
    case 2: return [1 - x, 1 - y];
    case 3: return [1 - y, x];
    default: return [x, y];
  }
}

// 视觉（wrap）向量 -> 地图向量（键盘方向键等屏幕方向输入用）
export function tacRotVec(dx, dy) {
  switch (tacRotK & 3) {
    case 1: return [-dy, dx];
    case 2: return [-dx, -dy];
    case 3: return [dy, -dx];
    default: return [dx, dy];
  }
}

export function tacLayer() {
  return (typeof tacRot !== 'undefined' && tacRot) || tacMapWrap;
}

export function tacApplyRotation() {
  if (!tacMapWrap) return;
  // 每张地图各自的旋转角（persist.js 随存档读写）
  tacRotK = (((savedRot[S.currentMapId] || 0) % 4) + 4) % 4;
  const map = MAPS_DATA[S.currentMapId];
  const [mw, mh] = map ? map.mapSize : [1, 1];
  const k = tacRotK & 3;
  const odd = k % 2 === 1;
  tacMapWrap.style.aspectRatio = odd ? `${mh} / ${mw}` : `${mw} / ${mh}`;
  if (tacRot) {
    tacRot.style.aspectRatio = `${mw} / ${mh}`;
    tacRot.style.width = odd ? `${(mw / mh) * 100}%` : '100%';
    tacRot.style.transform = `translate(-50%, -50%) rotate(${-90 * k}deg)`;
    tacRot.style.setProperty('--k', k);
  }
  const rb = $('tacRotateBtn');
  if (rb) rb.classList.toggle('active', k !== 0);
  renderTacArrows();
}

export function tacZoomEls() {
  return {
    lock: $('tacZoomLock'),
    out: $('tacZoomOut'), inn: $('tacZoomIn'),
    val: $('tacZoomVal'), pan: $('tacZoomPan'),
  };
}


export function tacUpdateTouchAction() {
  const own = tacTool === 'draw' || tacTool === 'measure'
    || tacZoomState.scale > TAC_ZOOM_MIN || tacZoomState.pan;
  tacMapWrap.style.touchAction = own ? 'none' : '';
}


export function tacSetZoomLock(on) {
  tacZoomState.locked = on;
  tacUpdateTouchAction();
  const { lock } = tacZoomEls();
  if (!lock) return;
  lock.classList.toggle('active', on);
  lock.innerHTML = on ? TAC_ZOOM_LOCK_ICONS.locked : TAC_ZOOM_LOCK_ICONS.unlocked;
  lock.title = on ? translate("application.tacSetZoomLock")
    : translate("application.tacSetZoomLockAlternate");
}


export function tacApplyZoom() {
  const s = tacZoomState.scale;
  const w = tacMapWrap.clientWidth, h = tacMapWrap.clientHeight;
  const minTx = Math.min(0, w - w * s), minTy = Math.min(0, h - h * s);
  tacZoomState.tx = Math.min(0, Math.max(minTx, tacZoomState.tx));
  tacZoomState.ty = Math.min(0, Math.max(minTy, tacZoomState.ty));
  tacMapWrap.style.transform =
    `translate(${tacZoomState.tx}px, ${tacZoomState.ty}px) scale(${s})`;
  tacUpdateTouchAction();
  const { out, inn, val, pan } = tacZoomEls();
  if (!out) return;
  val.textContent = Math.round(s * 100) + '%';
  out.disabled = s <= TAC_ZOOM_MIN;
  inn.disabled = s >= TAC_ZOOM_MAX;
  
  pan.disabled = s <= TAC_ZOOM_MIN;
  if (s <= TAC_ZOOM_MIN && tacZoomState.pan) tacSetPanMode(false);
}


export function tacZoomTo(next, anchorX, anchorY) {
  next = Math.min(TAC_ZOOM_MAX, Math.max(TAC_ZOOM_MIN, next));
  if (next === tacZoomState.scale) return;
  const w = tacMapWrap.clientWidth, h = tacMapWrap.clientHeight;
  const ax = anchorX !== undefined ? anchorX * w : w / 2;
  const ay = anchorY !== undefined ? anchorY * h : h / 2;
  const s0 = tacZoomState.scale;
  
  const px = tacZoomState.tx + ax * s0, py = tacZoomState.ty + ay * s0;
  tacZoomState.scale = next;
  tacZoomState.tx = px - ax * next;
  tacZoomState.ty = py - ay * next;
  tacApplyZoom();
}

export function tacZoomStep(dir, anchorX, anchorY) {
  const cur = tacZoomState.scale;
  
  const next = dir > 0 ? Math.min(TAC_ZOOM_MAX, cur * 1.25)
    : Math.max(TAC_ZOOM_MIN, cur / 1.25);
  tacZoomTo(Math.round(next * 100) / 100, anchorX, anchorY);
}


export function tacSetPanMode(on) {
  if (on && tacZoomState.scale <= TAC_ZOOM_MIN) return; 
  tacZoomState.pan = on;
  tacUpdateTouchAction();
  tacMapWrap.classList.remove('grabbing');
  const { pan } = tacZoomEls();
  if (pan) pan.classList.toggle('active', on);
  tacticView.classList.toggle('tac-panning', on);
  if (on) {
    
    tacSelected = null; tacSelectedItem = null; tacSelectedText = null;
    tacSelMeasure = null; tacPlaceRole = null; tacPlaceItem = null;
    tacTextPlacing = false; updateTacTextUi();
    renderTacBoard(); updateTacPanel();
  }
}

export function tacZoomInit() {
  const { lock, out, inn, pan } = tacZoomEls();
  if (!out) return;
  lock.addEventListener('click', () => tacSetZoomLock(!tacZoomState.locked));
  tacSetZoomLock(tacZoomState.locked);
  out.addEventListener('click', () => tacZoomStep(-1));
  inn.addEventListener('click', () => tacZoomStep(1));
  pan.addEventListener('click', () => tacSetPanMode(!tacZoomState.pan));
  const rot = $('tacRotateBtn');
  if (rot) rot.addEventListener('click', () => tacRotate());
  const cropEl = $('tacExportCrop');
  if (cropEl) cropEl.addEventListener('change', () => {
    tacDisplay.exportCrop = cropEl.checked;
    tacSave();
  });
  const exportRotEl = $('tacExportRot');
  if (exportRotEl) exportRotEl.addEventListener('change', () => {
    tacDisplay.exportRot = exportRotEl.checked;
    tacSave();
  });
}

tacZoomInit();


export function tacZoomReset() {
  tacZoomState.scale = 1; tacZoomState.tx = 0; tacZoomState.ty = 0;
  tacPanDrag = null;
  tacMapWrap.classList.remove('grabbing');
  tacZoomState.pan = false;
  const { pan } = tacZoomEls();
  if (pan) pan.classList.remove('active');
  tacticView.classList.remove('tac-panning');
  tacApplyZoom();
}


export function tacHexRgba(hex, a) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}


export function tacDragMeasureExcl() {
  if (!tacDragMeasure) return null;
  return {
    x: tacDragMeasure.ox, y: tacDragMeasure.oy,
    seg: tacDragMeasure.idx, which: tacDragMeasure.end,
  };
}

export function tacUpdateSnapRipple(p) {
  if (!tacSnapRipple) return;
  const active = (tacTool === 'draw' || tacTool === 'measure') && p
    ? tacSnapTarget(p, tacDragMeasureExcl()) : null;
  if (active) {
    const [vu, vv] = tacRotPt(active.x, active.y);
    tacSnapRipple.style.left = `${vu * 100}%`;
    tacSnapRipple.style.top = `${vv * 100}%`;
    tacSnapRipple.classList.toggle('door', active.kind === 'door'); 
    if (active.kind === 'point') { 
      const c = tacHexRgba(active.color, 0.95);
      const g = tacHexRgba(active.color, 0.55);
      if (c) tacSnapRipple.style.setProperty('--snap-c', c);
      if (g) tacSnapRipple.style.setProperty('--snap-g', g);
    } else {
      tacSnapRipple.style.removeProperty('--snap-c');
      tacSnapRipple.style.removeProperty('--snap-g');
    }
    tacSnapRipple.classList.add('show');
  } else {
    tacSnapRipple.classList.remove('show');
  }
}


export function tacUpdateCoordsTip(p, e) {
  if (!tacCoordsTip) return;
  if (!tacDisplay.showCoords || !p) {
    tacCoordsTip.classList.remove('show');
    return;
  }
  const [imgW, imgH] = MAPS_DATA[S.currentMapId].mapSize;
  const [vu, vv] = tacRotPt(p.x, p.y);
  tacCoordsTip.textContent = `${Math.round(p.x * imgW)}, ${Math.round(p.y * imgH)}`;
  tacCoordsTip.style.left = `${vu * 100}%`;
  tacCoordsTip.style.top = `${vv * 100}%`;

  tacCoordsTip.style.transform =
    `translate(${vu > 0.82 ? 'calc(-100% - 14px)' : '14px'}, `
    + `${vv > 0.85 ? 'calc(-100% - 14px)' : '14px'})`;
  tacCoordsTip.classList.add('show');
}


export function bindTacDisplayRow(toggleEl, sliderEl, defEl, onToggle, onSize) {
  toggleEl.addEventListener('change', () => { onToggle(toggleEl.checked); tacSave(); });
  sliderEl.addEventListener('input', () => {
    onSize(parseFloat(sliderEl.value));
    defEl.checked = parseFloat(sliderEl.value) === defEl._default;
    tacSave();
  });
  defEl.addEventListener('change', () => {
    if (!defEl.checked) return;
    sliderEl.value = defEl._default;
    sliderEl.dispatchEvent(new Event('input'));
  });
}

tacCipherSizeDefEl._default = TAC_DISPLAY_DEFAULT.cipherSize;

tacDungeonSizeDefEl._default = TAC_DISPLAY_DEFAULT.dungeonSize;

tacSpawnSizeDefEl._default = TAC_DISPLAY_DEFAULT.spawnSize;

tacChairSizeDefEl._default = TAC_DISPLAY_DEFAULT.chairSize;

tacBoxSizeDefEl._default = TAC_DISPLAY_DEFAULT.boxSize;

tacDoorSizeDefEl._default = TAC_DISPLAY_DEFAULT.doorSize;


tacShowZonesEl.addEventListener('change', () => {
  tacDisplay.zones = tacShowZonesEl.checked;
  renderTacZones();
  tacSave();
});

bindTacDisplayRow(tacShowCiphersEl, tacCipherSizeEl, tacCipherSizeDefEl,
  (v) => { tacDisplay.ciphers = v; renderTacCiphers(); syncTacCipherCard(); },
  (v) => { tacDisplay.cipherSize = v; renderTacCiphers(); syncTacCipherCard(); });

bindTacDisplayRow(tacShowDungeonEl, tacDungeonSizeEl, tacDungeonSizeDefEl,
  (v) => { tacDisplay.dungeon = v; renderTacLandmarks(); },
  (v) => { tacDisplay.dungeonSize = v; renderTacLandmarks(); });

bindTacDisplayRow(tacShowSpawnsEl, tacSpawnSizeEl, tacSpawnSizeDefEl,
  (v) => { tacDisplay.spawns = v; renderTacSpawns(); },
  (v) => { tacDisplay.spawnSize = v; renderTacSpawns(); });

bindTacDisplayRow(tacShowChairsEl, tacChairSizeEl, tacChairSizeDefEl,
  (v) => { tacDisplay.chairs = v; renderTacChairs(); },
  (v) => { tacDisplay.chairSize = v; renderTacChairs(); });

tacShowChairBasementEl.addEventListener('change', () => {
  tacDisplay.chairsBasement = tacShowChairBasementEl.checked;
  tacCarryChairBasementEl.checked = tacDisplay.chairsBasement;
  renderTacChairs();
  tacSave();
});

bindTacDisplayRow(tacShowBoxesEl, tacBoxSizeEl, tacBoxSizeDefEl,
  (v) => { tacDisplay.boxes = v; renderTacBoxes(); },
  (v) => { tacDisplay.boxSize = v; renderTacBoxes(); });

tacShowBoxBasementEl.addEventListener('change', () => {
  tacDisplay.boxesBasement = tacShowBoxBasementEl.checked;
  tacCarryBoxBasementEl.checked = tacDisplay.boxesBasement;
  renderTacBoxes();
  tacSave();
});

bindTacDisplayRow(tacShowDoorsEl, tacDoorSizeEl, tacDoorSizeDefEl,
  (v) => { tacDisplay.doors = v; renderTacLandmarks(); },
  (v) => { tacDisplay.doorSize = v; renderTacLandmarks(); });

// ---- 狂欢之椅推算（挂人范围二维近似，数据来自三维导航栅格） ----
export const tacCarryState = {
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

/* ================= 两点最优路径规划 ================= */
// 状态与推算卡片完全私有（含移速设置区），不与其它卡片共享
export const tacPathState = {
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

/* ---- 推算绘制按地图各自保留（切图保存 / 切回恢复，move 语义） ---- */
const tacDedStore = new Map();  // mapId -> { carry: {chair, cache, hiddenBands, detailMark}|null, path: {points, cache}|null }
let tacDedLiveMapId = null;     // 实时选中/结果当前所属的地图

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
          ? translate('ui.tacTide.summary', { cells: c.field.reached })
          : translate('ui.tacCarry.summary', {
            seconds: c.profile.remainingSeconds.toFixed(1),
            pickup: c.profile.pickupSeconds.toFixed(1),
            cells: c.field.reached,
          });
        if (tide) renderTacTideLegend(c.field.bands);
        else renderTacCarryLegend(c.field.bands);
        syncTacCarryResultBox();
        tacCarryResultBoxEl.style.display = '';
        tacCarryNote.dataset.i18n = tide ? 'ui.tacTide.note' : 'ui.tacCarry.note';
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
        tacPathSummary.textContent = translate('ui.tacPath.summary', {
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
          fixLines.push(translate('ui.tacPath.fixNote', {
            name: translate(which === 'a' ? 'ui.tacPath.startLabelA' : 'ui.tacPath.endLabelB'),
            fx: Math.round(fx.from.x), fy: Math.round(fx.from.z),
            tx: Math.round(fx.to.x), ty: Math.round(fx.to.z),
          }));
        }
        tacPathFixNote.textContent = fixLines.join('\n');
        tacPathFixNote.style.display = fixLines.length ? '' : 'none';
        tacPathNote.dataset.i18n = 'ui.tacPath.note';
        tacPathNote.textContent = translate('ui.tacPath.note');
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
  const ch = MAPS_DATA[S.currentMapId].rocketChairs;
  if (!ch) return [];
  const out = [];
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const ground = (pt) => (pt.length > 2 ? pt[1] > -5 : true);
  ch.fixed.forEach((pt, i) => {
    if (ground(pt)) out.push({ kind: 'fixed', index: i, x: xz(pt)[0], z: xz(pt)[1] });
  });
  const setIdx = ch.sets.length ? S.tacChairIndex % ch.sets.length : -1;
  if (setIdx >= 0) {
    ch.sets[setIdx].forEach((pt, i) => {
      if (ground(pt)) out.push({ kind: 'set', index: i, x: xz(pt)[0], z: xz(pt)[1] });
    });
  }
  if (tacDisplay.chairsBasement) {
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

export function syncTacCarryChairRow() {
  if (!tacCarryCard) return;
  tacCarryShowChairsEl.checked = tacDisplay.chairs;
  tacCarryChairSizeEl.value = tacDisplay.chairSize;
  tacCarryChairSizeDefEl.checked = tacDisplay.chairSize === TAC_DISPLAY_DEFAULT.chairSize;
  const ch = MAPS_DATA[S.currentMapId].rocketChairs;
  tacCarryChairText.textContent = (!ch || !ch.sets.length) ? '--'
    : translate('application.syncTacChairText', { index: S.tacChairIndex + 1, count: ch.sets.length });
  tacCarryChairBasementEl.checked = tacDisplay.chairsBasement;
  tacCarryBoxBasementEl.checked = tacDisplay.boxesBasement;
  syncTacBasementText();
}

function syncTacCarryChairName() {
  const point = tacCarryState.mode === 'point';
  if (tacCarryState.armed) {
    tacCarryChairName.textContent = translate(point ? 'ui.tacCarry.pickingPoint' : 'ui.tacCarry.picking');
  } else if (tacCarryState.chair) {
    tacCarryChairName.textContent = translate(point ? 'ui.tacCarry.pointSelected' : 'ui.tacCarry.chairSelected', {
      x: Math.round(tacCarryState.chair.x), y: Math.round(tacCarryState.chair.z),
    });
  } else {
    tacCarryChairName.textContent = translate(point ? 'ui.tacCarry.noPoint' : 'ui.tacCarry.noChair');
  }
}

// 选择按钮文案：待命时「点我选择…」，点选状态下「点我取消选择」
function syncTacCarryPickBtn() {
  const key = tacCarryState.armed ? 'ui.tacCarry.cancelPick'
    : (tacCarryState.mode === 'point' ? 'ui.tacCarry.pickPoint' : 'ui.tacCarry.pickChair');
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
    ? (point ? 'ui.tacTide.runPoint' : 'ui.tacTide.run')
    : (point ? 'ui.tacCarry.runPoint' : 'ui.tacCarry.run');
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
  // 模式按钮 2 的文案随场景变化（选点看可挂椅 / 选点看可达椅）
  const mk = tide ? 'ui.tacTide.modePoint' : 'ui.tacCarry.modePoint';
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
    showToast(translate(tacCarryState.mode === 'point' ? 'ui.tacCarry.pickingPoint' : 'ui.tacCarry.picking'));
    return;
  }
  if (!navGridAvailable(S.currentMapId)) {
    tacCarrySummary.textContent = translate('ui.tacCarry.noGrid');
    return;
  }
  tacCarryClearResult();
  tacCarryState.running = true;
  tacCarryRunBtn.textContent = translate('ui.tacCarry.running');
  tacCarryProgressBox.style.display = '';
  tacCarryProgressBar.style.width = '0%';
  try {
    const g = await loadNavGrid(S.currentMapId);
    if (!g) { tacCarrySummary.textContent = translate('ui.tacCarry.noGrid'); return; }
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
        ? 'ui.tacCarry.unsupportedPoint' : 'ui.tacCarry.unsupportedChair');
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
    tacCarrySummary.textContent = translate('ui.tacCarry.summary', {
      seconds: profile.remainingSeconds.toFixed(1),
      pickup: profile.pickupSeconds.toFixed(1),
      cells: field.reached,
    });
    renderTacCarryLegend(field.bands);
    syncTacCarryResultBox();
    tacCarryResultBoxEl.style.display = '';
    tacCarryNote.dataset.i18n = 'ui.tacCarry.note';
    tacCarryNote.textContent = translate('ui.tacCarry.note');
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
      translate(risk ? 'ui.tacCarry.timeRisk' : 'ui.tacCarry.timeSeconds',
        { seconds: t.toFixed(1) }),
      shown >= 0 ? CARRY_BAND_COLORS[shown] : '#a4afbb');
    rows.push({ x: c.x, z: c.z, t, band });
  }
  tacLayer().appendChild(layer);
  // 挂椅明细：按最短挂椅时间升序，缓存供明细表重开时复用
  rows.sort((a, b) => a.t - b.t);
  if (tacCarryState.cache) tacCarryState.cache.chairRows = rows;
  if (tacCarryState.mode === 'point') {
    tacCarryChairCountEl.textContent = translate('ui.tacCarry.chairCount', { count: rows.length });
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
  tacCarryDetailToggleEl.textContent = translate('ui.tacCarry.detailToggle', { value: tacCarryDetailOpen ? '▾' : '▸' });
  tacCarryDetailBoxEl.style.display = rows.length ? '' : 'none';
  tacCarryDetailBodyEl.style.display = tacCarryDetailOpen ? '' : 'none';
  if (!rows.length) return;
  if (tacCarryDetailOpen) {
    tacCarryDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
      + `<th>${translate('ui.tacCarry.detailPos')}</th>`
      + `<th>${translate('ui.tacCarry.detailTime')}</th>`
      + `<th>${translate('ui.tacCarry.detailType')}</th></tr></thead><tbody>`
      + rows.map((r, i) =>
        `<tr data-row="${i}"${tacCarryState.detailMark === i ? ' class="marked"' : ''}>`
        + `<td>${Math.round(r.x)}, ${Math.round(r.z)}</td><td>${r.t.toFixed(1)}</td>`
        + `<td>${translate(`ui.tacCarry.band${r.band}`)}</td></tr>`).join('')
      + '</tbody></table>';
  }
  renderTacCarryMark();
}

// 计算结果区 / 设置区：整体可收起（结果区默认展开，设置区默认收起）
let tacCarryResultOpen = true;
function syncTacCarryResultBox() {
  tacCarryResultToggleEl.textContent = translate('application.buildTacSpeedPanelFifth', { value: tacCarryResultOpen ? '▾' : '▸' });
  tacCarryResultBodyEl.style.display = tacCarryResultOpen ? '' : 'none';
}
let tacCarrySettingsOpen = false;
function syncTacCarrySettingsBox() {
  tacCarrySettingsToggleEl.textContent = translate('ui.tacCarry.settingsToggleFmt', { value: tacCarrySettingsOpen ? '▾' : '▸' });
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
  ring.style.width = `${tacDisplay.chairSize * 1.5}%`;
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
      el.title = translate('ui.tacCarry.bandToggleHint');
      el.addEventListener('click', () => tacDedToggleBand(b.band));
    }
    el.innerHTML = `<span class="tac-carry-swatch" style="background:${CARRY_BAND_COLORS[b.band]}"></span>`
      + `<span>${translate(`ui.tacCarry.band${b.band}`)}</span>`;
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
      ? translate("application.tacBuildRoleOptionsFourth", { key, value: '', name: def.name, sp0 })
      : translate("application.tacBuildRoleOptionsFifth", { key, name: def.name });
  }
  tacCarryHunterEl.innerHTML = opts + translate("application.tacBuildRoleOptionsThird");
  tacCarryHunterEl.value = 'hellEmber';
}

function syncTacCarryHunterForm() {
  const key = tacCarryHunterEl.value;
  const info = tacSpeedForms(key);
  if (info && info.dual) {
    if (tacCarryHunterFormEl.dataset.sig !== key) {
      tacCarryHunterFormEl.innerHTML = info.forms.map((f, i) =>
        translate("application.syncTacSpeedForm", { index: i, name: f.name, speed: f.speed })).join('');
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
function buildTacCarryModalList(listEl, group) {
  listEl.innerHTML = Object.entries(CARRY_TALENTS)
    .filter(([, d]) => d.group === group)
    .map(([key, d]) => {
      const name = translate(`ui.tacCarry.talent.${key}`);
      const lv = d.levels.length > 1
        ? `<select data-clv="${key}">`
          + d.levels.map((_, i) =>
            translate('application.lv', { index: i + 1, count: i === d.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
          + '</select>'
        : '';
      return `<div class="tac-talent-row"><span class="tac-talent-name">${name}`
        + `<small>${translate(`ui.tacCarry.desc.${key}`)}</small></span>${lv}`
        + `<button type="button" class="tac-talent-add" data-ck="${key}">${translate('ui.tacCarry.add')}</button></div>`;
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
  tacCarryBuffToggleEl.textContent = translate('application.renderTacBuffDetail', { value: tacCarryBuffOpen ? '▾' : '▸' });
  tacCarryBuffBody.style.display = tacCarryBuffOpen ? '' : 'none';
  if (!tacCarryBuffOpen) return;
  const pct = (v) => `${Math.round(v * 1000) / 10}%`;
  const rows = [];
  for (const b of tacCarryState.buffs) {
    const def = CARRY_TALENTS[b.key];
    const base = translate(`ui.tacCarry.talent.${b.key}`);
    const name = def.levels.length > 1 ? `${base} ${b.level}层` : base;
    const dur = def.duration ? ` · ${def.duration}s` : '';
    if (b.key === 'ironGrip') {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]) + dur, type: translate('ui.tacCarry.type.struggle') });
      rows.push({ id: b.id, name, value: pct(def.dropProgress[b.level - 1] / 100), type: translate('ui.tacCarry.type.drop') });
    } else if (b.key === 'playful') {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]), type: translate('ui.tacCarry.type.pickup') });
    } else if (def.group === 'survivor') {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]), type: translate('ui.tacCarry.type.struggle') });
    } else {
      rows.push({ id: b.id, name, value: pct(def.levels[b.level - 1]) + dur, type: translate('ui.tacCarry.type.speed') });
    }
  }
  if (!rows.length) {
    tacCarryBuffBody.innerHTML = `<div class="tac-detail-empty">${translate('application.renderTacBuffDetailSixth')}</div>`;
    return;
  }
  tacCarryBuffBody.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th class="tac-cb-name">${translate('ui.tacCarry.buffColName')}</th>`
    + `<th class="tac-cb-value">${translate('ui.tacCarry.buffColValue')}</th>`
    + `<th>${translate('ui.tacCarry.buffColType')}</th>`
    + `<th class="tac-col-del"></th></tr></thead><tbody>`
    + rows.map((r) =>
      `<tr><td>${r.name}</td><td>${r.value}</td><td>${r.type}</td>`
      + `<td class="tac-col-del"><button type="button" class="tac-buff-del tac-carry-buff-del" data-cbid="${r.id}">×</button></td></tr>`).join('')
    + '</tbody></table>';
}

function buildTacCarryCard() {
  if (!tacCarryCard) return;
  // 与显示设置共享的椅子行
  tacCarryChairSizeDefEl._default = TAC_DISPLAY_DEFAULT.chairSize;
  bindTacDisplayRow(tacCarryShowChairsEl, tacCarryChairSizeEl, tacCarryChairSizeDefEl,
    (v) => { tacDisplay.chairs = v; renderTacChairs(); syncTacDisplayUI(); },
    (v) => { tacDisplay.chairSize = v; renderTacChairs(); syncTacDisplayUI(); });
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
    tacDisplay.chairsBasement = tacCarryChairBasementEl.checked;
    tacShowChairBasementEl.checked = tacDisplay.chairsBasement;
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
    showToast(translate(tacCarryState.mode === 'point' ? 'ui.tacCarry.pickingPoint' : 'ui.tacTide.picking'));
    return;
  }
  if (!navGridAvailable(S.currentMapId)) {
    tacCarrySummary.textContent = translate('ui.tacTide.noGrid');
    return;
  }
  tacCarryClearResult();
  tacCarryState.running = true;
  tacCarryRunBtn.textContent = translate('ui.tacTide.running');
  tacCarryProgressBox.style.display = '';
  tacCarryProgressBar.style.width = '0%';
  try {
    const g = await loadNavGrid(S.currentMapId);
    if (!g) { tacCarrySummary.textContent = translate('ui.tacTide.noGrid'); return; }
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
        ? 'ui.tacTide.unsupportedPoint' : 'ui.tacTide.unsupportedChair');
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
    tacCarrySummary.textContent = translate('ui.tacTide.summary', { cells: field.reached });
    renderTacTideLegend(field.bands);
    syncTacCarryResultBox();
    tacCarryResultBoxEl.style.display = '';
    tacCarryNote.dataset.i18n = 'ui.tacTide.note';
    tacCarryNote.textContent = translate('ui.tacTide.note');
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
    tacCarryCanvas = canvas;
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
      translate(band === 4 ? 'ui.tacTide.timeMargin' : 'ui.tacTide.timeSeconds',
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
    tacCarryChairCountEl.textContent = translate('ui.tacTide.chairCount', { count: reachable });
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
  tacCarryDetailToggleEl.textContent = translate('ui.tacTide.detailToggle', { value: tacCarryDetailOpen ? '▾' : '▸' });
  tacCarryDetailBoxEl.style.display = rows.length ? '' : 'none';
  tacCarryDetailBodyEl.style.display = tacCarryDetailOpen ? '' : 'none';
  if (!rows.length) return;
  if (tacCarryDetailOpen) {
    tacCarryDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
      + `<th>${translate('ui.tacTide.detailPos')}</th>`
      + `<th>${translate('ui.tacTide.detailTime')}</th>`
      + `<th>${translate('ui.tacTide.detailType')}</th></tr></thead><tbody>`
      + rows.map((r, i) =>
        `<tr data-row="${i}"${tacCarryState.detailMark === i ? ' class="marked"' : ''}>`
        + `<td>${Math.round(r.x)}, ${Math.round(r.z)}</td><td>${r.t.toFixed(1)}</td>`
        + `<td>${translate(`ui.tacTide.band${r.band}`)}</td></tr>`).join('')
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
      el.title = translate('ui.tacTide.bandToggleHint');
      el.addEventListener('click', () => tacDedToggleBand(b.band));
    }
    el.innerHTML = `<span class="tac-carry-swatch" style="background:${TIDE_BAND_COLORS[b.band]}"></span>`
      + `<span>${translate(`ui.tacTide.band${b.band}`)}</span>`;
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
  opts += translate("application.tacBuildRoleOptions");
  opts += translate("application.tacBuildRoleOptionsAlternate");
  tacTideSpeedRoleEl.innerHTML = opts + translate("application.tacBuildRoleOptionsThird");
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
    return { name: translate("application.name"), speed, camp: 'survivor', role: null, form: 0, stKey: 'custom' };
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

// 基础明细：名称 / 速度 / 20 秒移动距离（默认展开）
let tacTideBaseDetailOpen = true;
function renderTacTideBaseDetail() {
  tacTideBaseDetailToggleEl.textContent = translate("application.renderTacBaseDetail", { value: tacTideBaseDetailOpen ? '▾' : '▸' });
  tacTideBaseDetailBodyEl.style.display = tacTideBaseDetailOpen ? '' : 'none';
  if (!tacTideBaseDetailOpen) return;
  const b = tacCarryState.tide.base;
  tacTideBaseDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th>${translate('ui.tacTide.baseColName')}</th>`
    + `<th>${translate('ui.tacTide.baseColSpeed')}</th>`
    + `<th>${translate('ui.tacTide.baseColDist')}</th></tr></thead><tbody>`
    + `<tr><td>${b.name}</td><td class="tac-col-speed"><b>${Math.round(b.speed * 100) / 100}</b></td>`
    + `<td>${Math.round(b.speed * TIDE_SECONDS * 10) / 10}</td></tr></tbody></table>`;
}

// 加成明细表（默认展开）：加成 / 加成值 / 时长 / 删除
let tacTideBuffOpen = true;
function renderTacTideBuffs() {
  tacTideBuffToggleEl.textContent = translate('application.renderTacBuffDetail', { value: tacTideBuffOpen ? '▾' : '▸' });
  tacTideBuffBodyEl.style.display = tacTideBuffOpen ? '' : 'none';
  if (!tacTideBuffOpen) return;
  const pct = (v) => `${Math.round((v - 1) * 1000) / 10}%`;
  const rows = tacCarryState.tide.buffs.map((b) => ({
    id: b.id,
    name: b.name,
    value: pct(b.mult) + (b.postMult ? translate("application.descThird") : ''),
    duration: b.duration ? `${b.duration}s` : translate("application.descAlternate"),
  }));
  if (!rows.length) {
    tacTideBuffBodyEl.innerHTML = `<div class="tac-detail-empty">${translate('application.renderTacBuffDetailSixth')}</div>`;
    return;
  }
  tacTideBuffBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th class="tac-cb-name">${translate('ui.tacTide.buffColName')}</th>`
    + `<th class="tac-cb-value">${translate('ui.tacTide.buffColValue')}</th>`
    + `<th>${translate('ui.tacTide.buffColDuration')}</th>`
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
    showToast(translate("application.tacAddBuffEntry"));
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
    showToast(translate("application.tacAddBuffEntryAlternate", { name: TAC_MOVEMENT_SURVIVOR.stateNames[state] || state }));
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
        + translate("application.desc", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"))
      : `${Math.round((t.mult - 1) * 100)}%${t.postMult ? translate("application.descThird") : ''}`
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"));
    if (t.states) {
      desc += translate("application.buildTacTraitList", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    const lv = t.levels
      ? `<select data-tlv="${t.key}">`
        + t.levels.map((_, i) =>
          `<option value="${i}"${i === t.levels.length - 1 ? ' selected' : ''}>${tacLevelLabel(t.key, i)}</option>`).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.role} · ${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + translate("application.buildTacTraitListFourth", { key: t.key });
  }).join('');
}

function buildTacTideTalentList() {
  const rows = Object.entries(TAC_MOVEMENT_BUFFS.talent)
    .filter(([, b]) => !b.camp || b.camp === 'survivor');
  tacTideTalentList.innerHTML = rows.map(([k, b]) => {
    let desc = b.levels
      ? `${b.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: b.levels.length }) + (b.duration ? ` ${b.duration}s` : translate("application.descAlternate"))
      : `${Math.round((b.mult - 1) * 100)}%` + (b.duration ? ` ${b.duration}s` : translate("application.descAlternate"));
    const lv = b.levels
      ? `<select data-lv="${k}">`
        + b.levels.map((_, i) =>
          translate("application.lv", { index: i, count: i === b.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
        + '</select>'
      : '';
    if (b.states) {
      desc += translate("application.buildTacTraitList", { name: b.states.map((k2) => (TAC_MOVEMENT_SURVIVOR.states[k2] || {}).name || k2).join('/') });
    }
    return `<div class="tac-talent-row"><span class="tac-talent-name">${b.name}`
      + `<small>${desc}${b.extra ? translate("application.buildTacTalentList", { name: b.extra.name }) : ''}</small></span>${lv}`
      + translate("application.buildTacTalentListAlternate", { key: k });
  }).join('');
}

function buildTacTideOtherList() {
  const rows = TAC_MOVEMENT_BUFFS.other.survivor || [];
  tacTideOtherList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"))
      : `${Math.round((t.mult - 1) * 100)}%`
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"));
    if (t.states) {
      desc += translate("application.buildTacTraitList", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    const lv = t.levels
      ? `<select data-olv="${t.key}">`
        + t.levels.map((_, i) =>
          translate("application.lv", { index: i + 1, count: i === t.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + translate("application.buildTacOtherList", { key: t.key });
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
        showToast(translate("application.buildTacSpeedPanelAlternate"));
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
      showToast(translate("application.buildTacSpeedPanelThird", { name: entry.name }));
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
    const name = def.levels ? translate("application.nameThird", { name: def.name, value: lv + 1 }) : def.name;
    const entry = { type: 'talent', key: k, name, mult, duration: def.duration || 0 };
    if (def.extra) entry.extra = { name: def.extra.name, mult: def.extra.mult, duration: 0 };
    tacTideTalentModal.style.display = 'none';
    if (tacTideAddBuff(entry)) {
      showToast(translate("application.buildTacSpeedPanelThird", { name }));
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
    const name = def.levels ? translate("application.nameThird", { name: def.name, value: lv + 1 }) : def.name;
    const entry = {
      type: 'other', key: def.key, name,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    tacTideOtherModal.style.display = 'none';
    if (tacTideAddBuff(entry)) {
      showToast(translate("application.buildTacSpeedPanelThird", { name }));
      renderTacTideBuffs();
    }
  });

  tacTideBuffOk.addEventListener('click', () => {
    const pct = parseFloat(tacTideBuffPct.value);
    tacTideBuffModal.style.display = 'none';
    if (!pct) { showToast(translate("application.buildTacSpeedPanelFourth")); return; }
    const dur = parseFloat(tacTideBuffDur.value) || 0;
    const name = (tacTideBuffName.value || '').trim() || translate("application.name");
    const ok = tacTideAddBuff({ type: 'custom', key: '', name, mult: 1 + pct / 100, duration: dur });
    if (ok) {
      tacTideBuffName.value = '';
      tacTideBuffPct.value = '';
      tacTideBuffDur.value = '';
      showToast(translate("application.buildTacSpeedPanelThird", { name }));
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
    const key = armed ? 'ui.tacPath.cancelPick' : (A ? 'ui.tacPath.pickA' : 'ui.tacPath.pickB');
    btn.dataset.i18n = key;
    btn.textContent = translate(key);
    btn.classList.toggle('active', armed);
    const pt = tacPathState.points[which];
    if (armed) st.textContent = translate(A ? 'ui.tacPath.pickingA' : 'ui.tacPath.pickingB');
    else if (pt) st.textContent = translate(A ? 'ui.tacPath.selectedA' : 'ui.tacPath.selectedB',
      { x: Math.round(pt.x), y: Math.round(pt.z) });
    else st.textContent = translate(A ? 'ui.tacPath.noA' : 'ui.tacPath.noB');
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
    label.textContent = translate(A ? 'ui.tacPath.startLabelA' : 'ui.tacPath.endLabelB');
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
    fl.textContent = translate(A ? 'ui.tacPath.fixedLabelA' : 'ui.tacPath.fixedLabelB');
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
  tacPathRunBtn.dataset.i18n = 'ui.tacPath.run';
  tacPathRunBtn.textContent = translate('ui.tacPath.run');
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
  if (!a) { showToast(translate('ui.tacPath.pickingA')); return; }
  if (!b) { showToast(translate('ui.tacPath.pickingB')); return; }
  if (!navGridAvailable(S.currentMapId)) {
    tacPathSummary.textContent = translate('ui.tacPath.noGrid');
    syncTacPathResultBox();
    tacPathResultBoxEl.style.display = '';
    return;
  }
  tacPathClearResult();
  tacPathState.running = true;
  tacPathRunBtn.textContent = translate('ui.tacPath.running');
  tacPathProgressBox.style.display = '';
  tacPathProgressBar.style.width = '0%';
  try {
    const g = await loadNavGrid(S.currentMapId);
    if (!g) {
      tacPathSummary.textContent = translate('ui.tacPath.noGrid');
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      return;
    }
    const profile = readTacPathProfile();
    const showResult = (result, sA, sB, totalSeconds, totalMeters, fixed = null) => {
      tacPathState.cache = { g, result, sA, sB, profile, totalSeconds, totalMeters, fixed };
      renderTacPathOverlay(g, result, sA, sB);
      tacPathState.resultMapId = S.currentMapId;
      tacPathSummary.textContent = translate('ui.tacPath.summary', {
        dist: totalMeters.toFixed(1),
        seconds: totalSeconds.toFixed(1),
      });
      // 起终点修正说明行：修正发生的端点各一行
      const fixLines = [];
      for (const which of ['a', 'b']) {
        const fx = fixed?.[which];
        if (!fx) continue;
        fixLines.push(translate('ui.tacPath.fixNote', {
          name: translate(which === 'a' ? 'ui.tacPath.startLabelA' : 'ui.tacPath.endLabelB'),
          fx: Math.round(fx.from.x), fy: Math.round(fx.from.z),
          tx: Math.round(fx.to.x), ty: Math.round(fx.to.z),
        }));
      }
      tacPathFixNote.textContent = fixLines.join('\n');
      tacPathFixNote.style.display = fixLines.length ? '' : 'none';
      renderTacPathPoints();
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      tacPathNote.dataset.i18n = 'ui.tacPath.note';
      tacPathNote.textContent = translate('ui.tacPath.note');
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
      tacPathSummary.textContent = translate('ui.tacPath.unsupportedA');
      syncTacPathResultBox();
      tacPathResultBoxEl.style.display = '';
      return;
    }
    const sB = snapEndpoint('b', b);
    if (!sB) {
      tacPathSummary.textContent = translate('ui.tacPath.unsupportedB');
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
      tacPathSummary.textContent = translate('ui.tacPath.unreachable');
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
    tacPathRunBtn.dataset.i18n = 'ui.tacPath.run';
    tacPathRunBtn.textContent = translate('ui.tacPath.run');
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
  tacPathResultToggleEl.textContent = translate('application.buildTacSpeedPanelFifth', { value: tacPathResultOpen ? '▾' : '▸' });
  tacPathResultBodyEl.style.display = tacPathResultOpen ? '' : 'none';
}
let tacPathSettingsOpen = false;
function syncTacPathSettingsBox() {
  tacPathSettingsToggleEl.textContent = translate('ui.tacPath.settingsToggleFmt', { value: tacPathSettingsOpen ? '▾' : '▸' });
  tacPathSettingsBodyEl.style.display = tacPathSettingsOpen ? '' : 'none';
}

/* ---- 移速设置区（私有状态，结构与测算卡片速度设置区对齐，含双阵营） ---- */

// 基础移速下拉：求生者=姿态+角色移速+固定移速+自定义；监管者=角色（含双形态）+自定义
function buildTacPathRoleOptions() {
  if (tacPathState.camp === 'survivor') {
    let opts = Object.entries(TAC_MOVEMENT_SURVIVOR.states).map(([k, st]) =>
      `<option value="${k}">${st.name} ${st.speed}m/s</option>`).join('');
    opts += translate("application.tacBuildRoleOptions");
    opts += translate("application.tacBuildRoleOptionsAlternate");
    tacPathSpeedRoleEl.innerHTML = opts + translate("application.tacBuildRoleOptionsThird");
    tacPathSpeedRoleEl.value = 'run';
    return;
  }
  let opts = '';
  for (const [key, def] of Object.entries(TAC_ROLES)) {
    if (def.camp !== 'hunter') continue;
    const sp0 = (def.speed != null && typeof def.speed === 'object')
      ? Object.values(def.speed)[0] : def.speed;
    opts += sp0
      ? translate("application.tacBuildRoleOptionsFourth", { key, value: key === 'hellEmber' ? ' selected' : '', name: def.name, sp0 })
      : translate("application.tacBuildRoleOptionsFifth", { key, name: def.name });
  }
  tacPathSpeedRoleEl.innerHTML = opts + translate("application.tacBuildRoleOptionsThird");
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
        translate("application.syncTacSpeedForm", { index: i, name: f.name, speed: f.speed })).join('');
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
    return { name: translate("application.name"), speed, camp, role: null, form: 0, stKey: 'custom' };
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
  tacPathBaseDetailToggleEl.textContent = translate("application.renderTacBaseDetail", { value: tacPathBaseDetailOpen ? '▾' : '▸' });
  tacPathBaseDetailBodyEl.style.display = tacPathBaseDetailOpen ? '' : 'none';
  if (!tacPathBaseDetailOpen) return;
  const b = tacPathState.base;
  tacPathBaseDetailBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th>${translate('ui.tacPath.baseColName')}</th>`
    + `<th>${translate('ui.tacPath.baseColSpeed')}</th></tr></thead><tbody>`
    + `<tr><td>${b.name}</td><td class="tac-col-speed"><b>${Math.round(b.speed * 100) / 100}</b></td></tr></tbody></table>`;
}

// 加成明细表（默认展开）：加成 / 加成值 / 时长 / 删除
let tacPathBuffOpen = true;
function renderTacPathBuffs() {
  tacPathBuffToggleEl.textContent = translate('application.renderTacBuffDetail', { value: tacPathBuffOpen ? '▾' : '▸' });
  tacPathBuffBodyEl.style.display = tacPathBuffOpen ? '' : 'none';
  if (!tacPathBuffOpen) return;
  const pct = (v) => `${Math.round((v - 1) * 1000) / 10}%`;
  const rows = tacPathState.buffs.map((b) => ({
    id: b.id,
    name: b.name,
    value: pct(b.mult) + (b.postMult ? translate("application.descThird") : ''),
    duration: b.duration ? `${b.duration}s` : translate("application.descAlternate"),
  }));
  if (!rows.length) {
    tacPathBuffBodyEl.innerHTML = `<div class="tac-detail-empty">${translate('application.renderTacBuffDetailSixth')}</div>`;
    return;
  }
  tacPathBuffBodyEl.innerHTML = `<table class="tac-detail-tbl"><thead><tr>`
    + `<th class="tac-cb-name">${translate('ui.tacPath.buffColName')}</th>`
    + `<th class="tac-cb-value">${translate('ui.tacPath.buffColValue')}</th>`
    + `<th>${translate('ui.tacPath.buffColDuration')}</th>`
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
    showToast(translate("application.tacAddBuffEntry"));
    return false;
  }
  // 姿态/角色/形态匹配校验（与测算 tacBuffAppliesToBase 同规则，双阵营通用）
  if (!tacBuffAppliesToBase(rows[0], tacPathState.base)) {
    const st = tacStateOf(tacPathState.base);
    showToast(translate("application.tacAddBuffEntryAlternate", { name: TAC_MOVEMENT_SURVIVOR.stateNames[st] || st }));
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
        + translate("application.desc", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"))
      : `${Math.round((t.mult - 1) * 100)}%${t.postMult ? translate("application.descThird") : ''}`
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"));
    if (t.states) {
      desc += translate("application.buildTacTraitList", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    if (t.forms) {
      // 按 forms 索引取该角色速度形态名：如摄魂 forms:[0]→谢必安
      const roleDef = Object.values(TAC_ROLES).find((r) => r.name === t.role);
      const formNames = roleDef && typeof roleDef.speed === 'object'
        ? t.forms.map((fi) => Object.keys(roleDef.speed)[fi]).filter(Boolean).join('/')
        : '';
      desc += t.key === 'windWings' ? translate("application.buildTacTraitListAlternate")
        : translate("application.buildTacTraitListFifth", { name: formNames });
    }
    const lv = t.levels
      ? `<select data-tlv="${t.key}">`
        + t.levels.map((_, i) =>
          `<option value="${i}"${i === t.levels.length - 1 ? ' selected' : ''}>${tacLevelLabel(t.key, i)}</option>`).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.role} · ${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + translate("application.buildTacTraitListFourth", { key: t.key });
  }).join('');
}

function buildTacPathTalentList() {
  const rows = Object.entries(TAC_MOVEMENT_BUFFS.talent)
    .filter(([, b]) => !b.camp || b.camp === tacPathState.camp);
  tacPathTalentList.innerHTML = rows.map(([k, b]) => {
    let desc = b.levels
      ? `${b.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: b.levels.length }) + (b.duration ? ` ${b.duration}s` : translate("application.descAlternate"))
      : `${Math.round((b.mult - 1) * 100)}%` + (b.duration ? ` ${b.duration}s` : translate("application.descAlternate"));
    const lv = b.levels
      ? `<select data-lv="${k}">`
        + b.levels.map((_, i) =>
          translate("application.lv", { index: i, count: i === b.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
        + '</select>'
      : '';
    if (b.states) {
      desc += translate("application.buildTacTraitList", { name: b.states.map((k2) => (TAC_MOVEMENT_SURVIVOR.states[k2] || {}).name || k2).join('/') });
    }
    return `<div class="tac-talent-row"><span class="tac-talent-name">${b.name}`
      + `<small>${desc}${b.extra ? translate("application.buildTacTalentList", { name: b.extra.name }) : ''}</small></span>${lv}`
      + translate("application.buildTacTalentListAlternate", { key: k });
  }).join('');
}

function buildTacPathOtherList() {
  const rows = TAC_MOVEMENT_BUFFS.other[tacPathState.camp] || [];
  tacPathOtherList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"))
      : `${Math.round((t.mult - 1) * 100)}%`
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"));
    if (t.states) {
      desc += translate("application.buildTacTraitList", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    const lv = t.levels
      ? `<select data-olv="${t.key}">`
        + t.levels.map((_, i) =>
          translate("application.lv", { index: i + 1, count: i === t.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + translate("application.buildTacOtherList", { key: t.key });
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
        showToast(translate("application.buildTacSpeedPanelAlternate"));
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
      showToast(translate("application.buildTacSpeedPanelThird", { name: entry.name }));
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
    const name = def.levels ? translate("application.nameThird", { name: def.name, value: lv + 1 }) : def.name;
    const entry = { type: 'talent', key: k, name, mult, duration: def.duration || 0 };
    if (def.extra) entry.extra = { name: def.extra.name, mult: def.extra.mult, duration: 0 };
    tacPathTalentModal.style.display = 'none';
    if (tacPathAddBuff(entry)) {
      showToast(translate("application.buildTacSpeedPanelThird", { name }));
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
    const name = def.levels ? translate("application.nameThird", { name: def.name, value: lv + 1 }) : def.name;
    const entry = {
      type: 'other', key: def.key, name,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    tacPathOtherModal.style.display = 'none';
    if (tacPathAddBuff(entry)) {
      showToast(translate("application.buildTacSpeedPanelThird", { name }));
      renderTacPathBuffs();
    }
  });

  tacPathBuffOk.addEventListener('click', () => {
    const pct = parseFloat(tacPathBuffPct.value);
    tacPathBuffModal.style.display = 'none';
    if (!pct) { showToast(translate("application.buildTacSpeedPanelFourth")); return; }
    const dur = parseFloat(tacPathBuffDur.value) || 0;
    const name = (tacPathBuffName.value || '').trim() || translate("application.name");
    const ok = tacPathAddBuff({ type: 'custom', key: '', name, mult: 1 + pct / 100, duration: dur });
    if (ok) {
      tacPathBuffName.value = '';
      tacPathBuffPct.value = '';
      tacPathBuffDur.value = '';
      showToast(translate("application.buildTacSpeedPanelThird", { name }));
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

buildTacCarryCard();
buildTacPathCard();


let tacResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(tacResizeTimer);
  tacResizeTimer = setTimeout(() => {
    renderTacCiphers();
    renderTacLandmarks();
    renderTacBoard();
  }, 150);
});


tacDoorLockEl.addEventListener('change', () => {
  tacDisplay.doorLock = tacDoorLockEl.checked;
  renderTacLandmarks();
  tacSave();
});


tacSnapCipherEl.addEventListener('change', () => {
  tacDisplay.snap.cipher = tacSnapCipherEl.checked;
  tacSave();
});

tacSnapDungeonEl.addEventListener('change', () => {
  tacDisplay.snap.dungeon = tacSnapDungeonEl.checked;
  tacSave();
});

tacSnapDoorEl.addEventListener('change', () => {
  tacDisplay.snap.door = tacSnapDoorEl.checked;
  tacSave();
});

tacSnapChairEl.addEventListener('change', () => {
  tacDisplay.snap.chair = tacSnapChairEl.checked;
  tacSave();
});

tacSnapBoxEl.addEventListener('change', () => {
  tacDisplay.snap.box = tacSnapBoxEl.checked;
  tacSave();
});

tacSnapPointEl.addEventListener('change', () => {
  tacDisplay.snap.point = tacSnapPointEl.checked;
  tacSave();
});


tacDelSegOnlyEl.addEventListener('change', () => {
  tacDisplay.delSegOnly = tacDelSegOnlyEl.checked;
  tacSave();
});


tacShowCoordsEl.addEventListener('change', () => {
  tacDisplay.showCoords = tacShowCoordsEl.checked;
  tacUpdateCoordsTip(null);
  tacSave();
});


tacSelGlowEl.addEventListener('change', () => {
  tacDisplay.selGlow = tacSelGlowEl.checked;
  renderTacBoard();
  tacSave();
});


tacHideEndpointsEl.addEventListener('change', () => {
  tacDisplay.hideEndpoints = tacHideEndpointsEl.checked;
  renderTacBoard();
  tacSave();
});

$('tacDispCipherPrev').addEventListener('click', () => switchTacCipher(-1));

$('tacDispCipherNext').addEventListener('click', () => switchTacCipher(1));

$('tacDungeonPrev').addEventListener('click', () => switchTacDungeon(-1));

$('tacDungeonNext').addEventListener('click', () => switchTacDungeon(1));

$('tacSpawnPrev').addEventListener('click', () => switchTacSpawn(-1));

$('tacSpawnNext').addEventListener('click', () => switchTacSpawn(1));

$('tacChairPrev').addEventListener('click', () => switchTacChair(-1));

$('tacChairNext').addEventListener('click', () => switchTacChair(1));

$('tacBasementPrev').addEventListener('click', () => switchTacBasement(-1));

$('tacBasementNext').addEventListener('click', () => switchTacBasement(1));


if (tacPersisted && tacPersisted.display) {
  const sd = tacPersisted.display;
  Object.assign(tacDisplay, sd);
  tacDisplay.snap = Object.assign({ cipher: true, dungeon: true, door: true, chair: true, box: true, point: true }, sd.snap || {});
}

if (tacPersisted && tacPersisted.mstyle) {
  if (tacPersisted.mstyle.single) Object.assign(tacMeasureStyle.single, tacPersisted.mstyle.single);
  if (tacPersisted.mstyle.chain) Object.assign(tacMeasureStyle.chain, tacPersisted.mstyle.chain);
}

syncTacDisplayUI();


export function arrowNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;
  const headLen = Math.min(a.width * 4.2, len * 0.8);
  const headW = a.width * 3;
  const bx = x2 - ux * headLen, by = y2 - uy * headLen;

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'line');
  hit.setAttribute('x1', x1); hit.setAttribute('y1', y1);
  hit.setAttribute('x2', x2); hit.setAttribute('y2', y2);
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const line = document.createElementNS(TAC_SVG_NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', bx); line.setAttribute('y2', by);
  line.setAttribute('stroke', a.color);
  line.setAttribute('stroke-width', a.width);
  line.setAttribute('stroke-linecap', 'round');

  const head = document.createElementNS(TAC_SVG_NS, 'polygon');
  head.setAttribute('points',
    `${x2},${y2} ${bx + px * headW / 2},${by + py * headW / 2} `
    + `${bx - px * headW / 2},${by - py * headW / 2}`);
  head.setAttribute('fill', a.color);

  g.append(hit, line, head);
  return g;
}


export function circleNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  const rx = Math.abs(x2 - x1) / 2, ry = Math.abs(y2 - y1) / 2;

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'ellipse');
  hit.setAttribute('cx', cx); hit.setAttribute('cy', cy);
  hit.setAttribute('rx', rx); hit.setAttribute('ry', ry);
  hit.setAttribute('fill', 'none');
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const ring = document.createElementNS(TAC_SVG_NS, 'ellipse');
  ring.setAttribute('cx', cx); ring.setAttribute('cy', cy);
  ring.setAttribute('rx', rx); ring.setAttribute('ry', ry);
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', a.color);
  ring.setAttribute('stroke-width', a.width);
  ring.setAttribute('stroke-dasharray', `${a.width * 3} ${a.width * 2}`);

  g.append(hit, ring);
  return g;
}


export function rectNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'rect');
  hit.setAttribute('x', x); hit.setAttribute('y', y);
  hit.setAttribute('width', w); hit.setAttribute('height', h);
  hit.setAttribute('fill', 'none');
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const box = document.createElementNS(TAC_SVG_NS, 'rect');
  box.setAttribute('x', x); box.setAttribute('y', y);
  box.setAttribute('width', w); box.setAttribute('height', h);
  box.setAttribute('fill', 'none');
  box.setAttribute('stroke', a.color);
  box.setAttribute('stroke-width', a.width);
  box.setAttribute('stroke-dasharray', `${a.width * 3} ${a.width * 2}`);

  g.append(hit, box);
  return g;
}


export function shapeNode(a, W, H, idx) {
  if (a.shape === 'circle') return circleNode(a, W, H, idx);
  if (a.shape === 'rect') return rectNode(a, W, H, idx);
  return arrowNode(a, W, H, idx);
}


export function tacMeasureLen(m) {
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  return { units: Math.hypot((m.x2 - m.x1) * dw, (m.y2 - m.y1) * dh), dw };
}


export function tacMeasureText(m) {
  const { units, dw } = tacMeasureLen(m);
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  return widthM ? `${(units / dw * widthM).toFixed(1)}m` : units.toFixed(1);
}


// ———— 连线系统 ————
// 同种两两相连（移行/音符/雕像）：linkIid 双向引用（仅这类道具有 linkMaxM）
export function tacSameLinkable(def) {
  return !!def && def.render === 'link';
}

// 异造物相连（镇魂伞→宿伞之魂等）：道具 linkTid 指向角色实例
export function tacLinkPartner(it) {
  if (!it || it.linkIid == null) return null;
  return tacItemByIid(it.linkIid);
}

export function tacLinkTokenOf(it) {
  if (!it || it.linkTid == null) return null;
  return tacTokenByTid(it.linkTid);
}

function tacTokenLinkedItems(t) {
  return tacBoard().items.filter((it) => it.linkTid === t.tid);
}


// 击球点链式连线：board.hpEdges = [{ a: iid, b: iid, close }]
// 链式生长：新点连最近一个「允许连线且未封闭」的点；第 3 个开放点可用提前闭合，
// 第 4 个开放点自动与最早的开放点闭合；封闭边无距离限制
const TAC_HP_KIND = 'contactPoint';
const TAC_HP_MIN_M = 4;
const TAC_HP_MAX_M = 35;

function tacHpItems() {
  return tacBoard().items.filter((it) => it.kind === TAC_HP_KIND);
}

function tacHpEdges() {
  const b = tacBoard();
  b.hpEdges ||= [];
  return b.hpEdges;
}

// 与某击球点相连的对端：普通边 / 封闭边分开返回
function tacHpPeers(it) {
  const reg = [];
  const close = [];
  for (const e of tacHpEdges()) {
    const other = e.a === it.iid ? e.b : (e.b === it.iid ? e.a : null);
    if (other == null) continue;
    const o = tacItemByIid(other);
    if (!o) continue;
    (e.close ? close : reg).push(o);
  }
  return { reg, close };
}

// 通过连线边得到的相连组件（共享按钮 / 一起删除的范围）
function tacHpComponent(it) {
  const seen = new Set([it.iid]);
  const queue = [it.iid];
  while (queue.length) {
    const cur = queue.pop();
    for (const e of tacHpEdges()) {
      const other = e.a === cur ? e.b : (e.b === cur ? e.a : null);
      if (other != null && !seen.has(other)) { seen.add(other); queue.push(other); }
    }
  }
  return tacHpItems().filter((o) => seen.has(o.iid));
}

// 开放点按加入链的顺序（hpSeq）排序：重新勾选允许连线后加入顺序优先于创建顺序
function tacHpOpenItems() {
  return tacHpItems().filter((o) => o.linkAuto !== false && !o.hpClosed)
    .sort((x, y) => (x.hpSeq || 0) - (y.hpSeq || 0) || x.iid - y.iid);
}

function tacHpComponentOpen(comp) {
  return comp.filter((o) => o.linkAuto !== false && !o.hpClosed)
    .sort((x, y) => (x.hpSeq || 0) - (y.hpSeq || 0) || x.iid - y.iid);
}

// 闭合本组件：最新开放点与最早开放点连成封闭边，组件全部转为封闭态
function tacHpCloseShape(item) {
  const opens = tacHpComponentOpen(tacHpComponent(item));
  if (opens.length < 3) return false;
  const newest = opens[opens.length - 1];
  const earliest = opens[0];
  tacHpEdges().push({ a: newest.iid, b: earliest.iid, close: true });
  opens.forEach((o) => { o.hpClosed = true; });
  return true;
}

// 击球点位置钳制：普通相连边距离限制 4-35m，封闭边无限制
function tacHpClampPos(item, x, y) {
  const map = MAPS_DATA[S.currentMapId];
  const widthM = map && map.widthM;
  const size = map && map.mapSize;
  if (!widthM || !size) return { x, y };
  const [dw, dh] = size;
  const minU = TAC_HP_MIN_M / widthM * dw;
  const maxU = TAC_HP_MAX_M / widthM * dw;
  let px = x;
  let py = y;
  for (const e of tacHpEdges()) {
    if (e.close) continue;
    if (e.a !== item.iid && e.b !== item.iid) continue;
    const o = tacItemByIid(e.a === item.iid ? e.b : e.a);
    if (!o) continue;
    const ux = (px - o.x) * dw;
    const uy = (py - o.y) * dh;
    const units = Math.hypot(ux, uy);
    if (units < 1e-9) {
      // 与对端重合：向右侧推出最小距离
      px = o.x + minU / dw;
      continue;
    }
    if (units < minU || units > maxU) {
      const k = Math.min(Math.max(units, minU), maxU) / units;
      px = o.x + (px - o.x) * k;
      py = o.y + (py - o.y) * k;
    }
  }
  return { x: px, y: py };
}

// 击球点加入链（创建 / 勾选允许连线）：连最近加入的开放点；开放数达 4 自动闭合
function tacHpJoin(item) {
  const b = tacBoard();
  item.hpSeq = (b.hpSeq = (b.hpSeq || 0) + 1);
  const mates = tacHpOpenItems().filter((o) => o !== item);
  if (mates.length) {
    const latest = mates[mates.length - 1];
    tacHpEdges().push({ a: item.iid, b: latest.iid, close: false });
    // 相连瞬间显示连线打勾（两端共享）
    item.linkShow = true;
    latest.linkShow = true;
    // 保证与相连点距离不少于 4m 不超过 35m
    const cl = tacHpClampPos(item, item.x, item.y);
    item.x = cl.x;
    item.y = cl.y;
  }
  const opens = tacHpComponentOpen(tacHpComponent(item));
  if (opens.length >= 4) tacHpCloseShape(item);
}

// 取消允许连线：组件内全部取消允许连线、解除连线、恢复未封闭态
function tacHpDissolve(item) {
  const comp = tacHpComponent(item);
  const ids = new Set(comp.map((o) => o.iid));
  const b = tacBoard();
  b.hpEdges = tacHpEdges().filter((e) => !(ids.has(e.a) && ids.has(e.b)));
  comp.forEach((o) => { o.linkAuto = false; o.hpClosed = false; delete o.hpSeq; });
}

function tacSetSameLink(a, b) {
  a.linkIid = b.iid;
  b.linkIid = a.iid;
  // 显示连线共享：相连瞬间任一端打勾则两端打勾，都未勾则保持未勾
  const show = a.linkShow !== false || b.linkShow !== false;
  a.linkShow = show;
  b.linkShow = show;
}

// 解除水镜/渔猎的专属状态（镜像造物、模拟水渊），供相连与解除相连共用
function tacClearMirrorState(aq) {
  if (!aq || aq.kind !== 'aquaMirror') return;
  aq.showMirror = false;
  aq.fixedMirror = false;
  delete aq.mirrorAxis;
  const b = tacBoard();
  for (let i = b.items.length - 1; i >= 0; i -= 1) {
    if (b.items[i].kind === 'mirrorImage'
      && (b.items[i].aqIid == null || b.items[i].aqIid === aq.iid)) {
      b.items.splice(i, 1);
    }
  }
}

function tacClearAbyss(sp) {
  if (sp && sp.kind === 'spearfishing') delete sp.abyss;
}

// 异造物相连：写入 linkTid 并同步显示连线共享；水镜相连时重置镜像状态，渔猎相连时关闭模拟水渊
function tacSetCrossLink(item, token) {
  item.linkTid = token.tid;
  const show = item.linkShow !== false || token.linkShow !== false;
  item.linkShow = show;
  token.linkShow = show;
  if (item.kind === 'aquaMirror') tacClearMirrorState(item);
  if (item.kind === 'spearfishing') tacClearAbyss(item);
}

function tacClearSameLink(it) {
  const p = tacLinkPartner(it);
  if (p) delete p.linkIid;
  delete it.linkIid;
}

// 创建道具后自动连线：只连最早创建的一个未连线且勾选自动连线的同类造物（两两相连）
export function tacAutoLinkItem(item) {
  const def = TAC_ITEM_TYPES[item.kind];
  if (!def) return;
  if (tacSameLinkable(def)) {
    const mate = tacBoard().items.find((o) => o !== item && o.kind === item.kind
      && o.linkIid == null && o.linkAuto !== false);
    if (mate) tacSetSameLink(item, mate);
  } else if (def.linkToRole) {
    const mate = tacBoard().tokens.find((t) => t.role === def.linkToRole
      && t.linkAuto !== false && !tacTokenLinkedItems(t).length);
    if (mate) tacSetCrossLink(item, mate);
  } else if (item.kind === TAC_HP_KIND) {
    tacHpJoin(item);
  }
}

// 创建角色后自动连线：最早创建的未连线且勾选自动连线的对应道具
export function tacAutoLinkToken(token) {
  const item = tacBoard().items.find((it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    return def && def.linkToRole === token.role
      && it.linkTid == null && it.linkAuto !== false;
  });
  if (item) tacSetCrossLink(item, token);
}

// 解除道具连线并按规则补连（删除道具 / 取消自动连线时）
export function tacBreakItemLink(item, relink = true) {
  const def = TAC_ITEM_TYPES[item.kind];
  if (!def) return;
  if (tacSameLinkable(def)) {
    const p = tacLinkPartner(item);
    tacClearSameLink(item);
    if (relink && p) {
      const mate = tacBoard().items.find((o) => o !== p && o.kind === p.kind
        && o.linkIid == null && o.linkAuto !== false);
      if (mate) tacSetSameLink(p, mate);
    }
  } else if (def.linkToRole) {
    const tk = tacLinkTokenOf(item);
    delete item.linkTid;
    tacClearMirrorState(item);
    tacClearAbyss(item);
    if (relink && tk) tacAutoLinkToken(tk);
  }
}

// 角色删除 / 取消自动连线时：其相连道具改连其它未连线且勾选自动连线的同类角色
export function tacBreakTokenLinks(token, relink = true) {
  for (const it of [...tacTokenLinkedItems(token)]) {
    delete it.linkTid;
    tacClearMirrorState(it);
    tacClearAbyss(it);
    if (!relink) continue;
    const def = TAC_ITEM_TYPES[it.kind];
    const mate = def && tacBoard().tokens.find((t) => t !== token
      && t.role === def.linkToRole && t.linkAuto !== false
      && !tacTokenLinkedItems(t).length);
    if (mate) tacSetCrossLink(it, mate);
  }
}



export function tacClampLinkPos(idx, x, y) {
  const it = tacBoard().items[idx];
  const def = it && TAC_ITEM_TYPES[it.kind];
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!def || !def.linkMaxM || !widthM) return { x, y };
  const partner = tacLinkPartner(it);
  if (!partner) return { x, y };
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  const ux = (x - partner.x) * dw, uy = (y - partner.y) * dh;
  const units = Math.hypot(ux, uy);
  const maxUnits = def.linkMaxM / widthM * dw; 
  if (units <= maxUnits || units < 1e-9) return { x, y };
  const k = maxUnits / units;
  return { x: partner.x + (x - partner.x) * k, y: partner.y + (y - partner.y) * k };
}




export function tacClampRoleLinkPos(idx, x, y) {
  const it = tacBoard().items[idx];
  const def = it && TAC_ITEM_TYPES[it.kind];
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!def || !def.linkToRole || !def.linkMaxM || !widthM) return { x, y };
  const tk = tacLinkTokenOf(it);
  if (!tk) return { x, y };
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  const ux = (x - tk.x) * dw, uy = (y - tk.y) * dh;
  const units = Math.hypot(ux, uy);
  const maxUnits = def.linkMaxM / widthM * dw;
  if (units <= maxUnits || units < 1e-9) return { x, y };
  const k = maxUnits / units;
  return { x: tk.x + (x - tk.x) * k, y: tk.y + (y - tk.y) * k };
}



export function tacClampTokenToLinkedItems(t, x, y) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!widthM || !t) return { x, y };
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  let cx = x, cy = y;
  for (const it of tacTokenLinkedItems(t)) {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def || !def.linkMaxM) continue;
    const ux = (cx - it.x) * dw, uy = (cy - it.y) * dh;
    const units = Math.hypot(ux, uy);
    const maxUnits = def.linkMaxM / widthM * dw;
    if (units > maxUnits && units > 1e-9) {
      const k = maxUnits / units;
      cx = it.x + (cx - it.x) * k;
      cy = it.y + (cy - it.y) * k;
    }
  }
  return { x: cx, y: cy };
}


export function tacMeasureSegColor(m) {
  return m.color || TAC_MEASURE_DEFAULT[m.chain != null ? 'chain' : 'single'].color;
}


export function tacMirrorParts(aq = null) {
  const board = tacBoard();
  aq = aq || board.items.find((it) => it.kind === 'aquaMirror') || null;
  const bq = (aq && aq.linkTid != null
    ? board.tokens.find((t) => t.tid === aq.linkTid) : null) || null;
  if (!aq || !bq) return null;
  const miIdx = board.items.findIndex((it) => it.kind === 'mirrorImage'
    && (it.aqIid == null || it.aqIid === aq.iid));
  return { bq, aq, mi: miIdx >= 0 ? board.items[miIdx] : null, miIdx };
}


export function tacSyncMirror(moved = null, targetAq = null) {
  const board = tacBoard();
  const parts = tacMirrorParts(targetAq);
  if (!parts) return false;
  const { bq, aq } = parts;
  let { mi, miIdx } = parts;
  const clamp01 = (v) => Math.min(0.995, Math.max(0.005, v));
  let changed = false;

  if (!aq || !aq.showMirror) {
    if (miIdx >= 0) { board.items.splice(miIdx, 1); changed = true; }
    if (aq) delete aq.mirrorAxis;
    return changed;
  }

  const W = tacMapWrap.clientWidth || 1;
  const H = tacMapWrap.clientHeight || 1;
  if (!mi) {
    mi = {
      iid: ++board.itemSeq,
      role: 'bloodyQueen', kind: 'mirrorImage',
      aqIid: aq.iid,
      x: clamp01(2 * aq.x - bq.x), y: clamp01(2 * aq.y - bq.y),
    };
    board.items.push(mi);
    changed = true;
    return changed;
  }

  if (aq.fixedMirror) {
    if (!aq.mirrorAxis) {
      const dx = (bq.x - aq.x) * W, dy = (bq.y - aq.y) * H;
      const len = Math.hypot(dx, dy) || 1;

      aq.mirrorAxis = { x: aq.x, y: aq.y, nx: dx / len, ny: dy / len };
      changed = true;
    }
    const ax = aq.mirrorAxis.x * W, ay = aq.mirrorAxis.y * H;
    const reflect = (q) => {
      const px = q.x * W, py = q.y * H;
      const dot = (px - ax) * aq.mirrorAxis.nx + (py - ay) * aq.mirrorAxis.ny;
      return { x: (px - 2 * dot * aq.mirrorAxis.nx) / W, y: (py - 2 * dot * aq.mirrorAxis.ny) / H };
    };
    if (moved === 'bq') {
      const r = reflect(bq);
      mi.x = clamp01(r.x); mi.y = clamp01(r.y); changed = true;
    } else if (moved === 'mi') {
      const r = reflect(mi);
      bq.x = clamp01(r.x); bq.y = clamp01(r.y); changed = true;
    }
    return changed;
  }

  delete aq.mirrorAxis;
  if (moved === 'mi') {
    aq.x = clamp01((bq.x + mi.x) / 2);
    aq.y = clamp01((bq.y + mi.y) / 2);
    changed = true;
  } else {
    mi.x = clamp01(2 * aq.x - bq.x);
    mi.y = clamp01(2 * aq.y - bq.y);
    changed = true;
  }
  return changed;
}


function tacSyncMirrorEl(kind, refItem = null) {
  const b = tacBoard();
  let i2 = -1;
  if (refItem) i2 = b.items.indexOf(refItem);
  else i2 = b.items.findIndex((o) => o.kind === kind);
  const o2 = i2 >= 0 ? b.items[i2] : null;
  if (!o2) return;
  // 该造物的所有范围圈/图标都要一起移动（镜像可同时显示三个范围）
  tacMapWrap.querySelectorAll(
    `.tac-item-circle[data-idx="${i2}"], .tac-item-pin[data-idx="${i2}"]`)
    .forEach((el2) => { el2.style.left = `${o2.x * 100}%`; el2.style.top = `${o2.y * 100}%`; });
}


function tacOnItemRemoved(removed) {
  if (!removed) return;
  tacBreakItemLink(removed, true);
  if (removed.kind === TAC_HP_KIND) {
    const b = tacBoard();
    if (removed.hpClosed) {
      const comp = tacHpComponent(removed);
      const ids = new Set(comp.map((o) => o.iid));
      ids.add(removed.iid);
      b.hpEdges = (b.hpEdges || []).filter((e) => !(ids.has(e.a) && ids.has(e.b)));
      for (let i = b.items.length - 1; i >= 0; i -= 1) {
        if (b.items[i] !== removed && ids.has(b.items[i].iid)) b.items.splice(i, 1);
      }
    } else {
      b.hpEdges = (b.hpEdges || []).filter((e) => e.a !== removed.iid && e.b !== removed.iid);
    }
  }
  if (removed.kind === 'mirrorImage') {
    const aq = (removed.aqIid != null && tacItemByIid(removed.aqIid))
      || tacBoard().items.find((it) => it.kind === 'aquaMirror');
    if (aq && aq.showMirror) {
      aq.showMirror = false;
      aq.fixedMirror = false;
      delete aq.mirrorAxis;
      tacSave();
    }
  }
  if (removed.kind === 'aquaMirror') {
    for (let i = tacBoard().items.length - 1; i >= 0; i -= 1) {
      if (tacBoard().items[i].kind === 'mirrorImage') tacBoard().items.splice(i, 1);
    }
  }
}


export function tacOnTokenRemoved(removed) {
  if (!removed) return;
  tacBreakTokenLinks(removed, true);
  if (removed.role === 'bloodyQueen') {
    const b = tacBoard();
    if (!b.tokens.some((t) => t.role === 'bloodyQueen')) {
      for (let i = b.items.length - 1; i >= 0; i -= 1) {
        if (b.items[i].kind === 'mirrorImage') b.items.splice(i, 1);
      }
    }
    b.items.filter((it) => it.kind === 'aquaMirror' && it.linkTid != null)
      .forEach((aq) => tacSyncMirror(null, aq));
  }
}


export function tacShadeColor(hex, f) {
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


export function tacBuffSegColor(segColor, pct) {
  const k = Math.min(1, Math.abs(pct) / 120);
  return pct > 0
    ? tacShadeColor(segColor, 1 + 0.25 + 0.35 * k)
    : tacShadeColor(segColor, 1 - (0.25 + 0.35 * k));
}






export function measureNode(m, W, H, idx, chain, sel) {
  const x1 = m.x1 * W, y1 = m.y1 * H;
  const x2 = m.x2 * W, y2 = m.y2 * H;
  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.midx = idx;

  const segWidth = m.width || TAC_MEASURE_DEFAULT[chain ? 'chain' : 'single'].width;

  const hit = document.createElementNS(TAC_SVG_NS, 'line');
  hit.setAttribute('x1', x1); hit.setAttribute('y1', y1);
  hit.setAttribute('x2', x2); hit.setAttribute('y2', y2);
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, segWidth * 4));

  const segColor = tacMeasureSegColor(m);

  const line = document.createElementNS(TAC_SVG_NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', segColor);
  line.setAttribute('stroke-width', sel ? segWidth + 1 : segWidth);
  line.setAttribute('stroke-dasharray', `${segWidth * 8 / 3} ${segWidth * 2}`);
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('opacity', sel ? '1' : '0.7');

  
  
  const buffRanges = tacGreenSegs.get(m) || [];
  const greenLines = buffRanges.map(([f1, f2, pct]) => {
    const gl = document.createElementNS(TAC_SVG_NS, 'line');
    gl.setAttribute('x1', x1 + (x2 - x1) * f1);
    gl.setAttribute('y1', y1 + (y2 - y1) * f1);
    gl.setAttribute('x2', x1 + (x2 - x1) * f2);
    gl.setAttribute('y2', y1 + (y2 - y1) * f2);
    gl.setAttribute('stroke', tacBuffSegColor(segColor, pct));
    gl.setAttribute('stroke-width', sel ? segWidth + 1 : segWidth);
    gl.setAttribute('stroke-dasharray', `${segWidth * 8 / 3} ${segWidth * 2}`);
    gl.setAttribute('stroke-linecap', 'round');
    gl.setAttribute('opacity', sel ? '1' : '0.85');
    return gl;
  });

  if (chain) {
    g.append(hit, line, ...greenLines);
    return g;
  }

  
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const s = ((W / 2 - mx) * nx + (H / 2 - my) * ny) >= 0 ? 1 : -1;
  const text = document.createElementNS(TAC_SVG_NS, 'text');
  const tx = mx + nx * 14 * s, ty = my + ny * 14 * s;
  text.setAttribute('x', tx);
  text.setAttribute('y', ty);
  text.setAttribute('class', 'tac-measure-label');
  text.style.fill = segColor;
  tacUprightSvgText(text, tx, ty);
  text.textContent = tacMeasureText(m);

  g.append(hit, line, ...greenLines, text);
  return g;
}



export function chainTotalNode(segs, W, H, sel) {
  const lens = segs.map((m) =>
    Math.hypot((m.x2 - m.x1) * W, (m.y2 - m.y1) * H));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  
  let acc = 0, px = 0, py = 0, nx = 0, ny = 1;
  for (let i = 0; i < segs.length; i++) {
    const m = segs[i];
    if (acc + lens[i] >= total / 2) {
      const t = lens[i] ? (total / 2 - acc) / lens[i] : 0;
      const x1 = m.x1 * W, y1 = m.y1 * H, x2 = m.x2 * W, y2 = m.y2 * H;
      px = x1 + (x2 - x1) * t; py = y1 + (y2 - y1) * t;
      const l = lens[i] || 1;
      nx = -(y2 - y1) / l; ny = (x2 - x1) / l;
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
  text.textContent = widthM
    ? `${(units / dw * widthM).toFixed(1)}m` : units.toFixed(1);
  return text;
}


export function tacAbyssItem(tid = null) {
  return tacBoard().items.find((it) =>
    it.kind === 'spearfishing' && it.abyss && it.abyss.on
    && (tid == null || it.linkTid === tid)) || null;
}


export function tacAbyssMeters(a, b) {
  const map = MAPS_DATA[S.currentMapId];
  if (!map.widthM) return null;
  const [dw, dh] = map.mapSize;
  return Math.hypot((a.x - b.x) * dw, (a.y - b.y) * dh) / dw * map.widthM;
}


export function tacAbyssRecord(p, t) {
  const it = t ? tacAbyssItem(t.tid) : null;
  if (!it || !it.abyss.recording) return;
  const nt = t;
  const ab = it.abyss;
  const last = ab.trail[ab.trail.length - 1];
  if (last && Math.hypot((nt.x - last.x) * p.W, (nt.y - last.y) * p.H) < 5) return;
  ab.done = null; 
  const m = tacAbyssMeters(nt, it);
  if (m !== null && m > TAC_ABYSS_MAX_M) {
    const k = TAC_ABYSS_MAX_M / m;
    ab.trail.push({ x: it.x + (nt.x - it.x) * k, y: it.y + (nt.y - it.y) * k });
    ab.done = ab.trail.slice();
    ab.recording = false;
    renderTacArrows();
    return;
  }
  ab.trail.push({ x: nt.x, y: nt.y });
  renderTacArrows();
}


export function tacAbyssFinalize() {
  const it = tacBoard().items.find((o) => o.kind === 'spearfishing'
    && o.abyss && o.abyss.on && o.abyss.recording);
  if (!it) return;
  const ab = it.abyss;
  ab.recording = false;
  if (ab.trail.length >= 2) ab.done = ab.trail.slice();
  ab.trail = [];
  renderTacArrows();
}

export function renderTacArrows() {
  const W = tacRot.clientWidth || tacMapWrap.clientWidth;
  const H = tacRot.clientHeight || tacMapWrap.clientHeight;
  if (!W || !H) return;
  tacArrowSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  tacArrowSvg.innerHTML = '';
  
  
  // 同种连线（移行/音符/雕像）：按显式配对渲染；祭司通道等无 linkMaxM 的按创建顺序两两成对
  const seenPair = new Set();
  tacBoard().items.forEach((it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def || !tacSameLinkable(def)) return;
    if (it.linkIid == null || seenPair.has(it.iid) || it.linkShow === false) return;
    const partner = tacLinkPartner(it);
    seenPair.add(it.iid);
    if (!partner || seenPair.has(partner.iid) || partner.linkShow === false) return;
    seenPair.add(partner.iid);
    const line = document.createElementNS(TAC_SVG_NS, 'line');
    line.setAttribute('x1', it.x * W); line.setAttribute('y1', it.y * H);
    line.setAttribute('x2', partner.x * W); line.setAttribute('y2', partner.y * H);
    line.setAttribute('stroke', def.linkColor || def.color);
    line.setAttribute('stroke-width', def.linkWidth || 5);
    line.setAttribute('stroke-linecap', 'round');
    tacArrowSvg.appendChild(line);
  });


  // 击球点链式连线：普通边实线，封闭边虚线；显示连线由组件共享
  tacHpEdges().forEach((e) => {
    const a = tacItemByIid(e.a);
    const b = tacItemByIid(e.b);
    if (!a || !b || a.linkShow === false || b.linkShow === false) return;
    const line = document.createElementNS(TAC_SVG_NS, 'line');
    line.setAttribute('x1', a.x * W); line.setAttribute('y1', a.y * H);
    line.setAttribute('x2', b.x * W); line.setAttribute('y2', b.y * H);
    line.setAttribute('stroke', '#f8fafc');
    line.setAttribute('stroke-width', 2);
    line.setAttribute('stroke-linecap', 'round');
    if (e.close) line.setAttribute('stroke-dasharray', '8 6');
    tacArrowSvg.appendChild(line);
  });


  
  tacBoard().items.forEach((it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def || !def.linkToRole || it.kind === 'aquaMirror'
      || it.linkTid == null || it.linkShow === false) return;
    const tk = tacTokenByTid(it.linkTid);
    if (!tk || tk.linkShow === false) return;
    const line = document.createElementNS(TAC_SVG_NS, 'line');
    line.setAttribute('x1', tk.x * W); line.setAttribute('y1', tk.y * H);
    line.setAttribute('x2', it.x * W); line.setAttribute('y2', it.y * H);
    line.setAttribute('stroke', def.linkColor || def.color || '#f8fafc');
    line.setAttribute('stroke-width', def.linkWidth || 2);
    line.setAttribute('stroke-linecap', 'round');
    tacArrowSvg.appendChild(line);
  });


  {
    const drawLine = (a, b) => {
      const line = document.createElementNS(TAC_SVG_NS, 'line');
      line.setAttribute('x1', a.x * W); line.setAttribute('y1', a.y * H);
      line.setAttribute('x2', b.x * W); line.setAttribute('y2', b.y * H);
      line.setAttribute('stroke', '#7dd3fc');
      line.setAttribute('stroke-width', 2);
      line.setAttribute('stroke-linecap', 'round');
      tacArrowSvg.appendChild(line);
    };
    // 每一对相连的红夫人/水镜都画线（多对互不干扰）
    tacBoard().items.forEach((aq) => {
      if (aq.kind !== 'aquaMirror' || aq.linkTid == null || aq.linkShow === false) return;
      const tk = tacTokenByTid(aq.linkTid);
      if (!tk || tk.linkShow === false) return;
      drawLine(tk, aq);
      const mi = tacBoard().items.find((it) => it.kind === 'mirrorImage'
        && (it.aqIid == null || it.aqIid === aq.iid));
      if (mi) drawLine(mi, aq);
    });
  }


  tacBoard().items.forEach((it) => {
    const ab = it.abyss;
    if (it.kind !== 'spearfishing' || !ab || !ab.on) return;
    const nt = it.linkTid != null ? tacTokenByTid(it.linkTid) : null;
    if (!nt) return;
    const g = document.createElementNS(TAC_SVG_NS, 'g');
    g.setAttribute('pointer-events', 'none');
    const hx = it.x * W, hy = it.y * H;
    const toPx = (q) => `${(q.x * W).toFixed(1)},${(q.y * H).toFixed(1)}`;
    const live = ab.recording && ab.trail.length >= 2 ? ab.trail : null;
    if (ab.done && ab.done.length >= 2) {
      
      const poly = document.createElementNS(TAC_SVG_NS, 'polygon');
      poly.setAttribute('points', [`${hx},${hy}`, ...ab.done.map(toPx)].join(' '));
      poly.setAttribute('fill', 'rgba(125, 211, 252, 0.18)');
      poly.setAttribute('stroke', '#7dd3fc');
      poly.setAttribute('stroke-width', 2.5);
      poly.setAttribute('stroke-dasharray', '9 7');
      poly.setAttribute('stroke-linejoin', 'round');
      g.appendChild(poly);
      const cx = (hx + ab.done.reduce((s, q) => s + q.x * W, 0)) / (ab.done.length + 1);
      const cy = (hy + ab.done.reduce((s, q) => s + q.y * H, 0)) / (ab.done.length + 1);
      const label = document.createElementNS(TAC_SVG_NS, 'text');
      label.setAttribute('x', cx);
      label.setAttribute('y', cy);
      tacUprightSvgText(label, cx, cy);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('fill', '#bae6fd');
      label.setAttribute('font-size', 14);
      label.setAttribute('paint-order', 'stroke');
      label.setAttribute('stroke', 'rgba(15, 23, 42, 0.7)');
      label.setAttribute('stroke-width', 3);
      label.textContent = translate("application.renderTacArrows");
      g.appendChild(label);
    } else if (live) {
      
      const poly = document.createElementNS(TAC_SVG_NS, 'polygon');
      poly.setAttribute('points', [`${hx},${hy}`, ...live.map(toPx)].join(' '));
      poly.setAttribute('fill', 'rgba(125, 211, 252, 0.08)');
      poly.setAttribute('stroke', 'rgba(125, 211, 252, 0.65)');
      poly.setAttribute('stroke-width', 2);
      poly.setAttribute('stroke-dasharray', '6 6');
      poly.setAttribute('stroke-linejoin', 'round');
      g.appendChild(poly);
    } else {
      
      const line = document.createElementNS(TAC_SVG_NS, 'line');
      line.setAttribute('x1', hx);
      line.setAttribute('y1', hy);
      line.setAttribute('x2', nt.x * W);
      line.setAttribute('y2', nt.y * H);
      line.setAttribute('stroke', 'rgba(125, 211, 252, 0.8)');
      line.setAttribute('stroke-width', 2);
      line.setAttribute('stroke-dasharray', '6 6');
      g.appendChild(line);
    }
    tacArrowSvg.appendChild(g);
  });
  tacBoard().arrows.forEach((a, i) =>
    tacArrowSvg.appendChild(shapeNode(a, W, H, i)));
  
  
  
  tacGreenSegs = new Map(); 
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (widthM) {
    const measures = tacBoard().measures;
    
    const groups = [];
    const byChain = new Map();
    measures.forEach((m) => {
      if (m.chain == null) { groups.push([m]); return; }
      if (!byChain.has(m.chain)) { byChain.set(m.chain, [m]); groups.push(byChain.get(m.chain)); }
      else byChain.get(m.chain).push(m);
    });
    groups.forEach((group) => {
      const lc = group[0].lc;
      if (!lc || !lc.buffs.length) return;
      const sim = tacSimLine(group, lc);
      sim.segs.forEach((s, i) => {
        const ranges = [];
        let acc = 0;
        for (const p of s.parts) {
          const f1 = acc / s.dist; acc += p.dist; const f2 = acc / s.dist;
          if (Math.abs(p.pct) <= 0.05) continue;
          const last = ranges[ranges.length - 1];
          if (last && Math.abs(last[2] - p.pct) < 1e-9
              && Math.abs(last[1] - f1) < 1e-9) last[1] = f2;
          else ranges.push([f1, f2, p.pct]);
        }
        if (ranges.length) tacGreenSegs.set(group[i], ranges);
      });
    });
  }
  const chainGroups = {};
  tacBoard().measures.forEach((m, i) => {
    if (m.chain != null) (chainGroups[m.chain] = chainGroups[m.chain] || []).push(i);
  });
  const selLineNow = tacSelLine();
  const selSet = selLineNow ? new Set(selLineNow.segs) : null;
  const isSel = (m) => !!(selSet && selSet.has(m)); 
  tacBoard().measures.forEach((m, i) =>
    tacArrowSvg.appendChild(measureNode(m, W, H, i, m.chain != null, isSel(m))));
  Object.entries(chainGroups).forEach(([id, idxs]) => {
    
    const chainSel = !!(selLineNow && selLineNow.chain === +id);
    tacArrowSvg.appendChild(chainTotalNode(
      idxs.map((i) => tacBoard().measures[i]), W, H, chainSel));
  });
  
  if (selLineNow) {
    selLineNow.segs.forEach((m, k) => {
      if (k === 0) tacArrowSvg.appendChild(
        tacLetterNode(m.x1 * W, m.y1 * H, tacLetter(0)));
      tacArrowSvg.appendChild(
        tacLetterNode(m.x2 * W, m.y2 * H, tacLetter(k + 1)));
    });
  }
  
  if (tacMeasurePending) {
    const st = tacMeasureStyle[tacMeasureMode];
    const cx = tacMeasurePending.x * W, cy = tacMeasurePending.y * H;
    const ring = document.createElementNS(TAC_SVG_NS, 'circle');
    ring.setAttribute('cx', cx); ring.setAttribute('cy', cy);
    ring.setAttribute('r', 7); ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', st.color); ring.setAttribute('stroke-width', 2);
    const core = document.createElementNS(TAC_SVG_NS, 'circle');
    core.setAttribute('cx', cx); core.setAttribute('cy', cy);
    core.setAttribute('r', 2.5); core.setAttribute('fill', st.color);
    tacArrowSvg.append(ring, core);
    if (tacMeasureHover) {
      tacArrowSvg.appendChild(measureNode(
        { x1: tacMeasurePending.x, y1: tacMeasurePending.y,
          x2: tacMeasureHover.x, y2: tacMeasureHover.y,
          color: st.color, width: st.width }, W, H, -1, tacChainRoute !== null));
    }
  }
  
  if (tacDrawing) {
    tacArrowSvg.appendChild(shapeNode(
      { ...tacDrawing, shape: tacDrawShape, color: tacArrowColor, width: tacArrowWidth }, W, H, -1));
  }
}


export function renderTacBoard() {
  tacSave(); 
  tacMapWrap.querySelectorAll('.tac-token, .tac-role-circle, .tac-item-circle, .tac-item-pin, .tac-measure-dot, .tac-text')
    .forEach((el) => el.remove());
  renderTacFixedSpawns();
  renderTacTreasure();
  const board = tacBoard();
  const zMap = new Map();
  {
    const sorted = tacSortedEntries(board);
    const n = sorted.length;
    sorted.forEach((en, i) => zMap.set(en.key, String(100 + (n - i))));
  }
  const itemOcc = {};

  board.items.forEach((it, idx) => {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def) return;
    const ok = `${it.role}|${it.kind}`;
    const o = (itemOcc[ok] = (itemOcc[ok] || 0) + 1) - 1;
    const z = zMap.get(`i:${it.role}:${it.kind}:${o}`);

    const rbFill = it.rangeBox ? it.rangeBox.fill : !!def.fill;
    const itRanges = [
      ...tacRangeEntries(def.ranges, it, false)
        .map((e) => ({ pct: tacItemMetersToPercent(e.meters), opt: e.opt, meters: e.meters })),
      ...tacTalentRanges(it, it.role)
        .map((r) => ({ pct: tacItemMetersToPercent(r.meters), opt: null, meters: r.meters })),
    ];
    const sizePct = itRanges.length ? itRanges[0].pct : null;
    const el = document.createElement('div');
    el.className = (sizePct !== null ? 'tac-item-circle' : 'tac-item-pin')
      + (tacSelectedItem === idx && tacDisplay.selGlow ? ' selected' : '')
      + (it.glow ? ' glow' : '');
    el.dataset.idx = idx;
    el.style.left = `${it.x * 100}%`;
    el.style.top = `${it.y * 100}%`;
    el.style.setProperty('--ic', def.color || '#e2e8f0');
    el.title = def.name;
    if (z) el.style.zIndex = z;
    if (sizePct !== null) {
      el.style.width = `${sizePct}%`;

      if (rbFill) el.style.setProperty('--ic-fill', def.fill || TAC_RANGE_DEFAULT_FILL);
      if (def.glow) el.style.setProperty('--ic-glow', def.glow);

      if (itRanges[0].opt && itRanges[0].opt.crossWidth != null) {
        el.classList.add('tac-item-cross');
        el.insertAdjacentHTML('beforeend',
          tacCrossSvg(itRanges[0].opt, itRanges[0].meters, it.angle));
      } else {
        el.insertAdjacentHTML('beforeend',
          '<svg class="tac-item-edge" viewBox="0 0 100 100" aria-hidden="true">'
          + '<circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0)"'
          + ' stroke-width="10"/></svg>');
      }
    }



    if (def.icon && !it.hideIcon) {
      el.insertAdjacentHTML('beforeend',
        `<img src="${def.icon}" alt="${def.name}" draggable="false">`);
      const img = el.querySelector('img');

      const isz = it.iconSize ?? 3.4;
      const ipx = isz / 100 * (tacRot.clientWidth || tacMapWrap.clientWidth);
      img.style.width = `${ipx}px`;
      img.style.height = `${ipx}px`;
      // tac-item-circle 的 img 原本靠 CSS translate(-50%,-50%) 居中；
      // tac-item-pin 的 img 靠 flex 居中，无 transform，不能加 translate
      const up = tacUpRot();
      if (up || it.angle) {
        const base = (!it.angle && el.classList.contains('tac-item-pin')) ? '' : 'translate(-50%, -50%) ';
        img.style.transform = `${base}rotate(${(it.angle || 0) + up}deg)`;
      } else {
        img.style.transform = '';
      }
    } else {
      el.insertAdjacentHTML('beforeend', '<div class="tac-item-dot"></div>');
    }
    tacLayer().appendChild(el);
    itRanges.slice(1).forEach((r) => {
      if (r.pct === null) return;
      const ex = document.createElement('div');
      ex.className = 'tac-item-circle tac-range-extra';
      ex.dataset.idx = idx;
      ex.style.left = `${it.x * 100}%`;
      ex.style.top = `${it.y * 100}%`;
      ex.style.width = `${r.pct}%`;
      ex.style.setProperty('--ic', def.color || '#e2e8f0');
      if (rbFill) ex.style.setProperty('--ic-fill', def.fill || TAC_RANGE_DEFAULT_FILL);
      if (r.opt && r.opt.crossWidth != null) {
        ex.classList.add('tac-item-cross');
        ex.insertAdjacentHTML('beforeend', tacCrossSvg(r.opt, r.meters, it.angle));
      }
      if (z) ex.style.zIndex = z;
      tacLayer().appendChild(ex);
    });
  });
  for (const t of board.tokens) {
    const role = t.role;
    const def = TAC_ROLES[role] || {};
    const z = zMap.get(`r:${role}`);

    const tFill = t.rangeBox ? t.rangeBox.fill : false;
    const roleRanges = [
      ...tacRangeEntries(def.ranges, t, true)
        .map((e) => ({ pct: tacItemMetersToPercent(e.meters), opt: e.opt })),
      ...tacTalentRanges(t, role)
        .map((r) => ({ pct: tacItemMetersToPercent(r.meters), opt: null })),
    ];
    roleRanges.forEach((r) => {
      if (r.pct === null) return;
      const rg = document.createElement('div');
      rg.className = 'tac-role-circle' + (tFill ? ' filled' : '');
      rg.dataset.role = role;
      rg.dataset.tid = t.tid;
      rg.style.left = `${t.x * 100}%`;
      rg.style.top = `${t.y * 100}%`;
      rg.style.width = `${r.pct}%`;
      if (r.opt && r.opt.ringInner != null) {
        rg.classList.add('tac-role-ring');
        if (tFill) rg.style.setProperty('--rc-fill', 'rgba(226, 232, 240, 0.1)');
        rg.insertAdjacentHTML('beforeend', tacRingSvg(r.opt));
      }
      if (z) rg.style.zIndex = z;
      tacLayer().appendChild(rg);
    });
    const el = document.createElement('div');
    
    const showIcon = def.icon && !t.hideIcon;
    el.className = 'tac-token' + (showIcon ? ' has-img' : ' as-dot')
      + (tacSelected === t.tid && tacDisplay.selGlow ? ' selected' : '')
      + (t.glow ? ' glow' : '');
    el.dataset.role = role;
    el.dataset.tid = t.tid;
    el.style.left = `${t.x * 100}%`;
    el.style.top = `${t.y * 100}%`;
    el.style.width = `${t.size}%`;
    setTacFontSize(el, t.size * 0.42, 26);
    el.style.setProperty('--rc', def.color || '#fff');
    if (z) el.style.zIndex = z;
    if (showIcon) {
      el.innerHTML = `<img src="${def.icon}" alt="${def.name}" draggable="false">`;
      const img = el.querySelector('img');
      if (img && tacUpRot()) img.style.transform = `rotate(${tacUpRot()}deg)`;
      el.title = def.name;
    } else {
      el.title = def.name || role;
    }
    tacLayer().appendChild(el);
  }
  
  const chainFirst = {}, chainLast = {};
  board.measures.forEach((m, i) => {
    if (m.chain == null) return;
    if (chainFirst[m.chain] === undefined) chainFirst[m.chain] = i;
    chainLast[m.chain] = i;
  });
  board.measures.forEach((m, idx) => {
    const isChain = m.chain != null;
    const isChainStart = isChain && chainFirst[m.chain] === idx;
    const isChainEnd = isChain && chainLast[m.chain] === idx;
    [['x1', 'y1', 'a'], ['x2', 'y2', 'b']].forEach(([kx, ky, end]) => {
      
      if (isChain && !((isChainStart && end === 'a') || (isChainEnd && end === 'b'))) return;
      const dot = document.createElement('div');
      dot.className = 'tac-measure-dot';
      if (tacDisplay.hideEndpoints) dot.classList.add('hidden-endpoint');
      dot.dataset.idx = idx;
      dot.dataset.end = end;
      dot.style.left = `${m[kx] * 100}%`;
      dot.style.top = `${m[ky] * 100}%`;
      const dotColor = tacMeasureSegColor(m);
      dot.style.background = dotColor; 
      dot.style.boxShadow = `0 0 6px ${dotColor}`;
      dot.title = translate("application.renderTacBoard");
      tacLayer().appendChild(dot);
    });
  });
  
  board.texts.forEach((t, idx) => {
    const el = document.createElement('div');
    el.className = 'tac-text' + (tacSelectedText === idx ? ' selected' : '');
    el.dataset.idx = idx;
    el.style.left = `${t.x * 100}%`;
    el.style.top = `${t.y * 100}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    el.style.color = t.color;
    setTacFontSize(el, Math.max(2.2, t.size * 0.18));
    el.textContent = t.text;
    tacLayer().appendChild(el);
  });
  renderTacArrows();
  updateTacPanel();
}


export function buildTacRangeRows(settings, cfg, inst, hideByDefault, opts) {
  opts = opts || {};
  const prefix = opts.labelPrefix || '';
  const postfix = opts.labelPostfix || '';
  const defFill = !!opts.defFill;
  const hostRole = opts.hostRole;
  const hostCamp = tacHostCamp(hostRole);
  const groupKind = opts.groupKind
    || (cfg && cfg.key === 'showItem' ? 'item'
      : (cfg && cfg.key === 'showTrait' ? 'trait' : 'plain'));
  cfg = cfg || { key: groupKind === 'item' ? 'showItem'
    : groupKind === 'trait' ? 'showTrait' : 'show', options: [] };
  inst = inst || {};
  const rb = tacRbEnsure(cfg, inst, hideByDefault, defFill);

  const refresh = () => { renderTacBoard(); renderTacManage(); };

  const box = tacManageBox(settings, "ui.tacRangeBox.title");

  const modeLine = document.createElement('div');
  const lv1Defs = [{ mk: 'range', label: cfg.key === 'showItem' ? translate("ui.tacRangeBox.showItem")
    : cfg.key === 'showTrait' ? translate("ui.tacRangeBox.showTrait")
    : translate("ui.tacRangeBox.showPlain") }];
  if (groupKind === 'trait') {
    lv1Defs.push({ mk: 'talents', label: translate("ui.tacRangeBox.showTalents") });
  }
  lv1Defs.push({ mk: 'hide', label: translate("ui.tacRangeBox.hide") });
  modeLine.className = 'tac-box-line';
  modeLine.innerHTML = `<div class="tac-range-opts">` + lv1Defs.map((d) =>
    `<button type="button" data-mk="${d.mk}" class="tac-range-opt`
    + `${rb.tab === d.mk ? ' active' : ''}">${d.label}</button>`).join('') + `</div>`;
  modeLine.querySelectorAll('.tac-range-opt').forEach((b) => {
    b.addEventListener('click', () => {
      const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
      const mk = b.dataset.mk;
      if (mk === 'hide') {
        rbx.tab = null;
        rbx.subs = [];
        rbx.talents = {};
      } else if (rbx.tab !== mk) {
        // 一级按钮仅切换分组：显示对应二级按钮，但不点亮（点亮由用户亲手操作）
        rbx.tab = mk;
      }
      refresh();
    });
  });
  box.appendChild(modeLine);


  function subBtn(active, attrs, label) {
    return `<button type="button" ${attrs} class="tac-range-opt tac-range-sub`
      + `${active ? ' active' : ''}">${label}</button>`;
  }

  if (rb.tab === 'talents') {
    const tLine = document.createElement('div');
    tLine.className = 'tac-box-line';
    tLine.innerHTML = `<div class="tac-range-opts">`
      + tacTalentButtons(hostRole, hostCamp).map((tb) =>
        subBtn(!!(rb.talents && rb.talents[tb.tk]), `data-tk="${tb.tk}"`, tb.label)).join('')
      + `</div>`;
    tLine.querySelectorAll('.tac-range-sub').forEach((b) => {
      b.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        if (rbx.talents[b.dataset.tk]) delete rbx.talents[b.dataset.tk];
        else rbx.talents[b.dataset.tk] = {};
        rbx.talentCur = b.dataset.tk;
        refresh();
      });
    });
      box.appendChild(tLine);
    // 三级按钮：只显示最近点亮的那个天赋的形态/档位
    tacTalentButtons(hostRole, hostCamp).forEach((tb) => {
      const sel = rb.talents[tb.tk];
      if (!sel || tb.tk !== rb.talentCur) return;
      const gLine = document.createElement('div');
      gLine.className = 'tac-box-line';
      if (tb.variants) {
        const cur = sel.variant || tb.variants[0].key;
        gLine.innerHTML = `<div class="tac-range-opts">`
          + tb.variants.map((v) =>
            subBtn(cur === v.key, `data-tv="${v.key}" data-tk="${tb.tk}"`, v.label)).join('')
          + `</div>`;
      } else if (tb.opt && Array.isArray(tb.opt.size_m)) {
        const vals = tb.opt.size_m;
        const cur = Number.isInteger(sel.gear) ? sel.gear : 0;
        gLine.innerHTML = `<div class="tac-range-opts">`
          + vals.map((v, gi) =>
            subBtn(cur === gi, `data-tg="${gi}" data-tk="${tb.tk}"`, `${v}m`)).join('')
          + `</div>`;
      } else {
        return;
      }
      gLine.querySelectorAll('.tac-range-sub').forEach((b2) => {
        b2.addEventListener('click', () => {
          const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
          const sel2 = rbx.talents[tb.tk];
          if (!sel2) return;
          if (b2.dataset.tv) sel2.variant = b2.dataset.tv;
          else sel2.gear = +b2.dataset.tg;
          refresh();
        });
      });
      box.appendChild(gLine);
    });
  } else if (rb.tab === 'range') {
    // 二级按钮统一：点已选中的取消，未选中的追加点亮（多个范围可同时显示）
    const lightSub = (rbx, i) => {
      rbx.subs = rbx.subs.includes(i)
        ? rbx.subs.filter((v) => v !== i)
        : [...rbx.subs, i];
    };
    // 全部二级按钮优先同一行（空间不足才换行）；点亮的选项在下方显示对应控制
    const subLine = document.createElement('div');
    subLine.className = 'tac-box-line';
    subLine.innerHTML = `<div class="tac-range-opts">`
      + cfg.options.map((opt, i) =>
        subBtn(rb.subs.includes(i), `data-v="${i}"`,
          opt.label ? opt.label + postfix : `${opt.size_m}m`)).join('')
      + `</div>`;
    subLine.querySelectorAll('.tac-range-sub').forEach((b) => {
      b.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        lightSub(rbx, +b.dataset.v);
        refresh();
      });
    });
    box.appendChild(subLine);
    // 点亮的选项：档位数组项出现互斥挡位组，滑杆项出现范围调节
    cfg.options.forEach((opt, i) => {
      if (!rb.subs.includes(i)) return;
      if (Array.isArray(opt.size_m)) {
        // 档位数组项（如牢笼 [9,12,15]）
        const vals = opt.size_m;
        const cur = Number.isInteger(rb.gear) ? rb.gear : 0;
        const gLine = document.createElement('div');
        gLine.className = 'tac-box-line';
        gLine.innerHTML = `<div class="tac-range-opts">`
          + vals.map((v, gi) =>
            subBtn(cur === gi, `data-g="${gi}"`, `${v}m`)).join('')
          + `</div>`;
        gLine.querySelectorAll('.tac-range-sub').forEach((b) => {
          b.addEventListener('click', () => {
            const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
            rbx.gear = +b.dataset.g;
            refresh();
          });
        });
        box.appendChild(gLine);
      } else if (opt.size_m && typeof opt.size_m === 'object') {
        // 滑杆项（{min,max}）
        const sm = opt.size_m;
        const sMin = sm.min != null ? sm.min : 0;
        const dynMax = sm.max != null ? sm.max
          : (MAPS_DATA[S.currentMapId] && MAPS_DATA[S.currentMapId].widthM) || 100;
        const cur = rb.m != null ? rb.m : dynMax;
        const slLine = document.createElement('div');
        slLine.className = 'tac-box-line';
        slLine.innerHTML = `<div class="tac-range-mid">`
          + `<span class="tac-range-end">${sMin}m</span>`
          + `<input type="range" min="${sMin}" max="${dynMax}" step="0.1" value="${cur}">`
          + `<span class="tac-range-end">${tacRangeFmt(dynMax)}m</span>`
          + `</div>`
          + `<span class="tac-range-val">${tacRangeFmt(cur)}m</span>`;
        const sl = slLine.querySelector('input');
        if (sl) {
          sl.addEventListener('input', () => {
            const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
            rbx.m = parseFloat(sl.value);
            slLine.querySelector('.tac-range-val').textContent = `${tacRangeFmt(rbx.m)}m`;
            updateDescs();
            if (opts.softUpdate) opts.softUpdate();
          });
          sl.addEventListener('change', () => { renderTacBoard(); renderTacManage(); });
        }
        box.appendChild(slLine);
      }
    });
    if (cfg.fearMods) {
      [['fearH', 'hunter'], ['fearS', 'survivor']].forEach(([field, gkey]) => {
        const gopts = cfg.fearMods[gkey];
        const defKey = gopts[0][0];
        const grpEl = document.createElement('div');
        grpEl.className = 'tac-box-line';
        grpEl.innerHTML = `<div class="tac-range-opts">`
          + gopts.map(([v, label]) =>
            subBtn((rb[field] || defKey) === v, `data-f="${field}" data-v="${v}"`, label)).join('')
          + `</div>`;
        grpEl.querySelectorAll('.tac-range-sub').forEach((b) => {
          b.addEventListener('click', () => {
            const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
            rbx[b.dataset.f] = b.dataset.v;
            refresh();
          });
        });
        box.appendChild(grpEl);
      });
    }
  }


  const descs = document.createElement('div');
  descs.className = 'tac-range-descs';
  function updateDescs() {
    descs.innerHTML = '';
    tacRangeEntries(cfg, inst, hideByDefault).forEach((e2) => {
      const row = document.createElement('div');
      row.className = 'tac-range-desc';
      const txt = document.createElement('span');
      txt.textContent = e2.opt.crossWidth != null
        ? `${(e2.opt.label || '') + postfix} ${translate("ui.tacRangeBox.radius")} ${tacRangeFmt(e2.meters)}m ${translate("ui.tacRangeBox.crossWidth")} ${tacRangeFmt(e2.opt.crossWidth)}m`
        : e2.opt.ringInner != null
          ? `${(e2.opt.label || '') + postfix} ${translate("ui.tacRangeBox.innerRadius")} ${tacRangeFmt(e2.opt.ringInner)}m ${translate("ui.tacRangeBox.outerRadius")} ${tacRangeFmt(e2.meters)}m`
          : `${(e2.opt.label || '') + postfix} ${translate("ui.tacRangeBox.radius")} ${tacRangeFmt(e2.meters)}m`;
      row.appendChild(txt);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tac-range-del';
      del.textContent = '×';
      del.title = translate("ui.tacRangeBox.delDesc");
      del.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        rbx.subs = rbx.subs.filter((v) => v !== e2.i);
        refresh();
      });
      row.appendChild(del);
      descs.appendChild(row);
    });
    tacTalentRanges(inst, hostRole).forEach((tr) => {
      const row = document.createElement('div');
      row.className = 'tac-range-desc';
      const txt = document.createElement('span');
      txt.textContent = `${tr.label}${tr.sub ? '·' + tr.sub : postfix} ${translate("ui.tacRangeBox.radius")} ${tacRangeFmt(tr.meters)}m`;
      row.appendChild(txt);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tac-range-del';
      del.textContent = '×';
      del.title = translate("ui.tacRangeBox.delDesc");
      del.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        delete rbx.talents[tr.tk];
        refresh();
      });
      row.appendChild(del);
      descs.appendChild(row);
    });
  }
  updateDescs();
  box.appendChild(descs);


  const fillLabel = document.createElement('label');
  fillLabel.className = 'tac-range-fill';
  fillLabel.innerHTML = `<input type="checkbox"`
    + `${(rb ? rb.fill : defFill) ? ' checked' : ''}> ${translate("ui.tacRangeBox.fill")}`;
  const fillInput = fillLabel.querySelector('input');
  if (fillInput) fillInput.addEventListener('change', (ev) => {
    const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
    rbx.fill = ev.target.checked;
    refresh();
  });
  box.appendChild(fillLabel);
}

function tacManageDefaultEntries(board) {
  const campOrder = { survivor: 0, hunter: 1, other: 2 };
  const campOf = (role) => campOrder[(TAC_ROLES[role] || {}).camp] ?? 0;
  const roleIdx = {};
  Object.keys(TAC_ROLES).forEach((r, i) => { roleIdx[r] = i; });
  const entries = [];
  board.tokens.forEach((t) =>
    entries.push({ type: 'role', tid: t.tid, role: t.role, key: `r:${t.tid}` }));
  board.items.forEach((it, idx) =>
    entries.push({ type: 'item', idx, role: it.role, key: `i:${it.iid}` }));
  entries.sort((a, b) =>
    campOf(a.role) - campOf(b.role)
    || (roleIdx[a.role] ?? 999) - (roleIdx[b.role] ?? 999)
    || (a.type === 'role' && b.type === 'role' ? a.tid - b.tid
      : a.type === 'item' && b.type === 'item' ? a.idx - b.idx
      : a.type === 'role' ? -1 : 1));
  const occCount = new Map();
  entries.forEach((e) => {
    const k = tacEntryName(e);
    occCount.set(k, (occCount.get(k) || 0) + 1);
    e.occ = occCount.get(k);
  });
  entries.forEach((e, i) => { e.defIdx = i; });
  return entries;
}

// 造物在管理列表中的名称（角色/道具统一按显示名）
function tacEntryName(e) {
  const def = e.type === 'role'
    ? (TAC_ROLES[e.role] || {})
    : (TAC_ITEM_TYPES[(tacBoard().items[e.idx] || {}).kind] || {});
  return def.name || e.role;
}

// 重复造物（同名多个实例，角色与道具同名合并计数）在按钮名后加序号
function tacDispName(e) {
  const base = tacEntryName(e);
  const dup = tacManageDefaultEntries(tacBoard())
    .filter((o) => tacEntryName(o) === base).length > 1;
  return dup ? `${base} ${e.occ}` : base;
}

function tacSortedEntries(board) {
  const entries = tacManageDefaultEntries(board);
  const order = board.order || [];
  const pos = new Map(order.map((k, i) => [k, i]));
  entries.sort((a, b) => {
    const pa = pos.has(a.key) ? pos.get(a.key) : order.length + a.defIdx;
    const pb = pos.has(b.key) ? pos.get(b.key) : order.length + b.defIdx;
    return pa - pb;
  });
  return entries;
}

let manageDrag = null;
let suppressManageClick = 0;

function attachManageDrag(btn, key) {
  btn.addEventListener('pointerdown', (ev) => {
    if (ev.button !== undefined && ev.button !== 0) return;
    manageDrag = { key, btn, x: ev.clientX, y: ev.clientY, active: false, target: null };
    const move = (e) => {
      if (!manageDrag) return;
      const dx = e.clientX - manageDrag.x;
      const dy = e.clientY - manageDrag.y;
      if (!manageDrag.active) {
        if (Math.hypot(dx, dy) <= 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { manageDrag = null; return; }
        manageDrag.active = true;
        btn.classList.add('dragging');
      }
      e.preventDefault();
      btn.style.setProperty('--dg-x', `${dx}px`);
      btn.style.setProperty('--dg-y', `${dy}px`);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const t = el && el.closest ? el.closest('.tac-manage-btn') : null;
      const nt = (t && t !== btn) ? t : null;
      if (manageDrag.target !== nt) {
        if (manageDrag.target) manageDrag.target.classList.remove('drag-over');
        manageDrag.target = nt;
        if (nt) nt.classList.add('drag-over');
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (manageDrag && manageDrag.active) {
        suppressManageClick = Date.now();
        const tgt = manageDrag.target;
        btn.classList.remove('dragging');
        btn.style.removeProperty('--dg-x');
        btn.style.removeProperty('--dg-y');
        if (tgt) tgt.classList.remove('drag-over');
        if (tgt) {
          const board = tacBoard();
          const keys = tacSortedEntries(board).map((en) => en.key);
          const from = keys.indexOf(key);
          const to = keys.indexOf(tgt.dataset.key);
          if (from > -1 && to > -1) {
            keys.splice(from, 1);
            keys.splice(to, 0, key);
            board.order = keys;
            tacSave();
            renderTacManage();
            renderTacBoard();
          }
        }
      }
      manageDrag = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
}


function tacManageBox(settings, titleKey) {
  const box = document.createElement('div');
  box.className = 'tac-manage-box';
  const title = document.createElement('span');
  title.className = 'tac-box-title';
  title.textContent = translate(titleKey, {  });
  box.appendChild(title);
  settings.appendChild(box);
  return box;
}


function tacBoxHint(box, html) {
  const hint = document.createElement('span');
  hint.className = 'tac-box-hint';
  hint.innerHTML = html;
  box.appendChild(hint);
  return hint;
}


function buildAngleManageBox(settings, inst, idx) {
  const box = tacManageBox(settings, "ui.tacAngleBox.title");
  const line = document.createElement('div');
  line.className = 'tac-box-line';
  const cur = ((inst.angle || 0) % 360 + 360) % 360;
  line.innerHTML = `<div class="tac-range-mid">`
    + `<input type="range" min="0" max="360" step="5" value="${cur}">`
    + `</div>`
    + `<span class="tac-range-val">${cur}°</span>`;
  const sl = line.querySelector('input');
  // 软更新：拖动时只旋转已有 DOM，不整板重绘（避免卡顿）；松手再全量刷新
  const softRotate = () => {
    const a = ((inst.angle || 0) % 360 + 360) % 360;
    tacMapWrap.querySelectorAll(`.tac-item-circle[data-idx="${idx}"]`).forEach((el) => {
      const g = el.querySelector('.tac-item-cross-svg g');
      if (g) g.setAttribute('transform', `rotate(${a} 50 50)`);
      const img = el.querySelector('img');
      if (img) img.style.transform = a
        ? `translate(-50%, -50%) rotate(${a}deg)` : '';
    });
  };
  sl.addEventListener('input', () => {
    inst.angle = parseFloat(sl.value) % 360;
    line.querySelector('.tac-range-val').textContent = `${inst.angle}°`;
    softRotate();
    tacSave();
  });
  sl.addEventListener('change', () => renderTacBoard());
  box.appendChild(line);
}


// 某造物实例在管理列表中的编号名（如 水镜1、红夫人2）
function tacInstDispName(inst) {
  if (!inst) return '';
  const entries = tacManageDefaultEntries(tacBoard());
  const e = inst.kind != null
    ? entries.find((o) => o.type === 'item' && tacBoard().items[o.idx]
      && tacBoard().items[o.idx].iid === inst.iid)
    : entries.find((o) => o.type === 'role' && o.tid === inst.tid);
  if (e) return tacDispName(e);
  return (TAC_ITEM_TYPES[inst.kind] || TAC_ROLES[inst.role] || {}).name || '';
}


// 镜像管理（红夫人 / 水镜 / 镜像 共享；与连线管理同一套相连语义，
// 按宿主（红夫人/水镜/镜像）解析其所属配对的水镜
function tacAqOfHost(host) {
  const b = tacBoard();
  if (host.kind === 'aquaMirror') return host;
  if (host.kind === 'mirrorImage') {
    return (host.aqIid != null && tacItemByIid(host.aqIid))
      || b.items.find((it) => it.kind === 'aquaMirror') || null;
  }
  return b.items.find((it) => it.kind === 'aquaMirror' && it.linkTid === host.tid) || null;
}


// 状态存于水镜造物上，显示连线/显示镜像/固定水镜位置/交换镜像由相连双方共享）
function buildMirrorManageBox(settings, host) {
  const board = tacBoard();
  const isTok = host.kind == null;
  // 配对解析：按 host 类型找到与其配对的红夫人/水镜
  let aq = null;
  let bq = null;
  if (host.kind === 'aquaMirror') {
    aq = host;
    bq = aq.linkTid != null ? tacTokenByTid(aq.linkTid) : null;
  } else if (host.kind === 'mirrorImage') {
    aq = tacAqOfHost(host);
    bq = aq && aq.linkTid != null ? tacTokenByTid(aq.linkTid) : null;
  } else {
    bq = host;
    aq = board.items.find((it) => it.kind === 'aquaMirror' && it.linkTid === bq.tid) || null;
  }
  const linked = !!(aq && bq);
  const mi = aq ? (board.items.find((it) => it.kind === 'mirrorImage' && it.aqIid === aq.iid)
    || board.items.find((it) => it.kind === 'mirrorImage' && it.aqIid == null)) : null;

  const box = tacManageBox(settings, "ui.tacManageMirror.title");
  const line = document.createElement('div');
  line.className = 'tac-box-line';
  box.appendChild(line);
  line.innerHTML =
    `<label class="tac-manage-glow"><input type="checkbox" data-mq="allow"`
    + `${host.linkAuto !== false ? ' checked' : ''}> ${translate("ui.tacManageMirror.allow")}</label>`
    + `<label class="tac-manage-glow"><input type="checkbox" data-mq="link"`
    + `${(linked ? aq.linkShow !== false && bq.linkShow !== false : host.linkShow !== false) ? ' checked' : ''}${linked ? '' : ' disabled'}>`
    + ` ${translate("ui.tacManageMirror.link")}</label>`
    + `<label class="tac-manage-glow"><input type="checkbox" data-mq="show"`
    + `${aq && aq.showMirror ? ' checked' : ''}${aq ? '' : ' disabled'}>`
    + ` ${translate("ui.tacManageMirror.show")}</label>`
    + `<button type="button" class="tac-manage-toggle${aq && aq.fixedMirror ? ' on' : ''}" data-mq="fix"`
    + `${aq && aq.showMirror ? '' : ' disabled'}>`
    + translate("ui.tacManageMirror.fix", {  }) + `</button>`
    + `<button type="button" class="tac-manage-swap"`
    + `${aq && aq.showMirror && mi ? '' : ' disabled'}>`
    + translate("ui.tacManageMirror.swap", {  }) + `</button>`;

  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  status.textContent = translate(linked
    ? "ui.tacManageMirror.statusLinked"
    : "ui.tacManageMirror.statusNone",
    { name: linked ? tacInstDispName(isTok ? aq : bq) : null });
  box.appendChild(status);
  tacBoxHint(box, translate("ui.tacManageMirror.hint", {  }));

  const refreshAll = () => {
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  };
  line.querySelector('input[data-mq="allow"]').addEventListener('change', (e) => {
    host.linkAuto = e.target.checked;
    if (e.target.checked) {
      if (isTok) tacAutoLinkToken(host);
      else tacAutoLinkItem(host);
    } else if (isTok) tacBreakTokenLinks(host, true);
    else tacBreakItemLink(host, true);
    tacSyncMirror(null, tacAqOfHost(host));
    refreshAll();
  });
  line.querySelector('input[data-mq="link"]').addEventListener('change', (e) => {
    if (!linked) return;
    aq.linkShow = e.target.checked;
    bq.linkShow = e.target.checked;
    renderTacArrows();
    tacSave();
  });
  line.querySelector('input[data-mq="show"]').addEventListener('change', (e) => {
    if (!aq) return;
    aq.showMirror = e.target.checked;
    if (!aq.showMirror) { aq.fixedMirror = false; delete aq.mirrorAxis; }
    tacSyncMirror(null, aq);
    refreshAll();
  });
  line.querySelector('button[data-mq="fix"]').addEventListener('click', () => {
    if (!aq || !aq.showMirror) return;
    aq.fixedMirror = !aq.fixedMirror;
    delete aq.mirrorAxis;
    tacSyncMirror(null, aq);
    refreshAll();
  });
  line.querySelector('button.tac-manage-swap').addEventListener('click', () => {
    if (!linked) return;
    const p2 = tacMirrorParts(aq);
    if (!p2 || !p2.mi) return;
    const bx = p2.bq.x, by = p2.bq.y;
    p2.bq.x = p2.mi.x; p2.bq.y = p2.mi.y;
    p2.mi.x = bx; p2.mi.y = by;
    tacSyncMirror('bq', aq);
    renderTacBoard();
    renderTacArrows();
    tacSave();
  });
}


// 击球点连线管理：允许连线 / 显示连线 / 提前闭合，三者由相连组件共享
function buildHittingPointBox(settings, host) {
  const comp = tacHpComponent(host);
  const opens = tacHpComponentOpen(comp);
  const canClose = !host.hpClosed && opens.length === 3;
  const box = tacManageBox(settings, 'ui.tacManageBox.hittingPoint');
  const allowOn = host.linkAuto !== false;
  box.innerHTML +=
    `<div class="tac-link-opts">`
    + `<label class="tac-link-opt"><input type="checkbox" data-hp="allow"`
    + `${allowOn ? ' checked' : ''}> ${translate("ui.tacLinkBox.auto")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-hp="show"`
    + `${host.linkShow !== false ? ' checked' : ''}${allowOn ? '' : ' disabled'}>`
    + ` ${translate("ui.tacLinkBox.show")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-hp="close"`
    + `${canClose ? '' : ' disabled'}> ${translate("ui.tacLinkBox.hpClose")}</label>`
    + `</div>`;
  const { reg, close } = tacHpPeers(host);
  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  let sKey = 'ui.tacLinkBox.statusNone';
  let sVars = {};
  if (close.length && reg.length) {
    sKey = 'ui.tacLinkBox.hpStatusClosed';
    sVars = { a: tacInstDispName(reg[0]), b: tacInstDispName(close[0]) };
  } else if (reg.length >= 2) {
    sKey = 'ui.tacLinkBox.hpStatusTwo';
    sVars = { a: tacInstDispName(reg[0]), b: tacInstDispName(reg[1]) };
  } else if (reg.length === 1) {
    sKey = 'ui.tacLinkBox.statusLinked';
    sVars = { name: tacInstDispName(reg[0]) };
  }
  status.textContent = translate(sKey, sVars);
  box.appendChild(status);
  const hKey = reg.length >= 2 ? 'ui.tacLinkBox.hpHintMulti' : 'ui.tacLinkBox.hpHintPair';
  tacBoxHint(box, translate(hKey, {
    name: (TAC_ITEM_TYPES[TAC_HP_KIND] || {}).name,
    minM: TAC_HP_MIN_M,
    maxM: TAC_HP_MAX_M,
  }));
  box.querySelector('input[data-hp="allow"]').addEventListener('change', (e) => {
    if (e.target.checked) {
      host.linkAuto = true;
      tacHpJoin(host);
    } else {
      tacHpDissolve(host);
    }
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  });
  box.querySelector('input[data-hp="show"]').addEventListener('change', (e) => {
    tacHpComponent(host).forEach((o) => { o.linkShow = e.target.checked; });
    renderTacArrows();
    tacSave();
  });
  box.querySelector('input[data-hp="close"]').addEventListener('change', (e) => {
    if (!e.target.checked) return;
    tacHpCloseShape(host);
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  });
}


// 连线管理（同造物两两相连 / 异造物相连 共用）
// host: 道具实例或角色实例；info: { cross, roleName, itemName, maxM }
function buildLinkManageBox(settings, host, info) {
  const box = tacManageBox(settings, "ui.tacLinkBox.title");
  box.innerHTML +=
    `<div class="tac-link-opts">`
    + `<label class="tac-link-opt"><input type="checkbox" data-lk="auto"`
    + `${host.linkAuto !== false ? ' checked' : ''}> ${translate("ui.tacLinkBox.auto")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-lk="show"`
    + `${host.linkShow !== false ? ' checked' : ''}> ${translate("ui.tacLinkBox.show")}</label>`
    + `</div>`;
  const isTok = !host.kind;
  let partnerName = null;
  if (isTok) {
    const its = tacTokenLinkedItems(host);
    if (its[0]) partnerName = tacInstDispName(its[0]);
  } else if (info.cross) {
    const tk = tacLinkTokenOf(host);
    if (tk) partnerName = tacInstDispName(tk);
  } else {
    const p = tacLinkPartner(host);
    if (p) partnerName = tacInstDispName(p);
  }
  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  status.textContent = translate(partnerName
    ? "ui.tacLinkBox.statusLinked" : "ui.tacLinkBox.statusNone", { name: partnerName });
  box.appendChild(status);
  const hintKey = info.cross
    ? (info.maxM ? "ui.tacLinkBox.crossHint" : "ui.tacLinkBox.crossHintNoMax")
    : (info.maxM ? "ui.tacLinkBox.sameHint" : "ui.tacLinkBox.sameHintNoMax");
  tacBoxHint(box, translate(hintKey, {
    name: info.itemName, item: info.itemName,
    role: info.roleName, maxM: info.maxM,
  }));
  box.querySelectorAll('input').forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.dataset.lk === 'show') {
        host.linkShow = cb.checked;
        if (isTok) {
          tacTokenLinkedItems(host).forEach((it) => { it.linkShow = cb.checked; });
        } else if (info.cross) {
          const tk = tacLinkTokenOf(host);
          if (tk) tk.linkShow = cb.checked;
        } else {
          const p = tacLinkPartner(host);
          if (p) p.linkShow = cb.checked;
        }
        renderTacArrows();
        tacSave();
        return;
      } else {
        host.linkAuto = cb.checked;
        if (cb.checked) {
          if (isTok) tacAutoLinkToken(host);
          else tacAutoLinkItem(host);
        } else if (isTok) tacBreakTokenLinks(host, true);
        else tacBreakItemLink(host, true);
      }
      renderTacBoard();
      tacSave();
    });
  });
}


// 水渊管理（渔女 / 渔猎 共享；与连线管理同一套相连语义，
// 允许连线各自持有，模拟水渊状态存于渔猎造物、由相连双方共享）
function buildAbyssManageBox(settings, host) {
  const board = tacBoard();
  const isTok = host.kind == null;
  let sp = null;
  let nt = null;
  if (isTok) {
    nt = host;
    sp = board.items.find((it) => it.kind === 'spearfishing' && it.linkTid === nt.tid) || null;
  } else {
    sp = host;
    nt = sp.linkTid != null ? tacTokenByTid(sp.linkTid) : null;
  }
  const linked = !!(sp && nt);
  const box = tacManageBox(settings, "ui.tacManageBox.abyss");
  box.innerHTML +=
    `<div class="tac-link-opts">`
    + `<label class="tac-link-opt"><input type="checkbox" data-ab="allow"`
    + `${host.linkAuto !== false ? ' checked' : ''}> ${translate("ui.tacLinkBox.auto")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-ab="abyss"`
    + `${sp && sp.abyss && sp.abyss.on ? ' checked' : ''}${linked ? '' : ' disabled'}>`
    + ` ${translate("ui.tacManageBox.abyssSim")}</label>`
    + `</div>`;
  const partnerName = linked ? tacInstDispName(isTok ? sp : nt) : null;
  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  status.textContent = translate(partnerName
    ? "ui.tacLinkBox.statusLinked" : "ui.tacLinkBox.statusNone", { name: partnerName });
  box.appendChild(status);
  tacBoxHint(box, translate("ui.tacManageBox.abyssHint", { maxM: TAC_ABYSS_MAX_M }));
  tacBoxHint(box, translate("ui.tacManageBox.abyssFixHint", {  }));
  box.querySelector('input[data-ab="allow"]').addEventListener('change', (e) => {
    host.linkAuto = e.target.checked;
    if (e.target.checked) {
      if (isTok) tacAutoLinkToken(host);
      else tacAutoLinkItem(host);
    } else if (isTok) tacBreakTokenLinks(host, true);
    else tacBreakItemLink(host, true);
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  });
  box.querySelector('input[data-ab="abyss"]').addEventListener('change', (e) => {
    if (!linked || !sp) return;
    if (e.target.checked) sp.abyss = { on: true, recording: false, trail: [], done: null };
    else delete sp.abyss;
    renderTacArrows();
    tacSave();
  });
}


export function renderTacManage() {
  const board = tacBoard();
  board.order ||= [];
  tacManageList.innerHTML = '';
  const entries = tacSortedEntries(board);

  if (!entries.length) {
    tacManageSel = null;
    tacManageList.innerHTML =
      translate("application.renderTacManage");
    return;
  }

  const info = document.createElement('div');
  info.className = 'tac-manage-info';
  info.innerHTML = `<span class="tac-manage-count">${
    translate("ui.tacManageInfo.count", { count: entries.length })}</span>`;
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'tac-manage-reset';
  resetBtn.textContent = translate("ui.tacManageInfo.reset");
  resetBtn.addEventListener('click', () => {
    board.order = [];
    tacSave();
    renderTacManage();
    renderTacBoard();
  });
  const side = document.createElement('span');
  side.className = 'tac-manage-side';
  const hint = document.createElement('span');
  hint.className = 'tac-manage-hint';
  hint.textContent = translate("ui.tacManageInfo.hint");
  side.appendChild(hint);
  side.appendChild(resetBtn);
  info.appendChild(side);
  tacManageList.appendChild(info);
  const isSelEntry = (e) => tacManageSel && e.type === tacManageSel.type
    && (e.type === 'role' ? e.tid === tacManageSel.tid : e.idx === tacManageSel.idx);
  if (tacManageSel && !entries.some(isSelEntry)) tacManageSel = null;

  
  const grid = document.createElement('div');
  grid.className = 'tac-manage-grid';
  entries.forEach((e) => {
    const isRole = e.type === 'role';
    const def = isRole
      ? (TAC_ROLES[e.role] || {})
      : (TAC_ITEM_TYPES[board.items[e.idx].kind] || {});
    const btn = document.createElement('button');
    btn.className = 'tac-manage-btn' + (isSelEntry(e) ? ' active' : '');
    const dispName = tacDispName(e);
    btn.title = dispName;
    btn.dataset.key = e.key;
    btn.innerHTML =
      `${def.icon ? `<img src="${def.icon}" alt="${def.name}" draggable="false">` : ''}`
      + `<span class="tac-manage-btn-name">${dispName}</span>`;
    attachManageDrag(btn, e.key);
    btn.addEventListener('click', () => {
      if (Date.now() - suppressManageClick < 300) return;
      tacManageSel = isRole ? { type: 'role', tid: e.tid } : { type: 'item', idx: e.idx };
      
      if (isRole) { tacSelected = e.tid; tacSelectedItem = null; }
      else { tacSelectedItem = e.idx; tacSelected = null; }
      renderTacBoard();
    });
    grid.appendChild(btn);
  });
  tacManageList.appendChild(grid);

  
  const settings = document.createElement('div');
  settings.className = 'tac-manage-settings';
  tacManageList.appendChild(settings);
  if (!tacManageSel) {
    settings.innerHTML =
      translate("application.renderTacManageAlternate");
    return;
  }

  
  if (tacManageSel.type === 'role') {
    const token = board.tokens.find((t) => t.tid === tacManageSel.tid) || null;
    if (!token) return;
    const role = token.role;
    const rgCfg = (TAC_ROLES[role] || {}).ranges;
    const rangeShown = !!rgCfg && tacRangeEntries(rgCfg, token, true).length > 0;
    const isRoleDefault = () =>
      token.size === TAC_MANAGE_DEFAULT.roleSize && !rangeShown && !token.hideIcon;


    if (role === 'explorer') {
      const box = tacManageBox(settings, "ui.tacManageBox.treasure");
      box.innerHTML +=
        `<label class="tac-manage-glow"><input type="checkbox"`
        + translate("application.renderTacManageTreasure", { value: token.showTreasureRange ? ' checked' : '' });
      tacBoxHint(box, translate("ui.tacManageBox.treasureHint", {  }));
      box.querySelector('input').addEventListener('change', (e) => {
        // 最多同时开启一个：开启当前冒险家时立即关闭其它所有冒险家
        if (e.target.checked) {
          board.tokens.forEach((o) => { if (o.role === 'explorer' && o !== token) o.showTreasureRange = false; });
        }
        token.showTreasureRange = e.target.checked;
        renderTacTreasure();
        tacSave();
      });
    }
    
    
    if (role === 'bloodyQueen') {
      buildMirrorManageBox(settings, token);
    }
    
    
    if (role === 'naiad') {
      buildAbyssManageBox(settings, token);
    }
const fixedSpawnCfg = (MAPS_DATA[S.currentMapId].fixedSpawns || {})[role];
    if (fixedSpawnCfg) {
      // 同角色多个造物共享固定点位设置（教授鳞片 / 摄影师照相机 / 疯眼控制台 / 小丑零件）
      const roleTokens = board.tokens.filter((t) => t.role === role);
      const anyFlag = (f) => roleTokens.some((t) => t[f]);
      const setAll = (f, v) => roleTokens.forEach((t) => { t[f] = v; });
      const fsTitleKey = role === 'professor' ? "ui.tacManageBox.scale"
        : role === 'photographer' ? "ui.tacManageBox.camera"
        : role === 'madEyes' ? "ui.tacManageBox.console"
        : role === 'smileyFace' ? "ui.tacManageBox.parts" : null;
      const fsBox = fsTitleKey ? tacManageBox(settings, fsTitleKey) : settings;
      const fsRangeItem = (Array.isArray(fixedSpawnCfg.item)
        ? fixedSpawnCfg.item : [fixedSpawnCfg.item])
        .find((it) => it && it.rangeM && it.rangeScreenM);
      const fsRow = document.createElement('div');
      fsRow.className = fsTitleKey ? 'tac-box-line' : 'tac-manage-row';
      const hasOrient = (Array.isArray(fixedSpawnCfg.item)
        ? fixedSpawnCfg.item : [fixedSpawnCfg.item])
        .some((it) => it && it.flag_orientation);
      fsRow.innerHTML =
        `<label class="tac-manage-glow"><input type="checkbox"`
        + translate("application.renderTacManageSeventh", { value: anyFlag('showFixedSpawns') ? ' checked' : '', label: fixedSpawnCfg.label })
        + (hasOrient
          ? `<label class="tac-manage-glow"><input type="checkbox" data-fsdir`
          + `${anyFlag('showSpawnDir') ? ' checked' : ''}> ${translate("ui.tacManageBox.showDir")}</label>`
          : '');
      fsRow.querySelector('input').addEventListener('change', (e) => {
        setAll('showFixedSpawns', e.target.checked);
        renderTacFixedSpawns();
        tacSave();
      });
      const dirCb = fsRow.querySelector('input[data-fsdir]');
      if (dirCb) dirCb.addEventListener('change', (e) => {
        setAll('showSpawnDir', e.target.checked);
        renderTacFixedSpawns();
        tacSave();
      });
      fsBox.appendChild(fsRow);


      if (fsRangeItem && MAPS_DATA[S.currentMapId].widthM) {
        const dev = roleTokens.find((t) => t.fixedSpawnDevice)?.fixedSpawnDevice || 'pc';
        const [devW, devH] = fsRangeItem.rangeScreenM[dev];
        const radioName = `tac-fsdev-${S.currentMapId}-${role}`;
        const rangeRow = document.createElement('div');
        rangeRow.className = fsTitleKey ? 'tac-box-line' : 'tac-manage-row';
        rangeRow.innerHTML =
          `<label class="tac-manage-glow"><input type="checkbox"`
          + translate("application.renderTacManageEighth", { value: anyFlag('showFixedSpawnRange') ? ' checked' : '', rangeM: fsRangeItem.rangeM, devW: devW, devH: devH })
          + `<label class="tac-manage-glow"><input type="radio" name="${radioName}"${dev === 'pc' ? ' checked' : ''}>PC</label>`
          + `<label class="tac-manage-glow"><input type="radio" name="${radioName}"${dev === 'ios' ? ' checked' : ''}>IOS</label>`;
        rangeRow.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
          setAll('showFixedSpawnRange', e.target.checked);
          renderTacFixedSpawns();
          tacSave();
        });
        const [pcRadio, iosRadio] = rangeRow.querySelectorAll('input[type="radio"]');
        const theory = rangeRow.querySelector('.tac-fsdev-theory');
        const onDevChange = (next) => {
          setAll('fixedSpawnDevice', next);
          const [w, h] = fsRangeItem.rangeScreenM[next];
          theory.textContent = translate("application.onDevChange", { rangeM: fsRangeItem.rangeM, width: w, height: h });
          renderTacFixedSpawns();
          tacSave();
        };
        pcRadio.addEventListener('change', () => { if (pcRadio.checked) onDevChange('pc'); });
        iosRadio.addEventListener('change', () => { if (iosRadio.checked) onDevChange('ios'); });
        fsBox.appendChild(rangeRow);
      }
    }

    const lkDef = Object.values(TAC_ITEM_TYPES).find((d) => d.linkToRole === role);
    if (lkDef && role !== 'bloodyQueen' && role !== 'naiad') {
      buildLinkManageBox(settings, token, {
        cross: true,
        roleName: (TAC_ROLES[role] || {}).name,
        itemName: lkDef.name,
        maxM: lkDef.linkMaxM,
      });
    }

    const roleCamp = (TAC_ROLES[role] || {}).camp;
    if (rgCfg || roleCamp === 'survivor' || roleCamp === 'hunter') {
      const syncRoleCircleWidth = () => {
        const el = tacMapWrap.querySelector(`.tac-role-circle[data-role="${role}"]`);
        const m = tacRoleRangeMeters(role, token);
        if (el && m !== null) el.style.width = `${tacItemMetersToPercent(m)}%`;
      };
      buildTacRangeRows(settings, rgCfg, token, true, { softUpdate: syncRoleCircleWidth, hostRole: role, groupKind: (roleCamp === 'survivor' || roleCamp === 'hunter') ? 'trait' : 'plain', labelPrefix: translate("characters.default.range.label.showPrefix"), labelPostfix: translate("characters.default.range.label.showPostfix") });
    }

    const row = document.createElement('div');
    row.className = 'tac-manage-row';
    row.innerHTML =
      translate("application.renderTacManageNinth", {  })
      + `<input type="range" min="3" max="12" step="0.5" value="${token.size}"></label>`
      + `<label class="tac-manage-hide"><input type="checkbox"`
      + translate("application.renderTacManageTenth", { value: token.hideIcon ? ' checked' : '' })
      + `<label class="tac-manage-glow"><input type="checkbox"`
      + translate("application.renderTacManageEleventh", { value: token.glow ? ' checked' : '' })
      + `<label class="tac-manage-def"><input type="checkbox"`
      + translate("application.renderTacManageTwelfth", { value: isRoleDefault() ? ' checked' : '' })
      + translate("application.renderTacManageThirteenth", {  });
    const slider = row.querySelector('input[type="range"]');
    const [hideCb, glowCb, defCb] = row.querySelectorAll('input[type="checkbox"]');
    slider.addEventListener('input', () => {
      token.size = parseFloat(slider.value);
      const el = tacMapWrap.querySelector(`.tac-token[data-role="${role}"]`);
      if (el) {
        el.style.width = `${token.size}%`;
        setTacFontSize(el, token.size * 0.42, 26);
      }
      defCb.checked = isRoleDefault();
    });
    
    hideCb.addEventListener('change', () => {
      token.hideIcon = hideCb.checked;
      renderTacBoard();
    });
    
    glowCb.addEventListener('change', () => {
      token.glow = glowCb.checked;
      renderTacBoard();
    });
    defCb.addEventListener('change', () => {
      if (!defCb.checked) return;
      token.size = TAC_MANAGE_DEFAULT.roleSize;
      token.hideIcon = false;
      if (rgCfg) {
        delete token.rangeMode;
        delete token.rangeMeters;
        delete token.rangeBox;
      }
      renderTacBoard();
    });
    
    row.querySelector('.tac-manage-del').addEventListener('click', () => {
      const ti = board.tokens.findIndex((t) => t.tid === token.tid);
      if (ti < 0) return;
      const snapshot = { ...board.tokens[ti] };
      const removed = board.tokens[ti];
      board.tokens.splice(ti, 1);
      tacOnTokenRemoved(removed);
      tacUndoStack.push({ type: 'remove', token: snapshot });
      if (tacSelected === token.tid) tacSelected = null;
      tacManageSel = null;
      renderTacBoard();
    });
    settings.appendChild(row);
    return;
  }

  
  const idx = tacManageSel.idx;
  const it = board.items[idx];
  const itDef = TAC_ITEM_TYPES[it.kind] || {};
  const rgCfg = (itDef.ranges && Array.isArray(itDef.ranges.options)) ? itDef.ranges : null;
  const curIcon = it.iconSize ?? TAC_MANAGE_DEFAULT.iconSize;
  
  const syncCircleWidth = () => {
    const el = tacMapWrap.querySelector(`.tac-item-circle[data-idx="${idx}"]`);
    if (el) el.style.width = `${tacItemSizePercent(it)}%`;
  };
  
  const itemRangeIsDefault = () => {
    if (!rgCfg) return true;
    return !it.rangeBox;
  };
  const isDefault = !it.hideIcon
    && curIcon === TAC_MANAGE_DEFAULT.iconSize
    && itemRangeIsDefault();

  
  const refreshDefault = () => {
    defCb.checked = !it.hideIcon
      && (it.iconSize ?? TAC_MANAGE_DEFAULT.iconSize)
        === TAC_MANAGE_DEFAULT.iconSize
      && itemRangeIsDefault();
  };

  
  if (it.kind === 'aquaMirror' || it.kind === 'mirrorImage') {
    buildMirrorManageBox(settings, it);
  }
  if (it.kind === 'spearfishing') {
    buildAbyssManageBox(settings, it);
  }
  if (it.kind === TAC_HP_KIND) {
    buildHittingPointBox(settings, it);
  }
  if (it.kind === 'timeBomb' || it.kind === 'remoteControlledBomb') {
    buildAngleManageBox(settings, it, idx);
  }

  
  if (it.kind !== 'aquaMirror' && it.kind !== 'mirrorImage'
    && it.kind !== 'spearfishing'
    && (itDef.linkToRole || tacSameLinkable(itDef))) {
    buildLinkManageBox(settings, it, {
      cross: !!itDef.linkToRole,
      roleName: itDef.linkToRole ? (TAC_ROLES[itDef.linkToRole] || {}).name : null,
      itemName: itDef.name,
      maxM: itDef.linkMaxM,
    });
  }

  if (rgCfg) {
    buildTacRangeRows(settings, rgCfg, it, false,
      { softUpdate: () => { syncCircleWidth(); refreshDefault(); },
        hostRole: it.role,
        groupKind: 'item',
        defFill: !!itDef.fill,
        labelPrefix: translate("items.default.range.label.showPrefix"),
        labelPostfix: translate("items.default.range.label.showPostfix") });
  }

  
  const row = document.createElement('div');
  row.className = 'tac-manage-row';
  row.innerHTML =
    translate("application.renderTacManageNinth", {  })
    + `<input type="range" min="1.5" max="10" step="0.2" value="${curIcon}"></label>`
    + `<label class="tac-manage-hide"><input type="checkbox"`
    + translate("application.renderTacManageTenth", { value: it.hideIcon ? ' checked' : '' })
    + `<label class="tac-manage-glow"><input type="checkbox"`
    + translate("application.renderTacManageEleventh", { value: it.glow ? ' checked' : '' })
    + `<label class="tac-manage-def"><input type="checkbox"`
    + translate("application.renderTacManageTwelfth", { value: isDefault ? ' checked' : '' })
    + translate("application.renderTacManageThirteenth", {  });
  settings.appendChild(row);
  const sizeSlider = row.querySelector('input[type="range"]');
  const [hideCb, glowCb, defCb] = row.querySelectorAll('input[type="checkbox"]');

  sizeSlider.addEventListener('input', () => {
    it.iconSize = parseFloat(sizeSlider.value);
    const el = tacMapWrap.querySelector(
      `.tac-item-circle[data-idx="${idx}"] img, .tac-item-pin[data-idx="${idx}"] img`);
    if (el) {
      const px = it.iconSize / 100 * tacMapWrap.clientWidth;
      el.style.width = `${px}px`;
      el.style.height = `${px}px`;
    }
    refreshDefault();
  });
  hideCb.addEventListener('change', () => {
    it.hideIcon = hideCb.checked;
    renderTacBoard();
  });
  
  glowCb.addEventListener('change', () => {
    it.glow = glowCb.checked;
    renderTacBoard();
  });
  defCb.addEventListener('change', () => {
    if (!defCb.checked) return;
    
    
    delete it.rangeMode;
    delete it.rangeMeters;
    delete it.hideRange;
    delete it.meters;
    delete it.fearHunter;
    delete it.fearSurv;
    delete it.rangeBox;
    delete it.angle;
    it.iconSize = TAC_MANAGE_DEFAULT.iconSize;
    it.hideIcon = false;
    renderTacBoard();
  });
  
  row.querySelector('.tac-manage-del').addEventListener('click', () => {
    const removed = board.items[idx];
    board.items.splice(idx, 1);
    tacOnItemRemoved(removed);
    tacUndoStack.push({ type: 'delItem', item: { ...removed }, idx });
    if (tacSelectedItem === idx) tacSelectedItem = null;
    tacManageSel = null;
    renderTacBoard();
  });
}

export function updateTacPanel() {
  const board = tacBoard();
  renderTacManage();
  const selTok = tacSelected != null
    ? board.tokens.find((t) => t.tid === tacSelected) : null;
  const selRole = selTok ? selTok.role : null;
  [tacRolesEl, tacRolesHunterEl, tacRolesOtherEl].forEach((box) =>
    box.querySelectorAll('.tac-role').forEach((btn) => {
      const role = btn.dataset.role;
      btn.classList.toggle('placed', board.tokens.some((t) => t.role === role));
      btn.classList.toggle('armed', tacPlaceRole === role);
      btn.classList.toggle('selected', selRole === role);
    }));
  tacticView.classList.toggle('tac-placing', !!(tacPlaceRole || tacPlaceItem));

  
  const selItem = tacSelectedItem !== null ? board.items[tacSelectedItem] : null;
  const activeRole = tacPlaceRole || selRole
    || (tacPlaceItem && tacPlaceItem.role)
    || (selItem && selItem.role);
  const activeDef = activeRole ? TAC_ROLES[activeRole] : null;
  const showItems = !!(activeDef && activeDef.items && activeDef.items.length);
  tacItemSection.style.display = showItems ? '' : 'none';
  if (showItems) {
    
    const activeBtn =
      tacRolesEl.querySelector(`.tac-role[data-role="${activeRole}"]`)
      || tacRolesHunterEl.querySelector(`.tac-role[data-role="${activeRole}"]`)
      || tacRolesOtherEl.querySelector(`.tac-role[data-role="${activeRole}"]`);
        
    if (activeBtn && (tacItemRole !== activeRole
        || activeBtn.nextSibling !== tacItemSection))
      buildTacItems(activeRole, activeBtn);
    
    if (tacPlaceItem && tacPlaceItem.role !== activeRole) tacPlaceItem = null;
    document.querySelectorAll('.tac-item').forEach((btn) => {
      btn.classList.toggle('armed',
        !!tacPlaceItem && tacPlaceItem.kind === btn.dataset.kind);
    });
  } else {
    tacPlaceItem = null;
    tacItemRole = null;
    
    tacItemSection.style.display = 'none';
    document.querySelectorAll('.tac-item-section').forEach((s) => {
      if (s !== tacItemSection) s.remove();
    });
  }

  

  renderTacTextList();
  tacWidthVal.textContent = tacArrowWidth;
  tacUndoBtn.disabled = tacUndoStack.length === 0;
  updateTacMeasureInfo();
}




export function tacLetter(i) {
  let s = '';
  let k = i + 1;
  while (k > 0) {
    s = String.fromCharCode(65 + ((k - 1) % 26)) + s;
    k = Math.floor((k - 1) / 26);
  }
  return s;
}


export function tacLetterNode(x, y, txt) {
  const t = document.createElementNS(TAC_SVG_NS, 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y - 11);
  tacUprightSvgText(t, x, y - 11);
  t.setAttribute('class', 'tac-mletter');
  t.textContent = txt;
  return t;
}


export function tacFmtD(v) {
  return (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
}


export function tacSelLine() {
  const all = tacBoard().measures;
  const m = tacSelMeasure && tacSelMeasure.idx != null ? all[tacSelMeasure.idx] : null;
  if (!m || !m.lc) return null;
  if (m.chain == null) return { segs: [m], lc: m.lc, n: 1, selSeg: 0, chain: null };
  const segs = all.filter((x) => x.chain === m.chain && x.lc === m.lc);
  return { segs, lc: m.lc, n: segs.length,
    selSeg: Math.max(0, segs.indexOf(m)), chain: m.chain };
}


export function tacEditTarget() {
  const L = tacSelLine();
  if (!L) return { pending: true };
  if (L.chain == null) return { pending: false, lc: L.lc, from: 0, to: 1, n: 1 };
  if (tacApplyScope === 'chain') return { pending: false, lc: L.lc, from: 0, to: L.n, n: L.n };
  return { pending: false, lc: L.lc, from: L.selSeg, to: L.selSeg + 1, n: L.n };
}


export function tacBaseAt(lc, i) {
  return measureBaseAt(lc, i);
}


export function tacApplyBase(lc, from, to, base) {
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


export function tacRemoveBuffsIn(lc, from, to, pred) {
  const nb = [];
  for (const b of lc.buffs) {
    if (!pred(b) || b.to <= from || b.from >= to) { nb.push(b); continue; }
    if (b.from < from) nb.push({ ...b, id: ++tacBuffSeq, to: from });
    if (b.to > to) nb.push({ ...b, id: ++tacBuffSeq, from: to });
  }
  lc.buffs = nb;
}


export function tacTraitRoleInTarget() {
  const tgt = tacEditTarget();
  const bs = tgt.pending
    ? tacPending.buffs
    : tgt.lc.buffs.filter((b) => b.from < tgt.to && b.to > tgt.from);
  const tr = bs.find((b) => b.type === 'trait');
  if (!tr) return null;
  const td = Object.values(TAC_MOVEMENT_BUFFS.trait).flat().find((t) => t.key === tr.key);
  return td ? td.role : (tr.name || '').split(' · ')[0];
}


export function tacClearTraitOfRole(roleName) {
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


export function tacApplyTrait(lc, from, to, def, roleName) {
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


export function tacAddBuffEntry(entry) {
  const rows = [{ ...entry }];
  delete rows[0].extra;
  if (entry.extra) rows.push({ ...entry.extra, type: entry.type, key: entry.key });
  const linkId = rows.length > 1 ? ++tacBuffSeq : null;
  const tgt = tacEditTarget();
  const bases = tgt.pending ? [tacPending.base]
    : Array.from({ length: tgt.to - tgt.from }, (_, i) => tacBaseAt(tgt.lc, tgt.from + i));
  if (bases.every((base) => base.fixed)) {
    showToast(translate("application.tacAddBuffEntry"));
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
    showToast(translate("application.tacAddBuffEntryAlternate", { name: TAC_MOVEMENT_SURVIVOR.stateNames[state] || state }));
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


export function tacNewLineCfg(n) {
  const lc = {
    lid: ++tacLcSeq,
    bases: [{ from: 0, to: n, ...tacPending.base }],
    buffs: tacPending.buffs.map((b) => ({ ...b, id: ++tacBuffSeq, from: 0, to: n })),
  };
  tacNormLc(lc);
  return lc;
}


export function tacExtendLineCfg(lc, oldN) {
  const newN = oldN + 1;
  lc.bases.forEach((b) => { if (b.to === oldN) b.to = newN; });
  lc.buffs.forEach((b) => { if (b.to === oldN) b.to = newN; });
  tacNormLc(lc); 
}


export function tacAppendSegCfg(lc, oldN) {
  lc.bases.push({ from: oldN, to: oldN + 1, ...tacPending.base });
  lc.bases.sort((a, b) => a.from - b.from);
  tacNormLc(lc);
  for (const b of tacPending.buffs) {
    lc.buffs.push({ ...b, id: ++tacBuffSeq, from: oldN, to: oldN + 1 });
  }
}


export function tacSimLine(segs, lc) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  const dists = segs.map((m) => {
    const { units, dw } = tacMeasureLen(m);
    return units / dw * widthM;
  });
  return simulateMovement(dists, lc, tacBuffAppliesToBase);
}


export function tacSpeedForms(key) {
  if (key === 'survivor') return { forms: [{ name: translate("characters.camps.survivor"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed }], dual: false };
  const sp = (TAC_ROLES[key] || {}).speed;
  if (sp == null) return null;
  if (typeof sp === 'number') return { forms: [{ name: '', speed: sp }], dual: false };
  const forms = Object.entries(sp).map(([name, speed]) => ({ name, speed }));
  return { forms, dual: true };
}


export function syncTacSpeedForm() {
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
        translate("application.syncTacSpeedForm", { index: i, name: f.name, speed: f.speed })).join('');
      tacSpeedForm.dataset.sig = key;
    }
    tacSpeedForm.style.display = '';
  } else {
    tacSpeedForm.style.display = 'none';
    tacSpeedForm.dataset.sig = key;
  }
}


export function tacBuildRoleOptions() {
  if (tacCamp === 'survivor') {
    
    let opts = Object.entries(TAC_MOVEMENT_SURVIVOR.states).map(([k, st]) =>
      `<option value="${k}">${st.name} ${st.speed}m/s</option>`).join('');
    opts += translate("application.tacBuildRoleOptions");
    opts += translate("application.tacBuildRoleOptionsAlternate");
    tacSpeedRole.innerHTML = opts + translate("application.tacBuildRoleOptionsThird");
    tacSpeedRole.value = 'run';
    return;
  }
  let opts = '';
  for (const [key, def] of Object.entries(TAC_ROLES)) {
    if (def.camp !== 'hunter') continue;
    const sp0 = (def.speed != null && typeof def.speed === 'object')
      ? Object.values(def.speed)[0] : def.speed;
    opts += sp0
      ? translate("application.tacBuildRoleOptionsFourth", { key: key, value: key === 'hellEmber' ? ' selected' : '', name: def.name, sp0: sp0 })
      : translate("application.tacBuildRoleOptionsFifth", { key: key, name: def.name });
  }
  tacSpeedRole.innerHTML = opts + translate("application.tacBuildRoleOptionsThird");
  tacSpeedRole.value = 'hellEmber';
}


export function tacSetCamp(camp) {
  if (tacCamp === camp) return;
  tacCamp = camp;
  tacCampToggle.querySelectorAll('.side-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.camp === camp));
  tacBuildRoleOptions();
}


export function tacPanelBase() {
  const v = parseFloat(tacBaseSpeedEl.value);
  const speed = v > 0 ? v : TAC_MOVEMENT_SURVIVOR.states.run.speed;
  const key = tacSpeedRole.value;
  if (key === 'custom') {
    return { name: translate("application.name"), speed, camp: tacCamp, role: null, form: 0, stKey: 'custom' };
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


export function tacApplyBaseInput(base) {
  const tgt = tacEditTarget();
  if (tgt.pending) tacPending.base = { ...base };
  else tacApplyBase(tgt.lc, tgt.from, tgt.to, base);
  tacPurgeInvalidBuffs(); 
  updateTacMeasureInfo();
  renderTacArrows();
}


export function tacBuffAppliesToBase(b, base) {
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

export function tacPurgeInvalidBuffs() {
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


export function tacSyncSpeedPanel() {
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
      } else if (base.name === translate("application.name")) {
        tacSpeedRole.value = 'custom';
        syncTacSpeedForm();
      }
    } else if (base.role) {
      tacSpeedRole.value = base.role;
      syncTacSpeedForm();
      tacSpeedForm.value = String(base.form || 0);
    } else if (base.name === translate("application.name")) {
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
        : (base.name === translate("application.name") ? 'custom' : null);
    } else {
      wantRole = base.role || (base.name === translate("application.name") ? 'custom' : null);
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


export function tacSyncStatus() {
  const L = tacSelLine();
  let s1, s2;
  if (L) {
    s1 = (L.chain != null && tacApplyScope === 'seg')
      ? translate("application.tacSyncStatus", { value: tacLetter(L.selSeg), valueSecondary: tacLetter(L.selSeg + 1) }) 
      : translate("application.tacSyncStatus", { value: tacLetter(0), valueSecondary: tacLetter(L.n) });
    s2 = L.chain == null
      ? translate("application.tacSyncStatusAlternate")
      : (tacApplyScope === 'chain' ? translate("application.tacSyncStatusThird") : translate("application.tacSyncStatusFourth"));
  } else {
    s1 = translate("application.tacSyncStatusFifth");
    s2 = tacMeasureMode === 'chain'
      ? (tacApplyScope === 'chain' ? translate("application.tacSyncStatusSixth") : translate("application.tacSyncStatusSeventh"))
      : translate("application.tacSyncStatusEighth");
  }
  tacStatusEl.innerHTML = s1;
  tacStatus2El.textContent = s2;
  tacDeselectBtn.disabled = !L;
}


export function tacSplitBases(lc) {
  const nb = [];
  lc.bases.forEach((b) => {
    for (let i = b.from; i < b.to; i++) nb.push({ ...b, from: i, to: i + 1 });
  });
  lc.bases = nb;
}

export function tacMergeBases(lc) {
  const nb = [];
  lc.bases.forEach((b) => {
    const last = nb[nb.length - 1];
    if (last && last.to === b.from && last.name === b.name
        && Math.abs(last.speed - b.speed) < 1e-9) last.to = b.to;
    else nb.push({ ...b });
  });
  lc.bases = nb;
}

export function tacNormLc(lc) {
  if (tacBaseMergeOn) tacMergeBases(lc); else tacSplitBases(lc);
}

export function tacNormalizeBases() {
  const seen = new Set();
  tacBoard().measures.forEach((m) => {
    if (m.lc && !seen.has(m.lc)) { seen.add(m.lc); tacNormLc(m.lc); }
  });
}


export function tacBaseDisplayRows(lc) {
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


export function tacDeleteBase(lc, idxs) {
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


export function renderTacBaseDetail() {
  tacBaseDetailToggle.textContent = translate("application.renderTacBaseDetail", { value: tacBaseDetailOpen ? '▾' : '▸' });
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
      translate("application.renderTacBaseDetailAlternate")
      + `<tr><td>${b.name}</td><td class="tac-col-speed"><b>${Math.round(b.speed * 100) / 100}</b></td>`
      + '<td class="tac-col-pt">—</td><td class="tac-col-pt">—</td><td class="tac-col-del"></td></tr></table>';
    return;
  }
  tacBaseMergeBox.style.display = '';
  const L = tacSelLine();
  const rows = tacBaseDisplayRows(tgt.lc);
  tacBaseDetailBody.innerHTML =
    translate("application.renderTacBaseDetailAlternate")
    + rows.map((r, i) => `<tr class="tac-base-row" data-brow="${i}"><td>${r.name}</td>`
      + `<td class="tac-col-speed"><b>${Math.round(r.speed * 100) / 100}</b></td>`
      + `<td class="tac-col-pt">${tacLetter(r.from)}</td>`
      + `<td class="tac-col-pt">${tacLetter(r.to)}</td>`
      + translate("application.renderTacBaseDetailThird", { index: i })).join('')
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


export function tacLetterOptions(n, sel) {
  let s = '';
  for (let i = 0; i <= n; i++) {
    s += `<option value="${i}"${i === sel ? ' selected' : ''}>${tacLetter(i)}</option>`;
  }
  return s;
}


export function renderTacBuffDetail() {
  tacBuffDetailToggle.textContent = translate("application.renderTacBuffDetail", { value: tacBuffDetailOpen ? '▾' : '▸' });
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
    tacBuffFilterBox.innerHTML = translate("application.renderTacBuffDetailAlternate")
      + `<select id="tacBuffFilterFrom"${tacBuffFilter.all ? ' disabled' : ''}>${tacLetterOptions(n, tacBuffFilter.from)}</select>`
      + `<select id="tacBuffFilterTo"${tacBuffFilter.all ? ' disabled' : ''}>${tacLetterOptions(n, tacBuffFilter.to)}</select>`
      + translate("application.renderTacBuffDetailThird", { value: tacBuffFilter.all ? ' checked' : '' });
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
      + translate("application.rowsHtml", { id: b.id });
  }).join('');

  tacBuffDetailBody.innerHTML =
    (shown.length
      ? translate("application.renderTacBuffDetailFourth")
        + rowsHtml + '</table>'
      : `<div class="tac-detail-empty">${buffs.length ? translate("application.renderTacBuffDetailFifth") : translate("application.renderTacBuffDetailSixth")}</div>`);

  
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


export function buildTacTraitList() {
  const rows = TAC_MOVEMENT_BUFFS.trait[tacCamp] || [];
  tacTraitList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"))
      : `${Math.round((t.mult - 1) * 100)}%${t.postMult ? translate("application.descThird") : ''}`
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"));
    if (t.states) { 
      desc += translate("application.buildTacTraitList", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    if (t.forms) {
      // 按 forms 索引取该角色速度形态名：如摄魂 forms:[0]→谢必安、信徒超出 forms:[1]→信徒
      const roleDef = Object.values(TAC_ROLES).find((r) => r.name === t.role);
      const formNames = roleDef && typeof roleDef.speed === 'object'
        ? t.forms.map((fi) => Object.keys(roleDef.speed)[fi]).filter(Boolean).join('/')
        : '';
      desc += t.key === 'windWings' ? translate("application.buildTacTraitListAlternate")
        : translate("application.buildTacTraitListFifth", { name: formNames });
    }
    const lv = t.levels
      ? `<select data-tlv="${t.key}">`
        + t.levels.map((_, i) =>
          `<option value="${i}"${i === t.levels.length - 1 ? ' selected' : ''}>${tacLevelLabel(t.key, i)}</option>`).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.role} · ${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + translate("application.buildTacTraitListFourth", { key: t.key });
  }).join('');
}


export function buildTacOtherList() {
  const rows = TAC_MOVEMENT_BUFFS.other[tacCamp] || [];
  tacOtherList.innerHTML = rows.map((t) => {
    let desc = t.levels
      ? `${t.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: t.levels.length })
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"))
      : `${Math.round((t.mult - 1) * 100)}%`
        + (t.duration ? ` ${t.duration}s` : translate("application.descAlternate"));
    if (t.states) {
      desc += translate("application.buildTacTraitList", { name: t.states.map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') });
    }
    const lv = t.levels
      ? `<select data-olv="${t.key}">`
        + t.levels.map((_, i) =>
          translate("application.lv", { index: i, count: i === t.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
        + '</select>'
      : '';
    return `<div class="tac-talent-row"><span class="tac-talent-name">${t.name}`
      + `<small>${desc}</small></span>${lv}`
      + translate("application.buildTacOtherList", { key: t.key });
  }).join('');
}


export function buildTacTalentList() {
  const rows = Object.entries(TAC_MOVEMENT_BUFFS.talent)
    .filter(([, b]) => !b.camp || b.camp === tacCamp);
  tacTalentList.innerHTML = rows.map(([k, b]) => {
    let desc = b.levels
      ? `${b.levels.map((m) => `${Math.round((m - 1) * 100)}%`).join('/')}`
        + translate("application.desc", { count: b.levels.length }) + (b.duration ? ` ${b.duration}s` : translate("application.descAlternate"))
      : `${Math.round((b.mult - 1) * 100)}%` + (b.duration ? ` ${b.duration}s` : translate("application.descAlternate"));
    const lv = b.levels
      ? `<select data-lv="${k}">`
        + b.levels.map((_, i) =>
          translate("application.lv", { index: i, count: i === b.levels.length - 1 ? ' selected' : '', value: i + 1 })).join('')
        + '</select>'
      : '';
    if (b.states) {
      desc += translate("application.buildTacTraitList", { name: b.states.map((k2) => (TAC_MOVEMENT_SURVIVOR.states[k2] || {}).name || k2).join('/') });
    }
    return `<div class="tac-talent-row"><span class="tac-talent-name">${b.name}`
      + `<small>${desc}${b.extra ? translate("application.buildTacTalentList", { name: b.extra.name }) : ''}</small></span>${lv}`
      + translate("application.buildTacTalentListAlternate", { key: k });
  }).join('');
}


export function updateTacMeasureInfo() {
  
  if (tacTool !== 'measure') return;
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
    if (tacMeasureMode === 'chain') {
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
  const headHtml = translate("application.headHtml")
    + translate("application.headHtmlAlternate");
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
  const CN = translate("application.cn");

  let html;
  if (chainSegs && chainSegs.length) {
    if (!widthM || !chainSegs[0].m.lc) {
      html = translate("application.updateTacMeasureInfo");
    } else {
      const sim = tacSimLine(chainSegs.map((x) => x.m), chainSegs[0].m.lc);
      html = headHtml
        + translate("application.updateTacMeasureInfoAlternate", { value: tacLetter(0), count: tacLetter(sim.segs.length) })
        + `<td><b>${tacFmtD(sim.dist)}</b></td><td><b>${fmt(sim.total)}</b></td>`
        + '<td>--</td><td>--</td>'
        + `<td>${fmt(sim.t0)}</td></tr>`
        + sim.segs.map((s, si) => segRow(
            translate("application.updateTacMeasureInfoThird", { value: CN[si] || (si + 1), valueSecondary: tacLetter(si), valueTertiary: tacLetter(si + 1) }),
            s, chainSegs[si].i, selIdx === chainSegs[si].i)).join('')
        + '</table>';
      if (tacMeasurePending) {
        html += '<div class="tac-result-empty" style="margin-top:6px">'
          + translate("application.updateTacMeasureInfoFourth");
      }
    }
  } else if (single) {
    if (!widthM || !single.m.lc) {
      html = translate("application.updateTacMeasureInfo");
    } else {
      const sim = tacSimLine([single.m], single.m.lc);
      html = headHtml
        + segRow(translate("application.updateTacMeasureInfoFifth", { value: tacLetter(0), valueSecondary: tacLetter(1) }), sim.segs[0], single.i,
            !!(tacSelMeasure && tacSelMeasure.idx === single.i))
        + '</table>';
    }
  } else {
    html = `<div class="tac-result-empty">${tacMeasureMode === 'chain'
      ? translate("application.updateTacMeasureInfoSixth")
      : translate("application.updateTacMeasureInfoSeventh")}</div>`;
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


export function buildTacSpeedPanel() {
  tacBuildRoleOptions(); 

  
  function tacSyncScopeVis() {
    tacScopeWrap.style.display = tacMeasureMode === 'chain' ? '' : 'none';
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
        dft = { name: translate("application.nameAlternate"), speed: TAC_MOVEMENT_SURVIVOR.states.run.speed, camp: 'survivor', role: null, form: 0, stKey: 'run' };
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
    tacApplyBaseInput({ name: translate("application.name"), speed: v, camp: tacCamp, role: null, form: 0 });
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
      showToast(translate("application.tacAddBuffEntry"));
      return;
    }
    
    const state0 = tacStateOf(base0);
    if (!tacStateMatches(def.states, state0)) {
      tacTraitModal.style.display = 'none';
      if (tacCamp === 'survivor') {
        showToast(translate("application.tacAddBuffEntryAlternate", { name: TAC_MOVEMENT_SURVIVOR.stateNames[state0] || state0 }));
      } else {
        showToast(translate("application.buildTacSpeedPanel", { role: def.role, name: def.name, nameSecondary: (def.states || []).map((k) => (TAC_MOVEMENT_SURVIVOR.states[k] || {}).name || k).join('/') }));
      }
      return;
    }
    
    
    if (tacCamp === 'survivor' && base0.stKey === 'role' && base0.role) {
      const roleName = (TAC_ROLES[base0.role] || {}).name;
      if (roleName && def.role !== roleName) {
        tacTraitModal.style.display = 'none';
        showToast(translate("application.buildTacSpeedPanelAlternate"));
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
    showToast(translate("application.buildTacSpeedPanelThird", { name: entry.name }));
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
    const name = def.levels ? translate("application.nameThird", { name: def.name, value: lv + 1 }) : def.name;
    const entry = {
      type: 'other', key: def.key, name,
      mult: def.levels ? def.levels[lv ?? def.levels.length - 1] : def.mult,
      duration: def.duration || 0,
    };
    tacOtherModal.style.display = 'none'; 
    if (tacAddBuffEntry(entry)) {
      showToast(translate("application.buildTacSpeedPanelThird", { name: name }));
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
    const name = def.levels ? translate("application.nameThird", { name: def.name, value: lv + 1 }) : def.name;
    const entry = { type: 'talent', key: k, name, mult, duration: def.duration || 0 };
    if (def.extra) entry.extra = { name: def.extra.name, mult: def.extra.mult, duration: 0 };
    tacTalentModal.style.display = 'none'; 
    if (tacAddBuffEntry(entry)) {
      showToast(translate("application.buildTacSpeedPanelThird", { name: name }));
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
    if (!pct) { showToast(translate("application.buildTacSpeedPanelFourth")); return; }
    const dur = parseFloat(tacBuffDur.value) || 0; 
    const name = (tacBuffName.value || '').trim() || translate("application.name");
    const ok = tacAddBuffEntry({ type: 'custom', key: '', name, mult: 1 + pct / 100, duration: dur });
    if (ok) {
      tacBuffName.value = '';
      tacBuffPct.value = '';
      tacBuffDur.value = '';
      showToast(translate("application.buildTacSpeedPanelThird", { name: name }));
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
    tacResultToggle.textContent = translate("application.buildTacSpeedPanelFifth", { value: tacResultOpen ? '▾' : '▸' });
    tacResultBody.style.display = tacResultOpen ? '' : 'none';
  });
  // 速度设置区：整体可收起，默认展开
  const syncTacSpeedSettings = () => {
    tacSpeedSettingsToggleEl.textContent = translate("application.buildTacSpeedPanelEighth", { value: tacSpeedSettingsOpen ? '▾' : '▸' });
    tacSpeedSettingsBodyEl.style.display = tacSpeedSettingsOpen ? '' : 'none';
  };
  tacSpeedSettingsToggleEl.addEventListener('click', () => {
    tacSpeedSettingsOpen = !tacSpeedSettingsOpen;
    syncTacSpeedSettings();
  });
  syncTacSpeedSettings();

  syncTacSpeedForm();
  tacBaseSpeedEl.value = tacPending.base.speed;
  
  tacMStyleToggle.addEventListener('click', () => {
    const open = tacMStyleBody.style.display === 'none'; 
    tacMStyleBody.style.display = open ? '' : 'none';
    tacMStyleToggle.classList.toggle('open', open);
    tacMStyleToggle.textContent = open ? translate("application.buildTacSpeedPanelSixth") : translate("application.buildTacSpeedPanelSeventh");
  });
  
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
      renderTacBoard();
      updateTacMeasureInfo();
    });
  });
  
  tacMeasureColorsEl.querySelectorAll('.tac-color').forEach((btn) => {
    btn.addEventListener('click', () => {
      tacMeasureStyle[tacMeasureMode].color = btn.dataset.color;
      tacMeasureColorsEl.querySelectorAll('.tac-color').forEach((b) =>
        b.classList.toggle('active', b === btn));
      tacSave();
    });
  });
  tacMeasureWidthEl.addEventListener('input', () => {
    tacMeasureStyle[tacMeasureMode].width = parseInt(tacMeasureWidthEl.value, 10);
    tacMeasureWidthVal.textContent = tacMeasureWidthEl.value;
    tacSave();
  });
  syncTacMeasureStyleUI();
  tacSyncScopeVis();
}


export function syncTacMeasureStyleUI() {
  const st = tacMeasureStyle[tacMeasureMode];
  tacMeasureColorsEl.querySelectorAll('.tac-color').forEach((b) =>
    b.classList.toggle('active', b.dataset.color === st.color));
  tacMeasureWidthEl.value = st.width;
  tacMeasureWidthVal.textContent = st.width;
}

buildTacSpeedPanel();


export function enterTactic() {
  tacMapTitle.textContent = MAPS_DATA[S.currentMapId].mapName;
  tacMapTitleEn.textContent = MAPS_DATA[S.currentMapId].mapNameEn;
  tacMeasurePending = null;
  tacMeasureHover = null;
  tacChainRoute = null;
  tacSelMeasure = null;
  syncTacImage();
  renderTacBoard();
}


export function syncTacSubCards() {
  tacManageCard.style.display = tacTool === 'select' ? '' : 'none';
  if (tacCipherCard) tacCipherCard.style.display = tacTool === 'select' ? '' : 'none';
  tacRolesCard.style.display = tacTool === 'roles' ? '' : 'none';
  tacDrawCard.style.display = tacTool === 'draw' ? '' : 'none';
  tacTextCard.style.display = tacTool === 'draw' ? '' : 'none';
  tacMeasureCard.style.display = tacTool === 'measure' ? '' : 'none';
  if (tacCarryCard) {
    tacCarryCard.style.display = tacTool === 'deduce' ? '' : 'none';
    if (tacTool === 'deduce') syncTacCarryChairRow();
  }
  if (tacPathCard) tacPathCard.style.display = tacTool === 'deduce' ? '' : 'none';
  tacDisplayCard.style.display = tacTool === 'display' ? '' : 'none';
  if (tacTool === 'select') { tacManageCard.open = true; if (tacCipherCard) tacCipherCard.open = true; }
  if (tacTool === 'roles') tacRolesCard.open = true;
  if (tacTool === 'draw') { tacDrawCard.open = true; tacTextCard.open = true; }
  if (tacTool === 'measure') tacMeasureCard.open = true;
  if (tacTool === 'deduce' && tacCarryCard) tacCarryCard.open = true;
  if (tacTool === 'display') tacDisplayCard.open = true;
}

export function setTacTool(tool) {
  tacTool = tool;
  tacUpdateTouchAction(); 
  tacPlaceRole = null;
  tacPlaceItem = null;
  tacDrawing = null;
  tacMeasurePending = null;
  tacMeasureHover = null;
  tacTextPlacing = false;
  updateTacTextUi();
  tacChainRoute = null; 
  tacSelMeasure = null;
  if (tool !== 'deduce') { tacCarryDisarm(); tacPathDisarm(); }
  tacticView.querySelectorAll('.tac-tool').forEach((b) =>
    b.classList.toggle('active', !!b.dataset.tool && b.dataset.tool === tool));
  tacticView.classList.toggle('tac-mode-draw', tool === 'draw');
  tacticView.classList.toggle('tac-mode-delete', tool === 'delete');
  tacticView.classList.toggle('tac-mode-measure', tool === 'measure');
  if (tacZoomState.pan) tacSetPanMode(false); 
  syncTacSubCards();
  renderTacArrows();
  updateTacPanel();
}


tacticView.querySelectorAll('.tac-tool[data-tool]').forEach((btn) =>
  btn.addEventListener('click', () => setTacTool(btn.dataset.tool)));


export function buildTacRoles() {
  const campBoxes = {
    survivor: tacRolesEl, hunter: tacRolesHunterEl, other: tacRolesOtherEl,
  };
  Object.values(campBoxes).forEach((box) => { box.innerHTML = ''; });
  for (const [role, def] of Object.entries(TAC_ROLES)) {
    const btn = document.createElement('button');
    btn.className = 'tac-role';
    btn.dataset.role = role;
    btn.style.setProperty('--rc', def.color || '#fff');
    btn.innerHTML = def.icon
      ? `<span class="tac-role-dot tac-role-img">`
        + `<img src="${def.icon}" alt="${def.name}" draggable="false"></span>${def.name}`
      : `<span class="tac-role-dot">${(def.name || role).charAt(0)}</span>${def.name}`;
    btn.addEventListener('click', () => onTacRoleClick(role));
    (campBoxes[def.camp] || tacRolesEl).appendChild(btn);
  }
}

buildTacRoles();


// 阵营页签：点击切换显示对应阵营的角色按钮；
// 切走时，被隐藏阵营里的选中/待放置角色与道具一并取消（沿用旧折叠语义）
tacticView.querySelectorAll('#tacCampTabs .side-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    tacticView.querySelectorAll('#tacCampTabs .side-btn').forEach((b) =>
      b.classList.toggle('active', b === btn));
    const boxes = { survivor: tacRolesEl, hunter: tacRolesHunterEl, other: tacRolesOtherEl };
    Object.entries(boxes).forEach(([camp, box]) => {
      box.style.display = camp === btn.dataset.camp ? '' : 'none';
    });
    const hidden = (r) => r && (TAC_ROLES[r] || {}).camp && TAC_ROLES[r].camp !== btn.dataset.camp;
    let changed = false;
    if (hidden(tacSelRole()) || hidden(tacPlaceRole)) {
      tacSelected = null;
      tacPlaceRole = null;
      changed = true;
    }
    if (tacPlaceItem && hidden(tacPlaceItem.role)) { tacPlaceItem = null; changed = true; }
    if (tacSelectedItem !== null) {
      const it = tacBoard().items[tacSelectedItem];
      if (it && hidden(it.role)) { tacSelectedItem = null; changed = true; }
    }
    if (changed) renderTacBoard();
  });
});


export function onTacRoleClick(role) {
  
  if (tacTool !== 'roles') setTacTool('roles');
  tacPlaceRole = tacPlaceRole === role ? null : role;
  tacSelected = null;
  tacSelectedItem = null;
  renderTacBoard();
}




export function buildTacItems(role, activeBtn) {
  const def = TAC_ROLES[role];
  tacItemRole = role;
  
  document.querySelectorAll('.tac-item-section').forEach((s) => {
    if (s !== tacItemSection) s.remove();
  });
  const grid = activeBtn.parentElement;
  
  let cols = 4;
  const tracks = getComputedStyle(grid).gridTemplateColumns;
  if (tracks && tracks !== 'none') cols = tracks.split(' ').length || 4;
  activeBtn.after(tacItemSection);
  const lead = Array.from(grid.children).indexOf(tacItemSection) % cols;
  const firstRow = Math.max(1, cols - lead);
  
  const rows = [];
  for (let i = 0, n = firstRow; i < def.items.length; i += n, n = cols)
    rows.push(def.items.slice(i, i + n));
  
  const sections = [tacItemSection];
  for (let r = 1; r < rows.length; r++) {
    const s = tacItemSection.cloneNode(false);
    s.removeAttribute('id');
    const inner = document.createElement('div');
    inner.className = 'tac-items';
    s.appendChild(inner);
    sections.push(s);
  }
  rows.forEach((chunk, r) => {
    const sec = sections[r];
    sec.style.display = '';
    sec.style.setProperty('--tac-item-cols', Math.max(1, chunk.length));
    const box = sec.querySelector('.tac-items');
    box.innerHTML = '';
    chunk.forEach((kind) => {
      const it = TAC_ITEM_TYPES[kind];
      const btn = document.createElement('button');
      btn.className = 'tac-item';
      btn.dataset.kind = kind;
      btn.style.setProperty('--ic', it.color);
      btn.title = it.name;
      btn.innerHTML =
        `<span class="tac-item-dot"><img src="${it.icon}" alt="${it.name}" draggable="false"></span>${it.name}`;
      btn.addEventListener('click', () => onTacItemClick(role, kind));
      box.appendChild(btn);
    });
  });
  
  activeBtn.after(...sections);
}


export function onTacItemClick(role, kind) {
  if (tacPlaceItem && tacPlaceItem.kind === kind) {
    tacPlaceItem = null;
  } else {
    if (tacTool !== 'roles') setTacTool('roles');
    tacPlaceItem = { role, kind };
    tacPlaceRole = null;
    tacSelected = null;
    tacSelectedItem = null;
  }
  renderTacBoard();
}


tacShapesEl.querySelectorAll('.tac-shape').forEach((btn) => {
  btn.addEventListener('click', () => {
    tacDrawShape = btn.dataset.shape;
    tacShapesEl.querySelectorAll('.tac-shape').forEach((b) =>
      b.classList.toggle('active', b === btn));
  });
});


tacColorsEl.querySelectorAll('.tac-color').forEach((btn) => {
  btn.addEventListener('click', () => {
    tacArrowColor = btn.dataset.color;
    tacColorsEl.querySelectorAll('.tac-color').forEach((b) =>
      b.classList.toggle('active', b === btn));
  });
});

tacWidthEl.addEventListener('input', () => {
  tacArrowWidth = parseInt(tacWidthEl.value, 10);
  tacWidthVal.textContent = tacArrowWidth;
});


tacTextColorsEl.querySelectorAll('.tac-color').forEach((btn) => {
  btn.addEventListener('click', () => {
    tacTextStyle.color = btn.dataset.color;
    tacTextColorsEl.querySelectorAll('.tac-color').forEach((b) =>
      b.classList.toggle('active', b === btn));
    
    if (tacSelectedText !== null && tacBoard().texts[tacSelectedText]) {
      tacBoard().texts[tacSelectedText].color = btn.dataset.color;
      renderTacBoard();
    }
  });
});

tacTextSizeEl.addEventListener('input', () => {
  tacTextStyle.size = parseInt(tacTextSizeEl.value, 10);
  tacTextSizeVal.textContent = tacTextStyle.size;
  if (tacSelectedText !== null && tacBoard().texts[tacSelectedText]) {
    tacBoard().texts[tacSelectedText].size = tacTextStyle.size;
    renderTacBoard();
  }
});


export function updateTacTextUi() {
  tacTextAddBtn.classList.toggle('active', tacTextPlacing);
  tacTextAddBtn.textContent = tacTextPlacing ? translate("application.updateTacTextUi") : translate("application.updateTacTextUiAlternate");
  tacTextHint.textContent = tacTextPlacing
    ? translate("application.updateTacTextUiThird")
    : translate("application.updateTacTextUiFourth");
}

tacTextAddBtn.addEventListener('click', () => {
  if (tacTextPlacing) {
    tacTextPlacing = false;
  } else {
    tacTextPlacing = true;
    tacPlaceRole = null;
    tacPlaceItem = null;
  }
  updateTacTextUi();
});


export function renderTacTextList() {
  
  const ae = document.activeElement;
  if (ae && ae.tagName === 'INPUT' && tacTextList.contains(ae)) return;
  const texts = tacBoard().texts;
  tacTextList.innerHTML = '';
  if (!texts.length) {
    tacTextList.innerHTML =
      translate("application.renderTacTextList");
    return;
  }
  if (tacSelectedText !== null && !texts[tacSelectedText]) tacSelectedText = null;
  texts.forEach((t, idx) => {
    const row = document.createElement('div');
    row.className = 'tac-text-row' + (tacSelectedText === idx ? ' sel' : '');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = t.text;
    input.maxLength = 60;
    input.addEventListener('input', () => {
      t.text = input.value;
      renderTacBoard();
    });
    input.addEventListener('focus', () => {
      tacSelectedText = idx;
      
      tacTextStyle.color = t.color;
      tacTextStyle.size = t.size;
      tacTextSizeEl.value = t.size;
      tacTextSizeVal.textContent = t.size;
      tacTextColorsEl.querySelectorAll('.tac-color').forEach((b) =>
        b.classList.toggle('active', b.dataset.color === t.color));
      renderTacBoard();
      renderTacTextList();
    });
    const done = document.createElement('button');
    done.className = 'tac-text-done';
    done.type = 'button';
    done.textContent = '√';
    done.title = translate("application.renderTacTextListAlternate");
    done.addEventListener('click', () => {
      if (tacSelectedText === idx) tacSelectedText = null;
      if (document.activeElement && tacTextList.contains(document.activeElement))
        document.activeElement.blur();
      renderTacBoard();
    });
    const del = document.createElement('button');
    del.className = 'tac-text-del';
    del.type = 'button';
    del.textContent = '✕';
    del.title = translate("application.renderTacTextListThird");
    del.addEventListener('click', () => {
      const removed = tacBoard().texts[idx];
      tacBoard().texts.splice(idx, 1);
      tacUndoStack.push({ type: 'delText', text: { ...removed }, idx });
      if (tacSelectedText === idx) tacSelectedText = null;
      renderTacBoard();
    });
    row.append(input, done, del);
    tacTextList.appendChild(row);
  });
}


export function tacLoadImg(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function tacExportImage() {
  const map = MAPS_DATA[S.currentMapId];
  const treasureRings = getTreasureRings(map,
    tacBoard().tokens.find((t) => t.role === 'explorer' && t.showTreasureRange) || null,
    S.currentCipherIndex, TAC_TREASURE_RULE);
  const [W0, H0] = map.mapSize;
  // 以旋转层（地图原始宽高比）为地图空间参考
  const wrapW = (tacRot && tacRot.clientWidth) || tacMapWrap.clientWidth || 1;
  const wrapH = (tacRot && tacRot.clientHeight) || tacMapWrap.clientHeight || 1;

  const cropOn = tacDisplay.exportCrop && tacZoomState.scale > 1;
  // 导出「旋转后的地图」开关：关闭时导出未旋转的原始地图（本身正立）
  const rotK = tacDisplay.exportRot ? (tacRotK & 3) : 0;

  let W, H, vx, vy, vw, vh;
  if (cropOn && rotK === 0) {
    // 未旋转：保持原有参考（导出尺寸 = 屏幕地图像素尺寸）
    W = Math.round(wrapW);
    H = Math.round(wrapH);
    vx = -tacZoomState.tx / (tacZoomState.scale * wrapW);
    vy = -tacZoomState.ty / (tacZoomState.scale * wrapH);
    vw = 1 / tacZoomState.scale;
    vh = 1 / tacZoomState.scale;
  } else if (cropOn) {
    // 旋转：wrap 可见矩形映射回地图空间（逆变换），导出尺寸按地图像素
    const fu = -tacZoomState.tx / (tacZoomState.scale * wrapW);
    const fv = -tacZoomState.ty / (tacZoomState.scale * wrapH);
    const fw = 1 / tacZoomState.scale, fh = fw;
    const mr = rotK === 1 ? { x: 1 - fv - fh, y: fu, w: fh, h: fw }
      : rotK === 2 ? { x: 1 - fu - fw, y: 1 - fv - fh, w: fw, h: fh }
      : { x: fv, y: 1 - fu - fw, w: fh, h: fw };
    vx = mr.x; vy = mr.y; vw = mr.w; vh = mr.h;
    W = Math.max(1, Math.round(mr.w * W0));
    H = Math.max(1, Math.round(mr.h * H0));
  } else {
    W = W0;
    H = H0;
    vx = 0; vy = 0; vw = 1; vh = 1;
  }
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  const sx = W / wrapW, sy = H / wrapH;
  const K = 1 / vw;
  
  const PX = (rx) => (rx - vx) * W / vw;
  const PY = (ry) => (ry - vy) * H / vh;
  // 旋转导出时，图标/文字等正立叠加层绘制到旋转后的画布上；
  // PXY 把地图分数映射到「当前目标画布」的像素（k=0 时即 PX/PY）。
  let uctx = ctx;
  let PXY = (fx, fy) => [(fx - vx) * W / vw, (fy - vy) * H / vh];

  
  const chainFirst = {}, chainLast = {};
  tacBoard().measures.forEach((m, i) => {
    if (m.chain == null) return;
    if (chainFirst[m.chain] === undefined) chainFirst[m.chain] = i;
    chainLast[m.chain] = i;
  });

  
  const base = await tacLoadImg(map.mapImage);
  if (base) ctx.drawImage(base, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  else { ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, W, H); }

  // 挂人范围色带（地图对齐画布，随整图旋转步骤一起旋转）
  if (tacCarryCanvas && tacCarryState.resultMapId === S.currentMapId) {
    ctx.drawImage(tacCarryCanvas, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  }
  // 两点最优路径折线（同为地图对齐画布）
  if (tacPathCanvas && tacPathState.resultMapId === S.currentMapId) {
    ctx.drawImage(tacPathCanvas, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  }

  
  const svgClone = tacArrowSvg.cloneNode(true);
  if (!tacDisplay.exportRot) {
    // 屏幕旋转态下给 SVG 文字加的正立补偿，不适用于未旋转导出
    svgClone.querySelectorAll('text[transform]').forEach((t) => t.removeAttribute('transform'));
  }
  svgClone.setAttribute('xmlns', TAC_SVG_NS);
  svgClone.setAttribute('width', W0);
  svgClone.setAttribute('height', H0);
  const svgUrl = URL.createObjectURL(new Blob(
    [new XMLSerializer().serializeToString(svgClone)], { type: 'image/svg+xml' }));
  const svgImg = await tacLoadImg(svgUrl);
  URL.revokeObjectURL(svgUrl);
  if (svgImg) ctx.drawImage(svgImg, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);

  
  if (tacDisplay.zones) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = Math.max(1.5, W * K / 400);
    mapsZonesRelative[S.currentMapId].forEach((z) =>
      ctx.strokeRect(PX(z.x), PY(z.y), z.width * W / vw, z.height * H / vh));
  }

  // Treasure rings are DOM overlays, so the SVG clone above does not include them.
  // Scale their map-relative geometry with the same crop transform as landmarks.
  ctx.save();
  const ringScale = W / vw;
  const strokeScale = ringScale / wrapW;
  ctx.lineWidth = 2 * strokeScale;
  ctx.setLineDash([4 * strokeScale, 3 * strokeScale]);
  treasureRings.forEach((ring) => {
    const x = PX(ring.x), y = PY(ring.y);
    const outer = ring.outerRadius * ringScale;
    const inner = ring.innerRadius * ringScale;
    ctx.fillStyle = ring.excluded ? 'rgba(124, 196, 255, 0.28)' : 'rgba(255, 213, 79, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y, outer, 0, Math.PI * 2);
    ctx.moveTo(x + inner, y);
    ctx.arc(x, y, inner, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.strokeStyle = ring.excluded ? 'rgba(124, 196, 255, 0.9)' : 'rgba(255, 213, 79, 0.9)';
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0, outer - ctx.lineWidth / 2), 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  const [ciphIcon, dungeonIcon, doorIcon, chairIcon, boxIcon, spawnSurvIcon, spawnHuntIcon] = await Promise.all([
    tacLoadImg(CIPHER_ICON_URL), tacLoadImg(DUNGEON_ICON_URL),
    tacLoadImg(ESCAPE_DOOR_ICON_URL), tacLoadImg(CHAIR_ICON_URL),
    tacLoadImg(BOX_ICON_URL), tacLoadImg(SPAWN_SURVIVOR_ICON_URL),
    tacLoadImg(SPAWN_HUNTER_ICON_URL)]);

  
  // 正立叠加层：地标/造物/角色图标与图文文字。
  // 旋转导出时在整图旋转完成后绘制到旋转后的画布上，保证图标与文字正立。
  const paintUprightOverlays = async () => {
    const [oW] = [uctx.canvas.width];
    const wrapX = (rotK % 2 === 1) ? wrapH : wrapW;
    if (tacDisplay.ciphers && ciphIcon) {
      const size = tacDisplay.cipherSize / 100 * W * K;
      const pctPx = 12 * (oW / wrapX) * K;
      uctx.save();
      uctx.font = `800 ${pctPx}px 'Noto Sans SC', sans-serif`;
      uctx.textAlign = 'center';
      uctx.textBaseline = 'top';
      uctx.lineJoin = 'round';
      map.cipherCombinations[S.currentCipherIndex].forEach((cid) => {
        const c = cipherOf(S.currentMapId, cid);
        if (!c) return;
        const [x, y] = PXY(c.location[0] / W0, c.location[1] / H0);
        uctx.drawImage(ciphIcon, x - size / 2, y - size / 2, size, size);
        const pct = tacCipherPctOf(S.currentMapId, cid);
        if (pct != null) {
          const ty = y + size / 2 + pctPx * 0.1;
          uctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
          uctx.lineWidth = Math.max(1.5, pctPx / 6);
          uctx.strokeText(`${pct}%`, x, ty);
          uctx.fillStyle = '#f8fafc';
          uctx.fillText(`${pct}%`, x, ty);
        }
      });
      uctx.restore();
    }
    if (tacDisplay.dungeon && dungeonIcon && map.dungeons.length) {
      const pt = map.dungeons[S.tacDungeonIndex % map.dungeons.length];
      const size = tacDisplay.dungeonSize / 100 * W * K;
      const [x, y] = PXY(pt[0] / W0, pt[1] / H0);
      uctx.drawImage(dungeonIcon, x - size / 2, y - size / 2, size, size);
    }
    if (tacDisplay.doors && doorIcon) {
      const size = tacDisplay.doorSize / 100 * W * K;
      tacDoorPoints(map).forEach((pt) => {
        const [x, y] = PXY(pt[0] / W0, pt[1] / H0);
        uctx.drawImage(doorIcon, x - size / 2, y - size / 2, size, size);
      });
    }
    if (tacDisplay.spawns && spawnSurvIcon && spawnHuntIcon && (map.spawns || []).length) {
      const group = map.spawns[S.tacSpawnIndex % map.spawns.length];
      const size = tacDisplay.spawnSize / 100 * W * K;
      const drawSpawn = (pt, icon) => {
        const [x, y] = PXY(pt[0] / W0, pt[1] / H0);
        uctx.drawImage(icon, x - size / 2, y - size / 2, size, size);
      };
      group.survivor.forEach((pt) => drawSpawn(pt, spawnSurvIcon));
      drawSpawn(group.hunter, spawnHuntIcon);
    }

    // 狂欢之椅：固定椅 + 当前刷点组 + 当前地下室组
    const xzOf = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
    if (chairIcon && map.rocketChairs) {
      const ch = map.rocketChairs;
      const size = tacDisplay.chairSize / 100 * W * K;
      const drawChair = (pt) => {
        const [px, pz] = xzOf(pt);
        const [x, y] = PXY(px / W0, pz / H0);
        uctx.drawImage(chairIcon, x - size / 2, y - size / 2, size, size);
      };
      if (tacDisplay.chairs) {
        ch.fixed.forEach(drawChair);
        if (ch.sets.length) ch.sets[S.tacChairIndex % ch.sets.length].forEach(drawChair);
      }
      const bs = tacBasementList();
      if (tacDisplay.chairsBasement && bs.length) {
        bs[S.tacChairBasementIndex % bs.length].rocketChairs.forEach(drawChair);
      }
    }

    // 箱子：固定箱 + 当前地下室组
    if (boxIcon && map.chests) {
      const bx = map.chests;
      const size = tacDisplay.boxSize / 100 * W * K;
      const drawBox = (pt) => {
        const [px, pz] = xzOf(pt);
        const [x, y] = PXY(px / W0, pz / H0);
        uctx.drawImage(boxIcon, x - size / 2, y - size / 2, size, size);
      };
      if (tacDisplay.boxes) bx.fixed.forEach(drawBox);
      const bs2 = tacBasementList();
      if (tacDisplay.boxesBasement && bs2.length) {
        bs2[S.tacChairBasementIndex % bs2.length].chest.forEach(drawBox);
      }
    }

    // 固定点位图标（教授鳞片 / 摄影师照相机 / 疯眼控制台 / 小丑零件 / 冒险家书页）
    for (const [role, cfg] of Object.entries(map.fixedSpawns || {})) {
      const token = tacTokenByRole(role);
      if (!token || !token.showFixedSpawns) continue;
      const fsItems = (Array.isArray(cfg.item) ? cfg.item : [cfg.item]).filter(Boolean);
      for (const item of fsItems) {
        for (const pt of item.points) {
          const p = Array.isArray(pt) ? pt : pt.p;
          const [x, y] = PXY(p[0] / W0, p[1] / H0);
          if (item.flag_orientation) {
            const fsIcon = TAC_FIXED_SPAWN_ICONS[item.icon] || item.icon;
            if (fsIcon) {
              const isz = 0.03 * W * K;
              const camImg = await tacLoadImg(fsIcon);
              if (camImg) { uctx.drawImage(camImg, x - isz / 2, y - isz / 2, isz, isz); continue; }
            }
            uctx.save();
            uctx.fillStyle = '#f8fafc';
            uctx.beginPath();
            uctx.arc(x, y, Math.max(2, W * K / 150), 0, Math.PI * 2);
            uctx.fill();
            uctx.restore();
          } else {
            const spawnDef = TAC_ITEM_TYPES[item.icon] || {};
            if (spawnDef.icon) {
              const isz = (spawnDef.iconSize || 3.4) / 100 * W * K;
              const iconImg = await tacLoadImg(spawnDef.icon);
              if (iconImg) { uctx.drawImage(iconImg, x - isz / 2, y - isz / 2, isz, isz); continue; }
            }
            uctx.save();
            uctx.fillStyle = '#f8fafc';
            uctx.beginPath();
            uctx.arc(x, y, Math.max(2, W * K / 150), 0, Math.PI * 2);
            uctx.fill();
            uctx.restore();
          }
        }
      }
    }

    // 造物图标与 fallback 圆点（范围圆在地图画布上随图旋转绘制）
    for (const it of board.items) {
      const def = TAC_ITEM_TYPES[it.kind];
      if (!def) continue;
      const [x, y] = PXY(it.x, it.y);
      const icon = itemIconCache[it.kind];
      if (icon) {
        const isz = (it.iconSize ?? 3.4) / 100 * W * K;
        uctx.drawImage(icon, x - isz / 2, y - isz / 2, isz, isz);
      } else if (!def.icon || it.hideIcon) {
        uctx.fillStyle = def.color || '#e2e8f0';
        uctx.beginPath();
        uctx.arc(x, y, Math.max(3, W * K / 200), 0, Math.PI * 2);
        uctx.fill();
      }
    }

    // 角色图标（或首字 fallback），保持正立
    for (const t of board.tokens) {
      const def = TAC_ROLES[t.role] || {};
      const [x, y] = PXY(t.x, t.y);
      const d = t.size / 100 * W * K;
      if (def.icon) {
        const img = await tacLoadImg(def.icon);
        if (img) { uctx.drawImage(img, x - d / 2, y - d / 2, d, d); continue; }
      }
      uctx.save();
      uctx.fillStyle = def.color || '#fff';
      uctx.beginPath();
      uctx.arc(x, y, d / 2, 0, Math.PI * 2);
      uctx.fill();
      uctx.fillStyle = '#0f172a';
      uctx.font = `800 ${d * 0.42}px 'Noto Sans SC', sans-serif`;
      uctx.textAlign = 'center';
      uctx.textBaseline = 'middle';
      uctx.fillText((def.name || t.role).charAt(0), x, y);
      uctx.restore();
    }

    // 图文文字（保持正立，多行沿输出纵向排开）
    uctx.save();
    uctx.textAlign = 'center';
    uctx.textBaseline = 'middle';
    uctx.lineJoin = 'round';
    board.texts.forEach((t) => {
      const px = Math.max(2.2, t.size * 0.18) / 100 * (oW / wrapX) * K;
      uctx.font = `700 ${px}px 'Noto Sans SC', sans-serif`;
      const lines = String(t.text).split('\n');
      const lh = px * 1.35;
      const [tx, ty0] = PXY(t.x, t.y);
      lines.forEach((line, i) => {
        const ty = ty0 + (i - (lines.length - 1) / 2) * lh;
        uctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        uctx.lineWidth = Math.max(2, px / 6);
        uctx.strokeText(line, tx, ty);
        uctx.fillStyle = t.color;
        uctx.fillText(line, tx, ty);
      });
    });
    uctx.restore();

    // ---- 推算标注（红圈 / 圆点 / 时间文字，全部保持正立） ----
    // 屏幕上的固定 px 尺寸（圆点 12px、文字 10/11px、标签上移 15px）按输出比例换算
    const fx = (oW / wrapX) * K;
    const ringLw = Math.max(1.5, 2 * (W * K) / wrapW);
    const drawRing = (x, z) => {
      const [cx, cy] = PXY(x / W0, z / H0);
      const d = tacDisplay.chairSize * 1.5 / 100 * W * K;
      uctx.save();
      uctx.strokeStyle = '#ff5252';
      uctx.lineWidth = ringLw;
      uctx.beginPath();
      uctx.arc(cx, cy, Math.max(1, d / 2 - ringLw / 2), 0, Math.PI * 2);
      uctx.stroke();
      uctx.restore();
    };
    const drawDot = (x, z, color) => {
      const [cx, cy] = PXY(x / W0, z / H0);
      uctx.save();
      uctx.fillStyle = color;
      uctx.strokeStyle = '#fff';
      uctx.lineWidth = Math.max(1, 2 * fx);
      uctx.beginPath();
      uctx.arc(cx, cy, Math.max(2, 6 * fx), 0, Math.PI * 2);
      uctx.fill();
      uctx.stroke();
      uctx.restore();
    };
    const drawLabel = (x, z, text, color, sizePx) => {
      const [cx, cy] = PXY(x / W0, z / H0);
      const px = sizePx * fx;
      uctx.save();
      uctx.font = `700 ${px}px 'Noto Sans SC', sans-serif`;
      uctx.textAlign = 'center';
      uctx.textBaseline = 'middle';
      uctx.lineJoin = 'round';
      uctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      uctx.lineWidth = Math.max(1.5, px / 5);
      uctx.strokeText(text, cx, cy - 15 * fx);
      uctx.fillStyle = color;
      uctx.fillText(text, cx, cy - 15 * fx);
      uctx.restore();
    };
    // 选中椅的正圆红框（与屏幕一致：椅子模式、未勾选隐藏选中圈、对应图标组显示中）
    const sel = tacCarryState.chair;
    if (sel && sel.kind !== 'point' && !tacDisplay.carryHideRing
        && (sel.kind === 'basement' ? tacDisplay.chairsBasement : tacDisplay.chairs)) {
      drawRing(sel.x, sel.z);
    }
    // 明细行点击的标记红圈
    const markRows = tacCarryState.cache?.chairRows;
    if (tacCarryState.detailMark != null && markRows?.[tacCarryState.detailMark]
        && tacCarryState.mode === 'point') {
      drawRing(markRows[tacCarryState.detailMark].x, markRows[tacCarryState.detailMark].z);
    }
    // 选点模式的起点圆点 / 路径规划的 A/B 端点圆点
    if (sel?.kind === 'point') drawDot(sel.x, sel.z, 'rgba(255, 82, 82, 0.9)');
    if (tacPathState.points.a) drawDot(tacPathState.points.a.x, tacPathState.points.a.z, 'rgba(255, 82, 82, 0.9)');
    if (tacPathState.points.b) drawDot(tacPathState.points.b.x, tacPathState.points.b.z, 'rgba(50, 139, 255, 0.9)');
    // 选点模式各椅时间标注（颜色随被关色带外推，与屏幕一致）
    const cache = tacCarryState.cache;
    if (cache && tacCarryState.resultMapId === S.currentMapId
        && tacCarryState.mode === 'point' && cache.chairRows) {
      const tide = cache.scenario === 'tide';
      const colors = tide ? TIDE_BAND_COLORS : CARRY_BAND_COLORS;
      const resolve = (band) => {
        let b = band;
        while (b < colors.length && tacCarryState.hiddenBands.has(b)) b++;
        return b < colors.length ? b : -1;
      };
      for (const r of cache.chairRows) {
        const shown = resolve(r.band);
        const text = tide
          ? translate(r.band === 4 ? 'ui.tacTide.timeMargin' : 'ui.tacTide.timeSeconds', { seconds: r.t.toFixed(1) })
          : translate(carryDropBudget(cache.profile, r.t).risk
            ? 'ui.tacCarry.timeRisk' : 'ui.tacCarry.timeSeconds', { seconds: r.t.toFixed(1) });
        drawLabel(r.x, r.z, text, shown >= 0 ? colors[shown] : '#a4afbb', 10);
      }
    }
    // 起点文字（牵气球起点 / 起点）与路径 A/B 端点文字
    if (sel?.kind === 'point') {
      drawLabel(sel.x, sel.z,
        translate(tacCarryState.scenario === 'tide' ? 'ui.tacTide.startLabel' : 'ui.tacCarry.startLabel'),
        '#ff5252', 11);
    }
    if (tacPathState.points.a) {
      drawLabel(tacPathState.points.a.x, tacPathState.points.a.z,
        translate('ui.tacPath.startLabelA'), '#ff5252', 11);
    }
    if (tacPathState.points.b) {
      drawLabel(tacPathState.points.b.x, tacPathState.points.b.z,
        translate('ui.tacPath.endLabelB'), '#328bff', 11);
    }
  };

  // 固定点位范围椭圆（教授鳞片 / 摄影师照相机 / 疯眼控制台及范围 / 小丑零件 / 冒险家书页）
  // 图标在 paintUprightOverlays 中正立绘制
  for (const [role, cfg] of Object.entries(map.fixedSpawns || {})) {
    const token = tacTokenByRole(role);
    if (!token) continue;
    const fsItems = (Array.isArray(cfg.item) ? cfg.item : [cfg.item]).filter(Boolean);
    fsItems.forEach((item) => {
      if (!(token.showFixedSpawnRange && item.rangeM && item.rangeScreenM && map.widthM)) return;
      const [screenW, screenH] = item.rangeScreenM[token.fixedSpawnDevice === 'ios' ? 'ios' : 'pc'];
      const metersToPxX = W / (vw * map.widthM);
      const metersToPxY = metersToPxX;
      const outerW = (item.rangeM * 2 + screenW) * metersToPxX;
      const outerH = (item.rangeM * 2 + screenH) * metersToPxY;
      ctx.save();
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.fillStyle = 'rgba(125, 211, 252, 0.08)';
      ctx.lineWidth = Math.max(1.2, W * K / 500);
      ctx.setLineDash([W * K / 50, W * K / 80]);
      item.points.forEach((pt) => {
        const p = item.flag_orientation ? pt.p : pt;
        ctx.beginPath();
        ctx.ellipse(PX(p[0] / W0), PY(p[1] / H0), outerW / 2, outerH / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    });
    // 朝向箭头（随地图旋转绘制，指向与屏幕一致）
    if (token.showFixedSpawns) fsItems.forEach((item) => {
      if (!item.flag_orientation) return;
      item.points.forEach((pt) => {
        const x = PX(pt.p[0] / W0), y = PY(pt.p[1] / H0);
        const ang = Math.atan2(pt.d[1], pt.d[0]);
        const arrowLen = 0.022 * W * K;
        ctx.save();
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = Math.max(1.5, W * K / 300);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(ang) * arrowLen, y + Math.sin(ang) * arrowLen);
        ctx.stroke();
        const head = arrowLen * 0.42;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ang) * arrowLen, y + Math.sin(ang) * arrowLen);
        ctx.lineTo(x + Math.cos(ang) * (arrowLen - head) + Math.cos(ang + Math.PI / 2) * head * 0.6,
          y + Math.sin(ang) * (arrowLen - head) + Math.sin(ang + Math.PI / 2) * head * 0.6);
        ctx.moveTo(x + Math.cos(ang) * arrowLen, y + Math.sin(ang) * arrowLen);
        ctx.lineTo(x + Math.cos(ang) * (arrowLen - head) + Math.cos(ang - Math.PI / 2) * head * 0.6,
          y + Math.sin(ang) * (arrowLen - head) + Math.sin(ang - Math.PI / 2) * head * 0.6);
        ctx.stroke();
        ctx.restore();
      });
    });
  }

  const board = tacBoard();

  const itemIconCache = {};
  await Promise.all(board.items.map(async (it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    if (def && def.icon && !it.hideIcon && itemIconCache[it.kind] === undefined)
      itemIconCache[it.kind] = await tacLoadImg(def.icon);
  }));
  // 造物范围圆（随地图画布旋转绘制，圆旋转后仍为正圆）
  for (const it of board.items) {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def) continue;
    const x = PX(it.x), y = PY(it.y);
    const sizePct = tacItemSizePercent(it);
    if (sizePct !== null) {
      const d = sizePct / 100 * W * K;
      ctx.save();
      if (def.fill) { ctx.fillStyle = def.fill; }
      ctx.strokeStyle = def.color || '#e2e8f0';
      ctx.setLineDash([W * K / 60, W * K / 90]);
      ctx.lineWidth = Math.max(1.5, W * K / 350);
      ctx.beginPath();
      ctx.arc(x, y, d / 2, 0, Math.PI * 2);
      if (def.fill) ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.restore();
    }
  }

  // 图标与文字：k=0 直接绘制；旋转导出时在整图旋转完成后绘制（保持正立）
  if (rotK === 0) await paintUprightOverlays();

  
  ctx.save();
  ctx.lineWidth = Math.max(1.5, W * K / 400);
  board.measures.forEach((m, idx) => {
    if (tacDisplay.hideEndpoints) return;
    const isChain = m.chain != null;
    if (isChain && !(chainFirst[m.chain] === idx || chainLast[m.chain] === idx)) return;
    const dotColor = tacMeasureSegColor(m);
    [['x1', 'y1'], ['x2', 'y2']].forEach(([kx, ky]) => {
      if (isChain) {
        const isStartEnd =
          (chainFirst[m.chain] === idx && kx === 'x1')
          || (chainLast[m.chain] === idx && kx === 'x2');
        if (!isStartEnd) return;
      }
      ctx.fillStyle = dotColor;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(PX(m[kx]), PY(m[ky]), 6 * sx * K, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });
  ctx.restore();

  
  // 按当前旋转角度整图逆时针旋转；SVG 层文字已带正立补偿，
  // 图标/图文等正立叠加层在旋转后补绘到输出画布上
  let out = cv;
  if (rotK) {
    const rcv = document.createElement('canvas');
    rcv.width = rotK % 2 === 1 ? cv.height : cv.width;
    rcv.height = rotK % 2 === 1 ? cv.width : cv.height;
    const rctx = rcv.getContext('2d');
    rctx.save();
    rctx.translate(rcv.width / 2, rcv.height / 2);
    rctx.rotate(-Math.PI / 2 * rotK);
    rctx.drawImage(cv, -cv.width / 2, -cv.height / 2);
    rctx.restore();
    out = rcv;
    // uctx 与 rctx 是同一上下文：必须先恢复单位变换，正立层才能按输出坐标直绘
    uctx = out.getContext('2d');
    uctx.setTransform(1, 0, 0, 1, 0, 0);
    // 与像素拷贝共用同一几何：地图分数 → cv 像素 → 整图旋转到输出像素
    PXY = (fx, fy) => {
      const cx = (fx - vx) * W / vw, cy = (fy - vy) * H / vh;
      switch (rotK) {
        case 1: return [cy, W - cx];
        case 2: return [W - cx, H - cy];
        case 3: return [H - cy, cx];
        default: return [cx, cy];
      }
    };
    await paintUprightOverlays();
  }

  const fileName = translate("application.fileName", { name: map.mapName });
  // 微信 / B 站 App 的 webview 会拦截 <a download> 下载，改为弹出图片供长按保存
  const saveByLongPress = /MicroMessenger|bili/i.test(navigator.userAgent);
  const openSaveOverlay = (dataUrl) => {
    if (!tacSaveOverlay || !tacSaveImg) return false;
    tacSaveImg.src = dataUrl;
    tacSaveOverlay.hidden = false;
    return true;
  };
  const download = (blobUrl) => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  try {
    if (saveByLongPress) {
      if (!openSaveOverlay(out.toDataURL('image/png'))) throw new Error('save overlay unavailable');
      showToast(translate("ui.tacSaveOverlay.toast"));
      return;
    }
    if (out.toBlob) {
      out.toBlob(async (blob) => {
        if (!blob) { showToast(translate("application.tacExportImage")); return; }
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file] });
            return;
          } catch (err) {
            if (err && err.name === 'AbortError') return; 
          }
        }
        const url = URL.createObjectURL(blob);
        download(url);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        showToast(translate("application.tacExportImageAlternate"));
      }, 'image/png');
    } else {
      download(out.toDataURL('image/png'));
      showToast(translate("application.tacExportImageAlternate"));
    }
  } catch (err) {
    showToast(translate("application.tacExportImageThird"));
  }
}

tacExportBtn.addEventListener('click', tacExportImage);

// 长按保存弹层：关闭按钮 / 点背景 / Esc
if (tacSaveOverlay && tacSaveClose) {
  const closeSaveOverlay = () => { tacSaveOverlay.hidden = true; };
  tacSaveClose.addEventListener('click', closeSaveOverlay);
  tacSaveOverlay.addEventListener('click', (event) => {
    if (event.target === tacSaveOverlay) closeSaveOverlay();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !tacSaveOverlay.hidden) closeSaveOverlay();
  });
}


export function tacPos(e) {
  const r = tacMapWrap.getBoundingClientRect();
  const clamp01 = (v) => Math.min(0.995, Math.max(0.005, v));
  const u = clamp01((e.clientX - r.left) / r.width);
  const v = clamp01((e.clientY - r.top) / r.height);
  // wrap（视觉）坐标 -> 地图坐标：旋转的逆变换
  let x = u, y = v;
  switch (tacRotK & 3) {
    case 1: x = 1 - v; y = u; break;
    case 2: x = 1 - u; y = 1 - v; break;
    case 3: x = v; y = 1 - u; break;
  }
  return { x: clamp01(x), y: clamp01(y), W: r.width, H: r.height };
}

tacMapWrap.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  
  if (tacZoomState.pan) {
    tacPanDrag = { startX: e.clientX, startY: e.clientY,
      baseTx: tacZoomState.tx, baseTy: tacZoomState.ty };
    tacMapWrap.classList.add('grabbing');
    tacMapWrap.setPointerCapture(e.pointerId);
    return;
  }
  const tokenEl = e.target.closest('.tac-token');
  const itemEl = e.target.closest('.tac-item-circle, .tac-item-pin');
  const textEl = e.target.closest('.tac-text');
  const p = tacPos(e);

  // 推算选择模式：选椅=点击椅子选中；选点=点击任意位置选起点
  // （椅子图标 pointer-events:none，按地图坐标找最近椅子）
  if (tacCarryState.armed) {
    const [W0, H0] = MAPS_DATA[S.currentMapId].mapSize;
    const mx = p.x * W0, my = p.y * H0;
    if (tacCarryState.mode === 'point') {
      tacCarrySelectPoint(mx, my);
      return;
    }
    let best = null, bestD = Infinity;
    for (const c of tacCarryGroundChairs()) {
      const d = Math.hypot(c.x - mx, c.z - my);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (best && bestD <= W0 * 0.04) tacCarrySelect(best.kind, best.index);
    return;
  }

  // 两点最优路径规划：选择模式下点击地图任意位置选起点 A / 终点 B
  if (tacPathState.armed) {
    const [W0, H0] = MAPS_DATA[S.currentMapId].mapSize;
    tacPathSelectPoint(tacPathState.armed, p.x * W0, p.y * H0);
    return;
  }

  
  if (tacTextPlacing) {
    const content = (tacTextInput.value || '').trim() || translate("application.content");
    tacBoard().texts.push({
      x: p.x, y: p.y, text: content,
      color: tacTextStyle.color, size: tacTextStyle.size,
    });
    tacUndoStack.push({ type: 'addText' });
    tacSelectedText = tacBoard().texts.length - 1;
    tacTextPlacing = false;
    updateTacTextUi();
    renderTacBoard();
    return;
  }

  
  if (tacTool === 'delete') {
    if (tokenEl) {
      const tid = +tokenEl.dataset.tid;
      const ti = tacBoard().tokens.findIndex((t) => t.tid === tid);
      if (ti < 0) return;
      const removed = tacBoard().tokens[ti];
      const snapshot = { ...removed };
      tacBoard().tokens.splice(ti, 1);
      tacOnTokenRemoved(removed);
      tacUndoStack.push({ type: 'remove', token: snapshot });
      if (tacSelected === tid) tacSelected = null;
      renderTacBoard();
    } else if (itemEl) {
      const idx = +itemEl.dataset.idx;
      const removed = tacBoard().items[idx];
      tacBoard().items.splice(idx, 1);
      tacOnItemRemoved(removed);
      tacUndoStack.push({ type: 'delItem', item: { ...removed }, idx });
      if (tacSelectedItem === idx) tacSelectedItem = null;
      renderTacBoard();
    } else if (textEl) {
      const idx = +textEl.dataset.idx;
      const removed = tacBoard().texts[idx];
      tacBoard().texts.splice(idx, 1);
      tacUndoStack.push({ type: 'delText', text: { ...removed }, idx });
      if (tacSelectedText === idx) tacSelectedText = null;
      renderTacBoard();
    }
    return;
  }

  
  if (textEl) {
    tacSelectedText = +textEl.dataset.idx;
    tacDragText = { idx: tacSelectedText };
    tacMapWrap.setPointerCapture(e.pointerId);
    tacSelected = null;
    tacSelectedItem = null;
    renderTacBoard();
    return;
  }

  
  if (tacSelectedText !== null) {
    tacSelectedText = null;
    tacMapWrap.querySelectorAll('.tac-text.selected').forEach((el) =>
      el.classList.remove('selected'));
    updateTacPanel();
  }

  
  
  if (tacTool === 'draw') {
    const sp = tacSnapLandmark(p);
    tacDrawing = { x1: sp.x, y1: sp.y, x2: sp.x, y2: sp.y };
    tacMapWrap.setPointerCapture(e.pointerId);
    return;
  }

  
  if (tacTool === 'measure') {
    const dotEl = e.target.closest('.tac-measure-dot');
    if (dotEl) {
      
      const mIdx = +dotEl.dataset.idx;
      const m0 = tacBoard().measures[mIdx];
      const isA = dotEl.dataset.end === 'a';
      tacDragMeasure = {
        idx: mIdx, end: dotEl.dataset.end,
        ox: m0 ? (isA ? m0.x1 : m0.x2) : null,
        oy: m0 ? (isA ? m0.y1 : m0.y2) : null,
      };
      tacMapWrap.setPointerCapture(e.pointerId);
      return;
    }
    
    const gEl = e.target.closest('g[data-midx]');
    if (gEl && !tacMeasurePending) {
      const idx = +gEl.dataset.midx;
      if (tacBoard().measures[idx]) {
        tacSelMeasure = { idx };
        renderTacArrows();
        updateTacMeasureInfo();
        return;
      }
    }
    if (!tacMeasurePending) {
      const sp = tacSnapLandmark(p); 
      tacMeasurePending = { x: sp.x, y: sp.y };
      tacMeasureHover = null;
      tacSelMeasure = null; 
      
      if (tacMeasureMode === 'chain') tacChainRoute = ++tacRouteSeq;
    } else {
      const sp = tacSnapLandmark(p);
      
      const d = Math.hypot((sp.x - tacMeasurePending.x) * p.W,
        (sp.y - tacMeasurePending.y) * p.H);
      if (d >= 10) {
        const st = tacMeasureStyle[tacMeasureMode];
        const board = tacBoard();
        const chain = tacMeasureMode === 'chain' ? tacChainRoute : null;
        
        
        let lc = null;
        if (chain != null) {
          const prev = board.measures.filter((m) => m.chain === chain);
          if (prev.length && prev[0].lc) {
            lc = prev[0].lc;
            if (tacApplyScope === 'chain') tacExtendLineCfg(lc, prev.length);
            else tacAppendSegCfg(lc, prev.length);
          }
        }
        if (!lc) lc = tacNewLineCfg(1);
        board.measures.push({
          x1: tacMeasurePending.x, y1: tacMeasurePending.y,
          x2: sp.x, y2: sp.y,
          chain,
          color: st.color, width: st.width,
          lc,
        });
        tacUndoStack.push({ type: 'addMeasure' });
        
        tacMeasurePending = tacMeasureMode === 'chain' ? { x: sp.x, y: sp.y } : null;
        tacMeasureHover = null;
        renderTacBoard();
        return;
      }
    }
    renderTacArrows();
    updateTacMeasureInfo();
    return;
  }

  
  if (tokenEl) {
    const tid = +tokenEl.dataset.tid;
    if (tacTool !== 'select') setTacTool('select');
    tacSelected = tid;
    tacSelectedItem = null;
    tacPlaceRole = null;
    tacPlaceItem = null;
    tacManageSel = { type: 'role', tid }; 
    tacDrag = { tid };
    
    const naiadT0 = tacTokenByTid(tid);
    const abIt = naiadT0 ? tacAbyssItem(tid) : null;
    if (abIt && naiadT0) {
      abIt.abyss.recording = true;
      abIt.abyss.trail = [{ x: naiadT0.x, y: naiadT0.y }];
    }
    tacMapWrap.setPointerCapture(e.pointerId);
    tacMapWrap.querySelectorAll('.tac-token').forEach((el) =>
      el.classList.toggle('selected', el === tokenEl && tacDisplay.selGlow));
    updateTacPanel();
    return;
  }
  if (itemEl) {
    const idx = +itemEl.dataset.idx;
    if (tacTool !== 'select') setTacTool('select');
    tacSelectedItem = idx;
    tacSelected = null;
    tacPlaceRole = null;
    tacPlaceItem = null;
    tacManageSel = { type: 'item', idx }; 
    
    const it0 = tacBoard().items[idx];
    const abyssLocked = !!(it0 && it0.abyss && it0.abyss.on
      && it0.linkTid != null && tacTokenByTid(it0.linkTid));
    const mirrorLocked = !!(it0 && it0.kind === 'aquaMirror'
      && it0.showMirror && it0.fixedMirror);
    tacDragItem = (abyssLocked || mirrorLocked)
      ? null : { idx, pushingItems: new Set(), pushingRoles: new Set() };
    tacMapWrap.setPointerCapture(e.pointerId);
    tacMapWrap.querySelectorAll('.tac-item-circle, .tac-item-pin').forEach((el) =>
      el.classList.toggle('selected', +el.dataset.idx === idx && tacDisplay.selGlow));
    updateTacPanel();
    return;
  }
  if (tacPlaceItem) {
    const item = {
      iid: ++tacBoard().itemSeq,
      role: tacPlaceItem.role, kind: tacPlaceItem.kind,
      x: p.x, y: p.y,
    };
    tacBoard().items.push(item);
    tacAutoLinkItem(item);
    
    let cl = tacClampLinkPos(tacBoard().items.length - 1, p.x, p.y);
    
    cl = tacClampRoleLinkPos(tacBoard().items.length - 1, cl.x, cl.y);
    cl = tacHpClampPos(item, cl.x, cl.y);
    item.x = cl.x; item.y = cl.y;
    tacUndoStack.push({ type: 'addItem' });
    tacSelectedItem = tacBoard().items.length - 1;
    tacManageSel = { type: 'item', idx: tacSelectedItem };
    tacPlaceItem = null;
    if (item.kind === 'aquaMirror') tacSyncMirror('aq', item);
    renderTacBoard();
    return;
  }
  if (tacPlaceRole) {
    const token = {
      tid: ++tacBoard().tokenSeq, role: tacPlaceRole,
      x: p.x, y: p.y, size: TAC_MANAGE_DEFAULT.roleSize,
    };
    tacBoard().tokens.push(token);
    tacAutoLinkToken(token);
    const rp = tacClampTokenToLinkedItems(token, p.x, p.y);
    token.x = rp.x; token.y = rp.y;
    tacUndoStack.push({ type: 'place', tid: token.tid });
    tacSelected = token.tid;
    tacManageSel = { type: 'role', tid: token.tid };
    tacPlaceRole = null;
    renderTacBoard();
    return;
  }
  
  if (tacSelected || tacSelectedItem !== null || tacSelectedText !== null) {
    tacSelected = null;
    tacSelectedItem = null;
    tacSelectedText = null;
    renderTacBoard();
  }
});

tacMapWrap.addEventListener('pointermove', (e) => {
  
  if (tacPanDrag) {
    tacZoomState.tx = tacPanDrag.baseTx + (e.clientX - tacPanDrag.startX);
    tacZoomState.ty = tacPanDrag.baseTy + (e.clientY - tacPanDrag.startY);
    tacApplyZoom();
    return;
  }
  const p = tacPos(e);

  // 选椅模式：悬停地面椅子时显示红色波纹
  if (tacCarryState.armed) {
    const [W0, H0] = MAPS_DATA[S.currentMapId].mapSize;
    const mx = p.x * W0, my = p.y * H0;
    let best = null, bestD = Infinity;
    for (const c of tacCarryGroundChairs()) {
      const d = Math.hypot(c.x - mx, c.z - my);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (best && bestD <= W0 * 0.04) {
      const [vu, vv] = tacRotPt(best.x / W0, best.z / H0);
      tacSnapRipple.style.left = `${vu * 100}%`;
      tacSnapRipple.style.top = `${vv * 100}%`;
      tacSnapRipple.style.removeProperty('--snap-c');
      tacSnapRipple.style.removeProperty('--snap-g');
      tacSnapRipple.classList.add('show', 'chair');
      tacSnapRipple.classList.remove('door');
    } else {
      tacSnapRipple.classList.remove('show', 'chair');
    }
  } else {
    tacSnapRipple.classList.remove('chair');
    tacUpdateSnapRipple(p);
  }
  tacUpdateCoordsTip(p, e);
  
  if (tacDragMeasure) {
    const m = tacBoard().measures[tacDragMeasure.idx];
    if (!m) { tacDragMeasure = null; return; }
    const sp = tacSnapLandmark(p, tacDragMeasureExcl());
    if (tacDragMeasure.end === 'a') { m.x1 = sp.x; m.y1 = sp.y; }
    else { m.x2 = sp.x; m.y2 = sp.y; }
    const dot = tacMapWrap.querySelector(
      `.tac-measure-dot[data-idx="${tacDragMeasure.idx}"][data-end="${tacDragMeasure.end}"]`);
    if (dot) {
      dot.style.left = `${sp.x * 100}%`;
      dot.style.top = `${sp.y * 100}%`;
    }
    renderTacArrows();
    updateTacMeasureInfo();
    return;
  }
  
  if (tacMeasurePending) {
    const sp = tacSnapLandmark(p);
    tacMeasureHover = { x: sp.x, y: sp.y };
    renderTacArrows();
    updateTacMeasureInfo();
    return;
  }
  if (tacDrawing) {
    const sp = tacSnapLandmark(p);
    tacDrawing.x2 = sp.x;
    tacDrawing.y2 = sp.y;
    renderTacArrows();
  } else if (tacDrag) {
    const t = tacTokenByTid(tacDrag.tid);
    if (!t) { tacDrag = null; return; }
    
    const cl = tacClampTokenToLinkedItems(t, p.x, p.y);
    t.x = cl.x;
    t.y = cl.y;
    const el = tacMapWrap.querySelector(`.tac-token[data-tid="${tacDrag.tid}"]`);
    if (el) {
      el.style.left = `${t.x * 100}%`;
      el.style.top = `${t.y * 100}%`;
    }
    
    tacMapWrap.querySelectorAll(`.tac-role-circle[data-tid="${tacDrag.tid}"]`)
      .forEach((rg) => {
        rg.style.left = `${t.x * 100}%`;
        rg.style.top = `${t.y * 100}%`;
      });
    if (t.showTreasureRange) renderTacTreasure();
    tacAbyssRecord(p, t); 

    if (t.role === 'bloodyQueen') {
      const bqAq = tacBoard().items.find((it) => it.kind === 'aquaMirror' && it.linkTid === t.tid);
      if (bqAq) {
        const parts = tacMirrorParts(bqAq);
        if (tacSyncMirror('bq', bqAq)) {
          if (!parts.mi) renderTacBoard();
          else { tacSyncMirrorEl('mirrorImage', parts.mi); renderTacArrows(); }
        }
      }
      if (tacBoard().items.some((it) => it.linkTid === t.tid)) renderTacArrows();
    }

    if (tacBoard().items.some((it) => it.linkTid === t.tid)) {
      renderTacArrows();
    }
  } else if (tacDragText) {
    const t = tacBoard().texts[tacDragText.idx];
    if (!t) { tacDragText = null; return; }
    t.x = p.x;
    t.y = p.y;
    const el = tacMapWrap.querySelector(`.tac-text[data-idx="${tacDragText.idx}"]`);
    if (el) {
      el.style.left = `${t.x * 100}%`;
      el.style.top = `${t.y * 100}%`;
    }
  } else if (tacDragItem) {
    const it = tacBoard().items[tacDragItem.idx];
    if (!it) { tacDragItem = null; return; }
    
    
    let cl = tacClampLinkPos(tacDragItem.idx, p.x, p.y);
    cl = tacClampRoleLinkPos(tacDragItem.idx, cl.x, cl.y);
    cl = tacHpClampPos(it, cl.x, cl.y);
    const mdx = cl.x - it.x, mdy = cl.y - it.y; 
    it.x = cl.x;
    it.y = cl.y;
    tacMapWrap.querySelectorAll(
      `.tac-item-circle[data-idx="${tacDragItem.idx}"], .tac-item-pin[data-idx="${tacDragItem.idx}"]`)
      .forEach((el) => {
        el.style.left = `${it.x * 100}%`;
        el.style.top = `${it.y * 100}%`;
      });

    if (it.kind === 'aquaMirror' || it.kind === 'mirrorImage') {
      const movedKind = it.kind === 'aquaMirror' ? 'aq' : 'mi';
      const miAq = tacAqOfHost(it);
      if (miAq) {
        const parts = tacMirrorParts(miAq);
        if (tacSyncMirror(movedKind, miAq)) {
          if (!parts.mi) renderTacBoard();
          else {
            if (movedKind === 'aq') {
              tacSyncMirrorEl('mirrorImage', parts.mi);
            } else {
              tacSyncMirrorEl('aquaMirror', miAq);
              const parts2 = tacMirrorParts(miAq);
              const bqTk = parts2 && parts2.bq;
              const tkEl = bqTk && tacMapWrap.querySelector(`.tac-token[data-tid="${bqTk.tid}"]`);
              if (tkEl && bqTk) {
                tkEl.style.left = `${bqTk.x * 100}%`;
                tkEl.style.top = `${bqTk.y * 100}%`;
              }
            }
            renderTacArrows();
          }
        }
      }
    }
    
    
    
    const dragDef = TAC_ITEM_TYPES[it.kind];
    if (dragDef && dragDef.pushes && (mdx || mdy)) {
      const clamp01 = (v) => Math.min(0.995, Math.max(0.005, v));
      
      
      const ox = it.x - mdx, oy = (it.y - mdy) * p.H / p.W;
      const nx = it.x, ny = it.y * p.H / p.W;
      const segDx = nx - ox, segDy = ny - oy;
      const segLen2 = segDx * segDx + segDy * segDy;
      const dragPct = tacItemSizePercent(it) ?? 0;
      const tryPush = (x, y, size) => {
        const px = x, py = y * p.H / p.W;
        let tt = 0;
        if (segLen2 > 0) {
          tt = ((px - ox) * segDx + (py - oy) * segDy) / segLen2;
          tt = Math.min(1, Math.max(0, tt));
        }
        const ddx = px - (ox + segDx * tt);
        const ddy = py - (oy + segDy * tt);
        return Math.hypot(ddx, ddy) < (dragPct + size) / 200;
      };
      const board = tacBoard();
      
      board.items.forEach((other, oi) => {
        if (oi === tacDragItem.idx) return;
        const oDef = TAC_ITEM_TYPES[other.kind];
        if (!oDef || !oDef.pushable) return;
        if (!tacDragItem.pushingItems.has(oi)
            && !tryPush(other.x, other.y, tacItemSizePercent(other) ?? 0)) return;
        tacDragItem.pushingItems.add(oi);
        other.x = clamp01(other.x + mdx * 0.3);
        other.y = clamp01(other.y + mdy * 0.3);
        const oEl = tacMapWrap.querySelector(
          `.tac-item-circle[data-idx="${oi}"], .tac-item-pin[data-idx="${oi}"]`);
        if (oEl) {
          oEl.style.left = `${other.x * 100}%`;
          oEl.style.top = `${other.y * 100}%`;
        }
      });
      
      for (const t of board.tokens) {
        if ((TAC_ROLES[t.role] || {}).camp !== 'hunter') continue;
        if (!tacDragItem.pushingRoles.has(t.tid)
            && !tryPush(t.x, t.y, 0)) continue;
        tacDragItem.pushingRoles.add(t.tid);
        
        t.x = clamp01(t.x + mdx);
        t.y = clamp01(t.y + mdy);
        tacMapWrap.querySelectorAll(`.tac-token[data-tid="${t.tid}"]`)
          .forEach((tEl) => {
            tEl.style.left = `${t.x * 100}%`;
            tEl.style.top = `${t.y * 100}%`;
          });
        tacMapWrap.querySelectorAll(`.tac-role-circle[data-tid="${t.tid}"]`)
          .forEach((rgEl) => {
            rgEl.style.left = `${t.x * 100}%`;
            rgEl.style.top = `${t.y * 100}%`;
          });
      }
    }
    renderTacArrows(); 
  }
});

tacMapWrap.addEventListener('pointerup', (e) => {
  if (tacPanDrag) {
    tacPanDrag = null;
    tacMapWrap.classList.remove('grabbing');
    return;
  }
  const changed = tacDrawing || tacDrag || tacDragItem || tacDragText || tacDragMeasure;
  if (tacDrawing) {
    const p = tacPos(e);
    const dx = (tacDrawing.x2 - tacDrawing.x1) * p.W;
    const dy = (tacDrawing.y2 - tacDrawing.y1) * p.H;
    
    const bigEnough = tacDrawShape === 'arrow'
      ? Math.hypot(dx, dy) > 20
      : Math.abs(dx) > 20 && Math.abs(dy) > 20;
    if (bigEnough) {
      tacBoard().arrows.push(
        { ...tacDrawing, shape: tacDrawShape, color: tacArrowColor, width: tacArrowWidth });
      tacUndoStack.push({ type: 'addArrow' });
    }
    tacDrawing = null;
    renderTacArrows();
    updateTacPanel();
  }
  tacDrag = null;
  tacDragItem = null;
  tacDragText = null;
  tacDragMeasure = null;
  tacAbyssFinalize(); 
  if (changed) tacSave();
});

tacMapWrap.addEventListener('pointercancel', () => {
  const changed = tacDrag || tacDragItem || tacDragText || tacDragMeasure;
  tacPanDrag = null;
  tacMapWrap.classList.remove('grabbing');
  tacDrawing = null;
  tacDrag = null;
  tacDragItem = null;
  tacDragText = null;
  tacDragMeasure = null;
  tacAbyssFinalize(); 
  renderTacArrows();
  if (changed) tacSave();
});


tacMapWrap.addEventListener('pointerleave', () => {
  tacUpdateSnapRipple(null);
  tacUpdateCoordsTip(null);
  if (tacMeasurePending && tacMeasureHover) {
    tacMeasureHover = null;
    renderTacArrows();
    updateTacMeasureInfo();
  }
});


tacMapWrap.addEventListener('wheel', (e) => {
  const tokenEl = e.target.closest('.tac-token');
  const itemEl = e.target.closest('.tac-item-circle, .tac-item-pin');

  if (tokenEl && tacSelected === +tokenEl.dataset.tid) {
    e.preventDefault();
    const t = tacTokenByTid(+tokenEl.dataset.tid);
    if (!t) return;
    t.size = Math.min(12, Math.max(3, t.size + (e.deltaY < 0 ? 0.5 : -0.5)));
    renderTacBoard();
    return;
  }
  if (itemEl && tacSelectedItem === +itemEl.dataset.idx) {
    e.preventDefault();
    const idx = +itemEl.dataset.idx;
    const it = tacBoard().items[idx];
    if (!it) return;


    const cfg = (TAC_ITEM_TYPES[it.kind] || {}).ranges;
    if (cfg && Array.isArray(cfg.options)) {
      const rb = tacRbEnsure(cfg, it, false, false);
      const numIdx = cfg.options
        .map((opt, k) => (typeof opt.size_m === 'number' ? k : -1))
        .filter((k) => k >= 0);
      const arrIdx0 = cfg.options.findIndex((opt) => Array.isArray(opt.size_m));
      if (arrIdx0 >= 0) {
        // 档位数组：滚轮切换挡位
        const vals0 = cfg.options[arrIdx0].size_m;
        const cur0 = Number.isInteger(rb.gear) ? rb.gear : 0;
        rb.gear = Math.min(vals0.length - 1,
          Math.max(0, cur0 + (e.deltaY < 0 ? 1 : -1)));
      } else if (numIdx.length >= 2) {
        // 多档数字范围：滚轮换档；只替换参与换档的数字项，保留其它已点亮的范围
        const dir = e.deltaY < 0 ? 1 : -1;
        const lit = numIdx.filter((k) => rb.subs.includes(k));
        if (lit.length) {
          const i = numIdx.indexOf(lit[0]);
          const j2 = Math.min(numIdx.length - 1, Math.max(0, i + dir));
          if (j2 !== i) {
            rb.subs = rb.subs.filter((k) => k !== lit[0]);
            rb.subs.push(numIdx[j2]);
          }
        } else {
          rb.subs = [...rb.subs, numIdx[0]];
        }
      } else {
        const sliderIdx = cfg.options.findIndex((opt) => opt.size_m && typeof opt.size_m === 'object');
        if (sliderIdx >= 0) {
          const sm = cfg.options[sliderIdx].size_m;
          const dynMax = sm.max != null ? sm.max
            : (MAPS_DATA[S.currentMapId] && MAPS_DATA[S.currentMapId].widthM) || 100;
          const entries = tacRangeEntries(cfg, it, false);
          const cur = entries.length ? entries[0].meters : dynMax;
          rb.m = Math.round(Math.min(dynMax,
            Math.max(sm.min != null ? sm.min : 0,
              cur + (e.deltaY < 0 ? 0.1 : -0.1))) * 100) / 100;
        }
      }
    }
    renderTacBoard();
    return;
  }

  if (tacZoomState.locked) return;
  const dir = e.deltaY < 0 ? 1 : -1;
  if (dir > 0 && tacZoomState.scale >= TAC_ZOOM_MAX) return;
  if (dir < 0 && tacZoomState.scale <= 1) return;
  e.preventDefault();
  const r = tacMapWrap.getBoundingClientRect();

  const ax = (e.clientX - r.left) / (tacZoomState.scale * tacMapWrap.clientWidth);
  const ay = (e.clientY - r.top) / (tacZoomState.scale * tacMapWrap.clientHeight);
  tacZoomStep(dir, ax, ay);
}, { passive: false });


tacArrowSvg.addEventListener('click', (e) => {
  if (tacTool !== 'delete') return;
  const g = e.target.closest('g');
  if (!g) return;
  if (g.dataset.midx !== undefined) {
    const idx = +g.dataset.midx;
    const board = tacBoard();
    const m = board.measures[idx];
    
    if (m && m.chain != null && !tacDisplay.delSegOnly) {
      const removedList = [];
      for (let i = board.measures.length - 1; i >= 0; i--) {
        if (board.measures[i].chain === m.chain) {
          removedList.unshift({ measure: board.measures[i], idx: i });
          board.measures.splice(i, 1);
        }
      }
      tacUndoStack.push({ type: 'delMeasures', list: removedList });
      tacSegExpanded.clear();
      tacSelMeasure = null;
      renderTacBoard();
      return;
    }
    // Removing one segment also changes its neighbours' route IDs and configs.
    // structuredClone preserves shared configs in the complete undo snapshot.
    const measures = structuredClone(board.measures);
    const removed = tacDeleteMeasureAt(idx);
    if (removed) tacUndoStack.push({ type: 'restoreMeasures', measures });
    renderTacBoard();
    return;
  }
  if (g.dataset.idx === undefined) return;
  const idx = +g.dataset.idx;
  const [removed] = tacBoard().arrows.splice(idx, 1);
  if (removed) tacUndoStack.push({ type: 'delArrow', arrow: removed, idx });
  tacSave();
  renderTacArrows();
  updateTacPanel();
});


export function tacDeleteMeasureAt(idx) {
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


export function tacUndo() {
  const act = tacUndoStack.pop();
  if (!act) return;
  const board = tacBoard();
  if (act.type === 'addArrow') board.arrows.pop();
  else if (act.type === 'delArrow') board.arrows.splice(act.idx, 0, act.arrow);
  else if (act.type === 'place') {
    const ti = board.tokens.findIndex((t) => t.tid === act.tid);
    if (ti >= 0) board.tokens.splice(ti, 1);
    if (tacSelected === act.tid) tacSelected = null;
  } else if (act.type === 'remove') {
    board.tokens.push({ ...act.token });
  } else if (act.type === 'addItem') {
    board.items.pop();
    tacSelectedItem = null;
  } else if (act.type === 'delItem') {
    board.items.splice(act.idx, 0, act.item);
    tacSelectedItem = null;
  } else if (act.type === 'addMeasure') {
    board.measures.pop();
    tacSegExpanded.clear();
  } else if (act.type === 'restoreMeasures') {
    board.measures = act.measures;
    tacSelMeasure = null;
    tacSegExpanded.clear();
  } else if (act.type === 'delMeasures') { 
    act.list.forEach(({ measure, idx }) => board.measures.splice(idx, 0, measure));
    tacSegExpanded.clear();
  } else if (act.type === 'clear') {
    board.tokens = act.tokens;
    board.arrows = act.arrows;
    board.items = act.items || [];
    board.measures = act.measures || [];
    board.texts = act.texts || [];
    tacSelectedText = null;
  } else if (act.type === 'addText') {
    board.texts.pop();
    tacSelectedText = null;
  } else if (act.type === 'delText') {
    board.texts.splice(act.idx, 0, act.text);
  }
  renderTacBoard();
}

export function tacClear() {
  const board = tacBoard();
  if (!board.tokens.length && !board.arrows.length && !board.items.length && !board.measures.length && !board.texts.length)
    return;
  tacUndoStack.push({ type: 'clear', tokens: board.tokens,
    arrows: board.arrows, items: board.items, measures: board.measures,
    texts: board.texts });
  board.tokens = [];
  board.arrows = [];
  board.items = [];
  board.measures = [];
  board.texts = [];
  tacSelected = null;
  tacSelectedItem = null;
  tacSelectedText = null;
  tacPlaceRole = null;
  tacPlaceItem = null;
  tacDrawing = null;
  tacMeasurePending = null;
  tacMeasureHover = null;
  renderTacBoard();
}

tacUndoBtn.addEventListener('click', tacUndo);

tacClearBtn.addEventListener('click', tacClear);




window.addEventListener('keydown', (e) => {
  if (S.currentTab !== 'tactic' || e.target.tagName === 'INPUT') return;
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    tacUndo();
    return;
  }
  const nudge = {
    w: [0, -1], arrowup: [0, -1],
    s: [0, 1], arrowdown: [0, 1],
    a: [-1, 0], arrowleft: [-1, 0],
    d: [1, 0], arrowright: [1, 0],
  }[e.key.toLowerCase()];
  if (nudge) {
    
    if (tacZoomState.pan) {
      if (tacZoomState.locked) return; 
      e.preventDefault();
      const step = 30; 
      tacZoomState.tx += nudge[0] * step;
      tacZoomState.ty += nudge[1] * step;
      tacApplyZoom();
      return;
    }
    const rect = tacMapWrap.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dx = nudge[0] / rect.width;
    const dy = nudge[1] / rect.height;
    const [ndx, ndy] = tacRotVec(dx, dy);
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    if (tacSelected != null && tacTokenByTid(tacSelected)) {
      const t = tacTokenByTid(tacSelected);
      
      const cl = tacClampTokenToLinkedItems(
        t, clamp01(t.x + ndx), clamp01(t.y + ndy));
      t.x = cl.x;
      t.y = cl.y;
      renderTacBoard();
      e.preventDefault();
    } else if (tacSelectedItem !== null && tacBoard().items[tacSelectedItem]) {
      const it = tacBoard().items[tacSelectedItem];
      
      if (it.abyss && it.abyss.on && it.linkTid != null && tacTokenByTid(it.linkTid)) {
        e.preventDefault();
        return;
      }
      
      
      let cl = tacClampLinkPos(
        tacSelectedItem, clamp01(it.x + ndx), clamp01(it.y + ndy));
      cl = tacClampRoleLinkPos(tacSelectedItem, cl.x, cl.y);
      cl = tacHpClampPos(it, cl.x, cl.y);
      it.x = cl.x;
      it.y = cl.y;
      renderTacBoard();
      e.preventDefault();
    } else if (tacSelectedText !== null && tacBoard().texts[tacSelectedText]) {
      const t = tacBoard().texts[tacSelectedText];
      t.x = clamp01(t.x + ndx);
      t.y = clamp01(t.y + ndy);
      renderTacBoard();
      e.preventDefault();
    }
    return;
  }
  if (e.key === 'Escape') {
    if ($('tacHelpModal') && $('tacHelpModal').style.display !== 'none') {
      $('tacHelpModal').style.display = 'none';
      return;
    }
    tacPlaceRole = null;
    tacPlaceItem = null;
    tacSelected = null;
    tacSelectedItem = null;
    tacSelectedText = null;
    tacTextPlacing = false;
    updateTacTextUi();
    tacDrawing = null;
    tacMeasurePending = null;
    tacMeasureHover = null;
    tacSelMeasure = null; 
    tacChainRoute = null; 
    renderTacBoard();
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    const board = tacBoard();
    if (tacSelected != null && tacTokenByTid(tacSelected)) {
      const ti = board.tokens.findIndex((t) => t.tid === tacSelected);
      const removed = board.tokens[ti];
      board.tokens.splice(ti, 1);
      tacOnTokenRemoved(removed);
      tacUndoStack.push({ type: 'remove', token: { ...removed } });
      tacSelected = null;
      renderTacBoard();
    } else if (tacSelectedItem !== null && board.items[tacSelectedItem]) {
      const removed = board.items[tacSelectedItem];
      board.items.splice(tacSelectedItem, 1);
      tacOnItemRemoved(removed);
      tacUndoStack.push({ type: 'delItem', item: { ...removed }, idx: tacSelectedItem });
      tacSelectedItem = null;
      renderTacBoard();
    } else if (tacSelectedText !== null && board.texts[tacSelectedText]) {
      const removed = board.texts[tacSelectedText];
      board.texts.splice(tacSelectedText, 1);
      tacUndoStack.push({ type: 'delText', text: { ...removed }, idx: tacSelectedText });
      tacSelectedText = null;
      renderTacBoard();
    }
  }
});


new ResizeObserver(() => {
  if (tacticView.classList.contains('active')) { renderTacArrows(); tacApplyZoom(); }
}).observe(tacMapWrap);


export function tacResetTransient() {
  tacPlaceRole = null;
  tacPlaceItem = null;
  tacSelected = null;
  tacSelectedItem = null;
  tacDrawing = null;
  tacDrag = null;
  tacDragItem = null;
  tacDragText = null;
  tacItemRole = null;
  tacSelectedText = null;
  tacUndoStack.length = 0;
  tacZoomReset(); 
  setTacTool('select');
}


for (const button of document.querySelectorAll('[data-map-3d]')) {
  button.addEventListener('click', async () => {
    try {
      const map = MAPS_DATA[S.currentMapId];
      const endpoints = measurementEndpoints(tacBoard().measures, {
        selectedIndex: tacSelMeasure?.idx, pending: tacMeasurePending, activeChain: tacChainRoute,
      });
      const target = await resolveMap3dTarget({
        mapId: S.currentMapId, image: map.mapImage, size: map.mapSize,
        pathname: location.pathname, origin: location.origin, ...endpoints,
      });
      tacSave();
      flushSave();
      // Off-origin deployments (e.g. the bilibili toy) cannot host the 3D assets:
      // open the official 3D page in a new window; closing it returns to the 2D board.
      if (isExternalMap3dEntry(target)) window.open(target, '_blank', 'noopener');
      else window.location.assign(target);
    } catch {
      showToast(translate('ui.map3d.error'));
    }
  });
}
