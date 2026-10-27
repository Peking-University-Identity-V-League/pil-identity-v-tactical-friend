
import { CIPHER_EXTRA, MAPS_DATA } from './maps.js';


export function cipherOf(mapId, cipherId) {
  return MAPS_DATA[mapId].ciphers.find((p) => p.id === cipherId)
    || (CIPHER_EXTRA[mapId] || []).find((c) => c.id === cipherId);
}



export function calculateMapsZonesRelative() {
  return MAPS_DATA.map(({ zonesInfo, mapSize }, mapId) => {
    const [xInit, yInit, w, h, cols, rows] = zonesInfo
    const [imgW, imgH] = mapSize
    const rel = { x: xInit / imgW, y: yInit / imgH, w: w / imgW, h: h / imgH }
    const zones = []
    if (mapId === 6) {
      
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          zones.push({
            x: rel.x + (cols - 1 - j) * rel.w,
            y: rel.y + i * rel.h,
            width: rel.w,
            height: rel.h,
          })
        }
      }
      
      zones.push({
        x: rel.x + 1.35 * rel.w, y: rel.y + 3 * rel.h,
        width: 1.65 * rel.w, height: 1.16 * rel.h,
      })
      return zones
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        zones.push({
          x: rel.x + i * rel.w,
          y: rel.y + (j - (mapId === 2 ? i * 0.125 : 0)) * rel.h,
          width: rel.w,
          height: rel.h,
        })
      }
    }
    return zones
  })
}


export function calculateCiphersCoordsRelative() {
  return MAPS_DATA.map((map, mapId) => {
    const [imgW, imgH] = map.mapSize
    return map.cipherCombinations.map((group) =>
      group.map((cipherId) => {
        const pt = cipherOf(mapId, cipherId).location
        return [pt[0] / imgW, pt[1] / imgH]
      }))
  })
}

export function calculateZoneCenters(zones) {
  return zones.map(zone => ({ x: zone.x + zone.width / 2, y: zone.y + zone.height / 2 }))
}

export function calculateLockCipher(hunterPos, ciphers, mapSize) {
  let maxDist = -1, idLock = 0
  const imgW = mapSize[0], imgH = mapSize[1]
  for (let i = 0; i < ciphers.length; i++) {
    const dx = (hunterPos.x - ciphers[i][0]) * imgW
    const dy = (hunterPos.y - ciphers[i][1]) * imgH
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > maxDist) { maxDist = dist; idLock = i }
  }
  return idLock
}

export const mapsZonesRelative = calculateMapsZonesRelative()

export const ciphersCoordsRelative = calculateCiphersCoordsRelative()
