const validPoint = p => Array.isArray(p) && p.length === 2
  && p.every(v => Number.isFinite(v) && v >= 0 && v <= 1);

export function parseHandoff(hash, profile) {
  if (typeof hash !== 'string' || hash.length > 4096) throw Error('选点链接过长或无效。');
  const raw = new URLSearchParams(hash.replace(/^#/, '')).get('pil2d');
  if (raw === null) return null;
  let data;
  try { data = JSON.parse(raw); } catch { throw Error('选点链接无法读取，请从二维工具重新进入。'); }
  if (!profile || !data || data.v !== 1 || data.scene !== profile.scene
      || data.image !== profile.image || !Array.isArray(data.size)
      || data.size.length !== 2 || data.size.some((n, i) => n !== profile.size[i])
      || !validPoint(data.start) || data.end !== undefined && !validPoint(data.end)
      || Object.keys(data).some(k => !['v', 'scene', 'image', 'size', 'start', 'end'].includes(k))) {
    throw Error('选点与当前地图或底图版本不匹配，请从二维工具重新进入。');
  }
  return { start: [...data.start], ...(data.end === undefined ? {} : { end: [...data.end] }) };
}

export function toWorldXZ(point, profile) {
  if (!validPoint(point) || !Array.isArray(profile?.normalizedToWorld)
      || profile.normalizedToWorld.length !== 6 || !profile.normalizedToWorld.every(Number.isFinite)) throw Error('无效的坐标校准。');
  const [a, b, c, d, e, f] = profile.normalizedToWorld, [x, y] = point;
  return [a * x + c * y + e, b * x + d * y + f];
}

export function surfaceCandidates(point, profile, layers, locate) {
  const [x, z] = toWorldXZ(point, profile), candidates = [];
  for (const layer of layers) {
    const hit = locate(layer.id, [x, 0, z]);
    if (!hit || !Array.isArray(hit.point) || !hit.point.every(Number.isFinite)) continue;
    // Height must come from this actual surface; never move XZ or invent Y.
    if (Math.abs(hit.point[0] - x) > 1e-6 || Math.abs(hit.point[2] - z) > 1e-6) continue;
    if (!candidates.some(c => Math.abs(c.hit.point[1] - hit.point[1]) < 1e-5)) candidates.push({ layer, hit });
  }
  return candidates;
}
