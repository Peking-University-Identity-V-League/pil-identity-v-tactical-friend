import {
  bindCipherCard,
  bindMapMarkers,
  bindMapResize,
  initializeMapZoom,
  observeMapSize,
} from './board.js';
import { bindDisplaySettings, bindDrawingSettings, initializeDisplaySettings } from './settings.js';
import { bindMap3dNavigation, bindToolbar, initializeAnalysisCards } from './panel.js';
import { bindTimeline } from './animation.js';
import { initializeSpeedPanel } from './measure.js';
import { initializeRolePicker } from './roles-items.js';
import { bindDrawingTools } from './drawing.js';
import { bindImageExport } from './export.js';
import { bindMapSelection } from './selection.js';

// 跨模块状态使用 ESM 的实时绑定。等所有模块加载完成后，再按原顺序绑定事件和初始化界面。
bindCipherCard();
initializeMapZoom();
bindDisplaySettings();
initializeAnalysisCards();
bindMapResize();
bindDrawingSettings();
bindMapMarkers();
initializeDisplaySettings();
bindTimeline();
initializeSpeedPanel();
bindToolbar();
initializeRolePicker();
bindDrawingTools();
bindImageExport();
bindMapSelection();
observeMapSize();
bindMap3dNavigation();

export { arrowNode, circleNode, rectNode, lineNode, shapeNode } from './drawing.js';
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
} from './board.js';
export {
  buildTacItems,
  buildTacRoles,
  onTacItemClick,
  onTacRoleClick,
  tacAbyssFinalize,
  tacAbyssItem,
  tacAbyssMeters,
  tacAbyssRecord,
  tacAutoLinkItem,
  tacAutoLinkToken,
  tacBreakItemLink,
  tacBreakTokenLinks,
  tacClampLinkPos,
  tacClampRoleLinkPos,
  tacClampTokenToLinkedItems,
  tacItemByIid,
  tacItemMeters,
  tacItemMetersToPercent,
  tacItemRole,
  tacItemSizePercent,
  tacLinkPartner,
  tacLinkTokenOf,
  tacMirrorParts,
  tacOnTokenRemoved,
  tacRangeDefaultKey,
  tacRangeMetersOf,
  tacRangeModeOf,
  tacRoleRangeMeters,
  tacRoleRangeMode,
  tacSameLinkable,
  tacSelRole,
  tacSyncMirror,
  tacTokenByRole,
  tacTokenByTid,
} from './roles-items.js';
export {
  buildTacOtherList,
  buildTacSpeedPanel,
  buildTacTalentList,
  buildTacTraitList,
  chainTotalNode,
  measureNode,
  renderTacBaseDetail,
  renderTacBuffDetail,
  syncTacMeasureStyleUI,
  syncTacSpeedForm,
  tacAddBuffEntry,
  tacAppendSegCfg,
  tacApplyBase,
  tacApplyBaseInput,
  tacApplyScope,
  tacApplyTrait,
  tacBaseAt,
  tacBaseDetailOpen,
  tacBaseDisplayRows,
  tacBaseMergeOn,
  tacBuffAppliesToBase,
  tacBuffDetailOpen,
  tacBuffFilter,
  tacBuffSegColor,
  tacBuffSeq,
  tacBuildRoleOptions,
  tacCamp,
  tacChainRoute,
  tacClearTraitOfRole,
  tacDeleteBase,
  tacDeleteMeasureAt,
  tacEditTarget,
  tacExtendLineCfg,
  tacFmtD,
  tacGreenSegs,
  tacLastRoleVal,
  tacLcSeq,
  tacLetter,
  tacLetterNode,
  tacLetterOptions,
  tacLevelLabel,
  tacLineStyle,
  tacMeasureHover,
  tacMeasureIsChain,
  tacMeasureLabelText,
  tacMeasureLen,
  tacMeasureMode,
  tacMeasurePending,
  tacMeasureSegColor,
  tacMeasureText,
  tacMeasureTime,
  tacMergeBases,
  tacNewLineCfg,
  tacNormLc,
  tacNormalizeBases,
  tacPanelBase,
  tacPending,
  tacPurgeInvalidBuffs,
  tacRemoveBuffsIn,
  tacResultOpen,
  tacRouteSeq,
  tacSegExpanded,
  tacSelLine,
  tacSelMeasure,
  tacSetCamp,
  tacShadeColor,
  tacSimLine,
  tacSpeedForms,
  tacSplitBases,
  tacStateMatches,
  tacStateOf,
  tacSyncMeasureArm,
  tacSyncSpeedPanel,
  tacSyncStatus,
  tacTargetSig,
  tacTraitRoleInTarget,
  updateTacMeasureInfo,
} from './measure.js';
export {
  bindTacDisplayRow,
  syncTacDisplayUI,
} from './settings.js';
export {
  enterTactic,
  setTacTool,
  syncTacSubCards,
  tacTool,
  updateTacPanel,
} from './panel.js';
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
} from './selection.js';
export {
  renderTacTextList,
  tacArrowColor,
  tacArrowWidth,
  tacDragText,
  tacDrawShape,
  tacDrawing,
  tacHexRgba,
  tacSelectedText,
  tacTextPlacing,
  updateTacTextUi,
} from './drawing.js';
export {
  renderTacTimeline,
  tacAnimArmed,
  tacAnimPlay,
  tacAnimPlayStart,
  tacAnimReset,
  tacAnimStop,
  tacDragAnimDot,
  tacTimeline,
  tacTimelineStop,
} from './animation.js';
export {
  buildTacRangeRows,
  renderTacManage,
  tacManageSel,
} from './manage.js';
export {
  syncTacCarryChairRow,
  tacCarryState,
} from './analysis-carry.js';
export {
  tacPathState,
} from './analysis-path.js';
export {
  tacExportImage,
  tacLoadImg,
} from './export.js';
