
import { deduceView, homeView, pageSubtitle, pageTitle, selectView, showToast, tabBar, tacticView } from './core/dom.js';
import { saveRegionSel } from './core/persist.js';
import { S } from './core/state.js';
import { MAPS_DATA } from './data/maps.js';
import { enterDeduce } from './deduce.js';
import { checkLock, drawCanvas, loadMapImage, selectMap, updateCipherDots, updateCipherText } from './region.js';
import { enterTactic, tacResetTransient } from './tactic.js';


import { translate } from './core/i18n.js';

export const TAB_TITLES = {
  tactic: [translate("navigation.tabTitlesZero"), 'Identity V Tactical Board'],
  region: [translate("navigation.tabTitlesZeroAlternate"), 'Identity V Region Selection'],
  deduce: [translate("navigation.tabTitlesZeroThird"), 'Identity V Cipher Deduction'],
};

export const HOME_TITLE = [translate("ui.application.title"), 'Identity V Tactical Friend'];


export const dedDataOf = (mapId) => (MAPS_DATA[mapId] ? MAPS_DATA[mapId].deduction : null);


export function showView(view) {
  [homeView, tacticView, selectView, deduceView]
    .forEach((v) => v.classList.toggle('active', v === view))
  window.scrollTo({ top: 0, behavior: 'instant' })
}


export function switchTab(tab) {
  if (tab === 'deduce' && !dedDataOf(S.currentMapId)) return;
  S.currentTab = tab;
  showView(tab === 'region' ? selectView
    : tab === 'deduce' ? deduceView : tacticView);
  
  if (tab === 'region') {
    updateCipherText();
    updateCipherDots();
    checkLock(); 
    drawCanvas();
    loadMapImage();
  }
  if (tab === 'deduce') enterDeduce();
  if (tab === 'tactic') enterTactic();
  updateTabUi();
}


export function updateTabUi() {
  tabBar.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === S.currentTab);
  });
  const tabsVisible = tabBar.style.display !== 'none';
  document.body.classList.toggle('has-tabs', tabsVisible);
  const [zh, en] = tabsVisible ? TAB_TITLES[S.currentTab] : HOME_TITLE;
  pageTitle.textContent = zh;
  pageSubtitle.textContent = en;
}

tabBar.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});


export const mapSwitchMenu = document.createElement('div')

mapSwitchMenu.className = 'map-switch-menu'

document.body.appendChild(mapSwitchMenu)

export let mapSwitchAnchor = null

export function closeMapSwitch() {
  mapSwitchMenu.classList.remove('open')
  if (mapSwitchAnchor) mapSwitchAnchor.classList.remove('open')
  mapSwitchAnchor = null
}

export function toggleMapSwitch(anchor) {
  if (mapSwitchMenu.classList.contains('open') && mapSwitchAnchor === anchor) {
    closeMapSwitch()
    return
  }
  closeMapSwitch()
  mapSwitchAnchor = anchor
  anchor.classList.add('open')
  mapSwitchMenu.innerHTML = ''
  MAPS_DATA.forEach((map, idx) => {
    const item = document.createElement('button')
    item.type = 'button'
    item.className = 'map-switch-item' + (idx === S.currentMapId ? ' current' : '')
    item.innerHTML = `<span class="msi-zh">${map.mapName}</span>`
      + `<span class="msi-en">${map.mapNameEn}</span>`
    item.addEventListener('click', () => {
      closeMapSwitch()
      switchMap(idx)
    })
    mapSwitchMenu.appendChild(item)
  })
  const r = anchor.getBoundingClientRect()
  const menuW = Math.min(260, window.innerWidth - 24)
  
  mapSwitchMenu.style.visibility = 'hidden'
  mapSwitchMenu.classList.add('open')
  const menuH = Math.min(mapSwitchMenu.scrollHeight + 12,
    window.innerHeight - 24)
  const top = Math.max(12,
    Math.min(r.bottom + 8, window.innerHeight - 12 - menuH))
  mapSwitchMenu.style.top = `${top}px`
  mapSwitchMenu.style.left =
    `${Math.max(12, Math.min(r.left, window.innerWidth - menuW - 12))}px`
  mapSwitchMenu.style.visibility = ''
}


export function switchMap(mapId) {
  if (mapId === S.currentMapId || !MAPS_DATA[mapId]) return
  selectMap(mapId)
  
  tacResetTransient(); 
  
  const hasDed = !!dedDataOf(mapId)
  tabBar.querySelector('[data-tab="deduce"]').style.display = hasDed ? '' : 'none'
  if (S.currentTab === 'deduce' && !hasDed) S.currentTab = 'region'
  if (S.currentTab === 'deduce') enterDeduce()
  else if (S.currentTab === 'tactic') enterTactic()
  else { checkLock(); drawCanvas() }
  updateTabUi()
  saveRegionSel() 
  showToast(translate("navigation.switchMap", { name: MAPS_DATA[mapId].mapName }))
}


document.querySelectorAll('.map-title-group').forEach((el) => {
  el.classList.add('map-switch-trigger')
  el.setAttribute('title', translate("navigation.message"))
  const caret = document.createElement('span')
  caret.className = 'map-switch-caret'
  caret.textContent = '▾'
  el.appendChild(caret)
  el.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleMapSwitch(el)
  })
})


document.addEventListener('click', (e) => {
  if (!mapSwitchMenu.classList.contains('open')) return
  if (e.target.closest('.map-switch-menu') || e.target.closest('.map-title-group')) return
  closeMapSwitch()
})

window.addEventListener('scroll', closeMapSwitch, true)

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMapSwitch()
})
