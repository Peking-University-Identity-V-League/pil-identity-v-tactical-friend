import {
  tacArrowSvg,
  tacClearBtn,
  tacCoordsTip,
  tacMapWrap,
  tacSnapRipple,
  tacTextInput,
  tacTextStyle,
  tacUndoBtn,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { tacBoard, tacDisplay, tacDrawSettings, tacMeasureStyle, tacSave } from '../core/persist.js';
import { S } from '../core/state.js';
import { $ } from '../core/utils.js';
import { cipherOf } from '../data/geo.js';
import { TAC_ITEM_TYPES } from '../data/items.js';
import { MAPS_DATA, rocketChairGroups } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_MANAGE_DEFAULT, TAC_ZOOM_MAX } from '../data/tactic-data.js';
import {
  tacCarryGroundChairs,
  tacCarrySelect,
  tacCarrySelectPoint,
  tacCarryState,
} from './analysis-carry.js';
import { tacPathSelectPoint, tacPathState } from './analysis-path.js';
import {
  setTacAnimArmed,
  setTacDragAnimDot,
  tacAnimArmed,
  tacAnimDefaultSpeed,
  tacAnimEnsure,
  tacAnimPlay,
  tacAnimPushUndo,
  tacAnimRouteSegment,
  tacAnimStop,
  tacAnimTargetOf,
  tacDragAnimDot,
  tacTimeline,
  tacTimelineStop,
} from './animation.js';
import {
  renderTacArrows,
  renderTacBoard,
  renderTacTreasure,
  setTacPanDrag,
  tacApplyZoom,
  tacBasementList,
  tacCipherAllIds,
  tacCipherCombos,
  tacDoorPoints,
  tacPanDrag,
  tacRotK,
  tacRotPt,
  tacRotVec,
  tacZoomReset,
  tacZoomState,
  tacZoomStep,
} from './board.js';
import {
  setTacDragText,
  setTacDrawing,
  setTacSelectedText,
  setTacTextPlacing,
  tacArrowColor,
  tacArrowWidth,
  tacDragText,
  tacDrawing,
  tacDrawShape,
  tacHexRgba,
  tacSelectedText,
  tacTextPlacing,
  updateTacTextUi,
} from './drawing.js';
import { setTacManageSel, tacAqOfHost, tacManageSel } from './manage.js';
import {
  setTacChainRoute,
  setTacMeasureHover,
  setTacMeasurePending,
  setTacRouteSeq,
  setTacSelMeasure,
  tacAppendSegCfg,
  tacApplyScope,
  tacChainRoute,
  tacDeleteMeasureAt,
  tacExtendLineCfg,
  tacMeasureHover,
  tacMeasureIsChain,
  tacMeasureMode,
  tacMeasurePending,
  tacNewLineCfg,
  tacRouteBetween,
  tacRouteSeq,
  tacSegExpanded,
  tacSyncMeasureArm,
  updateTacMeasureInfo,
} from './measure.js';
import { setTacTool, tacTool, updateTacPanel } from './panel.js';
import {
  setTacItemRole,
  tacAbyssFinalize,
  tacAbyssItem,
  tacAbyssRecord,
  tacAutoLinkItem,
  tacAutoLinkToken,
  tacClampLinkPos,
  tacClampRoleLinkPos,
  tacClampTokenToLinkedItems,
  tacHpClampPos,
  tacItemSizePercent,
  tacMirrorParts,
  tacOnItemRemoved,
  tacOnTokenRemoved,
  tacRangeEntries,
  tacRbEnsure,
  tacSyncMirror,
  tacSyncMirrorEl,
  tacTokenByTid,
} from './roles-items.js';

let tacPlaceRole = null;

let tacPlaceItem = null;

let tacSelected = null;

let tacSelectedItem = null;

let tacDragMeasure = null;

let tacDrag = null;

let tacDragItem = null;

const tacUndoStack = [];

function tacSnapTarget(p, excl) {
  const map = MAPS_DATA[S.currentMapId];
  const [imgW, imgH] = map.mapSize;
  const pts = [];
  if (tacDrawSettings.snap.cipher && tacDisplay.ciphers) {
    (tacDisplay.cipherAll ? tacCipherAllIds(map) : tacCipherCombos(map)[S.currentCipherIndex]).forEach((cid) => {
      const c = cipherOf(S.currentMapId, cid);
      if (c) pts.push({
        x: c.location[0] / imgW, y: c.location[1] / imgH,
        size: tacDisplay.cipherSize, kind: 'cipher',
      });
    });
  }
  if (tacDrawSettings.snap.dungeon && tacDisplay.dungeon && map.dungeons.length) {
    const dPts = tacDisplay.dungeonAll ? map.dungeons : [map.dungeons[S.tacDungeonIndex % map.dungeons.length]];
    dPts.forEach((pt) => {
      pts.push({
        x: pt[0] / imgW, y: pt[1] / imgH,
        size: tacDisplay.dungeonSize, kind: 'dungeon',
      });
    });
  }
  if (tacDrawSettings.snap.escapeDoor && tacDisplay.escapeDoors) {
    tacDoorPoints(map).forEach((pt) =>
      pts.push({
        x: pt[0] / imgW, y: pt[1] / imgH,
        size: tacDisplay.escapeDoorSize, kind: 'door',
      }));
  }
  if (tacDrawSettings.snap.rocketChair && map.rocketChairCombinations) {
    const ch = rocketChairGroups(map);
    const pushChair = (pt) => {
      const px = pt[0], pz = pt.length > 2 ? pt[2] : pt[1];
      pts.push({ x: px / imgW, y: pz / imgH, size: tacDisplay.rocketChairSize, kind: 'chair' });
    };
    if (tacDisplay.rocketChairs) {
      if (tacDisplay.chairAll) {
        map.rocketChairs.forEach((rc) => pushChair(rc.location));
      } else {
        ch.fixed.forEach(pushChair);
        if (ch.sets.length) ch.sets[S.tacChairIndex % ch.sets.length].forEach(pushChair);
      }
    }
    const bs = tacBasementList();
    if (tacDisplay.rocketChairsBasement && bs.length) {
      bs[S.tacChairBasementIndex % bs.length].rocketChairs.forEach(pushChair);
    }
  }
  if (tacDrawSettings.snap.box && map.chests) {
    const bx = map.chests;
    const pushBox = (pt) => {
      const px = pt[0], pz = pt.length > 2 ? pt[2] : pt[1];
      pts.push({ x: px / imgW, y: pz / imgH, size: tacDisplay.boxSize, kind: 'box' });
    };
    if (tacDisplay.boxes) {
      bx.forEach(pushBox);
    }
    const bs = tacBasementList();
    if (tacDisplay.boxesBasement && bs.length) {
      bs[S.tacChairBasementIndex % bs.length].chest.forEach(pushBox);
    }
  }
  if (tacDrawSettings.snap.locker && tacDisplay.lockers && map.lockers) {
    map.lockers.forEach(([px, pz]) => {
      pts.push({ x: px / imgW, y: pz / imgH, size: tacDisplay.lockerSize, kind: 'locker' });
    });
  }
  if (tacDrawSettings.snap.phoneBooth && tacDisplay.phoneBooths && map.phoneBooths) {
    map.phoneBooths.forEach(([px, pz]) => {
      pts.push({ x: px / imgW, y: pz / imgH, size: tacDisplay.phoneBoothSize, kind: 'phoneBooth' });
    });
  }
  if (tacDrawSettings.snap.endpoint) {
    const b = tacBoard();

    b.arrows.forEach((a) => {
      if (a.shape !== 'arrow' && a.shape !== 'line') return;
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

function tacSnapLandmark(p, excl) {
  const t = tacSnapTarget(p, excl);
  return t ? { ...p, x: t.x, y: t.y } : p;
}

function tacDragMeasureExcl() {
  if (!tacDragMeasure) return null;
  return {
    x: tacDragMeasure.ox, y: tacDragMeasure.oy,
    seg: tacDragMeasure.idx, which: tacDragMeasure.end,
  };
}

function tacUpdateSnapRipple(p) {
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

function tacUpdateCoordsTip(p, e) {
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

function tacPos(e) {
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

function tacUndo() {
  const act = tacUndoStack.pop();
  if (!act) return;
  tacAnimStop(true);
  tacTimelineStop(true);
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
    setTacSelMeasure(null);
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
    setTacSelectedText(null);
  } else if (act.type === 'addText') {
    board.texts.pop();
    setTacSelectedText(null);
  } else if (act.type === 'delText') {
    board.texts.splice(act.idx, 0, act.text);
  } else if (act.type === 'anim') {
    const obj = act.kind === 'role'
      ? board.tokens.find((t) => t.tid === act.tid)
      : board.items[act.idx];
    if (obj) {
      if (act.prev) obj.anim = act.prev;
      else delete obj.anim;
    }
  }
  renderTacBoard();
}

function tacClear() {
  tacAnimStop(true);
  tacTimelineStop(true);
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
  setTacSelectedText(null);
  tacPlaceRole = null;
  tacPlaceItem = null;
  setTacDrawing(null);
  setTacMeasurePending(null);
  setTacMeasureHover(null);
  renderTacBoard();
}

function tacResetTransient() {
  tacPlaceRole = null;
  tacPlaceItem = null;
  tacSelected = null;
  tacSelectedItem = null;
  setTacDrawing(null);
  tacDrag = null;
  tacDragItem = null;
  setTacDragText(null);
  setTacItemRole(null);
  setTacSelectedText(null);
  tacUndoStack.length = 0;
  S.spawnDuoPicks = []; // 联合狩猎随机点跨图失效，下张图按 36m 规则重随
  tacBoard(); // 确保新图画板已创建（原先由 setTacTool('select') 的渲染副作用完成）
  tacZoomReset();
}

export function setTacPlaceItem(value) {
  tacPlaceItem = value;
  return value;
}

export function setTacPlaceRole(value) {
  tacPlaceRole = value;
  return value;
}

export function setTacSelected(value) {
  tacSelected = value;
  return value;
}

export function setTacSelectedItem(value) {
  tacSelectedItem = value;
  return value;
}

export function bindMapSelection() {
  tacMapWrap.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;

    if (tacZoomState.pan) {
      setTacPanDrag({ startX: e.clientX, startY: e.clientY,
        baseTx: tacZoomState.tx, baseTy: tacZoomState.ty });
      tacMapWrap.classList.add('grabbing');
      tacMapWrap.setPointerCapture(e.pointerId);
      return;
    }
    const tokenEl = e.target.closest('.tac-token');
    const itemEl = e.target.closest('.tac-item-circle, .tac-item-pin');
    const textEl = e.target.closest('.tac-text');
    const p = tacPos(e);

    // 任何地图点击都先停止正在播放的动画（还原到真实位置）
    if (tacAnimPlay) tacAnimStop(true);
    if (tacTimeline.playing) tacTimelineStop(true);

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
      const content = (tacTextInput.value || '').trim() || translate("ui.tac.text.default.content");
      tacBoard().texts.push({
        x: p.x, y: p.y, text: content,
        color: tacTextStyle.color, size: tacTextStyle.size,
      });
      tacUndoStack.push({ type: 'addText' });
      setTacSelectedText(tacBoard().texts.length - 1);
      setTacTextPlacing(false);
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
        if (tacSelectedText === idx) setTacSelectedText(null);
        renderTacBoard();
      }
      return;
    }


    if (textEl) {
      setTacSelectedText(+textEl.dataset.idx);
      setTacDragText({ idx: tacSelectedText });
      tacMapWrap.setPointerCapture(e.pointerId);
      tacSelected = null;
      tacSelectedItem = null;
      renderTacBoard();
      return;
    }


    if (tacSelectedText !== null) {
      setTacSelectedText(null);
      tacMapWrap.querySelectorAll('.tac-text.selected').forEach((el) =>
        el.classList.remove('selected'));
      updateTacPanel();
    }



    if (tacTool === 'anim') {
      // 拖动编号路径点
      const dotEl = e.target.closest('.tac-anim-dot');
      const animObj = tacAnimTargetOf(tacManageSel);
      if (dotEl && animObj && animObj.anim) {
        setTacDragAnimDot({ ptIdx: +dotEl.dataset.pt, prev: structuredClone(animObj.anim) });
        // 拖动使相邻两段的旧路径失效：立即清除，拖动中显示直线，松手后再按需重算
        if (animObj.anim.paths) {
          delete animObj.anim.paths[tacDragAnimDot.ptIdx - 1];
          delete animObj.anim.paths[tacDragAnimDot.ptIdx];
        }
        tacMapWrap.setPointerCapture(e.pointerId);
        return;
      }
      // 点击造物：选中并展开管理卡片
      if (tokenEl) {
        const tid = +tokenEl.dataset.tid;
        tacSelected = tid;
        tacSelectedItem = null;
        setTacManageSel({ type: 'role', tid });
        tacMapWrap.querySelectorAll('.tac-token').forEach((el) =>
          el.classList.toggle('selected', el === tokenEl && tacDisplay.selGlow));
        renderTacBoard();
        return;
      }
      if (itemEl) {
        const idx = +itemEl.dataset.idx;
        tacSelectedItem = idx;
        tacSelected = null;
        setTacManageSel({ type: 'item', idx });
        tacMapWrap.querySelectorAll('.tac-item-circle, .tac-item-pin').forEach((el) =>
          el.classList.toggle('selected', +el.dataset.idx === idx && tacDisplay.selGlow));
        renderTacBoard();
        return;
      }
      // 空地图：添加状态下为选中造物追加路径点（首点自动取造物当前位置，t=0）
      if (animObj && tacAnimArmed) {
        const prev = animObj.anim ? structuredClone(animObj.anim) : null;
        const anim = tacAnimEnsure(animObj);
        if (!anim.points.length) {
          anim.points.push({ x: animObj.x, y: animObj.y });
          anim.times.push(0);
        }
        anim.points.push({ x: p.x, y: p.y });
        if (anim.mode === 'time') {
          anim.times.push((anim.times[anim.times.length - 1] ?? 0) + 3);
          while (anim.speeds.length < anim.points.length - 1) {
            anim.speeds.push(tacAnimDefaultSpeed(animObj));
          }
        } else {
          anim.speeds.push(tacAnimDefaultSpeed(animObj));
          while (anim.times.length < anim.points.length) {
            anim.times.push((anim.times[anim.times.length - 1] ?? 0) + 3);
          }
        }
        tacAnimPushUndo(animObj, prev);
        renderTacBoard();
        // 勾选自动规划最优路线：异步补上与前一点的最优路径（粉色虚线随之改为最优路径）
        if (tacDrawSettings.animAutoRoute && anim.points.length >= 2) {
          tacAnimRouteSegment(animObj, anim.points.length - 2);
        }
      }
      return;
    }


    if (tacTool === 'draw') {
      const sp = tacSnapLandmark(p);
      setTacDrawing({ x1: sp.x, y1: sp.y, x2: sp.x, y2: sp.y });
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
          setTacSelMeasure({ idx });
          renderTacArrows();
          updateTacMeasureInfo();
          return;
        }
      }
      if (!tacMeasurePending) {
        const sp = tacSnapLandmark(p);
        setTacMeasurePending({ x: sp.x, y: sp.y });
        setTacMeasureHover(null);
        setTacSelMeasure(null);

        if (tacMeasureIsChain()) setTacChainRoute(setTacRouteSeq(tacRouteSeq + 1));
      } else {
        const sp = tacSnapLandmark(p);

        const d = Math.hypot((sp.x - tacMeasurePending.x) * p.W,
          (sp.y - tacMeasurePending.y) * p.H);
        if (d >= 10) {
          const st = tacMeasureStyle[tacMeasureMode];
          const board = tacBoard();
          const chain = tacMeasureIsChain() ? tacChainRoute : null;


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
          const seg = {
            x1: tacMeasurePending.x, y1: tacMeasurePending.y,
            x2: sp.x, y2: sp.y,
            chain,
            color: st.color, width: st.width,
            lc,
          };
          board.measures.push(seg);
          tacUndoStack.push({ type: 'addMeasure' });

          // 路径线：异步把该段替换为最优路径（允许翻窗受绘制设置控制）；先显示直线，算好后变弯
          if (tacMeasureMode === 'route') {
            const from = { x: seg.x1, y: seg.y1 };
            const to = { x: seg.x2, y: seg.y2 };
            tacRouteBetween(from, to, tacDrawSettings.measureVault).then((pts) => {
              if (!pts) return;
              // 段可能已被删除或拖动过端点：校验仍在板上且端点未变
              if (!tacBoard().measures.includes(seg)) return;
              const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-6;
              if (!near({ x: seg.x1, y: seg.y1 }, from) || !near({ x: seg.x2, y: seg.y2 }, to)) return;
              seg.path = pts;
              renderTacBoard();
              updateTacMeasureInfo();
            });
          }

          setTacMeasurePending(tacMeasureIsChain() ? { x: sp.x, y: sp.y } : null);
          setTacMeasureHover(null);
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
      setTacManageSel({ type: 'role', tid });
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
      setTacManageSel({ type: 'item', idx });

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
      setTacManageSel({ type: 'item', idx: tacSelectedItem });
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
      setTacManageSel({ type: 'role', tid: token.tid });
      tacPlaceRole = null;
      renderTacBoard();
      return;
    }

    if (tacSelected || tacSelectedItem !== null || tacSelectedText !== null) {
      tacSelected = null;
      tacSelectedItem = null;
      setTacSelectedText(null);
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

    if (tacDragAnimDot) {
      const obj = tacAnimTargetOf(tacManageSel);
      const pt = obj && obj.anim && obj.anim.points[tacDragAnimDot.ptIdx];
      if (!pt) { setTacDragAnimDot(null); return; }
      obj.anim.points[tacDragAnimDot.ptIdx] = { x: p.x, y: p.y };
      const dot = tacMapWrap.querySelector(`.tac-anim-dot[data-pt="${tacDragAnimDot.ptIdx}"]`);
      if (dot) {
        dot.style.left = `${p.x * 100}%`;
        dot.style.top = `${p.y * 100}%`;
      }
      renderTacArrows();
      return;
    }

    if (tacDragMeasure) {
      const m = tacBoard().measures[tacDragMeasure.idx];
      if (!m) { tacDragMeasure = null; return; }
      const sp = tacSnapLandmark(p, tacDragMeasureExcl());
      if (tacDragMeasure.end === 'a') { m.x1 = sp.x; m.y1 = sp.y; }
      else { m.x2 = sp.x; m.y2 = sp.y; }
      delete m.path; // 端点被拖动后旧最优路径失效，回退直线
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
      setTacMeasureHover({ x: sp.x, y: sp.y });
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
      if (!t) { setTacDragText(null); return; }
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
      setTacPanDrag(null);
      tacMapWrap.classList.remove('grabbing');
      return;
    }
    const changed = tacDrawing || tacDrag || tacDragItem || tacDragText || tacDragMeasure || tacDragAnimDot;
    if (tacDragAnimDot) {
      const obj = tacAnimTargetOf(tacManageSel);
      const ptIdx = tacDragAnimDot.ptIdx;
      if (obj) tacAnimPushUndo(obj, tacDragAnimDot.prev);
      setTacDragAnimDot(null);
      renderTacBoard();
      // 勾选自动规划最优路线：拖动结束后重算被改动点相邻的两段
      const anim = obj && obj.anim;
      if (anim && tacDrawSettings.animAutoRoute) {
        if (ptIdx - 1 >= 0) tacAnimRouteSegment(obj, ptIdx - 1);
        if (ptIdx + 1 < anim.points.length) tacAnimRouteSegment(obj, ptIdx);
      }
    }
    if (tacDrawing) {
      const p = tacPos(e);
      const dx = (tacDrawing.x2 - tacDrawing.x1) * p.W;
      const dy = (tacDrawing.y2 - tacDrawing.y1) * p.H;

      const bigEnough = (tacDrawShape === 'arrow' || tacDrawShape === 'line')
        ? Math.hypot(dx, dy) > 20
        : Math.abs(dx) > 20 && Math.abs(dy) > 20;
      if (bigEnough) {
        tacBoard().arrows.push(
          { ...tacDrawing, shape: tacDrawShape, color: tacArrowColor, width: tacArrowWidth });
        tacUndoStack.push({ type: 'addArrow' });
      }
      setTacDrawing(null);
      renderTacArrows();
      updateTacPanel();
    }
    tacDrag = null;
    tacDragItem = null;
    setTacDragText(null);
    tacDragMeasure = null;
    tacAbyssFinalize();
    if (changed) tacSave();
  });

  tacMapWrap.addEventListener('pointercancel', () => {
    const changed = tacDrag || tacDragItem || tacDragText || tacDragMeasure || tacDragAnimDot;
    setTacPanDrag(null);
    tacMapWrap.classList.remove('grabbing');
    setTacDrawing(null);
    tacDrag = null;
    tacDragItem = null;
    setTacDragText(null);
    tacDragMeasure = null;
    if (tacDragAnimDot) {
      const obj = tacAnimTargetOf(tacManageSel);
      if (obj && tacDragAnimDot.prev) obj.anim = tacDragAnimDot.prev;
      setTacDragAnimDot(null);
      renderTacBoard();
    }
    tacAbyssFinalize();
    renderTacArrows();
    if (changed) tacSave();
  });

  tacMapWrap.addEventListener('pointerleave', () => {
    tacUpdateSnapRipple(null);
    tacUpdateCoordsTip(null);
    if (tacMeasurePending && tacMeasureHover) {
      setTacMeasureHover(null);
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

      if (m && m.chain != null && !tacDrawSettings.delSegOnly) {
        const removedList = [];
        for (let i = board.measures.length - 1; i >= 0; i--) {
          if (board.measures[i].chain === m.chain) {
            removedList.unshift({ measure: board.measures[i], idx: i });
            board.measures.splice(i, 1);
          }
        }
        tacUndoStack.push({ type: 'delMeasures', list: removedList });
        tacSegExpanded.clear();
        setTacSelMeasure(null);
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
      setTacSelectedText(null);
      setTacTextPlacing(false);
      updateTacTextUi();
      setTacDrawing(null);
      setTacMeasurePending(null);
      setTacMeasureHover(null);
      setTacSelMeasure(null);
      setTacChainRoute(null);
      if (tacAnimArmed) setTacAnimArmed(false);
      tacSyncMeasureArm();
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
        setTacSelectedText(null);
        renderTacBoard();
      }
    }
  });
}

export {
  tacClear,
  tacDrag,
  tacDragItem,
  tacDragMeasure,
  tacDragMeasureExcl,
  tacPlaceItem,
  tacPlaceRole,
  tacPos,
  tacResetTransient,
  tacSelected,
  tacSelectedItem,
  tacSnapLandmark,
  tacSnapTarget,
  tacUndo,
  tacUndoStack,
  tacUpdateCoordsTip,
  tacUpdateSnapRipple,
};
