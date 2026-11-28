import {
  showToast,
  tacCarryCard,
  tacCipherCard,
  tacDisplayCard,
  tacDrawCard,
  tacItemSection,
  tacManageCard,
  tacMapTitle,
  tacMapTitleEn,
  tacMeasureCard,
  tacPathCard,
  tacRolesCard,
  tacRolesEl,
  tacRolesHunterEl,
  tacRolesOtherEl,
  tacTextCard,
  tacticView,
  tacTimelineEl,
  tacUndoBtn,
  tacWidthVal,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { isExternalMap3dEntry, measurementEndpoints, resolveMap3dTarget } from '../core/map-handoff.js';
import { flushSave, tacBoard, tacSave } from '../core/persist.js';
import { S } from '../core/state.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { buildTacCarryCard, syncTacCarryChairRow, tacCarryDisarm } from './analysis-carry.js';
import { buildTacPathCard, tacPathDisarm } from './analysis-path.js';
import { setTacAnimArmed, tacAnimStop, tacTimelineStop } from './animation.js';
import {
  renderTacArrows,
  renderTacBoard,
  syncTacImage,
  tacSetPanMode,
  tacUpdateTouchAction,
  tacZoomState,
} from './board.js';
import {
  renderTacTextList,
  setTacDrawing,
  setTacTextPlacing,
  tacArrowWidth,
  updateTacTextUi,
} from './drawing.js';
import { renderTacManage } from './manage.js';
import {
  setTacChainRoute,
  setTacMeasureHover,
  setTacMeasurePending,
  setTacSelMeasure,
  tacChainRoute,
  tacMeasurePending,
  tacSelMeasure,
  updateTacMeasureInfo,
} from './measure.js';
import { buildTacItems, setTacItemRole, tacItemRole } from './roles-items.js';
import {
  setTacPlaceItem,
  setTacPlaceRole,
  tacPlaceItem,
  tacPlaceRole,
  tacSelected,
  tacSelectedItem,
  tacUndoStack,
} from './selection.js';

let tacTool = 'select';

function updateTacPanel() {
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

    if (tacPlaceItem && tacPlaceItem.role !== activeRole) setTacPlaceItem(null);
    document.querySelectorAll('.tac-item').forEach((btn) => {
      btn.classList.toggle('armed',
        !!tacPlaceItem && tacPlaceItem.kind === btn.dataset.kind);
    });
  } else {
    setTacPlaceItem(null);
    setTacItemRole(null);

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

function enterTactic() {
  tacMapTitle.textContent = MAPS_DATA[S.currentMapId].mapName;
  tacMapTitleEn.textContent = MAPS_DATA[S.currentMapId].mapNameEn;
  tacAnimStop(true);
  tacTimelineStop(true);
  setTacMeasurePending(null);
  setTacMeasureHover(null);
  setTacChainRoute(null);
  setTacSelMeasure(null);
  syncTacImage();
  renderTacBoard();
}

function syncTacSubCards() {
  if (tacTimelineEl) {
    const show = tacTool === 'anim';
    tacTimelineEl.style.display = show ? '' : 'none';
    document.body.classList.toggle('tac-timeline-open', show);
  }
  // 「删除」与「撤销」一样是即时动作，不影响下方卡片
  if (tacTool === 'delete') return;
  tacManageCard.style.display = (tacTool === 'select' || tacTool === 'anim') ? '' : 'none';
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
  if (tacTool === 'select' || tacTool === 'anim') {
    tacManageCard.open = true;
    if (tacTool === 'select' && tacCipherCard) tacCipherCard.open = true;
  }
  if (tacTool === 'roles') tacRolesCard.open = true;
  if (tacTool === 'draw') { tacDrawCard.open = true; tacTextCard.open = true; }
  if (tacTool === 'measure') tacMeasureCard.open = true;
  if (tacTool === 'deduce' && tacCarryCard) tacCarryCard.open = true;
  if (tacTool === 'display') tacDisplayCard.open = true;
}

function setTacTool(tool) {
  tacAnimStop(true);
  tacTimelineStop(true);
  setTacAnimArmed(tool === 'anim');
  tacTool = tool;
  tacUpdateTouchAction();
  setTacPlaceRole(null);
  setTacPlaceItem(null);
  setTacDrawing(null);
  setTacMeasurePending(null);
  setTacMeasureHover(null);
  setTacTextPlacing(false);
  updateTacTextUi();
  setTacChainRoute(null);
  setTacSelMeasure(null);
  if (tool !== 'deduce') { tacCarryDisarm(); tacPathDisarm(); }
  document.querySelectorAll('.tac-tool').forEach((b) =>
    b.classList.toggle('active', !!b.dataset.tool && b.dataset.tool === tool));
  tacticView.classList.toggle('tac-mode-draw', tool === 'draw');
  tacticView.classList.toggle('tac-mode-delete', tool === 'delete');
  tacticView.classList.toggle('tac-mode-measure', tool === 'measure');
  tacticView.classList.toggle('tac-mode-anim', tool === 'anim');
  if (tacZoomState.pan) tacSetPanMode(false);
  syncTacSubCards();
  renderTacArrows();
  updateTacPanel();
}

export function initializeAnalysisCards() {
  buildTacCarryCard();

  buildTacPathCard();
}

export function bindToolbar() {
  document.querySelectorAll('.tac-tool[data-tool]').forEach((btn) =>
    btn.addEventListener('click', () => setTacTool(btn.dataset.tool)));
}

export function bindMap3dNavigation() {
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
}

export {
  enterTactic,
  setTacTool,
  syncTacSubCards,
  tacTool,
  updateTacPanel,
};
