import { TAC_LS_KEY, saveRegionSel } from './core/persist.js';
import { drawCanvas } from './region.js';

export const SEL_DISPLAY_DEFAULT = { roleSize: 50, cipherSize: 5.2, doorSize: 6 };
export const selDisplay = {
  doors: false,
  roleSize: SEL_DISPLAY_DEFAULT.roleSize,
  cipherSize: SEL_DISPLAY_DEFAULT.cipherSize,
  doorSize: SEL_DISPLAY_DEFAULT.doorSize,
};

export function bindSelDisplay() {
  const roleSizeEl = document.getElementById('selRoleSize');
  const cipherSizeEl = document.getElementById('selCipherSize');
  const showDoorsEl = document.getElementById('selShowDoors');
  const doorSizeEl = document.getElementById('selDoorSize');
  const roleDefEl = document.getElementById('selRoleSizeDef');
  const cipherDefEl = document.getElementById('selCipherSizeDef');
  const doorDefEl = document.getElementById('selDoorSizeDef');
  if (!roleSizeEl || !cipherSizeEl || !showDoorsEl || !doorSizeEl
      || !roleDefEl || !cipherDefEl || !doorDefEl) return;

  try {
    const pd = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null');
    if (pd?.selDisplay) Object.assign(selDisplay, pd.selDisplay);
  } catch { /* ignore unavailable storage */ }
  roleSizeEl.value = selDisplay.roleSize;
  cipherSizeEl.value = selDisplay.cipherSize;
  showDoorsEl.checked = selDisplay.doors;
  doorSizeEl.value = selDisplay.doorSize;
  roleDefEl.checked = selDisplay.roleSize === SEL_DISPLAY_DEFAULT.roleSize;
  cipherDefEl.checked = selDisplay.cipherSize === SEL_DISPLAY_DEFAULT.cipherSize;
  doorDefEl.checked = selDisplay.doorSize === SEL_DISPLAY_DEFAULT.doorSize;

  roleSizeEl.addEventListener('input', () => {
    selDisplay.roleSize = parseFloat(roleSizeEl.value);
    roleDefEl.checked = selDisplay.roleSize === SEL_DISPLAY_DEFAULT.roleSize;
    drawCanvas(); saveRegionSel();
  });
  roleDefEl.addEventListener('change', () => {
    if (!roleDefEl.checked) return;
    roleSizeEl.value = SEL_DISPLAY_DEFAULT.roleSize;
    roleSizeEl.dispatchEvent(new Event('input'));
  });
  cipherSizeEl.addEventListener('input', () => {
    selDisplay.cipherSize = parseFloat(cipherSizeEl.value);
    cipherDefEl.checked = selDisplay.cipherSize === SEL_DISPLAY_DEFAULT.cipherSize;
    drawCanvas(); saveRegionSel();
  });
  cipherDefEl.addEventListener('change', () => {
    if (!cipherDefEl.checked) return;
    cipherSizeEl.value = SEL_DISPLAY_DEFAULT.cipherSize;
    cipherSizeEl.dispatchEvent(new Event('input'));
  });
  showDoorsEl.addEventListener('change', () => {
    selDisplay.doors = showDoorsEl.checked;
    drawCanvas(); saveRegionSel();
  });
  doorSizeEl.addEventListener('input', () => {
    selDisplay.doorSize = parseFloat(doorSizeEl.value);
    doorDefEl.checked = selDisplay.doorSize === SEL_DISPLAY_DEFAULT.doorSize;
    drawCanvas(); saveRegionSel();
  });
  doorDefEl.addEventListener('change', () => {
    if (!doorDefEl.checked) return;
    doorSizeEl.value = SEL_DISPLAY_DEFAULT.doorSize;
    doorSizeEl.dispatchEvent(new Event('input'));
  });
}
