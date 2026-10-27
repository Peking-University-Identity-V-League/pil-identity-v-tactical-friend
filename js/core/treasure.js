// Return map-relative ring geometry shared by the board and PNG export.
// Radii are relative to map width, matching the circular CSS overlays.
export function getTreasureRings(map, token, cipherIndex, rule) {
  if (!map.widthM || !token?.showTreasureRange) return [];
  const [width, height] = map.mapSize;
  const metresPerPixel = map.widthM / width;
  const candidates = (map.cipherCombinations[cipherIndex] || [])
    .map((id) => map.ciphers.find((cipher) => cipher.id === id))
    .filter(Boolean)
    .map((cipher) => ({
      cipher,
      distance: Math.hypot(
        (cipher.location[0] - token.x * width) * metresPerPixel,
        (cipher.location[1] - token.y * height) * metresPerPixel,
      ),
    }));
  const nearest = candidates.reduce((best, candidate) =>
    !best || candidate.distance < best.distance ? candidate : best, null);
  // Preserve the existing same-cipher exclusion rule and its 0.7 m tolerance.
  const excludedId = nearest && nearest.distance <= rule.ringM[1] + 0.7
    ? nearest.cipher.id : null;
  return candidates.filter(({ distance }) => distance <= rule.rangeM)
    .map(({ cipher }) => ({
      cipherId: cipher.id,
      x: cipher.location[0] / width,
      y: cipher.location[1] / height,
      innerRadius: rule.ringM[0] / map.widthM,
      outerRadius: rule.ringM[1] / map.widthM,
      excluded: cipher.id === excludedId,
    }));
}
