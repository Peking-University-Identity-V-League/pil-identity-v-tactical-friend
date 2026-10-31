import assert from 'node:assert/strict';
import test from 'node:test';
import { MAP_SCENES, measurementEndpoints, map3dURL } from '../../js/core/map-handoff.js';

const line = (x1, y1, x2, y2, chain = null) => ({ x1, y1, x2, y2, chain });
test('selected measurement wins over newer lines; polylines transfer only their first and last point', () => {
  const measures = [line(.1, .2, .3, .4, 7), line(.3, .4, .5, .6, 7), line(.7, .8, .9, 1)];
  assert.deepEqual(measurementEndpoints(measures, { selectedIndex: 1 }), { start: [.1, .2], end: [.5, .6] });
  assert.deepEqual(measurementEndpoints(measures), { start: [.7, .8], end: [.9, 1] });
});
test('an unfinished new start is transferred instead of an older line', () => {
  assert.deepEqual(measurementEndpoints([line(.1, .2, .3, .4)], { pending: { x: .6, y: .7 } }), { start: [.6, .7] });
  assert.deepEqual(measurementEndpoints([]), {});
  assert.deepEqual(measurementEndpoints([line(NaN, .2, .3, .4)]), {});
});
test('a polyline still being drawn transfers both endpoints, including a new chain after an older chain', () => {
  const measures = [line(.1, .2, .3, .4, 7), line(.3, .4, .6, .7, 7)];
  assert.deepEqual(measurementEndpoints(measures, { pending: { x: .6, y: .7 }, activeChain: 7 }), { start: [.1, .2], end: [.6, .7] });
  assert.deepEqual(measurementEndpoints(measures, { pending: { x: .8, y: .9 }, activeChain: 8 }), { start: [.8, .9] });
});
test('all nine 2D maps open the corresponding 3D scene', () => {
  assert.equal(new Set(MAP_SCENES).size, 9);
  for (let mapId = 0; mapId < 9; mapId++) {
    assert.equal(map3dURL({ mapId }), `/tactical-friend/3d/${MAP_SCENES[mapId]}.html`);
  }
  assert.throws(() => map3dURL({ mapId: 9 }));
  assert.throws(() => map3dURL({ mapId: '0' }));
});
test('the fragment contains only image identity and endpoints, with no board state or query parameters', () => {
  const input = { mapId: 0, image: 'https://example.org/map.png', size: [750, 644], start: [.1, .2], end: [.8, .9], tokens: { secret: 'ignored' } };
  const url = new URL(map3dURL(input), 'https://pkuidv.com');
  assert.equal(url.search, '');
  const payload = JSON.parse(new URLSearchParams(url.hash.slice(1)).get('pil2d'));
  assert.deepEqual(payload, { v: 1, scene: MAP_SCENES[0], image: input.image, size: input.size, start: input.start, end: input.end });
  assert.throws(() => map3dURL({ ...input, end: [Infinity, .3] }));
  assert.throws(() => map3dURL({ ...input, start: [-.1, .2] }));
});
