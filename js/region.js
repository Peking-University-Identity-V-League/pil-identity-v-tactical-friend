
import { backHomeBtn, cipherDots, cipherRows, cipherText, currentMapTitle, currentMapTitleEn, hintDynamic, hintFixed, homeView, hunterInfo, hunterPixelCoord, hunterZoneName, lockCipherDist, lockCipherName, mapCanvas, mapImage, nextCipherBtn, prevCipherBtn, resetBtn, showToast, sideToggle, survivorInfo, tabBar, tacticView } from './core/dom.js';
import { TAC_LS_KEY, restoreRegionSel, saveRegionSel } from './core/persist.js';
import { S } from './core/state.js';
import { $, loadImageWithStatus, mountImageOverlays } from './core/utils.js';
import { calculateLockCipher, calculateZoneCenters, cipherOf, ciphersCoordsRelative, mapsZonesRelative } from './data/geo.js';
import { MAPS_DATA, getImageUrl } from './data/maps.js';
import { ESCAPE_DOOR_ICON_URL } from './data/tactic-data.js';
import { updateLawBtn } from './deduce.js';
import { dedDataOf, showView, updateTabUi } from './shell.js';
import { enterTactic, renderTacCiphers, tacResetTransient } from './tactic.js';

import { translate } from './core/i18n.js';

export const { loading: loadingOverlay, error: imageError } =
  mountImageOverlays($('regionMapContainer'))

export let canvasCtx = null

export let canvasWidth = 0

export let canvasHeight = 0


export const ROLE_ICON_URLS = {
  survivor: 'https://patchwiki.biligame.com/images/dwrg/4/45/'
    + 'omv2vmop0j63s9aprhjjkt4psykuy5p.png',
  hunter: 'https://patchwiki.biligame.com/images/dwrg/7/7a/'
    + 'f3sec5gnnhzh1xprcbxeaxa1uuzhkmo.png',
}

export const roleIcons = {
  survivor: { img: null, loaded: false, retryTimer: null },
  hunter: { img: null, loaded: false, retryTimer: null },
}

export function loadRoleIcon(role) {
  const icon = roleIcons[role]
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    icon.img = img
    icon.loaded = true
    if (icon.retryTimer) { clearTimeout(icon.retryTimer); icon.retryTimer = null }
    drawCanvas()
  }
  img.onerror = () => {
    icon.loaded = false
    if (icon.retryTimer) clearTimeout(icon.retryTimer)
    icon.retryTimer = setTimeout(() => loadRoleIcon(role), 3350)
    drawCanvas()
  }
  img.src = ROLE_ICON_URLS[role]
  if (img.complete && img.naturalWidth > 0) img.onload()
}

loadRoleIcon('survivor')

loadRoleIcon('hunter')


export const CIPHER_ICON_URL = 'https://patchwiki.biligame.com/images/dwrg/9/93/'
  + 'eorb4lhtk2n7ej9iuuufhaadh3l2ec9.png'

export const cipherIcon = { img: null, loaded: false, retryTimer: null }

export function loadCipherIcon() {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    cipherIcon.img = img
    cipherIcon.loaded = true
    if (cipherIcon.retryTimer) {
      clearTimeout(cipherIcon.retryTimer); cipherIcon.retryTimer = null
    }
    drawCanvas()
    renderTacCiphers()
  }
  img.onerror = () => {
    cipherIcon.loaded = false
    if (cipherIcon.retryTimer) clearTimeout(cipherIcon.retryTimer)
    cipherIcon.retryTimer = setTimeout(loadCipherIcon, 3350)
  }
  img.src = CIPHER_ICON_URL
  if (img.complete && img.naturalWidth > 0) img.onload()
}

loadCipherIcon()

export function setMapContainerHeight() {
  
  const container = document.getElementById('regionMapContainer')
  const mapWrapper = document.getElementById('mapWrapper')
  const mapSize = MAPS_DATA[S.currentMapId].mapSize
  const imgW = mapSize[0], imgH = mapSize[1]
  const containerWidth = container.clientWidth
  const displayHeight = containerWidth * (imgH / imgW)
  container.style.height = displayHeight + 'px'
  mapWrapper.style.height = displayHeight + 'px'
  mapWrapper.style.overflow = 'hidden'
}

export function getImageDrawRect(canvasW, canvasH, mapId) {
  const mapSize = MAPS_DATA[mapId].mapSize
  const imgW = mapSize[0], imgH = mapSize[1]
  const imgAspect = imgW / imgH
  const canvasAspect = canvasW / canvasH
  if (canvasAspect > imgAspect) {
    const drawH = canvasH
    const drawW = canvasH * imgAspect
    return { x: (canvasW - drawW) / 2, y: 0, w: drawW, h: drawH }
  } else {
    const drawW = canvasW
    const drawH = canvasW / imgAspect
    return { x: 0, y: 0, w: drawW, h: drawH }
  }
}

export function enterMap(mapId) {
  selectMap(mapId)
  
  S.currentTab = 'tactic'
  showView(tacticView)
  backHomeBtn.style.display = 'flex'
  
  tabBar.style.display = 'flex'
  tabBar.querySelector('[data-tab="deduce"]').style.display =
    dedDataOf(mapId) ? '' : 'none'
  
  tacResetTransient(); 
  updateTabUi()
  
  enterTactic()
  saveRegionSel() 
}

export function backToHome() {
  showView(homeView)
  backHomeBtn.style.display = 'none'
  tabBar.style.display = 'none'
  S.currentTab = 'region'
  updateTabUi()
}

export function selectMap(mapId) {
  S.currentMapId = mapId
  S.currentCipherIndex = 0

  const map = MAPS_DATA[mapId]
  currentMapTitle.textContent = map.mapName
  currentMapTitleEn.textContent = map.mapNameEn

  const zones = mapsZonesRelative[mapId]
  S.survivorState = new Array(zones.length).fill(0)
  S.hunterState = new Array(zones.length).fill(0)
  S.chooseState = [...(S.currentSide === 1 ? S.survivorState : S.hunterState)]

  S.flagLock = false
  S.lockCipherIndex = -1
  S.selectedCipherIndex = -1

  restoreRegionSel(mapId) 

  updateLawBtn()
  updateCipherText()
  updateCipherDots()
  updateSelectionInfo() 
  loadMapImage()
}

export const regionImageState = { url: null, timer: null }

export let regionImgUrl = null

 
export function loadMapImage() {
  const url = getImageUrl(S.currentMapId, S.currentCipherIndex)
  
  if (url === regionImgUrl && canvasWidth > 0) { drawCanvas(); return }
  regionImgUrl = url
  loadImageWithStatus({
    url: getImageUrl(S.currentMapId, S.currentCipherIndex),
    img: mapImage,
    loading: loadingOverlay,
    error: imageError,
    state: regionImageState,
    crossOrigin: true, 
    onReady: () => { setMapContainerHeight(); initCanvas() },
    onFail: setMapContainerHeight,
  })
}

export function initCanvas() {
  const rect = mapWrapper.getBoundingClientRect()
  const scale = window.devicePixelRatio || 1

  canvasWidth = rect.width
  canvasHeight = rect.height

  mapCanvas.width = canvasWidth * scale
  mapCanvas.height = canvasHeight * scale
  mapCanvas.style.width = canvasWidth + 'px'
  mapCanvas.style.height = canvasHeight + 'px'

  canvasCtx = mapCanvas.getContext('2d')
  canvasCtx.scale(scale, scale)

  drawCanvas()
}

export function drawCanvas() {
  if (!canvasCtx || canvasWidth <= 0 || canvasHeight <= 0) return

  const ctx = canvasCtx
  const zones = mapsZonesRelative[S.currentMapId]
  const centers = calculateZoneCenters(zones)
  const ciphers = ciphersCoordsRelative[S.currentMapId][S.currentCipherIndex]

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  ctx.drawImage(mapImage, 0, 0, canvasWidth, canvasHeight)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 3
  zones.forEach(zone => {
    ctx.strokeRect(
      zone.x * canvasWidth,
      zone.y * canvasHeight,
      zone.width * canvasWidth,
      zone.height * canvasHeight
    )
  })

  
  if (cipherIcon.loaded) {
    const iconSize = Math.max(18, Math.round(canvasWidth * selDisplay.cipherSize / 100))
    ciphers.forEach(([rx, ry]) => {
      ctx.drawImage(cipherIcon.img,
        rx * canvasWidth - iconSize / 2,
        ry * canvasHeight - iconSize / 2,
        iconSize, iconSize)
    })
  }

  
  if (selDisplay.doors && doorIcon.loaded) {
    const doorSize = Math.max(14, Math.round(canvasWidth * selDisplay.doorSize / 100))
    MAPS_DATA[S.currentMapId].escapeDoors.slice(0, 2).forEach(([dx, dy]) => {
      ctx.drawImage(doorIcon.img,
        dx / MAPS_DATA[S.currentMapId].mapSize[0] * canvasWidth - doorSize / 2,
        dy / MAPS_DATA[S.currentMapId].mapSize[1] * canvasHeight - doorSize / 2,
        doorSize, doorSize)
    })
  }

  zones.forEach((zone, i) => {
    const zoneW = zone.width * canvasWidth
    const zoneH = zone.height * canvasHeight
    const iconSize = Math.min(zoneW, zoneH) * selDisplay.roleSize / 100 
    const cx = centers[i].x * canvasWidth
    const cy = centers[i].y * canvasHeight

    if (S.survivorState[i] > 0) {
      drawRoleMark(ctx, cx, cy, iconSize, roleIcons.survivor, ROLE_STYLE.survivor)
    }
    if (S.hunterState[i] < 0) {
      drawRoleMark(ctx, cx, cy, iconSize, roleIcons.hunter, ROLE_STYLE.hunter)
    }
  })

  if (S.flagLock && S.lockCipherIndex >= 0) {
    const [rx, ry] = ciphers[S.lockCipherIndex]
    drawCipherRing(ctx, rx * canvasWidth, ry * canvasHeight, RING_STYLE.lock)
  }

  if (S.selectedCipherIndex >= 0 && ciphers[S.selectedCipherIndex]) {
    const [rx, ry] = ciphers[S.selectedCipherIndex]
    drawCipherRing(ctx, rx * canvasWidth, ry * canvasHeight, RING_STYLE.selected)
  }
}


export const ROLE_STYLE = {
  survivor: {
    glowBlur: 17, glowColor: '#6366f1',
    ringBlur: 10, color: '#00f0ff', fill: 'rgba(0, 240, 255, 0.25)', radius: 8,
  },
  hunter: {
    glowBlur: 20, glowColor: '#f472b6',
    ringBlur: 13, color: '#ff2a6d', fill: 'rgba(255, 42, 109, 0.25)', radius: 9,
  },
}


export function drawRoleMark(ctx, cx, cy, size, icon, style) {
  if (icon.loaded) {
    ctx.save()
    ctx.shadowBlur = style.glowBlur
    ctx.shadowColor = style.glowColor
    ctx.drawImage(icon.img, cx - size / 2, cy - size / 2, size, size)
    ctx.restore()
    return
  }
  ctx.save()
  ctx.shadowBlur = style.ringBlur
  ctx.shadowColor = style.color
  ctx.beginPath()
  ctx.fillStyle = style.fill
  ctx.strokeStyle = style.color
  ctx.lineWidth = 2
  ctx.arc(cx, cy, style.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  ctx.beginPath()
  ctx.fillStyle = style.color
  ctx.arc(cx, cy, 3, 0, Math.PI * 2)
  ctx.fill()
}


export const RING_STYLE = {
  lock: {
    color: '#fbbf24', faint: 'rgba(251, 191, 36, 0.3)',
    dash: [4, 3], r: 15, dot: 5, outer: 20,
  },
  selected: {
    color: '#34d399', faint: 'rgba(52, 211, 153, 0.3)',
    dash: [3, 2], r: 16, dot: 4, outer: 23,
  },
}

export function drawCipherRing(ctx, x, y, style) {
  ctx.save()
  ctx.shadowBlur = 17
  ctx.shadowColor = style.color
  ctx.strokeStyle = style.color
  ctx.lineWidth = 3
  ctx.setLineDash(style.dash)
  ctx.beginPath()
  ctx.arc(x, y, style.r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = style.color
  ctx.beginPath()
  ctx.arc(x, y, style.dot, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = style.faint
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(x, y, style.outer, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

export function toggleSide() {
  S.currentSide = S.currentSide === 1 ? -1 : 1

  const btns = sideToggle.querySelectorAll('.side-btn')
  btns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === (S.currentSide === 1 ? 0 : 1))
  })

  S.chooseState = [...(S.currentSide === 1 ? S.survivorState : S.hunterState)]
  updateSelectionInfo()
  drawCanvas()
  saveRegionSel() 
}


export function switchCipher(step) {
  const count = MAPS_DATA[S.currentMapId].cipherCombinations.length
  S.currentCipherIndex = (S.currentCipherIndex + step + count) % count
  updateCipherText()
  updateCipherDots()
  checkLock() 
  drawCanvas()
  loadMapImage()
  saveRegionSel() 
}

export function updateCipherText() {
  const count = MAPS_DATA[S.currentMapId].cipherCombinations.length
  cipherText.textContent = translate("region.updateCipherText", { index: S.currentCipherIndex + 1, count: count })
}

export function updateCipherDots() {
  const count = MAPS_DATA[S.currentMapId].cipherCombinations.length
  cipherDots.innerHTML = ''
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div')
    dot.className = 'cipher-dot' + (i === S.currentCipherIndex ? ' active' : '')
    cipherDots.appendChild(dot)
  }
}


export function updateLockCipher() {
  const idx = S.hunterState.findIndex((s) => s < 0)
  if (idx < 0) {
    S.flagLock = false
    S.lockCipherIndex = -1
    return
  }
  const hunterPos = calculateZoneCenters(mapsZonesRelative[S.currentMapId])[idx]
  const ciphers = ciphersCoordsRelative[S.currentMapId][S.currentCipherIndex]
  S.lockCipherIndex = calculateLockCipher(
    hunterPos, ciphers, MAPS_DATA[S.currentMapId].mapSize)
  S.flagLock = true
}

export function checkLock() {
  updateLockCipher()
  updateDistancePanel()
}

export function handleMapClick(e) {
  const rect = mapCanvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
    return
  }

  const x_rel = x / rect.width
  const y_rel = y / rect.height

  const zones = mapsZonesRelative[S.currentMapId]
  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i]
    if (x_rel >= zone.x && x_rel <= zone.x + zone.width &&
        y_rel >= zone.y && y_rel <= zone.y + zone.height) {
      changeStates(i)

      const center = calculateZoneCenters(zones)[i]
      const ripple = document.createElement('div')
      ripple.className = 'zone-click-effect'
      ripple.style.left = (center.x * rect.width) + 'px'
      ripple.style.top = (center.y * rect.height) + 'px'
      if (S.currentSide > 0) {
        ripple.style.borderColor = '#3b82f6'
        ripple.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)'
      } else {
        ripple.style.borderColor = '#ef4444'
        ripple.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)'
      }
      mapWrapper.appendChild(ripple)
      setTimeout(() => ripple.remove(), 536)

      return
    }
  }
}

export function changeStates(index) {
  if (S.currentSide > 0) {
    if (S.hunterState[index] < 0) {
      showToast(translate("region.changeStates"))
      return
    }
    if (S.survivorState[index] > 0) {
      S.survivorState[index] = 0
      S.chooseState[index] = 0
    } else if (S.survivorState[index] === 0) {
      const count = S.survivorState.filter(s => s > 0).length
      if (count < 4) {
        S.survivorState[index] = 1
        S.chooseState[index] = 1
      }
    }
  } else {
    if (S.survivorState[index] > 0) {
      showToast(translate("region.changeStatesAlternate"))
      return
    }
    if (S.hunterState[index] === 0) {
      S.hunterState.forEach((s, i) => {
        if (s < 0) {
          S.hunterState[i] = 0
          S.chooseState[i] = 0
        }
      })
      S.hunterState[index] = -1
      S.chooseState[index] = -1
    } else if (S.hunterState[index] < 0) {
      S.hunterState[index] = 0
      S.chooseState[index] = 0
    }
    updateLockCipher()
  }

  updateSelectionInfo()
  drawCanvas()
  saveRegionSel() 
}

export function updateSelectionInfo() {
  const sCount = S.survivorState.filter(s => s > 0).length
  const hCount = S.hunterState.filter(s => s < 0).length
  survivorInfo.textContent = translate("region.updateSelectionInfo", { count: sCount })
  hunterInfo.textContent = translate("region.updateSelectionInfoAlternate", { count: hCount })
  updateDistancePanel()
}

export function updateDistancePanel() {
  const hasHunter = S.hunterState.some(s => s < 0)
  const mapSize = MAPS_DATA[S.currentMapId].mapSize

  const zones = mapsZonesRelative[S.currentMapId]
  const centers = calculateZoneCenters(zones)
  const zoneNamesList = MAPS_DATA[S.currentMapId].zoneNames
  let hunterZoneIdx = -1
  let hunterPos = { x: 0, y: 0 }

  if (hasHunter) {
    for (let i = 0; i < S.hunterState.length; i++) {
      if (S.hunterState[i] < 0) {
        hunterZoneIdx = i
        hunterPos = centers[i]
        break
      }
    }
  }

  const cipherGroup = MAPS_DATA[S.currentMapId].cipherCombinations[S.currentCipherIndex]
  const ciphers = ciphersCoordsRelative[S.currentMapId][S.currentCipherIndex]
  
  const mPerPx = (MAPS_DATA[S.currentMapId].widthM || 0) / mapSize[0]
  let maxDist = -1, farthestIdx = 0
  let lockDist = 0, lockName = '--'

  const rows = ciphers.map((cipher, idx) => {
    let pixelDist = 0
    if (hasHunter) {
      const dx = (hunterPos.x - cipher[0]) * mapSize[0]
      const dy = (hunterPos.y - cipher[1]) * mapSize[1]
      pixelDist = Math.sqrt(dx * dx + dy * dy)
      if (pixelDist > maxDist) { maxDist = pixelDist; farthestIdx = idx }
    }
    const cObj = cipherOf(S.currentMapId, cipherGroup[idx])
    return { idx, name: cObj.name, feature: cObj.feature, dist: pixelDist }
  })

  if (hasHunter && S.flagLock && S.lockCipherIndex >= 0) {
    lockDist = rows[S.lockCipherIndex].dist
    lockName = rows[S.lockCipherIndex].name
  }

  if (hasHunter) {
    const hunterPixelX = Math.round(hunterPos.x * mapSize[0])
    const hunterPixelY = Math.round(hunterPos.y * mapSize[1])
    hunterZoneName.textContent = zoneNamesList[hunterZoneIdx] || translate("region.updateDistancePanel")
    hunterPixelCoord.textContent = hunterPixelX + ', ' + hunterPixelY
    lockCipherName.textContent = lockName
    
    lockCipherDist.textContent = S.flagLock
      ? (lockDist * mPerPx).toFixed(1) + ' m' : '--'
  } else {
    hunterZoneName.textContent = '--'
    hunterPixelCoord.textContent = '--'
    lockCipherName.textContent = '--'
    lockCipherDist.textContent = '--'
  }

  
  const fixedHint = MAPS_DATA[S.currentMapId].fixedHint
  const hints = MAPS_DATA[S.currentMapId].hints
  const hasAnyHint = !!(fixedHint && fixedHint.trim())
    || !!(hints && hints.some((h) => h && h.trim()))
  const hintCard = $('regionHintCard')
  if (hintCard) hintCard.style.display = hasAnyHint ? '' : 'none'
  hintFixed.textContent = fixedHint || '--'
  const dynamicHint = hints && hints[S.currentCipherIndex]
    ? hints[S.currentCipherIndex].trim() : ''
  if (dynamicHint) {
    hintDynamic.textContent = dynamicHint
    hintDynamic.style.display = 'block'
  } else {
    hintDynamic.style.display = 'none'
  }

  cipherRows.innerHTML = rows.map((r, i) => {
    const cls = ['cipher-row',
      hasHunter && i === farthestIdx ? 'farthest' : '',
      i === S.selectedCipherIndex ? 'selected-cipher' : '',
      hasHunter && S.flagLock && i === S.lockCipherIndex ? 'locked' : '',
    ].filter(Boolean).join(' ')
    return `
      <div class="${cls}" data-index="${i}">
        <div class="cipher-id">${r.idx + 1}</div>
        <div class="cipher-coord">${r.name}</div>
        <div class="cipher-coord cipher-feature">${r.feature}</div>
      </div>
    `
  }).join('')

  cipherRows.onclick = function(e) {
    const row = e.target.closest('.cipher-row')
    if (!row) return
    const idx = parseInt(row.dataset.index)
    if (isNaN(idx)) return
  if (S.selectedCipherIndex === idx) {
      S.selectedCipherIndex = -1
    } else {
      S.selectedCipherIndex = idx
    }
    updateDistancePanel()
    drawCanvas()
    saveRegionSel() 
  }
}

export function resetSelection() {
  const zones = mapsZonesRelative[S.currentMapId]
  S.survivorState = new Array(zones.length).fill(0)
  S.hunterState = new Array(zones.length).fill(0)
  S.chooseState = new Array(zones.length).fill(0)
  S.flagLock = false
  S.lockCipherIndex = -1
  S.selectedCipherIndex = -1
  updateSelectionInfo()
  drawCanvas()
  saveRegionSel() 
}

sideToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.side-btn')
  if (btn) toggleSide()
})

prevCipherBtn.addEventListener('click', () => switchCipher(-1))

nextCipherBtn.addEventListener('click', () => switchCipher(1))

resetBtn.addEventListener('click', resetSelection)

backHomeBtn.addEventListener('click', backToHome)

mapCanvas.addEventListener('click', handleMapClick)

window.addEventListener('resize', () => {
  if (mapImage.complete && mapImage.naturalWidth > 0) {
    setMapContainerHeight()
    initCanvas()
  }
})

export const SEL_DISPLAY_DEFAULT = { roleSize: 50, cipherSize: 5.2, doorSize: 6 };

export const selDisplay = { doors: false, roleSize: SEL_DISPLAY_DEFAULT.roleSize,
  cipherSize: SEL_DISPLAY_DEFAULT.cipherSize,
  doorSize: SEL_DISPLAY_DEFAULT.doorSize };

export const doorIcon = { img: null, loaded: false };

(function loadSelDoorIcon() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    doorIcon.img = img;
    doorIcon.loaded = true;
    drawCanvas();
  };
  img.src = ESCAPE_DOOR_ICON_URL;
})();

export function bindSelDisplay() {
  const roleSizeEl = $('selRoleSize');
  const roleDefEl = $('selRoleSizeDef');
  const cipherSizeEl = $('selCipherSize');
  const cipherDefEl = $('selCipherSizeDef');
  const showDoorsEl = $('selShowDoors');
  const doorSizeEl = $('selDoorSize');
  const doorDefEl = $('selDoorSizeDef');
  if (!cipherSizeEl) return;
  
  try {
    const pd = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null');
    if (pd && pd.selDisplay) Object.assign(selDisplay, pd.selDisplay);
  } catch (err) {  }
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
    drawCanvas();
    saveRegionSel();
  });
  roleDefEl.addEventListener('change', () => {
    if (!roleDefEl.checked) return;
    roleSizeEl.value = SEL_DISPLAY_DEFAULT.roleSize;
    roleSizeEl.dispatchEvent(new Event('input'));
  });
  cipherSizeEl.addEventListener('input', () => {
    selDisplay.cipherSize = parseFloat(cipherSizeEl.value);
    cipherDefEl.checked = selDisplay.cipherSize === SEL_DISPLAY_DEFAULT.cipherSize;
    drawCanvas();
    saveRegionSel();
  });
  cipherDefEl.addEventListener('change', () => {
    if (!cipherDefEl.checked) return;
    cipherSizeEl.value = SEL_DISPLAY_DEFAULT.cipherSize;
    cipherSizeEl.dispatchEvent(new Event('input'));
  });
  showDoorsEl.addEventListener('change', () => {
    selDisplay.doors = showDoorsEl.checked;
    drawCanvas();
    saveRegionSel();
  });
  doorSizeEl.addEventListener('input', () => {
    selDisplay.doorSize = parseFloat(doorSizeEl.value);
    doorDefEl.checked = selDisplay.doorSize === SEL_DISPLAY_DEFAULT.doorSize;
    drawCanvas();
    saveRegionSel();
  });
  doorDefEl.addEventListener('change', () => {
    if (!doorDefEl.checked) return;
    doorSizeEl.value = SEL_DISPLAY_DEFAULT.doorSize;
    doorSizeEl.dispatchEvent(new Event('input'));
  });
}
