
import { mapsZonesRelative } from '../data/geo.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_DISPLAY_DEFAULT, TAC_MEASURE_DEFAULT } from '../data/tactic-data.js';
import { selDisplay, updateLockCipher } from '../region.js';
import { sideToggle } from './dom.js';
import { S } from './state.js';
import { measureIdCounters, restoreMeasureReferences } from './measurements.js';






export const tacBoards = {};

export const tacBoard = () => {
  const b = (tacBoards[S.currentMapId] ||=
    { tokens: {}, arrows: [], items: [], measures: [], texts: [] });
  b.measures ||= [];
  b.texts ||= [];
  b.order ||= [];
  return b;
};


export const TAC_LS_KEY = 'idv5_tactic_v1';

export let tacPersisted = null;

try { tacPersisted = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null'); } catch (err) { tacPersisted = null; }

if (tacPersisted && tacPersisted.boards) Object.assign(tacBoards, tacPersisted.boards);

export const restoredMeasureIds = measureIdCounters(tacBoards);
restoreMeasureReferences(tacBoards);

// Capture map-specific changes when they happen, not when the debounce expires.
// The in-memory copies also let a rapid switch restore edits not yet on disk.
const savedRegions = structuredClone(tacPersisted?.regions || {});
const savedDedMarks = structuredClone(tacPersisted?.dedMarks || {});
const savedDungeons = structuredClone(tacPersisted?.dungeon || {});
const savedChairs = structuredClone(tacPersisted?.chairs || {});
const savedBoxes = structuredClone(tacPersisted?.boxes || {});

export let tacSaveTimer = null;

export function flushSave() {
  if (tacSaveTimer === null) return;
  clearTimeout(tacSaveTimer);
  tacSaveTimer = null;
  try {
    const data = {
      ...tacPersisted,
      v: 1,
      map: S.currentMapId,
      boards: tacBoards,
      display: tacDisplay,
      mstyle: tacMeasureStyle,
      regions: savedRegions,
      dedMarks: savedDedMarks,
      dungeon: savedDungeons,
      chairs: savedChairs,
      boxes: savedBoxes,
      selDisplay,
    };
    localStorage.setItem(TAC_LS_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Unable to save local board data.', err);
  }
}

export function tacSave() {
  clearTimeout(tacSaveTimer);
  tacSaveTimer = setTimeout(flushSave, 400);
}

window.addEventListener('pagehide', flushSave);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushSave();
});

export function saveRegionSel() {
  savedRegions[S.currentMapId] = {
    side: S.currentSide,
    cipher: S.currentCipherIndex,
    surv: [...S.survivorState],
    hunt: [...S.hunterState],
    sel: S.selectedCipherIndex,
  };
  savedDedMarks[S.currentMapId] = { ...S.dedMarks };
  savedDungeons[S.currentMapId] = S.tacDungeonIndex;
  savedChairs[S.currentMapId] = { set: S.tacChairIndex, basement: S.tacChairBasementIndex };
  savedBoxes[S.currentMapId] = { basement: S.tacBoxBasementIndex };
  tacSave();
}


export function restoreRegionSel(mapId) {
  S.dedMarks = { ...savedDedMarks[mapId] };
  S.dedSelectedStep = null;
  S.tacDungeonIndex = Math.min(
    Math.max(0, MAPS_DATA[mapId].dungeons.length - 1),
    Math.max(0, savedDungeons[mapId] | 0),
  );
  const ch = MAPS_DATA[mapId].rocketChairs;
  const sc = savedChairs[mapId] || {};
  S.tacChairIndex = ch && ch.sets.length
    ? Math.min(Math.max(0, sc.set | 0), ch.sets.length - 1) : 0;
  S.tacChairBasementIndex = ch && ch.basements.length
    ? Math.min(Math.max(0, sc.basement | 0), ch.basements.length - 1) : 0;
  const bx = MAPS_DATA[mapId].chests;
  S.tacBoxBasementIndex = bx && bx.basements.length
    ? Math.min(Math.max(0, (savedBoxes[mapId] || {}).basement | 0), bx.basements.length - 1) : 0;
  const r = savedRegions[mapId];
  if (!r) return;
  const zones = mapsZonesRelative[mapId];
  if (Array.isArray(r.surv) && r.surv.length === zones.length
      && Array.isArray(r.hunt) && r.hunt.length === zones.length) {
    S.survivorState = [...r.surv];
    S.hunterState = [...r.hunt];
  }
  const count = MAPS_DATA[mapId].cipherCombinations.length;
  S.currentCipherIndex = Math.min(Math.max(0, r.cipher | 0), count - 1);
  S.selectedCipherIndex = typeof r.sel === 'number' ? r.sel : -1;
  if (r.side === -1 || r.side === 1) {
    S.currentSide = r.side;
    sideToggle.querySelectorAll('.side-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === (S.currentSide === 1 ? 0 : 1));
    });
  }
  S.chooseState = [...(S.currentSide === 1 ? S.survivorState : S.hunterState)];
  updateLockCipher(); 
}

export const tacMeasureStyle = {
  single: { ...TAC_MEASURE_DEFAULT.single },
  chain: { ...TAC_MEASURE_DEFAULT.chain },
};

export const tacDisplay = {
  zones: false,
  ciphers: true, cipherSize: TAC_DISPLAY_DEFAULT.cipherSize, 
  dungeon: false, dungeonSize: TAC_DISPLAY_DEFAULT.dungeonSize,
  doors: true, doorSize: TAC_DISPLAY_DEFAULT.doorSize, 
  doorLock: false, 
  chairs: false, chairSize: TAC_DISPLAY_DEFAULT.chairSize,
  chairsBasement: false,
  boxes: false, boxSize: TAC_DISPLAY_DEFAULT.boxSize,
  boxesBasement: false,
  
  snap: { cipher: true, dungeon: true, door: true, chair: true, box: true, point: true },
  delSegOnly: false, 
  showCoords: false, 
  selGlow: true, 
  exportCrop: false, 
};
