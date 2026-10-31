export const MAP_SCENES = Object.freeze([
  'ordnance_factory1', 'h55_hospital2', 'h55_demo', 'h55_fishingvillage',
  'h55_playground', 'ordnance_factory2', 'h55_sleepingtown3', 'h55_chinatown', 'h55_deadforest_sp',
]);

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

export function map3dURL({ mapId, image, size, start, end }) {
  if (!Number.isInteger(mapId) || !MAP_SCENES[mapId]) throw new TypeError('Unknown map');
  const url = `/tactical-friend/3d/${MAP_SCENES[mapId]}.html`;
  if (start === undefined && end === undefined) return url;
  if (!point(start) || end !== undefined && !point(end)
      || typeof image !== 'string' || image.length > 1500
      || !Array.isArray(size) || size.length !== 2 || !size.every(n => Number.isInteger(n) && n > 0 && n <= 10000)) {
    throw new TypeError('Invalid map endpoints');
  }
  const payload = { v: 1, scene: MAP_SCENES[mapId], image, size, start };
  if (end !== undefined) payload.end = end;
  return url + '#' + new URLSearchParams({ pil2d: JSON.stringify(payload) });
}
