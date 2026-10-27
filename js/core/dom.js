
import { $ } from './utils.js';


export const pageTitle = $('pageTitle')

export const pageSubtitle = $('pageSubtitle')

export const tabBar = $('tabBar')

export const backHomeBtn = $('backHomeBtn')

export const toastMessage = $('toastMessage')

export const homeView = $('homeView')

export const selectView = $('selectView')

export const homeMapGrid = $('homeMapGrid')


export const currentMapTitle = $('currentMapTitle')

export const currentMapTitleEn = $('currentMapTitleEn')

export const sideToggle = $('sideToggle')

export const prevCipherBtn = $('prevCipher')

export const nextCipherBtn = $('nextCipher')

export const cipherText = $('cipherText')

export const cipherDots = $('cipherDots')

export const mapImage = $('mapImage')

export const mapCanvas = $('mapCanvas')

export const mapWrapper = $('mapWrapper')

export const resetBtn = $('resetBtn')

export const survivorInfo = $('survivorInfo')

export const hunterInfo = $('hunterInfo')

export const dedLawBtn = $('dedLawBtn')

export const dedLawBtnDouyin = $('dedLawBtnDouyin')

export const hunterZoneName = $('hunterZoneName')

 
export const hunterPixelCoord = $('hunterPixelCoord')

export const lockCipherName = $('lockCipherName')

export const lockCipherDist = $('lockCipherDist')

export const cipherRows = $('cipherRows')

export const hintFixed = $('hintFixed')

export const hintDynamic = $('hintDynamic')


export const deduceView = $('deduceView')

export const dedMapTitle = $('dedMapTitle')

export const dedMapTitleEn = $('dedMapTitleEn')

export const dedProgress = $('dedProgress')

export const dedConclusion = $('dedConclusion')

export const dedMapWrap = $('dedMapWrap')

export const dedMapImage = $('dedMapImage')

export const dedChainSvg = $('dedChainSvg')

export const dedResetBtn = $('dedResetBtn')

export const dedLegend = $('dedLegend')

export const dedAlert = $('dedAlert')

export const dedAlertText = $('dedAlertText')

export const dedSteps = $('dedSteps')

export const dedLayouts = $('dedLayouts')

export const dedRuleList = $('dedRuleList')

export function showToast(msg) {
  toastMessage.textContent = msg
  toastMessage.classList.add('show')
  setTimeout(() => {
    toastMessage.classList.remove('show')
  }, 1340)
}




export const tacticView = $('tacticView');

export const tacMapTitle = $('tacMapTitle');

export const tacMapTitleEn = $('tacMapTitleEn');

export const tacDrawCard = $('tacDrawCard');

export const tacTextCard = $('tacTextCard');

export const tacMeasureCard = $('tacMeasureCard');

export const tacDisplayCard = $('tacDisplayCard');

export const tacRolesCard = $('tacRolesCard');

export const tacManageCard = $('tacManageCard');

export const tacManageList = $('tacManageList');

export const tacMStyleToggle = $('tacMStyleToggle');

export const tacMStyleBody = $('tacMStyleBody');

export const tacBaseSpeedEl = $('tacBaseSpeed');

export const tacShapesEl = $('tacShapes');

export const tacMapWrap = $('tacMapWrap');

export const tacMapImage = $('tacMapImage');

export const tacArrowSvg = $('tacArrowSvg');

export const tacRolesEl = $('tacRolesSurvivor');

export const tacRolesHunterEl = $('tacRolesHunter');

export const tacRolesOtherEl = $('tacRolesOther');

export const tacColorsEl = $('tacColors');

export const tacWidthEl = $('tacWidth');

export const tacWidthVal = $('tacWidthVal');

export const tacUndoBtn = $('tacUndoBtn');

export const tacClearBtn = $('tacClearBtn');

export const tacExportBtn = $('tacExportBtn');

export const tacTextInput = $('tacTextInput');

export const tacTextAddBtn = $('tacTextAddBtn');

export const tacTextHint = $('tacTextHint');

export const tacTextColorsEl = $('tacTextColors');

export const tacTextSizeEl = $('tacTextSize');

export const tacTextSizeVal = $('tacTextSizeVal');

export const tacTextList = $('tacTextList');


export const tacTextStyle = { color: '#f1f5f9', size: 12 };

export const tacItemSection = $('tacItemSection');

export const tacItemsEl = $('tacItems');

export const tacMeasureModesEl = $('tacMeasureModes');

export const tacMeasureColorsEl = $('tacMeasureColors');

export const tacMeasureWidthEl = $('tacMeasureWidth');

export const tacMeasureWidthVal = $('tacMeasureWidthVal');

export const tacResult = $('tacResult');

export const tacSpeedRole = $('tacSpeedRole');

export const tacSpeedForm = $('tacSpeedForm');

export const tacCampToggle = $('tacCampToggle');

export const tacScopeWrap = $('tacScopeWrap');

export const tacScopeToggle = $('tacScopeToggle');

export const tacStatusEl = $('tacStatus');

export const tacStatus2El = $('tacStatus2');

export const tacDeselectBtn = $('tacDeselect');

export const tacTraitAddBtn = $('tacTraitAddBtn');

export const tacTraitModal = $('tacTraitModal');

export const tacTraitList = $('tacTraitList');

export const tacTraitClose = $('tacTraitClose');

export const tacTalentAddBtn = $('tacTalentAddBtn');

export const tacTalentModal = $('tacTalentModal');

export const tacTalentList = $('tacTalentList');

export const tacTalentClose = $('tacTalentClose');

export const tacBaseDetailToggle = $('tacBaseDetailToggle');

export const tacBaseDetailBody = $('tacBaseDetailBody');

export const tacBaseMergeBox = $('tacBaseMergeBox');

export const tacBaseMerge = $('tacBaseMerge');

export const tacBuffDetailToggle = $('tacBuffDetailToggle');

export const tacBuffDetailBody = $('tacBuffDetailBody');

export const tacBuffFilterBox = $('tacBuffFilterBox');

export const tacResultToggle = $('tacResultToggle');

export const tacResultBody = $('tacResultBody');


export const tacOtherAddBtn = $('tacOtherAddBtn');

export const tacOtherModal = $('tacOtherModal');

export const tacOtherList = $('tacOtherList');

export const tacOtherClose = $('tacOtherClose');

export const tacBuffAddBtn = $('tacBuffAddBtn');

export const tacBuffModal = $('tacBuffModal');

export const tacBuffClose = $('tacBuffClose');

export const tacBuffName = $('tacBuffName');

export const tacBuffPct = $('tacBuffPct');

export const tacBuffDur = $('tacBuffDur');

export const tacBuffOk = $('tacBuffOk');


export const tacSnapRipple = $('tacSnapRipple');

export const tacCoordsTip = $('tacCoordsTip');

export const tacShowZonesEl = $('tacShowZones');

export const tacShowCiphersEl = $('tacShowCiphers');

export const tacCipherSizeEl = $('tacCipherSize');

export const tacCipherSizeDefEl = $('tacCipherSizeDef');

export const tacShowDungeonEl = $('tacShowDungeon');

export const tacDungeonSizeEl = $('tacDungeonSize');

export const tacDungeonSizeDefEl = $('tacDungeonSizeDef');

export const tacShowDoorsEl = $('tacShowDoors');

export const tacDoorSizeEl = $('tacDoorSize');

export const tacDoorSizeDefEl = $('tacDoorSizeDef');

export const tacDoorLockEl = $('tacDoorLock');

export const tacSnapCipherEl = $('tacSnapCipher');

export const tacSnapDungeonEl = $('tacSnapDungeon');

export const tacSnapDoorEl = $('tacSnapDoor');

export const tacSnapChairEl = $('tacSnapChair');

export const tacSnapPointEl = $('tacSnapPoint');

export const tacDelSegOnlyEl = $('tacDelSegOnly');

export const tacShowCoordsEl = $('tacShowCoords');

export const tacSelGlowEl = $('tacSelGlow');

export const tacDispCipherText = $('tacDispCipherText');

export const tacDungeonText = $('tacDungeonText');

export const tacShowChairsEl = $('tacShowChairs');

export const tacChairSizeEl = $('tacChairSize');

export const tacChairSizeDefEl = $('tacChairSizeDef');

export const tacChairText = $('tacChairText');

export const tacShowChairBasementEl = $('tacShowChairBasement');

export const tacChairBasementText = $('tacChairBasementText');
