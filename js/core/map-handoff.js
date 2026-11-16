export const MAP_SCENES = Object.freeze([
  'ordnance_factory1', 'h55_hospital2', 'h55_demo', 'h55_fishingvillage',
  'h55_playground', 'ordnance_factory2', 'h55_sleepingtown3', 'h55_chinatown', 'h55_deadforest_sp',
]);

export const OFFICIAL_ORIGIN = 'https://pkuidv.com';

const ENTRY_PATHS = Object.freeze(['/tactical-friend/', '/zhanshuyanlian/']);

const point = value => Array.isArray(value) && value.length === 2
  && value.every(n => Number.isFinite(n) && n >= 0 && n <= 1);
const validLine = m => m && point([m.x1, m.y1]) && point([m.x2, m.y2]);

export function measurementEndpoints(measures = [], { selectedIndex, pending, activeChain } = {}) {
  let selected = Number.isInteger(selectedIndex) && validLine(measures[selectedIndex]) ? measures[selectedIndex] : null;
  if (!selected && pending && point([pending.x, pending.y])) {
    // Chain drawing keeps its last endpoint pending for the next segment.
    selected = activeChain != null ? measures.findLast(m => validLine(m) && m.chain === activeChain) : null;
    if (!selected) return { start: [pending.x, pending.y] };
  }
  selected ||= measures.findLast(validLine);
  if (!selected) return {};
  const segments = selected.chain == null ? [selected] : measures.filter(m => validLine(m) && m.chain === selected.chain);
  const first = segments[0], last = segments.at(-1);
  return { start: [first.x1, first.y1], end: [last.x2, last.y2] };
}

// Local entry when hosted on the official origin (or a local preview); otherwise
// point at the official site so packaged copies (e.g. the bilibili toy, which
// cannot bundle the 3D assets) open the 3D page there in a new window.
export function resolveMap3dEntryPath(pathname, origin) {
  const prefix = String(pathname).startsWith('/zhanshuyanlian/') ? '/zhanshuyanlian/' : '/tactical-friend/';
  let hostname = '';
  try { hostname = new URL(origin).hostname; } catch { /* invalid origin: treat as external */ }
  if (origin === OFFICIAL_ORIGIN || hostname === 'localhost' || hostname === '127.0.0.1') return prefix;
  return OFFICIAL_ORIGIN + prefix;
}

export function isExternalMap3dEntry(entryPath) {
  return String(entryPath).startsWith('https://');
}

function map3dFragment(scene, { image, size, start, end }) {
  if (start === undefined && end === undefined) return '';
  if (!point(start) || end !== undefined && !point(end)
      || typeof image !== 'string' || image.length > 1500
      || !Array.isArray(size) || size.length !== 2 || !size.every(n => Number.isInteger(n) && n > 0 && n <= 10000)) {
    throw new TypeError('Invalid map endpoints');
  }
  const payload = { v: 1, scene, image, size, start };
  if (end !== undefined) payload.end = end;
  return '#' + new URLSearchParams({ pil2d: JSON.stringify(payload) });
}

export function map3dURL({ mapId, image, size, start, end, entryPath = '/tactical-friend/' }) {
  if (!Number.isInteger(mapId) || !MAP_SCENES[mapId]) throw new TypeError('Unknown map');
  if (!(ENTRY_PATHS.includes(entryPath) || ENTRY_PATHS.some(prefix => entryPath === OFFICIAL_ORIGIN + prefix))) {
    throw new TypeError('Unknown entry path');
  }
  const scene = MAP_SCENES[mapId];
  return `${entryPath}3d/${scene}.html` + map3dFragment(scene, { image, size, start, end });
}

async function htmlReachable(fetchFn, url) {
  try {
    const response = await fetchFn(url);
    await response.body?.cancel?.();
    return response.ok && String(response.headers.get('content-type') || '').includes('text/html');
  } catch { return false; }
}

// Resolve where this scene's 3D page is actually reachable. The official site is
// always served; local previews may host the public entry, plain dev servers
// (repo root, e.g. Live Server) only the raw maps-3d files, and packaged copies
// (e.g. the bilibili toy) nothing at all — those fall back to the official site.
export async function resolveMap3dTarget({ mapId, image, size, start, end, pathname, origin, fetchFn = fetch }) {
  if (!Number.isInteger(mapId) || !MAP_SCENES[mapId]) throw new TypeError('Unknown map');
  const scene = MAP_SCENES[mapId];
  const prefix = String(pathname).startsWith('/zhanshuyanlian/') ? '/zhanshuyanlian/' : '/tactical-friend/';
  const handoff = { image, size, start, end };
  const entry = `${prefix}3d/${scene}.html`;
  if (origin === OFFICIAL_ORIGIN) return entry + map3dFragment(scene, handoff);
  if (resolveMap3dEntryPath(pathname, origin) === prefix) {
    if (await htmlReachable(fetchFn, entry)) return entry + map3dFragment(scene, handoff);
    const devEntry = `/maps-3d/${scene}.html`;
    if (await htmlReachable(fetchFn, devEntry)) return devEntry + map3dFragment(scene, handoff);
  }
  return OFFICIAL_ORIGIN + entry + map3dFragment(scene, handoff);
}
