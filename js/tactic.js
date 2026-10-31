
import { showToast, tacArrowSvg, tacBaseDetailBody, tacBaseDetailToggle, tacBaseMerge, tacBaseMergeBox, tacBaseSpeedEl, tacBuffAddBtn, tacBuffClose, tacBuffDetailBody, tacBuffDetailToggle, tacBuffDur, tacBuffFilterBox, tacBuffModal, tacBuffName, tacBuffOk, tacBuffPct, tacCampToggle, tacCipherSizeDefEl, tacCipherSizeEl, tacClearBtn, tacColorsEl, tacCoordsTip, tacDelSegOnlyEl, tacDeselectBtn, tacDispCipherText, tacDisplayCard, tacDoorLockEl, tacDoorSizeDefEl, tacDoorSizeEl, tacDrawCard, tacDungeonSizeDefEl, tacDungeonSizeEl, tacDungeonText, tacExportBtn, tacItemSection, tacMStyleBody, tacMStyleToggle, tacManageCard, tacManageList, tacMapImage, tacMapTitle, tacMapTitleEn, tacMapWrap, tacMeasureCard, tacMeasureColorsEl, tacMeasureModesEl, tacMeasureWidthEl, tacMeasureWidthVal, tacOtherAddBtn, tacOtherClose, tacOtherList, tacOtherModal, tacResult, tacResultBody, tacResultToggle, tacRolesCard, tacRolesEl, tacRolesHunterEl, tacRolesOtherEl, tacScopeToggle, tacScopeWrap, tacSelGlowEl, tacShapesEl, tacShowCiphersEl, tacShowChairsEl, tacChairSizeEl, tacChairSizeDefEl, tacChairText, tacShowChairBasementEl, tacBasementText, tacSnapBoxEl, tacShowBoxesEl, tacBoxSizeEl, tacBoxSizeDefEl, tacShowBoxBasementEl, tacShowCoordsEl, tacShowDoorsEl, tacShowDungeonEl, tacShowZonesEl, tacSnapCipherEl, tacSnapDoorEl, tacSnapChairEl, tacSnapDungeonEl, tacSnapPointEl, tacSnapRipple, tacSpeedForm, tacSpeedRole, tacStatus2El, tacStatusEl, tacTalentAddBtn, tacTalentClose, tacTalentList, tacTalentModal, tacTextAddBtn, tacTextCard, tacTextColorsEl, tacTextHint, tacTextInput, tacTextList, tacTextSizeEl, tacTextSizeVal, tacTextStyle, tacTraitAddBtn, tacTraitClose, tacTraitList, tacTraitModal, tacUndoBtn, tacWidthEl, tacWidthVal, tacticView } from './core/dom.js';
import { restoredMeasureIds, saveRegionSel, tacBoard, tacDisplay, tacMeasureStyle, tacPersisted, tacSave, flushSave } from './core/persist.js';
import { measureBaseAt, simulateMovement } from './core/measurements.js';
import { measurementEndpoints, map3dURL } from './core/map-handoff.js';
import { getTreasureRings } from './core/treasure.js';
import { S } from './core/state.js';
import { $, loadImageWithStatus, mountImageOverlays } from './core/utils.js';
import { cipherOf, mapsZonesRelative } from './data/geo.js';
import { MAPS_DATA, getImageUrl } from './data/maps.js';
import { BOX_ICON_URL, CHAIR_ICON_URL, DUNGEON_ICON_URL, ESCAPE_DOOR_ICON_URL, TAC_ABYSS_MAX_M, TAC_DISPLAY_DEFAULT, TAC_FIXED_SPAWN_ICONS, TAC_ITEM_TYPES, TAC_MANAGE_DEFAULT, TAC_MEASURE_DEFAULT, TAC_MOVEMENT_SURVIVOR, TAC_MOVEMENT_BUFFS, TAC_ROLES, TAC_SVG_NS, TAC_TREASURE_RULE, TAC_ZOOM_LOCK_ICONS, TAC_ZOOM_MAX, TAC_ZOOM_MIN } from './data/tactic-data.js';
import { CIPHER_ICON_URL, cipherIcon } from './region.js';

import { translate } from './core/i18n.js';

export const { loading: tacLoading, error: tacImageError } =
  mountImageOverlays(tacMapWrap);




export function tacItemMetersToPercent(meters) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  return widthM ? (meters * 2 / widthM) * 100 : null;
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
      if (camp === 'hunter' && hostRole === 'Geisha') {
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
  const cropEl = $('tacExportCrop');
  if (cropEl) cropEl.checked = tacDisplay.exportCrop;
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

export let tacBaseDetailOpen = false;

 
export let tacBaseMergeOn = true;

   
export let tacLastRoleVal = null;

 
export let tacBuffDetailOpen = false;

 
export let tacResultOpen = true;

    

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
  const count = MAPS_DATA[S.currentMapId].cipherCombinations.length;
  
  tacDispCipherText.textContent = translate("region.updateCipherText", { index: S.currentCipherIndex + 1, count: count });
  renderTacCiphers();
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
  if (url === tacImageState.loaded) return;
  tacImageState.loaded = url;
  const [mw, mh] = MAPS_DATA[S.currentMapId].mapSize;
  tacMapWrap.style.aspectRatio = `${mw} / ${mh}`;
  loadImageWithStatus({
    url,
    img: tacMapImage,
    loading: tacLoading,
    error: tacImageError,
    state: tacImageState,
    onReady: (w, h) => {
      tacMapWrap.style.aspectRatio = `${w} / ${h}`;
      renderTacArrows();
    },
  });
}



function setTacFontSize(el, units, cap) {
  const w = tacMapWrap ? tacMapWrap.clientWidth : 360;
  const px = units * w / 100;
  el.style.fontSize = cap == null ? `${px}px` : `${Math.min(cap, px)}px`;
  el.style.fontSize = cap == null ? `${units}cqw` : `min(${cap}px, ${units}cqw)`;
}


export function renderTacCiphers() {
  if (!tacMapWrap) return;
  // The prediction remains visible and must update even when cipher icons do not.
  renderTacTreasure();
  tacMapWrap.querySelectorAll('.tac-cipher').forEach((el) => el.remove());
  if (!tacDisplay.ciphers || !cipherIcon.loaded) return;
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  map.cipherCombinations[S.currentCipherIndex].forEach((cid) => {
    const c = cipherOf(S.currentMapId, cid);
    if (!c) return;
    const el = document.createElement('img');
    el.className = 'tac-cipher';
    el.src = CIPHER_ICON_URL;
    el.alt = c.name;
    el.title = c.name;
    el.draggable = false;
    el.style.left = `${(c.location[0] / imgW) * 100}%`;
    el.style.top = `${(c.location[1] / imgH) * 100}%`;
    el.style.width = `${tacDisplay.cipherSize}%`;
    tacMapWrap.appendChild(el);
  });
}


export function switchTacCipher(step) {
  const count = MAPS_DATA[S.currentMapId].cipherCombinations.length;
  S.currentCipherIndex = (S.currentCipherIndex + step + count) % count;
  syncTacImage();
  saveRegionSel();
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
    tacMapWrap.appendChild(el);
  });
}


export function tacDoorPoints(map) {
  const d = map.escapeDoors;
  if (tacDisplay.doorLock && d.length >= 4) return [d[2], d[3]];
  return d.slice(0, 2);
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
    tacMapWrap.appendChild(el);
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
      tacMapWrap.appendChild(el);
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
          tacMapWrap.appendChild(rangeEl);
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
        tacMapWrap.appendChild(el);
      });
    });
  }
}


export function renderTacTreasure() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-treasure-ring').forEach((el) => el.remove());
  const rings = getTreasureRings(MAPS_DATA[S.currentMapId], tacTokenByRole('explorer'),
    S.currentCipherIndex, TAC_TREASURE_RULE);
  rings.forEach((ring) => {
    const el = document.createElement('div');
    el.className = 'tac-treasure-ring' + (ring.excluded ? ' excluded' : '');
    el.style.left = `${ring.x * 100}%`;
    el.style.top = `${ring.y * 100}%`;
    el.style.width = `${ring.outerRadius * 200}%`;
    el.style.setProperty('--treasure-inner', `${ring.innerRadius / ring.outerRadius * 100}%`);
    tacMapWrap.appendChild(el);
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
  tacMapWrap.querySelectorAll('.tac-chair').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const ch = map.rocketChairs;
  if (!ch) return;
  const [imgW, imgH] = map.mapSize;
  // 椅子点格式：[x, z]（地面）或 [x, y, z]（地下室，y 为高度）
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const draw = (pt, title) => {
    const [px, pz] = xz(pt);
    const el = document.createElement('img');
    el.className = 'tac-chair';
    el.src = CHAIR_ICON_URL;
    el.alt = translate("game.rocketChair");
    el.title = title;
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.chairSize}%`;
    tacMapWrap.appendChild(el);
  };
  if (tacDisplay.chairs) {
    ch.fixed.forEach((pt) => draw(pt, translate("application.renderTacChairsFixed")));
    const setIdx = ch.sets.length ? S.tacChairIndex % ch.sets.length : -1;
    if (setIdx >= 0) {
      ch.sets[setIdx].forEach((pt) => draw(pt,
        translate("application.renderTacChairs", { index: setIdx + 1, count: ch.sets.length })));
    }
  }
  const bs = tacBasementList();
  if (tacDisplay.chairsBasement && bs.length) {
    const bIdx = S.tacChairBasementIndex % bs.length;
    bs[bIdx].rocketChairs.forEach((pt) => draw(pt,
      translate("application.renderTacChairsBasement", { index: bIdx + 1, count: bs.length })));
  }
}

export function syncTacChairText() {
  const ch = MAPS_DATA[S.currentMapId].rocketChairs;
  if (!ch || !ch.sets.length) { tacChairText.textContent = '--'; return; }
  tacChairText.textContent = translate("application.syncTacChairText",
    { index: S.tacChairIndex + 1, count: ch.sets.length });
}

export function switchTacChair(step) {
  const ch = MAPS_DATA[S.currentMapId].rocketChairs;
  if (!ch || !ch.sets.length) return;
  S.tacChairIndex = (S.tacChairIndex + step + ch.sets.length) % ch.sets.length;
  syncTacChairText();
  renderTacChairs();
  saveRegionSel();
}

export function syncTacBasementText() {
  const count = tacBasementList().length;
  if (!count) { tacBasementText.textContent = '--'; return; }
  tacBasementText.textContent = translate("application.syncTacBasementText",
    { index: S.tacChairBasementIndex + 1, count });
}

export function switchTacBasement(step) {
  const count = tacBasementList().length;
  if (!count) return;
  S.tacChairBasementIndex = (S.tacChairBasementIndex + step + count) % count;
  S.tacBoxBasementIndex = S.tacChairBasementIndex;
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
    tacMapWrap.appendChild(el);
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
  const cropEl = $('tacExportCrop');
  if (cropEl) cropEl.addEventListener('change', () => {
    tacDisplay.exportCrop = cropEl.checked;
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
    tacSnapRipple.style.left = `${active.x * 100}%`;
    tacSnapRipple.style.top = `${active.y * 100}%`;
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
  tacCoordsTip.textContent = `${Math.round(p.x * imgW)}, ${Math.round(p.y * imgH)}`;
  tacCoordsTip.style.left = `${p.x * 100}%`;
  tacCoordsTip.style.top = `${p.y * 100}%`;
  
  tacCoordsTip.style.transform =
    `translate(${p.x > 0.82 ? 'calc(-100% - 14px)' : '14px'}, `
    + `${p.y > 0.85 ? 'calc(-100% - 14px)' : '14px'})`;
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

tacChairSizeDefEl._default = TAC_DISPLAY_DEFAULT.chairSize;

tacBoxSizeDefEl._default = TAC_DISPLAY_DEFAULT.boxSize;

tacDoorSizeDefEl._default = TAC_DISPLAY_DEFAULT.doorSize;


tacShowZonesEl.addEventListener('change', () => {
  tacDisplay.zones = tacShowZonesEl.checked;
  renderTacZones();
  tacSave();
});

bindTacDisplayRow(tacShowCiphersEl, tacCipherSizeEl, tacCipherSizeDefEl,
  (v) => { tacDisplay.ciphers = v; renderTacCiphers(); },
  (v) => { tacDisplay.cipherSize = v; renderTacCiphers(); });

bindTacDisplayRow(tacShowDungeonEl, tacDungeonSizeEl, tacDungeonSizeDefEl,
  (v) => { tacDisplay.dungeon = v; renderTacLandmarks(); },
  (v) => { tacDisplay.dungeonSize = v; renderTacLandmarks(); });

bindTacDisplayRow(tacShowChairsEl, tacChairSizeEl, tacChairSizeDefEl,
  (v) => { tacDisplay.chairs = v; renderTacChairs(); },
  (v) => { tacDisplay.chairSize = v; renderTacChairs(); });

tacShowChairBasementEl.addEventListener('change', () => {
  tacDisplay.chairsBasement = tacShowChairBasementEl.checked;
  renderTacChairs();
  tacSave();
});

bindTacDisplayRow(tacShowBoxesEl, tacBoxSizeEl, tacBoxSizeDefEl,
  (v) => { tacDisplay.boxes = v; renderTacBoxes(); },
  (v) => { tacDisplay.boxSize = v; renderTacBoxes(); });

tacShowBoxBasementEl.addEventListener('change', () => {
  tacDisplay.boxesBasement = tacShowBoxBasementEl.checked;
  renderTacBoxes();
  tacSave();
});

bindTacDisplayRow(tacShowDoorsEl, tacDoorSizeEl, tacDoorSizeDefEl,
  (v) => { tacDisplay.doors = v; renderTacLandmarks(); },
  (v) => { tacDisplay.doorSize = v; renderTacLandmarks(); });

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

$('tacDispCipherPrev').addEventListener('click', () => switchTacCipher(-1));

$('tacDispCipherNext').addEventListener('click', () => switchTacCipher(1));

$('tacDungeonPrev').addEventListener('click', () => switchTacDungeon(-1));

$('tacDungeonNext').addEventListener('click', () => switchTacDungeon(1));

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


export function tacMirrorParts() {
  const board = tacBoard();
  const aq = board.items.find((it) => it.kind === 'aquaMirror') || null;
  const bq = (aq && aq.linkTid != null
    ? board.tokens.find((t) => t.tid === aq.linkTid) : null) || null;
  if (!aq || !bq) return null;
  const miIdx = board.items.findIndex((it) => it.kind === 'mirrorImage'
    && (it.aqIid == null || it.aqIid === aq.iid));
  return { bq, aq, mi: miIdx >= 0 ? board.items[miIdx] : null, miIdx };
}


export function tacSyncMirror(moved = null) {
  const board = tacBoard();
  const parts = tacMirrorParts();
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


function tacSyncMirrorEl(kind) {
  const b = tacBoard();
  const i2 = b.items.findIndex((o) => o.kind === kind);
  const o2 = i2 >= 0 ? b.items[i2] : null;
  const el2 = o2 && tacMapWrap.querySelector(
    `.tac-item-circle[data-idx="${i2}"], .tac-item-pin[data-idx="${i2}"]`);
  if (el2) { el2.style.left = `${o2.x * 100}%`; el2.style.top = `${o2.y * 100}%`; }
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
    tacSyncMirror(null);
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
  text.setAttribute('x', mx + nx * 14 * s);
  text.setAttribute('y', my + ny * 14 * s);
  text.setAttribute('class', 'tac-measure-label');
  text.style.fill = segColor; 
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
  text.setAttribute('x', px + nx * 14 * s);
  text.setAttribute('y', py + ny * 14 * s);
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
  const W = tacMapWrap.clientWidth;
  const H = tacMapWrap.clientHeight;
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
        .map((e) => ({ pct: tacItemMetersToPercent(e.meters) })),
      ...tacTalentRanges(it, it.role)
        .map((r) => ({ pct: tacItemMetersToPercent(r.meters) })),
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




      el.insertAdjacentHTML('beforeend',
        '<svg class="tac-item-edge" viewBox="0 0 100 100" aria-hidden="true">'
        + '<circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0)"'
        + ' stroke-width="10"/></svg>');
    }



    if (def.icon && !it.hideIcon) {
      el.insertAdjacentHTML('beforeend',
        `<img src="${def.icon}" alt="${def.name}" draggable="false">`);
      const img = el.querySelector('img');

      const isz = it.iconSize ?? 3.4;
      const ipx = isz / 100 * tacMapWrap.clientWidth;
      img.style.width = `${ipx}px`;
      img.style.height = `${ipx}px`;
    } else {
      el.insertAdjacentHTML('beforeend', '<div class="tac-item-dot"></div>');
    }
    tacMapWrap.appendChild(el);
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
      if (z) ex.style.zIndex = z;
      tacMapWrap.appendChild(ex);
    });
  });
  for (const t of board.tokens) {
    const role = t.role;
    const def = TAC_ROLES[role] || {};
    const z = zMap.get(`r:${role}`);

    const tFill = t.rangeBox ? t.rangeBox.fill : false;
    const roleRanges = [
      ...tacRangeEntries(def.ranges, t, true)
        .map((e) => ({ pct: tacItemMetersToPercent(e.meters) })),
      ...tacTalentRanges(t, role)
        .map((r) => ({ pct: tacItemMetersToPercent(r.meters) })),
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
      if (z) rg.style.zIndex = z;
      tacMapWrap.appendChild(rg);
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
      el.title = def.name;
    } else {
      el.title = def.name || role;
    }
    tacMapWrap.appendChild(el);
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
      dot.dataset.idx = idx;
      dot.dataset.end = end;
      dot.style.left = `${m[kx] * 100}%`;
      dot.style.top = `${m[ky] * 100}%`;
      const dotColor = tacMeasureSegColor(m);
      dot.style.background = dotColor; 
      dot.style.boxShadow = `0 0 6px ${dotColor}`;
      dot.title = translate("application.renderTacBoard");
      tacMapWrap.appendChild(dot);
    });
  });
  
  board.texts.forEach((t, idx) => {
    const el = document.createElement('div');
    el.className = 'tac-text' + (tacSelectedText === idx ? ' selected' : '');
    el.dataset.idx = idx;
    el.style.left = `${t.x * 100}%`;
    el.style.top = `${t.y * 100}%`;
    el.style.color = t.color;
    setTacFontSize(el, Math.max(2.2, t.size * 0.18));
    el.textContent = t.text;
    tacMapWrap.appendChild(el);
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
    // 数字项：多个同排平铺
    const numIdx = [];
    cfg.options.forEach((opt, i) => {
      if (typeof opt.size_m === 'number') numIdx.push(i);
    });
    if (numIdx.length) {
      const optLine = document.createElement('div');
      optLine.className = 'tac-box-line';
      optLine.innerHTML = `<div class="tac-range-opts">`
        + numIdx.map((i) => {
          const opt = cfg.options[i];
          return subBtn(rb.subs.includes(i), `data-v="${i}"`,
            opt.label ? opt.label + postfix : `${opt.size_m}m`);
        }).join('')
        + `</div>`;
      optLine.querySelectorAll('.tac-range-sub').forEach((b) => {
        b.addEventListener('click', () => {
          const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
          lightSub(rbx, +b.dataset.v);
          refresh();
        });
      });
      box.appendChild(optLine);
    }
    // 档位数组项（如牢笼 [9,12,15]）：二级按钮 + 点亮后出现互斥三挡组
    cfg.options.forEach((opt, i) => {
      if (!Array.isArray(opt.size_m)) return;
      const subLine = document.createElement('div');
      subLine.className = 'tac-box-line';
      subLine.innerHTML = `<div class="tac-range-opts">`
        + subBtn(rb.subs.includes(i), `data-v="${i}"`,
          opt.label ? opt.label + postfix : '')
        + `</div>`;
      subLine.querySelectorAll('.tac-range-sub').forEach((b) => {
        b.addEventListener('click', () => {
          const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
          lightSub(rbx, +b.dataset.v);
          refresh();
        });
      });
      box.appendChild(subLine);
      if (!rb.subs.includes(i)) return;
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
    });
    // 滑杆项（{min,max}）：二级按钮 + 点亮后出现范围调节
    cfg.options.forEach((opt, i) => {
      if (!opt.size_m || typeof opt.size_m !== 'object' || Array.isArray(opt.size_m)) return;
      const subLine = document.createElement('div');
      subLine.className = 'tac-box-line';
      subLine.innerHTML = `<div class="tac-range-opts">`
        + subBtn(rb.subs.includes(i), `data-v="${i}"`,
          opt.label ? opt.label + postfix : '')
        + `</div>`;
      subLine.querySelectorAll('.tac-range-sub').forEach((b) => {
        b.addEventListener('click', () => {
          const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
          lightSub(rbx, +b.dataset.v);
          refresh();
        });
      });
      box.appendChild(subLine);
      if (!rb.subs.includes(i)) return;
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
      txt.textContent = `${(e2.opt.label || '') + postfix} ${tacRangeFmt(e2.meters)}m`;
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
      txt.textContent = `${tr.label}${tr.sub ? '·' + tr.sub : postfix} ${tacRangeFmt(tr.meters)}m`;
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
    aq = (host.aqIid != null && tacItemByIid(host.aqIid))
      || board.items.find((it) => it.kind === 'aquaMirror') || null;
    bq = aq && aq.linkTid != null ? tacTokenByTid(aq.linkTid) : null;
  } else {
    bq = host;
    aq = board.items.find((it) => it.kind === 'aquaMirror' && it.linkTid === bq.tid) || null;
  }
  const linked = !!(aq && bq);
  const mi = aq ? board.items.find((it) => it.kind === 'mirrorImage'
    && (it.aqIid == null || it.aqIid === aq.iid)) : null;

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
    tacSyncMirror(null);
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
    tacSyncMirror(null);
    refreshAll();
  });
  line.querySelector('button[data-mq="fix"]').addEventListener('click', () => {
    if (!aq || !aq.showMirror) return;
    aq.fixedMirror = !aq.fixedMirror;
    delete aq.mirrorAxis;
    tacSyncMirror(null);
    refreshAll();
  });
  line.querySelector('button.tac-manage-swap').addEventListener('click', () => {
    if (!linked) return;
    const p2 = tacMirrorParts();
    if (!p2 || !p2.mi) return;
    const bx = p2.bq.x, by = p2.bq.y;
    p2.bq.x = p2.mi.x; p2.bq.y = p2.mi.y;
    p2.mi.x = bx; p2.mi.y = by;
    tacSyncMirror('bq');
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
        + translate("application.renderTacManageSeventh", { value: token.showFixedSpawns ? ' checked' : '', label: fixedSpawnCfg.label })
        + (hasOrient
          ? `<label class="tac-manage-glow"><input type="checkbox" data-fsdir`
          + `${token.showSpawnDir ? ' checked' : ''}> ${translate("ui.tacManageBox.showDir")}</label>`
          : '');
      fsRow.querySelector('input').addEventListener('change', (e) => {
        token.showFixedSpawns = e.target.checked;
        renderTacFixedSpawns();
        tacSave();
      });
      const dirCb = fsRow.querySelector('input[data-fsdir]');
      if (dirCb) dirCb.addEventListener('change', (e) => {
        token.showSpawnDir = e.target.checked;
        renderTacFixedSpawns();
        tacSave();
      });
      fsBox.appendChild(fsRow);
      
      
      if (fsRangeItem && MAPS_DATA[S.currentMapId].widthM) {
        const dev = token.fixedSpawnDevice === 'ios' ? 'ios' : 'pc';
        const [devW, devH] = fsRangeItem.rangeScreenM[dev];
        const radioName = `tac-fsdev-${S.currentMapId}-${role}`;
        const rangeRow = document.createElement('div');
        rangeRow.className = fsTitleKey ? 'tac-box-line' : 'tac-manage-row';
        rangeRow.innerHTML =
          `<label class="tac-manage-glow"><input type="checkbox"`
          + translate("application.renderTacManageEighth", { value: token.showFixedSpawnRange ? ' checked' : '', rangeM: fsRangeItem.rangeM, devW: devW, devH: devH })
          + `<label class="tac-manage-glow"><input type="radio" name="${radioName}"${dev === 'pc' ? ' checked' : ''}>PC</label>`
          + `<label class="tac-manage-glow"><input type="radio" name="${radioName}"${dev === 'ios' ? ' checked' : ''}>IOS</label>`;
        rangeRow.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
          token.showFixedSpawnRange = e.target.checked;
          renderTacFixedSpawns();
          tacSave();
        });
        const [pcRadio, iosRadio] = rangeRow.querySelectorAll('input[type="radio"]');
        const theory = rangeRow.querySelector('.tac-fsdev-theory');
        const onDevChange = (next) => {
          token.fixedSpawnDevice = next;
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
      desc += t.key === 'windWings' ? translate("application.buildTacTraitListAlternate") : translate("application.buildTacTraitListThird");
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
  tacRolesCard.style.display = tacTool === 'roles' ? '' : 'none';
  tacDrawCard.style.display = tacTool === 'draw' ? '' : 'none';
  tacTextCard.style.display = tacTool === 'draw' ? '' : 'none';
  tacMeasureCard.style.display = tacTool === 'measure' ? '' : 'none';
  tacDisplayCard.style.display = tacTool === 'display' ? '' : 'none';
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


tacticView.querySelectorAll('.tac-camp-header').forEach((btn) => {
  btn.addEventListener('click', () => {
    const camp = btn.closest('.tac-camp');
    camp.classList.toggle('collapsed');
    if (camp.classList.contains('collapsed')) {
      const inCamp = (r) => r && (TAC_ROLES[r] || {}).camp === btn.dataset.camp;
      if (inCamp(tacSelRole()) || inCamp(tacPlaceRole)) {
        tacSelected = null;
        tacPlaceRole = null;
      }
      if (tacPlaceItem && inCamp(tacPlaceItem.role)) tacPlaceItem = null;
      if (tacSelectedItem !== null) {
        const it = tacBoard().items[tacSelectedItem];
        if (it && inCamp(it.role)) tacSelectedItem = null;
      }
      renderTacBoard();
    }
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
  const treasureRings = getTreasureRings(map, tacTokenByRole('explorer'),
    S.currentCipherIndex, TAC_TREASURE_RULE);
  const [W0, H0] = map.mapSize;
  const wrapW = tacMapWrap.clientWidth || 1;
  const wrapH = tacMapWrap.clientHeight || 1;
  
  const cropOn = tacDisplay.exportCrop && tacZoomState.scale > 1;

  const W = cropOn ? Math.round(wrapW) : W0;
  const H = cropOn ? Math.round(wrapH) : H0;

  const vx = cropOn ? -tacZoomState.tx / (tacZoomState.scale * wrapW) : 0;
  const vy = cropOn ? -tacZoomState.ty / (tacZoomState.scale * wrapH) : 0;
  const vw = cropOn ? 1 / tacZoomState.scale : 1;
  const vh = cropOn ? 1 / tacZoomState.scale : 1;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  const sx = W / wrapW, sy = H / wrapH;
  const K = 1 / vw;
  
  const PX = (rx) => (rx - vx) * W / vw;
  const PY = (ry) => (ry - vy) * H / vh;

  
  const chainFirst = {}, chainLast = {};
  tacBoard().measures.forEach((m, i) => {
    if (m.chain == null) return;
    if (chainFirst[m.chain] === undefined) chainFirst[m.chain] = i;
    chainLast[m.chain] = i;
  });

  
  const base = await tacLoadImg(map.mapImage);
  if (base) ctx.drawImage(base, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  else { ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, W, H); }

  
  const svgClone = tacArrowSvg.cloneNode(true);
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

  const [ciphIcon, dungeonIcon, doorIcon, chairIcon, boxIcon] = await Promise.all([
    tacLoadImg(CIPHER_ICON_URL), tacLoadImg(DUNGEON_ICON_URL),
    tacLoadImg(ESCAPE_DOOR_ICON_URL), tacLoadImg(CHAIR_ICON_URL),
    tacLoadImg(BOX_ICON_URL)]);

  
  if (tacDisplay.ciphers && ciphIcon) {
    const size = tacDisplay.cipherSize / 100 * W * K;
    map.cipherCombinations[S.currentCipherIndex].forEach((cid) => {
      const c = cipherOf(S.currentMapId, cid);
      if (!c) return;
      const x = PX(c.location[0] / W0), y = PY(c.location[1] / H0);
      ctx.drawImage(ciphIcon, x - size / 2, y - size / 2, size, size);
    });
  }
  
  if (tacDisplay.dungeon && dungeonIcon && map.dungeons.length) {
    const pt = map.dungeons[S.tacDungeonIndex % map.dungeons.length];
    const size = tacDisplay.dungeonSize / 100 * W * K;
    ctx.drawImage(dungeonIcon,
      PX(pt[0] / W0) - size / 2, PY(pt[1] / H0) - size / 2, size, size);
  }
  
  if (tacDisplay.doors && doorIcon) {
    const size = tacDisplay.doorSize / 100 * W * K;
    tacDoorPoints(map).forEach((pt) => ctx.drawImage(doorIcon,
      PX(pt[0] / W0) - size / 2, PY(pt[1] / H0) - size / 2, size, size));
  }

  // 狂欢之椅：固定椅 + 当前刷点组 + 当前地下室组
  const xzOf = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  if (chairIcon && map.rocketChairs) {
    const ch = map.rocketChairs;
    const size = tacDisplay.chairSize / 100 * W * K;
    const drawChair = (pt) => {
      const [px, pz] = xzOf(pt);
      ctx.drawImage(chairIcon, PX(px / W0) - size / 2, PY(pz / H0) - size / 2, size, size);
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
      ctx.drawImage(boxIcon, PX(px / W0) - size / 2, PY(pz / H0) - size / 2, size, size);
    };
    if (tacDisplay.boxes) bx.fixed.forEach(drawBox);
    const bs = tacBasementList();
    if (tacDisplay.boxesBasement && bs.length) {
      bs[S.tacChairBasementIndex % bs.length].chest.forEach(drawBox);
    }
  }

  // 固定点位（教授鳞片 / 摄影师摄像机 / 疯眼控制台及范围 / 小丑零件 / 冒险家书页）
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
    if (!token.showFixedSpawns) continue;
    for (const item of fsItems) {
      for (const pt of item.points) {
        const p = Array.isArray(pt) ? pt : pt.p;
        const x = PX(p[0] / W0), y = PY(p[1] / H0);
        if (item.flag_orientation) {
          // 朝向箭头 + 图标
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
          const fsIcon = TAC_FIXED_SPAWN_ICONS[item.icon] || item.icon;
          if (fsIcon) {
            const isz = 0.03 * W * K;
            const camImg = await tacLoadImg(fsIcon);
            if (camImg) { ctx.drawImage(camImg, x - isz / 2, y - isz / 2, isz, isz); continue; }
          }
          ctx.save();
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(x, y, Math.max(2, W * K / 150), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          const spawnDef = TAC_ITEM_TYPES[item.icon] || {};
        if (spawnDef.icon) {
          const isz = (spawnDef.iconSize || 3.4) / 100 * W * K;
          const iconImg = await tacLoadImg(spawnDef.icon);
          if (iconImg) { ctx.drawImage(iconImg, x - isz / 2, y - isz / 2, isz, isz); continue; }
        }
        ctx.save();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, W * K / 150), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      }
    }
  }

  const board = tacBoard();
  
  const itemIconCache = {};
  await Promise.all(board.items.map(async (it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    if (def && def.icon && !it.hideIcon && itemIconCache[it.kind] === undefined)
      itemIconCache[it.kind] = await tacLoadImg(def.icon);
  }));
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
    const icon = itemIconCache[it.kind];
    if (icon) {
      const isz = (it.iconSize ?? 3.4) / 100 * W * K;
      ctx.drawImage(icon, x - isz / 2, y - isz / 2, isz, isz);
    } else if (!def.icon || it.hideIcon) {
      ctx.fillStyle = def.color || '#e2e8f0';
      ctx.beginPath();
      ctx.arc(x, y, Math.max(3, W * K / 200), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (const t of board.tokens) {
    const role = t.role;
    const def = TAC_ROLES[role] || {};
    const x = PX(t.x), y = PY(t.y);
    const d = t.size / 100 * W * K;
    if (def.icon) {
      const img = await tacLoadImg(def.icon);
      if (img) { ctx.drawImage(img, x - d / 2, y - d / 2, d, d); continue; }
    }
    ctx.save();
    ctx.fillStyle = def.color || '#fff';
    ctx.beginPath();
    ctx.arc(x, y, d / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = `800 ${d * 0.42}px 'Noto Sans SC', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((def.name || role).charAt(0), x, y);
    ctx.restore();
  }
  
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  board.texts.forEach((t) => {
    const px = Math.max(2.2, t.size * 0.18) / 100 * wrapW * sx * K;
    ctx.font = `700 ${px}px 'Noto Sans SC', sans-serif`;
    const lines = String(t.text).split('\n');
    const lh = px * 1.35;
    lines.forEach((line, i) => {
      const ty = PY(t.y) + (i - (lines.length - 1) / 2) * lh;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = Math.max(2, px / 6);
      ctx.strokeText(line, PX(t.x), ty);
      ctx.fillStyle = t.color;
      ctx.fillText(line, PX(t.x), ty);
    });
  });
  ctx.restore();

  
  ctx.save();
  ctx.lineWidth = Math.max(1.5, W * K / 400);
  board.measures.forEach((m, idx) => {
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

  
  const fileName = translate("application.fileName", { name: map.mapName });
  const download = (blobUrl) => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  try {
    if (cv.toBlob) {
      cv.toBlob(async (blob) => {
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
      download(cv.toDataURL('image/png'));
      showToast(translate("application.tacExportImageAlternate"));
    }
  } catch (err) {
    showToast(translate("application.tacExportImageThird"));
  }
}

tacExportBtn.addEventListener('click', tacExportImage);


export function tacPos(e) {
  const r = tacMapWrap.getBoundingClientRect();
  const clamp01 = (v) => Math.min(0.995, Math.max(0.005, v));
  return {
    x: clamp01((e.clientX - r.left) / r.width),
    y: clamp01((e.clientY - r.top) / r.height),
    W: r.width,
    H: r.height,
  };
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
    if (item.kind === 'aquaMirror') tacSyncMirror('aq');
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
  
  tacUpdateSnapRipple(p);
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
      const hadMirror = tacBoard().items.some((it) => it.kind === 'mirrorImage');
      if (tacSyncMirror('bq')) {
        if (!hadMirror) renderTacBoard();
        else { tacSyncMirrorEl('mirrorImage'); renderTacArrows(); }
      }
      if (tacBoard().items.some((it) => it.kind === 'aquaMirror')) renderTacArrows();
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
      const hadMirror = tacBoard().items.some((o) => o.kind === 'mirrorImage');
      if (tacSyncMirror(movedKind)) {
        if (!hadMirror) renderTacBoard();
        else {
          if (movedKind === 'aq') {
            tacSyncMirrorEl('mirrorImage');
          } else {
            tacSyncMirrorEl('aquaMirror');
            const parts2 = tacMirrorParts();
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
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    if (tacSelected != null && tacTokenByTid(tacSelected)) {
      const t = tacTokenByTid(tacSelected);
      
      const cl = tacClampTokenToLinkedItems(
        t, clamp01(t.x + dx), clamp01(t.y + dy));
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
        tacSelectedItem, clamp01(it.x + dx), clamp01(it.y + dy));
      cl = tacClampRoleLinkPos(tacSelectedItem, cl.x, cl.y);
      cl = tacHpClampPos(it, cl.x, cl.y);
      it.x = cl.x;
      it.y = cl.y;
      renderTacBoard();
      e.preventDefault();
    } else if (tacSelectedText !== null && tacBoard().texts[tacSelectedText]) {
      const t = tacBoard().texts[tacSelectedText];
      t.x = clamp01(t.x + dx);
      t.y = clamp01(t.y + dy);
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
  button.addEventListener('click', () => {
    try {
      const map = MAPS_DATA[S.currentMapId];
      const endpoints = measurementEndpoints(tacBoard().measures, {
        selectedIndex: tacSelMeasure?.idx, pending: tacMeasurePending, activeChain: tacChainRoute,
      });
      const entryPath = location.pathname.startsWith('/zhanshuyanlian/') ? '/zhanshuyanlian/' : '/tactical-friend/';
      const target = map3dURL({ mapId: S.currentMapId, image: map.mapImage, size: map.mapSize, entryPath, ...endpoints });
      tacSave();
      flushSave();
      window.location.assign(target);
    } catch {
      showToast(translate('ui.map3d.error'));
    }
  });
}
