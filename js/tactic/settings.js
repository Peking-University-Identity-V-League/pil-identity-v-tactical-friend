import {
  tacBoxSizeDefEl,
  tacBoxSizeEl,
  tacCarryBoxBasementEl,
  tacCarryChairAllEl,
  tacCarryChairBasementEl,
  tacCarryHideRingEl,
  tacChairAllEl,
  tacChairSizeDefEl,
  tacChairSizeEl,
  tacCipherAllEl,
  tacCipherCardAllEl,
  tacCipherCardDuoEl,
  tacCipherDuoEl,
  tacCipherSizeDefEl,
  tacCipherSizeEl,
  tacDelSegOnlyEl,
  tacDoorLockEl,
  tacDoorSizeDefEl,
  tacDoorSizeEl,
  tacDungeonAllEl,
  tacDungeonSizeDefEl,
  tacDungeonSizeEl,
  tacLockerSizeDefEl,
  tacLockerSizeEl,
  tacMeasureVaultEl,
  tacPhoneBoothSizeDefEl,
  tacPhoneBoothSizeEl,
  tacSelGlowEl,
  tacShowBoxBasementEl,
  tacShowBoxesEl,
  tacShowChairBasementEl,
  tacShowChairsEl,
  tacShowCiphersEl,
  tacShowCoordsEl,
  tacShowDistEl,
  tacShowDoorsEl,
  tacShowDungeonEl,
  tacShowEndpointsEl,
  tacShowLockersEl,
  tacShowPhoneBoothsEl,
  tacShowSpawnsEl,
  tacShowSpringBoxesEl,
  tacShowTimeEl,
  tacShowZonesEl,
  tacSnapBoxEl,
  tacSnapChairEl,
  tacSnapCipherEl,
  tacSnapDoorEl,
  tacSnapDungeonEl,
  tacSnapLockerEl,
  tacSnapPhoneBoothEl,
  tacSnapPointEl,
  tacSpawnDuoAllEl,
  tacSpawnDuoEl,
  tacSpawnDuoRandomEl,
  tacSpawnSizeDefEl,
  tacSpawnSizeEl,
  tacSpringBoxRangeEl,
  tacSpringBoxSizeDefEl,
  tacSpringBoxSizeEl,
} from '../core/dom.js';
import { tacDisplay, tacDrawSettings, tacSave } from '../core/persist.js';
import { S } from '../core/state.js';
import { $ } from '../core/utils.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_DISPLAY_DEFAULT } from '../data/tactic-data.js';
import {
  renderTacBoard,
  renderTacBoxes,
  renderTacChairs,
  renderTacCiphers,
  renderTacLandmarks,
  renderTacLockers,
  renderTacPhoneBooths,
  renderTacSpawns,
  renderTacSpringBoxes,
  renderTacZones,
  switchTacCipher,
  switchTacDungeon,
  switchTacSpawn,
  syncTacCipherCard,
  syncTacSpawnText,
  tacCarryDeselectIfGone,
  tacCipherCombos,
  tacSpawnDuoReroll,
} from './board.js';
import { tacSelLine } from './measure.js';
import { tacUpdateCoordsTip } from './selection.js';

function syncTacDisplayUI() {
  tacShowZonesEl.checked = tacDisplay.zones;
  tacShowCiphersEl.checked = tacDisplay.ciphers;
  tacCipherAllEl.checked = !!tacDisplay.cipherAll;
  tacDungeonAllEl.checked = !!tacDisplay.dungeonAll;
  tacChairAllEl.checked = !!tacDisplay.chairAll;
  if (tacCipherCardAllEl) tacCipherCardAllEl.checked = !!tacDisplay.cipherAll;
  if (tacCarryChairAllEl) tacCarryChairAllEl.checked = !!tacDisplay.chairAll;
  tacCipherDuoEl.checked = !!tacDisplay.cipherDuo;
  if (tacCipherCardDuoEl) tacCipherCardDuoEl.checked = !!tacDisplay.cipherDuo;
  tacCipherSizeEl.value = tacDisplay.cipherSize;
  tacCipherSizeDefEl.checked = tacDisplay.cipherSize === TAC_DISPLAY_DEFAULT.cipherSize;
  tacShowDungeonEl.checked = tacDisplay.dungeon;
  tacDungeonSizeEl.value = tacDisplay.dungeonSize;
  tacDungeonSizeDefEl.checked = tacDisplay.dungeonSize === TAC_DISPLAY_DEFAULT.dungeonSize;
  tacShowSpawnsEl.checked = tacDisplay.spawns;
  tacSpawnDuoEl.checked = !!tacDisplay.spawnDuo;
  tacSpawnDuoAllEl.checked = !!tacDisplay.spawnDuoAll;
  tacSpawnSizeEl.value = tacDisplay.spawnSize;
  tacSpawnSizeDefEl.checked = tacDisplay.spawnSize === TAC_DISPLAY_DEFAULT.spawnSize;
  tacShowChairsEl.checked = tacDisplay.rocketChairs;
  tacChairSizeEl.value = tacDisplay.rocketChairSize;
  tacChairSizeDefEl.checked = tacDisplay.rocketChairSize === TAC_DISPLAY_DEFAULT.rocketChairSize;
  tacShowChairBasementEl.checked = tacDisplay.rocketChairsBasement;
  tacShowLockersEl.checked = tacDisplay.lockers;
  tacLockerSizeEl.value = tacDisplay.lockerSize;
  tacLockerSizeDefEl.checked = tacDisplay.lockerSize === TAC_DISPLAY_DEFAULT.lockerSize;
  tacShowBoxesEl.checked = tacDisplay.boxes;
  tacBoxSizeEl.value = tacDisplay.boxSize;
  tacBoxSizeDefEl.checked = tacDisplay.boxSize === TAC_DISPLAY_DEFAULT.boxSize;
  tacShowPhoneBoothsEl.checked = tacDisplay.phoneBooths;
  tacPhoneBoothSizeEl.value = tacDisplay.phoneBoothSize;
  tacPhoneBoothSizeDefEl.checked = tacDisplay.phoneBoothSize === TAC_DISPLAY_DEFAULT.phoneBoothSize;
  tacShowSpringBoxesEl.checked = tacDisplay.springBoxes;
  tacSpringBoxRangeEl.checked = tacDisplay.springBoxRange;
  tacSpringBoxSizeEl.value = tacDisplay.springBoxSize;
  tacSpringBoxSizeDefEl.checked = tacDisplay.springBoxSize === TAC_DISPLAY_DEFAULT.springBoxSize;
  tacShowBoxBasementEl.checked = tacDisplay.boxesBasement;
  tacShowDoorsEl.checked = tacDisplay.escapeDoors;
  tacDoorSizeEl.value = tacDisplay.escapeDoorSize;
  tacDoorSizeDefEl.checked = tacDisplay.escapeDoorSize === TAC_DISPLAY_DEFAULT.escapeDoorSize;
  tacDoorLockEl.checked = tacDisplay.escapeDoorLock;
  tacSnapCipherEl.checked = tacDrawSettings.snap.cipher;
  tacSnapDungeonEl.checked = tacDrawSettings.snap.dungeon;
  tacSnapDoorEl.checked = tacDrawSettings.snap.escapeDoor;
  tacSnapChairEl.checked = tacDrawSettings.snap.rocketChair;
  tacSnapLockerEl.checked = tacDrawSettings.snap.locker;
  tacSnapBoxEl.checked = tacDrawSettings.snap.box;
  tacSnapPhoneBoothEl.checked = tacDrawSettings.snap.phoneBooth;
  tacSnapPointEl.checked = tacDrawSettings.snap.endpoint;
  tacDelSegOnlyEl.checked = tacDrawSettings.delSegOnly;
  tacShowCoordsEl.checked = tacDisplay.showCoords;
  tacSelGlowEl.checked = tacDisplay.selGlow;
  tacShowEndpointsEl.checked = !!tacDrawSettings.showEndpoints;
  tacShowDistEl.checked = tacDrawSettings.showDist !== false;
  tacShowTimeEl.checked = !!tacDrawSettings.showTime;
  if (tacMeasureVaultEl) tacMeasureVaultEl.checked = tacDrawSettings.measureVault !== false;
  tacCarryHideRingEl.checked = !!tacDisplay.carryHideRing;
  const cropEl = $('tacExportCrop');
  if (cropEl) cropEl.checked = tacDisplay.exportCrop;
  const exportRotEl = $('tacExportRot');
  if (exportRotEl) exportRotEl.checked = tacDisplay.exportRot;
}

let tacSpeedSettingsOpen = true;

let tacDrawSettingsOpen = false;

let tacDrawOtherOpen = true;

function bindTacDisplayRow(toggleEl, sliderEl, defEl, onToggle, onSize) {
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

function tacSetCipherAll(v) {
  tacDisplay.cipherAll = v;
  tacCipherAllEl.checked = v;
  if (tacCipherCardAllEl) tacCipherCardAllEl.checked = v;
  renderTacCiphers();
  tacSave();
}

function tacSetCipherDuo(v) {
  tacDisplay.cipherDuo = v;
  // 联合狩猎组数更少，当前组下标取模收敛，避免越界
  S.currentCipherIndex %= tacCipherCombos(MAPS_DATA[S.currentMapId]).length;
  renderTacCiphers();
  syncTacCipherCard();
  tacSave();
}

function tacSetChairAll(v) {
  tacDisplay.chairAll = v;
  tacChairAllEl.checked = v;
  if (tacCarryChairAllEl) tacCarryChairAllEl.checked = v;
  // 椅子集合变化后，旧的选中椅子引用可能不再对应屏幕上的图标，取消选中
  tacCarryDeselectIfGone('fixed');
  tacCarryDeselectIfGone('set');
  tacCarryDeselectIfGone('all');
  renderTacChairs();
  tacSave();
}

// 显示端点/距离/时间：选中某条线时，改动同步应用到该线（lc.style 覆盖全局设置）
const tacApplyLineStyle = (key, val) => {
  tacDrawSettings[key] = val;
  const L = tacSelLine();
  if (L && L.segs[0] && L.segs[0].lc) {
    L.segs[0].lc.style = { ...(L.segs[0].lc.style || {}), [key]: val };
  }
  renderTacBoard();
  tacSave();
};

export function setTacDrawOtherOpen(value) {
  tacDrawOtherOpen = value;
  return value;
}

export function setTacDrawSettingsOpen(value) {
  tacDrawSettingsOpen = value;
  return value;
}

export function setTacSpeedSettingsOpen(value) {
  tacSpeedSettingsOpen = value;
  return value;
}

export function bindDisplaySettings() {
  tacCipherSizeDefEl._default = TAC_DISPLAY_DEFAULT.cipherSize;

  tacDungeonSizeDefEl._default = TAC_DISPLAY_DEFAULT.dungeonSize;

  tacSpawnSizeDefEl._default = TAC_DISPLAY_DEFAULT.spawnSize;

  tacChairSizeDefEl._default = TAC_DISPLAY_DEFAULT.rocketChairSize;

  tacLockerSizeDefEl._default = TAC_DISPLAY_DEFAULT.lockerSize;

  tacBoxSizeDefEl._default = TAC_DISPLAY_DEFAULT.boxSize;

  tacPhoneBoothSizeDefEl._default = TAC_DISPLAY_DEFAULT.phoneBoothSize;

  tacDoorSizeDefEl._default = TAC_DISPLAY_DEFAULT.escapeDoorSize;

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
    (v) => { tacDisplay.rocketChairs = v; renderTacChairs(); },
    (v) => { tacDisplay.rocketChairSize = v; renderTacChairs(); });

  tacShowChairBasementEl.addEventListener('change', () => {
    tacDisplay.rocketChairsBasement = tacShowChairBasementEl.checked;
    tacCarryChairBasementEl.checked = tacDisplay.rocketChairsBasement;
    renderTacChairs();
    tacSave();
  });

  bindTacDisplayRow(tacShowLockersEl, tacLockerSizeEl, tacLockerSizeDefEl,
    (v) => { tacDisplay.lockers = v; renderTacLockers(); },
    (v) => { tacDisplay.lockerSize = v; renderTacLockers(); });

  bindTacDisplayRow(tacShowBoxesEl, tacBoxSizeEl, tacBoxSizeDefEl,
    (v) => { tacDisplay.boxes = v; renderTacBoxes(); },
    (v) => { tacDisplay.boxSize = v; renderTacBoxes(); });

  bindTacDisplayRow(tacShowPhoneBoothsEl, tacPhoneBoothSizeEl, tacPhoneBoothSizeDefEl,
    (v) => { tacDisplay.phoneBooths = v; renderTacPhoneBooths(); },
    (v) => { tacDisplay.phoneBoothSize = v; renderTacPhoneBooths(); });

  bindTacDisplayRow(tacShowSpringBoxesEl, tacSpringBoxSizeEl, tacSpringBoxSizeDefEl,
    (v) => { tacDisplay.springBoxes = v; renderTacSpringBoxes(); },
    (v) => { tacDisplay.springBoxSize = v; renderTacSpringBoxes(); });

  tacSpringBoxRangeEl.addEventListener('change', () => {
    tacDisplay.springBoxRange = tacSpringBoxRangeEl.checked;
    renderTacSpringBoxes();
    tacSave();
  });

  tacShowBoxBasementEl.addEventListener('change', () => {
    tacDisplay.boxesBasement = tacShowBoxBasementEl.checked;
    tacCarryBoxBasementEl.checked = tacDisplay.boxesBasement;
    renderTacBoxes();
    tacSave();
  });

  bindTacDisplayRow(tacShowDoorsEl, tacDoorSizeEl, tacDoorSizeDefEl,
    (v) => { tacDisplay.escapeDoors = v; renderTacLandmarks(); },
    (v) => { tacDisplay.escapeDoorSize = v; renderTacLandmarks(); });

  tacCipherAllEl.addEventListener('change', () => tacSetCipherAll(tacCipherAllEl.checked));

  tacCipherDuoEl.addEventListener('change', () => tacSetCipherDuo(tacCipherDuoEl.checked));

  if (tacCipherCardDuoEl) {
    tacCipherCardDuoEl.addEventListener('change', () => tacSetCipherDuo(tacCipherCardDuoEl.checked));
  }

  if (tacCipherCardAllEl) {
    tacCipherCardAllEl.addEventListener('change', () => tacSetCipherAll(tacCipherCardAllEl.checked));
  }

  tacDungeonAllEl.addEventListener('change', () => {
    tacDisplay.dungeonAll = tacDungeonAllEl.checked;
    renderTacLandmarks();
    tacSave();
  });

  tacChairAllEl.addEventListener('change', () => tacSetChairAll(tacChairAllEl.checked));

  if (tacCarryChairAllEl) {
    tacCarryChairAllEl.addEventListener('change', () => tacSetChairAll(tacCarryChairAllEl.checked));
  }
}

export function bindDrawingSettings() {
  tacDoorLockEl.addEventListener('change', () => {
    tacDisplay.escapeDoorLock = tacDoorLockEl.checked;
    renderTacLandmarks();
    tacSave();
  });

  tacSnapCipherEl.addEventListener('change', () => {
    tacDrawSettings.snap.cipher = tacSnapCipherEl.checked;
    tacSave();
  });

  tacSnapDungeonEl.addEventListener('change', () => {
    tacDrawSettings.snap.dungeon = tacSnapDungeonEl.checked;
    tacSave();
  });

  tacSnapDoorEl.addEventListener('change', () => {
    tacDrawSettings.snap.escapeDoor = tacSnapDoorEl.checked;
    tacSave();
  });

  tacSnapChairEl.addEventListener('change', () => {
    tacDrawSettings.snap.rocketChair = tacSnapChairEl.checked;
    tacSave();
  });

  tacSnapLockerEl.addEventListener('change', () => {
    tacDrawSettings.snap.locker = tacSnapLockerEl.checked;
    tacSave();
  });

  tacSnapBoxEl.addEventListener('change', () => {
    tacDrawSettings.snap.box = tacSnapBoxEl.checked;
    tacSave();
  });

  tacSnapPhoneBoothEl.addEventListener('change', () => {
    tacDrawSettings.snap.phoneBooth = tacSnapPhoneBoothEl.checked;
    tacSave();
  });

  tacSnapPointEl.addEventListener('change', () => {
    tacDrawSettings.snap.endpoint = tacSnapPointEl.checked;
    tacSave();
  });

  tacDelSegOnlyEl.addEventListener('change', () => {
    tacDrawSettings.delSegOnly = tacDelSegOnlyEl.checked;
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

  tacShowEndpointsEl.addEventListener('change', () => tacApplyLineStyle('showEndpoints', tacShowEndpointsEl.checked));

  tacShowDistEl.addEventListener('change', () => tacApplyLineStyle('showDist', tacShowDistEl.checked));

  tacShowTimeEl.addEventListener('change', () => tacApplyLineStyle('showTime', tacShowTimeEl.checked));

  // 路径线的「允许翻窗」：控制最优路径是否可穿过窗户
  tacMeasureVaultEl?.addEventListener('change', () => {
    tacDrawSettings.measureVault = tacMeasureVaultEl.checked;
    tacSave();
  });

  $('tacDispCipherPrev').addEventListener('click', () => switchTacCipher(-1));

  $('tacDispCipherNext').addEventListener('click', () => switchTacCipher(1));

  $('tacDungeonPrev').addEventListener('click', () => switchTacDungeon(-1));

  $('tacDungeonNext').addEventListener('click', () => switchTacDungeon(1));

  $('tacSpawnPrev').addEventListener('click', () => switchTacSpawn(-1));

  $('tacSpawnNext').addEventListener('click', () => switchTacSpawn(1));

  tacSpawnDuoEl.addEventListener('change', () => {
    tacDisplay.spawnDuo = tacSpawnDuoEl.checked;
    syncTacSpawnText();
    renderTacSpawns();
    tacSave();
  });

  tacSpawnDuoAllEl.addEventListener('change', () => {
    tacDisplay.spawnDuoAll = tacSpawnDuoAllEl.checked;
    syncTacSpawnText();
    renderTacSpawns();
    tacSave();
  });

  tacSpawnDuoRandomEl.addEventListener('click', () => tacSpawnDuoReroll());
}

export function initializeDisplaySettings() {
  // 显示/绘制/样式设置的持久化恢复已收拢在 persist.js 顶部（只认当前结构的键）
  syncTacDisplayUI();
}

export {
  bindTacDisplayRow,
  syncTacDisplayUI,
  tacDrawOtherOpen,
  tacDrawSettingsOpen,
  tacSpeedSettingsOpen,
};
