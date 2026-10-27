
import { mapsZonesRelative } from '../data/geo.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_DISPLAY_DEFAULT, TAC_MEASURE_DEFAULT } from '../data/tactic-data.js';
import { selDisplay, updateLockCipher } from '../region.js';
import { sideToggle } from './dom.js';
import { S } from './state.js';






export const tacBoards = {};

export const tacBoard = () => {
  const b = (tacBoards[S.currentMapId] ||=
    { tokens: {}, arrows: [], items: [], measures: [], texts: [] });
  b.measures ||= [];
  b.texts ||= [];
  return b;
};


export const TAC_LS_KEY = 'idv5_tactic_v1';

export let tacPersisted = null;

try { tacPersisted = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null'); } catch (err) { tacPersisted = null; }

if (tacPersisted && tacPersisted.boards) Object.assign(tacBoards, tacPersisted.boards);

export let tacSaveTimer = null;


export function tacSave() {
  clearTimeout(tacSaveTimer);
  tacSaveTimer = setTimeout(() => {
    try {
      const data = JSON.parse(localStorage.getItem(TAC_LS_KEY) || '{}');
      data.v = 1;
      data.map = S.currentMapId;
      data.boards = tacBoards;
      data.display = tacDisplay;
      data.mstyle = tacMeasureStyle;
      localStorage.setItem(TAC_LS_KEY, JSON.stringify(data));
    } catch (err) {  }
  }, 400);
}


export function saveRegionSel() {
  if (typeof S.dedMarks === 'undefined') return; 
  clearTimeout(tacSaveTimer);
  tacSaveTimer = setTimeout(() => {
    try {
      const data = JSON.parse(localStorage.getItem(TAC_LS_KEY) || '{}');
      data.v = 1;
      data.map = S.currentMapId;
      data.regions = Object.assign(data.regions || {}, {
        [S.currentMapId]: {
          side: S.currentSide,
          cipher: S.currentCipherIndex,
          surv: S.survivorState,
          hunt: S.hunterState,
          sel: S.selectedCipherIndex,
        },
      });
      data.dedMarks = Object.assign(data.dedMarks || {}, { [S.currentMapId]: S.dedMarks });
      data.dungeon = Object.assign(data.dungeon || {}, { [S.currentMapId]: S.tacDungeonIndex });
      data.selDisplay = selDisplay; 
      localStorage.setItem(TAC_LS_KEY, JSON.stringify(data));
    } catch (err) {  }
  }, 400);
}


export function restoreRegionSel(mapId) {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null'); } catch (err) { d = null; }
  const r = d && d.regions && d.regions[mapId];
  if (!r) return;
  const zones = mapsZonesRelative[mapId];
  if (Array.isArray(r.surv) && r.surv.length === zones.length) {
    S.survivorState = r.surv;
    S.hunterState = r.hunt;
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
  if (d.dungeon && typeof d.dungeon[mapId] === 'number'
      && typeof S.tacSkipDungeonReset !== 'undefined') {
    S.tacDungeonIndex = Math.max(0, d.dungeon[mapId] | 0); 
    S.tacSkipDungeonReset = true; 
  }
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
  
  snap: { cipher: true, dungeon: true, door: true, point: true },
  delSegOnly: false, 
  showCoords: false, 
  selGlow: true, 
  exportCrop: false, 
};
