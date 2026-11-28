import { animSegPath } from '../core/anim.js';
import {
  tacArrowSvg,
  tacBasementText,
  tacCarryBasementTextEl,
  tacCarryCard,
  tacChairText,
  tacCipherCard,
  tacCipherCardAllEl,
  tacCipherCardDuoEl,
  tacCipherCardDuoWrapEl,
  tacCipherCardNextBtn,
  tacCipherCardPrevBtn,
  tacCipherCardShowEl,
  tacCipherCardSizeDefEl,
  tacCipherCardSizeEl,
  tacCipherCardText,
  tacCipherDuoEl,
  tacCipherDuoWrapEl,
  tacCipherList,
  tacCipherSizeDefEl,
  tacCipherSizeEl,
  tacDispCipherText,
  tacDungeonText,
  tacMapImage,
  tacMapWrap,
  tacRot,
  tacShowCiphersEl,
  tacSpawnDuoAllEl,
  tacSpawnDuoEl,
  tacSpawnDuoEntryEl,
  tacSpawnDuoHunterTextEl,
  tacSpawnDuoRandomEl,
  tacSpawnDuoWrapEl,
  tacSpawnText,
  tacticView,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import {
  savedRot,
  saveRegionSel,
  tacBoard,
  tacDisplay,
  tacDrawSettings,
  tacMeasureStyle,
  tacSave,
} from '../core/persist.js';
import { S } from '../core/state.js';
import { getTreasureRings } from '../core/treasure.js';
import { $, loadImageWithStatus, mountImageOverlays } from '../core/utils.js';
import { cipherOf, mapsZonesRelative } from '../data/geo.js';
import { COMMON_ICON_URL, TAC_COMMON_ITEM_TYPES } from '../data/items_common.js';
import { TAC_ITEM_TYPES } from '../data/items.js';
import {
  getImageUrl,
  MAPS_DATA,
  rocketChairGroups,
  SPAWN_SURVIVOR_HUNTER_DISTANCE_MIN,
  spawnPointGroups,
} from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import {
  TAC_DISPLAY_DEFAULT,
  TAC_SVG_NS,
  TAC_TREASURE_RULE,
  TAC_ZOOM_LOCK_ICONS,
  TAC_ZOOM_MAX,
  TAC_ZOOM_MIN,
} from '../data/tactic-data.js';
import { CIPHER_ICON_URL, cipherIcon } from '../map-icons.js';
import {
  syncTacCarryChairName,
  syncTacCarryChairRow,
  tacCarryClearResult,
  tacCarryDisarm,
  tacCarryState,
  tacDedOnMapSwitch,
} from './analysis-carry.js';
import { renderTacPathPoints } from './analysis-path.js';
import { renderTacAnimDots, renderTacTimeline, tacAnimTargetOf } from './animation.js';
import {
  setTacSelectedText,
  setTacTextPlacing,
  shapeNode,
  tacArrowColor,
  tacArrowWidth,
  tacDrawing,
  tacDrawShape,
  tacSelectedText,
  updateTacTextUi,
} from './drawing.js';
import { tacManageSel, tacSortedEntries } from './manage.js';
import {
  chainTotalNode,
  measureNode,
  setTacGreenSegs,
  setTacSelMeasure,
  tacChainRoute,
  tacGreenSegs,
  tacLetter,
  tacLetterNode,
  tacLineStyle,
  tacMeasureHover,
  tacMeasureMode,
  tacMeasurePending,
  tacMeasureSegColor,
  tacSelLine,
  tacSimLine,
} from './measure.js';
import { tacTool, updateTacPanel } from './panel.js';
import {
  TAC_RANGE_DEFAULT_FILL,
  tacCrossSvg,
  tacHpEdges,
  tacItemByIid,
  tacItemMetersToPercent,
  tacLinkPartner,
  tacRangeEntries,
  tacRingSvg,
  tacSameLinkable,
  tacTalentRanges,
  tacTokenByRole,
  tacTokenByTid,
} from './roles-items.js';
import {
  setTacPlaceItem,
  setTacPlaceRole,
  setTacSelected,
  setTacSelectedItem,
  tacSelected,
  tacSelectedItem,
} from './selection.js';

const { loading: tacLoading, error: tacImageError } =
  mountImageOverlays(tacMapWrap);

const tacImageState = { url: null, timer: null, loaded: null };

function syncTacImage() {
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
  renderTacLockers();
  const lockerEntry = $('tacLockerEntry');
  if (lockerEntry) lockerEntry.style.display = MAPS_DATA[S.currentMapId].lockers ? '' : 'none';
  renderTacBoxes();
  const boxEntry = $('tacBoxEntry');
  if (boxEntry) boxEntry.style.display = MAPS_DATA[S.currentMapId].chests ? '' : 'none';
  renderTacPhoneBooths();
  renderTacSpringBoxes();
  const phoneBoothEntry = $('tacPhoneBoothEntry');
  if (phoneBoothEntry) phoneBoothEntry.style.display = MAPS_DATA[S.currentMapId].phoneBooths ? '' : 'none';
  const springBoxEntry = $('tacSpringBoxEntry');
  if (springBoxEntry) springBoxEntry.style.display = MAPS_DATA[S.currentMapId].springBox ? '' : 'none';
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
  if (spawnEntry) spawnEntry.style.display = (MAPS_DATA[S.currentMapId].spawnPointCombinations || []).length ? '' : 'none';
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

// 每张地图各密码机的破译进度（0-100；null/0 表示未开启进度显示）
let tacCipherProgress = {};

function tacCipherProgressSave() {
  try { localStorage.setItem(TAC_CIPHER_PROGRESS_LS_KEY, JSON.stringify(tacCipherProgress)); } catch (err) { /* ignore */ }
}

function tacCipherPctOf(mapId, cid) {
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
  if (pct != null && pct >= 100) return COMMON_ICON_URL.cipherMachineDone;
  return CIPHER_ICON_URL;
}

// 当前生效的密码机组列表与全量列表（勾选「联合狩猎」且有对应数据时切换）
function tacCipherCombos(map) {
  return (tacDisplay.cipherDuo && map.cipherCombinationsDuoHunters) || map.cipherCombinations;
}

function tacCipherAllIds(map) {
  return (tacDisplay.cipherDuo && map.cipherAllDuoHunters) || map.cipherAll;
}

function renderTacCiphers() {
  if (!tacMapWrap) return;
  // The prediction remains visible and must update even when cipher icons do not.
  renderTacTreasure();
  tacMapWrap.querySelectorAll('.tac-cipher, .tac-cipher-pct').forEach((el) => el.remove());
  if (!tacDisplay.ciphers || !cipherIcon.loaded) return;
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  (tacDisplay.cipherAll ? tacCipherAllIds(map) : tacCipherCombos(map)[S.currentCipherIndex]).forEach((cid) => {
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

function switchTacCipher(step) {
  const count = tacCipherCombos(MAPS_DATA[S.currentMapId]).length;
  S.currentCipherIndex = (S.currentCipherIndex + step + count) % count;
  syncTacImage();
  saveRegionSel();
}

// 密码机卡片：与显示设置共享「显示 / 切组 / 图标大小」，下方列出当前组 5 台密码机的进度设置
function syncTacCipherCard() {
  if (!tacCipherCard) return;
  const map = MAPS_DATA[S.currentMapId];
  const combos = tacCipherCombos(map);
  const count = combos.length;
  const text = translate("ui.tac.display.cipher.layout", { index: S.currentCipherIndex + 1, count: count });
  tacDispCipherText.textContent = text;
  tacCipherCardText.textContent = text;
  tacCipherCardShowEl.checked = !!tacDisplay.ciphers;
  tacShowCiphersEl.checked = !!tacDisplay.ciphers;
  if (tacCipherCardAllEl) tacCipherCardAllEl.checked = !!tacDisplay.cipherAll;
  // 「联合狩猎」仅在有对应数据的地图出现
  const duoVisible = map.cipherCombinationsDuoHunters ? '' : 'none';
  tacCipherDuoWrapEl.style.display = duoVisible;
  if (tacCipherCardDuoWrapEl) tacCipherCardDuoWrapEl.style.display = duoVisible;
  tacCipherDuoEl.checked = !!tacDisplay.cipherDuo;
  if (tacCipherCardDuoEl) tacCipherCardDuoEl.checked = !!tacDisplay.cipherDuo;
  tacCipherCardSizeEl.value = tacDisplay.cipherSize;
  tacCipherSizeEl.value = tacDisplay.cipherSize;
  tacCipherCardSizeDefEl.checked = tacDisplay.cipherSize === TAC_DISPLAY_DEFAULT.cipherSize;
  tacCipherSizeDefEl.checked = tacCipherCardSizeDefEl.checked;
  tacCipherList.innerHTML = '';
  combos[S.currentCipherIndex].forEach((cid) => {
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
    enableText.textContent = translate("ui.tac.cipherCard.enableProgress");
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

function renderTacZones() {
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

function tacDoorPoints(map) {
  const d = map.escapeDoors;
  if (tacDisplay.escapeDoorLock && d.length >= 4) return [d[2], d[3]];
  return d.slice(0, 2);
}

// 联合狩猎：从求生者点位池随机抽 8 个（洗牌取前 8）
// 联合狩猎：与当前监管者双人组合均相距 ≥36m 的求生者候选点
function spawnDuoSurvivorCandidates(map) {
  const combos = map.spawnPointsHunterDuoHunters;
  if (!combos || !combos.length) return map.spawnPoints.survivor.map((pt) => pt.id);
  // 跨图切换时下标可能越界，先收敛
  S.tacSpawnDuoHunterIndex %= combos.length;
  const [imgW] = map.mapSize;
  const huntById = new Map(map.spawnPoints.hunter.map((pt) => [pt.id, pt.location]));
  const hunters = combos[S.tacSpawnDuoHunterIndex % combos.length]
    .map((id) => huntById.get(id))
    .filter(Boolean);
  const minPx = map.widthM ? (SPAWN_SURVIVOR_HUNTER_DISTANCE_MIN / map.widthM) * imgW : 0;
  return map.spawnPoints.survivor
    .filter((pt) => hunters.every((h) => Math.hypot(pt.location[0] - h[0], pt.location[1] - h[1]) >= minPx))
    .map((pt) => pt.id);
}

function tacSpawnDuoReroll() {
  const map = MAPS_DATA[S.currentMapId];
  if (!map.spawnPoints) return;
  const ids = spawnDuoSurvivorCandidates(map);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  S.spawnDuoPicks = ids.slice(0, 8);
  renderTacSpawns();
}

function renderTacSpawns() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-spawn').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  if (!tacDisplay.spawns || !map.spawnPoints) return;
  const [imgW, imgH] = map.mapSize;
  const place = (pt, iconUrl, alt) => {
    if (!pt) return;
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
  const altText = translate("common.spawnPoint");
  // 联合狩猎模式：8 求生者（随机或全部）+ 固定组合的 2 监管者
  if (tacDisplay.spawnDuo && map.spawnPointsHunterDuoHunters) {
    const survById = new Map(map.spawnPoints.survivor.map((pt) => [pt.id, pt.location]));
    const huntById = new Map(map.spawnPoints.hunter.map((pt) => [pt.id, pt.location]));
    let picks;
    if (tacDisplay.spawnDuoAll) {
      picks = map.spawnPoints.survivor.map((pt) => pt.id);
    } else {
      if (!S.spawnDuoPicks.length) tacSpawnDuoReroll();
      picks = S.spawnDuoPicks;
    }
    picks.forEach((id) => place(survById.get(id), COMMON_ICON_URL.survivor, altText));
    const combos = map.spawnPointsHunterDuoHunters;
    combos[S.tacSpawnDuoHunterIndex % combos.length]
      .forEach((id) => place(huntById.get(id), COMMON_ICON_URL.hunter, altText));
    return;
  }
  const groups = spawnPointGroups(map);
  if (!groups.length) return;
  const group = groups[S.tacSpawnIndex % groups.length];
  group.survivor.forEach((pt) => place(pt, COMMON_ICON_URL.survivor, altText));
  place(group.hunter, COMMON_ICON_URL.hunter, altText);
}

function syncTacSpawnText() {
  const map = MAPS_DATA[S.currentMapId];
  const n = (map.spawnPointCombinations || []).length;
  tacSpawnText.textContent = translate("ui.tac.display.spawnPoint.layout", { index: S.tacSpawnIndex + 1, count: n });
  // 「联合狩猎」仅在有监管者组合数据的地图出现；开启后普通组切换失效，展开子行
  const hasDuo = !!map.spawnPointsHunterDuoHunters;
  const duo = tacDisplay.spawnDuo && hasDuo;
  tacSpawnDuoWrapEl.style.display = hasDuo ? '' : 'none';
  tacSpawnDuoEl.checked = duo;
  tacSpawnDuoEntryEl.style.display = duo ? "" : "none";
  $('tacSpawnPrev').classList.toggle('tac-switch-disabled', duo);
  $('tacSpawnNext').classList.toggle('tac-switch-disabled', duo);
  if (tacSpawnDuoRandomEl) tacSpawnDuoRandomEl.disabled = !!tacDisplay.spawnDuoAll;
  if (tacSpawnDuoAllEl) tacSpawnDuoAllEl.checked = !!tacDisplay.spawnDuoAll;
  if (duo) {
    const combos = map.spawnPointsHunterDuoHunters;
    tacSpawnDuoHunterTextEl.textContent = translate("ui.tac.display.spawnPoint.layout",
      { index: (S.tacSpawnDuoHunterIndex % combos.length) + 1, count: combos.length });
  }
}

function switchTacSpawn(step) {
  const map = MAPS_DATA[S.currentMapId];
  if (tacDisplay.spawnDuo && map.spawnPointsHunterDuoHunters) return;
  const n = (map.spawnPointCombinations || []).length;
  if (!n) return;
  S.tacSpawnIndex = (S.tacSpawnIndex + step + n) % n;
  syncTacSpawnText();
  renderTacSpawns();
  saveRegionSel();
}

function renderTacLandmarks() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-dungeon, .tac-door').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  if (tacDisplay.dungeon && map.dungeons.length) {
    const pts = tacDisplay.dungeonAll ? map.dungeons : [map.dungeons[S.tacDungeonIndex % map.dungeons.length]];
    pts.forEach((pt) => {
      const el = document.createElement('img');
      el.className = 'tac-dungeon';
      el.src = COMMON_ICON_URL.dungeon;
      el.alt = translate("common.dungeon");
      el.draggable = false;
      el.style.left = `${(pt[0] / imgW) * 100}%`;
      el.style.top = `${(pt[1] / imgH) * 100}%`;
      el.style.width = `${tacDisplay.dungeonSize}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
      tacLayer().appendChild(el);
    });
  }
  if (tacDisplay.escapeDoors) {
    tacDoorPoints(map).forEach((pt, i) => {
      const el = document.createElement('img');
      el.className = 'tac-door';
      el.src = COMMON_ICON_URL.escapeDoor;
      el.alt = translate("common.escapeDoor.alt", { value: i + 1 });
      el.draggable = false;
      el.style.left = `${(pt[0] / imgW) * 100}%`;
      el.style.top = `${(pt[1] / imgH) * 100}%`;
      el.style.width = `${tacDisplay.escapeDoorSize}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
      tacLayer().appendChild(el);
    });
  }
  renderTacFixedSpawns();
}

function renderTacFixedSpawns() {
  if (!tacMapWrap) return;
  // 排除弹簧箱范围圈（它带 tac-spring-box-range 标记，由 renderTacSpringBoxes 独立管理）
  tacMapWrap.querySelectorAll('.tac-fixed-spawn, .tac-fixed-spawn-range:not(.tac-spring-box-range)').forEach((el) => el.remove());
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
          const iconUrl = (TAC_ITEM_TYPES[item.icon] || {}).icon || COMMON_ICON_URL[item.icon] || item.icon;
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

function renderTacTreasure() {
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

function syncTacDungeonText() {
  const n = MAPS_DATA[S.currentMapId].dungeons.length;
  tacDungeonText.textContent = translate("ui.tac.display.dungeon.layout", { index: S.tacDungeonIndex + 1, count: n });
}

function switchTacDungeon(step) {
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

function renderTacChairs() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-chair, .tac-carry-point, .tac-carry-time-start, .tac-path-point, .tac-path-label').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const ch = rocketChairGroups(map);
  if (!ch) return;
  const [imgW, imgH] = map.mapSize;
  // 椅子点格式：[x, z]（地面）或 [x, y, z]（地下室，y 为高度）
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const draw = (pt, kind, index) => {
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
    el.src = COMMON_ICON_URL.rocketChair;
    el.alt = translate("common.rocketChair");
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.rocketChairSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
    // 选中椅子的正圆红框：img 是替换元素不支持伪元素，用独立 div 画正圆
    if (el.classList.contains('tac-carry-selected') && !tacDisplay.carryHideRing) {
      const ring = document.createElement('div');
      ring.className = 'tac-chair tac-carry-ring';
      ring.style.left = el.style.left;
      ring.style.top = el.style.top;
      ring.style.width = `${tacDisplay.rocketChairSize * 1.5}%`;
      tacLayer().appendChild(ring);
    }
  };
  if (tacDisplay.rocketChairs) {
    if (tacDisplay.chairAll) {
      map.rocketChairs.forEach((rc, i) => draw(rc.location, 'all', i));
    } else {
      ch.fixed.forEach((pt, i) => draw(pt, 'fixed', i));
      const setIdx = ch.sets.length ? S.tacChairIndex % ch.sets.length : -1;
      if (setIdx >= 0) {
        ch.sets[setIdx].forEach((pt, i) => draw(pt, 'set', i));
      }
    }
  }
  const bs = tacBasementList();
  if (tacDisplay.rocketChairsBasement && bs.length) {
    const bIdx = S.tacChairBasementIndex % bs.length;
    bs[bIdx].rocketChairs.forEach((pt, i) => draw(pt, 'basement', i));
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
      ? 'ui.tac.rocketChair.tideTurner.point.map.startLabel' : 'ui.tac.rocketChair.balloon.point.map.startLabel');
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

function syncTacChairText() {
  const ch = rocketChairGroups(MAPS_DATA[S.currentMapId]);
  if (!ch || !ch.sets.length) { tacChairText.textContent = '--'; return; }
  tacChairText.textContent = translate("ui.tac.display.rocketChair.layout",
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

function switchTacChair(step) {
  const ch = rocketChairGroups(MAPS_DATA[S.currentMapId]);
  if (!ch || !ch.sets.length) return;
  S.tacChairIndex = (S.tacChairIndex + step + ch.sets.length) % ch.sets.length;
  tacCarryDeselectIfGone('set');
  syncTacChairText();
  renderTacChairs();
  saveRegionSel();
}

function syncTacBasementText() {
  const count = tacBasementList().length;
  const txt = !count ? '--' : translate("ui.tac.display.basement.layout",
    { index: S.tacChairBasementIndex + 1, count });
  tacBasementText.textContent = txt;
  if (tacCarryBasementTextEl) tacCarryBasementTextEl.textContent = txt;
}

function switchTacBasement(step) {
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

function renderTacLockers() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-locker').forEach((el) => el.remove());
  if (!tacDisplay.lockers) return;
  const map = MAPS_DATA[S.currentMapId];
  if (!map || !map.lockers || !map.lockers.length) return;
  const [imgW, imgH] = map.mapSize;
  map.lockers.forEach(([px, pz]) => {
    const el = document.createElement('img');
    el.className = 'tac-locker';
    el.src = COMMON_ICON_URL.locker;
    el.alt = translate("common.locker");
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.lockerSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
  });
}

function renderTacPhoneBooths() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-phone-booth').forEach((el) => el.remove());
  if (!tacDisplay.phoneBooths) return;
  const map = MAPS_DATA[S.currentMapId];
  if (!map || !map.phoneBooths || !map.phoneBooths.length) return;
  const [imgW, imgH] = map.mapSize;
  map.phoneBooths.forEach(([px, pz]) => {
    const el = document.createElement('img');
    el.className = 'tac-phone-booth';
    el.src = COMMON_ICON_URL.phoneBooth;
    el.alt = translate("common.phoneBooth");
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.phoneBoothSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
  });
}

// 弹簧箱：图标 + 可选 8m 范围圈（范围取 customSpringBox 的第一个档位）
function renderTacSpringBoxes() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-spring-box, .tac-spring-box-range').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  if (!map || !map.springBox || !map.springBox.length) return;
  if (!tacDisplay.springBoxes && !tacDisplay.springBoxRange) return;
  const [imgW, imgH] = map.mapSize;
  const rangeM = (TAC_COMMON_ITEM_TYPES.customSpringBox.ranges.options[0] || {}).size_m;
  map.springBox.forEach(([px, pz]) => {
    if (tacDisplay.springBoxRange && rangeM && map.widthM) {
      const sizePct = ((rangeM * 2) / map.widthM) * 100;
      const rangeEl = document.createElement('div');
      rangeEl.className = 'tac-fixed-spawn-range tac-spring-box-range';
      rangeEl.style.width = `${sizePct}%`;
      rangeEl.style.aspectRatio = '1';
      rangeEl.style.borderRadius = '50%';
      rangeEl.style.left = `${(px / imgW) * 100}%`;
      rangeEl.style.top = `${(pz / imgH) * 100}%`;
      tacLayer().appendChild(rangeEl);
    }
    if (tacDisplay.springBoxes) {
      const el = document.createElement('img');
      el.className = 'tac-spring-box';
      el.src = COMMON_ICON_URL.springBox;
      el.alt = translate("common.springBox");
      el.draggable = false;
      el.style.left = `${(px / imgW) * 100}%`;
      el.style.top = `${(pz / imgH) * 100}%`;
      el.style.width = `${tacDisplay.springBoxSize}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
      tacLayer().appendChild(el);
    }
  });
}

function renderTacBoxes() {
  if (!tacMapWrap) return;
  tacMapWrap.querySelectorAll('.tac-box').forEach((el) => el.remove());
  const map = MAPS_DATA[S.currentMapId];
  const bx = map.chests;
  if (!bx) return;
  const [imgW, imgH] = map.mapSize;
  // 箱子点格式与椅子相同：[x, z]（地面）或 [x, y, z]（带高度，如地下室/二楼）
  const xz = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
  const draw = (pt) => {
    const [px, pz] = xz(pt);
    const el = document.createElement('img');
    el.className = 'tac-box';
    el.src = COMMON_ICON_URL.box;
    el.alt = translate("common.box");
    el.draggable = false;
    el.style.left = `${(px / imgW) * 100}%`;
    el.style.top = `${(pz / imgH) * 100}%`;
    el.style.width = `${tacDisplay.boxSize}%`;
    el.style.transform = `translate(-50%, -50%) rotate(${tacUpRot()}deg)`;
    tacLayer().appendChild(el);
  };
  if (tacDisplay.boxes) {
    bx.forEach((pt) => draw(pt));
  }
  const bs = tacBasementList();
  if (tacDisplay.boxesBasement && bs.length) {
    const bIdx = S.tacChairBasementIndex % bs.length;
    bs[bIdx].chest.forEach((pt) => draw(pt));
  }
}

const tacZoomState = { scale: 1, tx: 0, ty: 0, pan: false, locked: true };

let tacPanDrag = null;

// ---- 地图旋转（逆时针 90° 步进，0-3，每张地图各自记忆并随存档持久化）----
// 存储坐标始终是地图原始坐标（x 右 / y 下，0-1 分数）。
// 显示时把内容挂到 #tacRot 层，整层 rotate(-90k)；
// 指针坐标经 tacPos 逆变换回地图坐标。
let tacRotK = 0;

function tacSetRot(k) {
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
  renderTacLockers();
  renderTacBoxes();
  renderTacPhoneBooths();
  renderTacSpringBoxes();
  renderTacBoard();
}

// 正立补偿角（度）：地图内容随层逆时针转了 90k，图标/文字反向转回
function tacUpRot() {
  return 90 * (tacRotK & 3);
}

// SVG 文字正立补偿：绕自身锚点反向旋转
function tacUprightSvgText(el, x, y) {
  if (tacUpRot()) el.setAttribute('transform', `rotate(${tacUpRot()} ${x} ${y})`);
  else el.removeAttribute('transform');
}

function tacRotate() {
  tacSetRot(tacRotK + 1);
}

// 地图坐标分数 -> 视觉（wrap）坐标分数
function tacRotPt(x, y) {
  switch (tacRotK & 3) {
    case 1: return [y, 1 - x];
    case 2: return [1 - x, 1 - y];
    case 3: return [1 - y, x];
    default: return [x, y];
  }
}

// 视觉（wrap）向量 -> 地图向量（键盘方向键等屏幕方向输入用）
function tacRotVec(dx, dy) {
  switch (tacRotK & 3) {
    case 1: return [-dy, dx];
    case 2: return [-dx, -dy];
    case 3: return [dy, -dx];
    default: return [dx, dy];
  }
}

function tacLayer() {
  return (typeof tacRot !== 'undefined' && tacRot) || tacMapWrap;
}

function tacApplyRotation() {
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

function tacZoomEls() {
  return {
    lock: $('tacZoomLock'),
    out: $('tacZoomOut'), inn: $('tacZoomIn'),
    val: $('tacZoomVal'), pan: $('tacZoomPan'),
  };
}

function tacUpdateTouchAction() {
  const own = tacTool === 'draw' || tacTool === 'measure'
    || tacZoomState.scale > TAC_ZOOM_MIN || tacZoomState.pan;
  tacMapWrap.style.touchAction = own ? 'none' : '';
}

function tacSetZoomLock(on) {
  tacZoomState.locked = on;
  tacUpdateTouchAction();
  const { lock } = tacZoomEls();
  if (!lock) return;
  lock.classList.toggle('active', on);
  lock.innerHTML = on ? TAC_ZOOM_LOCK_ICONS.locked : TAC_ZOOM_LOCK_ICONS.unlocked;
  lock.title = on ? translate("ui.tac.map.zoomLock.message1")
    : translate("ui.tac.map.zoomLock.message2");
}

function tacApplyZoom() {
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

function tacZoomTo(next, anchorX, anchorY) {
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

function tacZoomStep(dir, anchorX, anchorY) {
  const cur = tacZoomState.scale;

  const next = dir > 0 ? Math.min(TAC_ZOOM_MAX, cur * 1.25)
    : Math.max(TAC_ZOOM_MIN, cur / 1.25);
  tacZoomTo(Math.round(next * 100) / 100, anchorX, anchorY);
}

function tacSetPanMode(on) {
  if (on && tacZoomState.scale <= TAC_ZOOM_MIN) return;
  tacZoomState.pan = on;
  tacUpdateTouchAction();
  tacMapWrap.classList.remove('grabbing');
  const { pan } = tacZoomEls();
  if (pan) pan.classList.toggle('active', on);
  tacticView.classList.toggle('tac-panning', on);
  if (on) {

    setTacSelected(null); setTacSelectedItem(null); setTacSelectedText(null);
    setTacSelMeasure(null); setTacPlaceRole(null); setTacPlaceItem(null);
    setTacTextPlacing(false); updateTacTextUi();
    renderTacBoard(); updateTacPanel();
  }
}

function tacZoomInit() {
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

function tacZoomReset() {
  tacZoomState.scale = 1; tacZoomState.tx = 0; tacZoomState.ty = 0;
  tacPanDrag = null;
  tacMapWrap.classList.remove('grabbing');
  tacZoomState.pan = false;
  const { pan } = tacZoomEls();
  if (pan) pan.classList.remove('active');
  tacticView.classList.remove('tac-panning');
  tacApplyZoom();
}

let tacResizeTimer = null;

function switchTacSpawnDuoHunter(step) {
  const combos = MAPS_DATA[S.currentMapId].spawnPointsHunterDuoHunters;
  if (!combos) return;
  S.tacSpawnDuoHunterIndex = (S.tacSpawnDuoHunterIndex + step + combos.length) % combos.length;
  // 监管者组变化后，若有求生者落入 36m 禁区则重新随机
  if (!tacDisplay.spawnDuoAll && S.spawnDuoPicks.length) {
    const valid = new Set(spawnDuoSurvivorCandidates(MAPS_DATA[S.currentMapId]));
    if (S.spawnDuoPicks.some((id) => !valid.has(id))) S.spawnDuoPicks = [];
  }
  syncTacSpawnText();
  renderTacSpawns();
  saveRegionSel();
}

function renderTacArrows() {
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
      label.textContent = translate("ui.tac.manangeBox.naiad.puddles.map.note");
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



  setTacGreenSegs(new Map());
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

  // 动画路径折线：显示当前选中造物的路径（可用「隐藏动画线」关闭）
  if (!tacDrawSettings.hideAnimPath) {
    const animObj = tacAnimTargetOf(tacManageSel);
    const anim = animObj && animObj.anim;
    if (anim && (anim.points || []).length >= 2) {
      // 「自动规划最优路线」的段沿最优路径绘制，其余段仍为直线；逐段拼接并去重共享端点
      const pts = [];
      for (let i = 0; i + 1 < anim.points.length; i++) {
        animSegPath(anim, i).forEach((pt, j) => {
          if (i > 0 && j === 0) return;
          pts.push(`${pt.x * W},${pt.y * H}`);
        });
      }
      const poly = document.createElementNS(TAC_SVG_NS, 'polyline');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', '#f472b6');
      poly.setAttribute('stroke-width', 2.5);
      poly.setAttribute('stroke-dasharray', '8 6');
      poly.setAttribute('stroke-linejoin', 'round');
      poly.setAttribute('stroke-linecap', 'round');
      tacArrowSvg.appendChild(poly);
    }
  }
}

function renderTacBoard() {
  tacSave();
  tacMapWrap.querySelectorAll('.tac-token, .tac-role-circle, .tac-item-circle, .tac-item-pin, .tac-measure-dot, .tac-anim-dot, .tac-text')
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
      if (!tacLineStyle(m).showEndpoints) dot.classList.add('hidden-endpoint');
      dot.dataset.idx = idx;
      dot.dataset.end = end;
      dot.style.left = `${m[kx] * 100}%`;
      dot.style.top = `${m[ky] * 100}%`;
      const dotColor = tacMeasureSegColor(m);
      dot.style.background = dotColor;
      dot.style.boxShadow = `0 0 6px ${dotColor}`;
      dot.title = translate("ui.tac.measure.map.endpoint");
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
    setTacFontSize(el, Math.max(1, t.size * 0.18));
    el.textContent = t.text;
    tacLayer().appendChild(el);
  });
  renderTacAnimDots();
  renderTacArrows();
  renderTacTimeline();
  updateTacPanel();
}

export function setTacPanDrag(value) {
  tacPanDrag = value;
  return value;
}

export function bindCipherCard() {
  try {
    tacCipherProgress = JSON.parse(localStorage.getItem(TAC_CIPHER_PROGRESS_LS_KEY) || '{}') || {};
  } catch (err) { tacCipherProgress = {}; }

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
}

export function initializeMapZoom() {
  tacZoomInit();
}

export function bindMapResize() {
  window.addEventListener('resize', () => {
    clearTimeout(tacResizeTimer);
    tacResizeTimer = setTimeout(() => {
      renderTacCiphers();
      renderTacLandmarks();
      renderTacBoard();
    }, 150);
  });
}

export function bindMapMarkers() {
  $('tacSpawnDuoHunterPrev').addEventListener('click', () => switchTacSpawnDuoHunter(-1));

  $('tacSpawnDuoHunterNext').addEventListener('click', () => switchTacSpawnDuoHunter(1));

  $('tacChairPrev').addEventListener('click', () => switchTacChair(-1));

  $('tacChairNext').addEventListener('click', () => switchTacChair(1));

  $('tacBasementPrev').addEventListener('click', () => switchTacBasement(-1));

  $('tacBasementNext').addEventListener('click', () => switchTacBasement(1));
}

export function observeMapSize() {
  // 观察旋转层而非外层容器：换图后新图片加载完成前 rot 高度仍是旧图比例，
  // 图片加载完成后 rot 高度才变化；监听 wrap 捕获不到这种内部尺寸变化，
  // 会导致 SVG viewBox 停留在旧地图宽高比，测距线/路径线与地图错位。
  new ResizeObserver(() => {
    if (tacticView.classList.contains('active')) { renderTacArrows(); tacApplyZoom(); }
  }).observe(tacRot);

  // 兜底：图片加载完成后也强制重绘一次（首次加载或缓存命中时序差异）
  tacMapImage.addEventListener('load', () => {
    if (tacticView.classList.contains('active')) { renderTacArrows(); tacApplyZoom(); }
  });
}

export {
  renderTacArrows,
  renderTacBoard,
  renderTacBoxes,
  renderTacChairs,
  renderTacCiphers,
  renderTacFixedSpawns,
  renderTacLandmarks,
  renderTacLockers,
  renderTacPhoneBooths,
  renderTacSpawns,
  renderTacSpringBoxes,
  renderTacTreasure,
  renderTacZones,
  setTacFontSize,
  switchTacBasement,
  switchTacChair,
  switchTacCipher,
  switchTacDungeon,
  switchTacSpawn,
  syncTacBasementText,
  syncTacChairText,
  syncTacCipherCard,
  syncTacDungeonText,
  syncTacImage,
  syncTacSpawnText,
  tacApplyRotation,
  tacApplyZoom,
  tacBasementList,
  tacCarryDeselectIfGone,
  tacCipherAllIds,
  tacCipherCombos,
  tacCipherPctOf,
  tacCipherProgress,
  tacDoorPoints,
  tacImageError,
  tacImageState,
  tacLayer,
  tacLoading,
  tacPanDrag,
  tacRotK,
  tacRotPt,
  tacRotVec,
  tacRotate,
  tacSetPanMode,
  tacSetRot,
  tacSetZoomLock,
  tacSpawnDuoReroll,
  tacUpRot,
  tacUpdateTouchAction,
  tacUprightSvgText,
  tacZoomEls,
  tacZoomInit,
  tacZoomReset,
  tacZoomState,
  tacZoomStep,
  tacZoomTo,
};
