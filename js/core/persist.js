
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
    { tokens: [], tokenSeq: 0, itemSeq: 0, arrows: [], items: [], measures: [], texts: [] });
  b.tokens ||= [];
  b.tokenSeq ||= 0;
  b.itemSeq ||= 0;
  b.items ||= [];
  b.measures ||= [];
  b.texts ||= [];
  b.order ||= [];
  return b;
};


export const TAC_LS_KEY = 'idv5_tactic_v1';

export let tacPersisted = null;

try { tacPersisted = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null'); } catch (err) { tacPersisted = null; }

if (tacPersisted && tacPersisted.boards) Object.assign(tacBoards, tacPersisted.boards);

// 旧存档迁移：tokens 对象 -> 多实例数组；为角色/道具实例分配 tid/iid
for (const board of Object.values(tacBoards)) {
  if (!board) continue;
  if (board.tokens && !Array.isArray(board.tokens)) {
    const arr = [];
    for (const [role, t] of Object.entries(board.tokens)) {
      arr.push({ tid: ++board.tokenSeq, role, ...t });
    }
    board.tokens = arr;
  }
  board.tokens ||= [];
  board.items ||= [];
  for (const t of board.tokens) { t.tid = t.tid || ++board.tokenSeq; }
  for (const it of board.items) { it.iid = it.iid || ++board.itemSeq; }
  board.tokenSeq = Math.max(board.tokenSeq || 0, ...board.tokens.map((t) => t.tid || 0));
  board.itemSeq = Math.max(board.itemSeq || 0, ...board.items.map((it) => it.iid || 0));
  // 渔女角色键 Naiad -> naiad
  const naiadT = board.tokens.find((t) => t.role === 'Naiad');
  if (naiadT) naiadT.role = 'naiad';
  board.items.forEach((it) => { if (it.role === 'Naiad') it.role = 'naiad'; });
  // 镜像状态从红夫人实例迁移到水镜造物（镜像管理状态共享改造）
  {
    const bqT = board.tokens.find((t) => t.role === 'bloodyQueen'
      && (t.showMirror || t.showMirrorLink === false || t.fixedMirror || t.mirrorAxis));
    const aqIt = board.items.find((it) => it.kind === 'aquaMirror');
    if (bqT && aqIt) {
      if (bqT.showMirror) aqIt.showMirror = true;
      if (bqT.showMirrorLink === false) aqIt.linkShow = false;
      if (bqT.fixedMirror) aqIt.fixedMirror = true;
      if (bqT.mirrorAxis) aqIt.mirrorAxis = bqT.mirrorAxis;
      delete bqT.showMirror; delete bqT.showMirrorLink;
      delete bqT.fixedMirror; delete bqT.mirrorAxis;
    }
    const anyBq = board.tokens.find((t) => t.role === 'bloodyQueen');
    if (aqIt && anyBq && aqIt.linkTid == null) aqIt.linkTid = anyBq.tid;
  }
}

export const restoredMeasureIds = measureIdCounters(tacBoards);
restoreMeasureReferences(tacBoards);

// Capture map-specific changes when they happen, not when the debounce expires.
// The in-memory copies also let a rapid switch restore edits not yet on disk.
const savedRegions = structuredClone(tacPersisted?.regions || {});
const savedDedMarks = structuredClone(tacPersisted?.dedMarks || {});
const savedDungeons = structuredClone(tacPersisted?.dungeon || {});
const savedChairs = structuredClone(tacPersisted?.chairs || {});
const savedBoxes = structuredClone(tacPersisted?.boxes || {});
const savedSpawns = structuredClone(tacPersisted?.spawns || {});

// 每张地图各自的旋转角（0-3，逆时针 90° 步进）
export const savedRot = structuredClone(tacPersisted?.rot || {});

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
      draw: tacDrawSettings,
      mstyle: tacMeasureStyle,
      regions: savedRegions,
      dedMarks: savedDedMarks,
      dungeon: savedDungeons,
      chairs: savedChairs,
      boxes: savedBoxes,
      spawns: savedSpawns,
      rot: savedRot,
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
  savedSpawns[S.currentMapId] = S.tacSpawnIndex;
  tacSave();
}


export function restoreRegionSel(mapId) {
  S.dedMarks = { ...savedDedMarks[mapId] };
  S.dedSelectedStep = null;
  S.tacDungeonIndex = Math.min(
    Math.max(0, MAPS_DATA[mapId].dungeons.length - 1),
    Math.max(0, savedDungeons[mapId] | 0),
  );
  const spawnCount = (MAPS_DATA[mapId].spawnPoints || []).length;
  S.tacSpawnIndex = spawnCount
    ? Math.min(Math.max(0, savedSpawns[mapId] | 0), spawnCount - 1) : 0;
  const ch = MAPS_DATA[mapId].rocketChairs;
  const sc = savedChairs[mapId] || {};
  S.tacChairIndex = ch && ch.sets.length
    ? Math.min(Math.max(0, sc.set | 0), ch.sets.length - 1) : 0;

  const bCount = Object.keys(MAPS_DATA[mapId].basements || {}).length;
  S.tacChairBasementIndex = bCount
    ? Math.min(Math.max(0, sc.basement | 0), bCount - 1) : 0;
  S.tacBoxBasementIndex = S.tacChairBasementIndex;
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
  route: { ...TAC_MEASURE_DEFAULT.chain }, // 路径线：同折线的连续分段，段内按最优路径
};

// 显示设置：只放“地图上显示什么、显示多大”的开关与尺寸
export const tacDisplay = {
  zones: false,
  spawns: false, spawnSize: TAC_DISPLAY_DEFAULT.spawnSize,
  escapeDoors: true, escapeDoorSize: TAC_DISPLAY_DEFAULT.escapeDoorSize,
  escapeDoorLock: false,
  ciphers: true, cipherSize: TAC_DISPLAY_DEFAULT.cipherSize,
  dungeon: false, dungeonSize: TAC_DISPLAY_DEFAULT.dungeonSize,
  rocketChairs: false, rocketChairSize: TAC_DISPLAY_DEFAULT.rocketChairSize,
  rocketChairsBasement: false,
  lockers: false, lockerSize: TAC_DISPLAY_DEFAULT.lockerSize,
  boxes: false, boxSize: TAC_DISPLAY_DEFAULT.boxSize,
  boxesBasement: false,
  phoneBooths: false, phoneBoothSize: TAC_DISPLAY_DEFAULT.phoneBoothSize,

  showCoords: false,
  selGlow: true,
  carryHideRing: false,
  exportCrop: true, exportRot: true,
};

// 绘制设置：测算卡片绘制设置区的行为开关（吸附、端点、折线删段），与显示设置分开持久化
export const tacDrawSettings = {
  snap: { escapeDoor: true, cipher: true, dungeon: true, rocketChair: true, locker: false, box: false, phoneBooth: false, endpoint: true },
  delSegOnly: false,
  hideEndpoints: true,
  hideAnimPath: false,
  hideAnimDots: false,
  animAutoRoute: false,
  animVault: true,
  measureVault: true,
};

// 恢复持久化的设置：只读取当前结构定义的键，历史遗留键自动忽略
if (tacPersisted && tacPersisted.display) {
  const sd = tacPersisted.display;
  for (const k of Object.keys(tacDisplay)) if (k in sd) tacDisplay[k] = sd[k];
}
if (tacPersisted && tacPersisted.draw) {
  const dw = tacPersisted.draw;
  for (const k of Object.keys(tacDrawSettings)) {
    if (k === 'snap') tacDrawSettings.snap = { ...tacDrawSettings.snap, ...(dw.snap || {}) };
    else if (k in dw) tacDrawSettings[k] = dw[k];
  }
}
if (tacPersisted && tacPersisted.mstyle) {
  if (tacPersisted.mstyle.single) Object.assign(tacMeasureStyle.single, tacPersisted.mstyle.single);
  if (tacPersisted.mstyle.chain) Object.assign(tacMeasureStyle.chain, tacPersisted.mstyle.chain);
  if (tacPersisted.mstyle.route) Object.assign(tacMeasureStyle.route, tacPersisted.mstyle.route);
}

