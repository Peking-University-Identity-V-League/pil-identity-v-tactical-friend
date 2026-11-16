import assert from 'node:assert/strict';
import test from 'node:test';
import { MAP_SCENES, measurementEndpoints, map3dURL, resolveMap3dEntryPath, resolveMap3dTarget, isExternalMap3dEntry } from '../../js/core/map-handoff.js';

const htmlResponse = ok => ({ ok, headers: { get: () => 'text/html' }, body: { cancel: async () => {} } });
const stubFetch = (...answers) => {
  const calls = [];
  const fn = async url => { calls.push(url); return answers[calls.length - 1]; };
  fn.calls = calls;
  return fn;
};

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
    assert.equal(map3dURL({ mapId, entryPath: '/zhanshuyanlian/' }), `/zhanshuyanlian/3d/${MAP_SCENES[mapId]}.html`);
  }
  assert.throws(() => map3dURL({ mapId: 9 }));
  assert.throws(() => map3dURL({ mapId: '0' }));
  assert.throws(() => map3dURL({ mapId: 0, entryPath: '//example.invalid/' }));
});
test('packaged deployments resolve to an absolute official entry; other origins stay rejected', () => {
  assert.equal(map3dURL({ mapId: 0, entryPath: 'https://pkuidv.com/tactical-friend/' }),
    `https://pkuidv.com/tactical-friend/3d/${MAP_SCENES[0]}.html`);
  assert.equal(map3dURL({ mapId: 1, entryPath: 'https://pkuidv.com/zhanshuyanlian/' }),
    `https://pkuidv.com/zhanshuyanlian/3d/${MAP_SCENES[1]}.html`);
  assert.throws(() => map3dURL({ mapId: 0, entryPath: 'https://example.invalid/tactical-friend/' }));
  assert.throws(() => map3dURL({ mapId: 0, entryPath: 'http://pkuidv.com/tactical-friend/' }));
  assert.throws(() => map3dURL({ mapId: 0, entryPath: 'https://pkuidv.com.evil.invalid/tactical-friend/' }));
});
test('entry resolution stays relative on the official origin and local previews, external elsewhere', () => {
  assert.equal(resolveMap3dEntryPath('/tactical-friend/', 'https://pkuidv.com'), '/tactical-friend/');
  assert.equal(resolveMap3dEntryPath('/zhanshuyanlian/', 'https://pkuidv.com'), '/zhanshuyanlian/');
  assert.equal(resolveMap3dEntryPath('/tactical-friend/', 'http://localhost:8787'), '/tactical-friend/');
  assert.equal(resolveMap3dEntryPath('/tactical-friend/', 'http://127.0.0.1:8787'), '/tactical-friend/');
  assert.equal(resolveMap3dEntryPath('/anything/', 'https://toy-cdn.bilibili.com'), 'https://pkuidv.com/tactical-friend/');
  assert.equal(resolveMap3dEntryPath('/zhanshuyanlian/', 'https://toy-cdn.bilibili.com'), 'https://pkuidv.com/zhanshuyanlian/');
  assert.ok(!isExternalMap3dEntry('/tactical-friend/'));
  assert.ok(isExternalMap3dEntry(resolveMap3dEntryPath('/anything/', 'https://toy-cdn.bilibili.com')));
});
test('target resolution skips probing on the official origin and probes locally with fallbacks', async () => {
  const base = { mapId: 1, pathname: '/tactical-friend/' };
  const official = stubFetch();
  assert.equal(await resolveMap3dTarget({ ...base, origin: 'https://pkuidv.com', fetchFn: official }),
    '/tactical-friend/3d/h55_hospital2.html');
  assert.deepEqual(official.calls, []);

  const publicEntry = stubFetch(htmlResponse(true));
  assert.equal(await resolveMap3dTarget({ ...base, origin: 'http://127.0.0.1:8787', fetchFn: publicEntry }),
    '/tactical-friend/3d/h55_hospital2.html');
  assert.deepEqual(publicEntry.calls, ['/tactical-friend/3d/h55_hospital2.html']);

  const devServer = stubFetch({ ok: false, headers: { get: () => null } }, htmlResponse(true));
  assert.equal(await resolveMap3dTarget({ ...base, origin: 'http://127.0.0.1:5500', fetchFn: devServer }),
    '/maps-3d/h55_hospital2.html');
  assert.deepEqual(devServer.calls, ['/tactical-friend/3d/h55_hospital2.html', '/maps-3d/h55_hospital2.html']);

  const nothing = stubFetch({ ok: false, headers: { get: () => null } }, { ok: false, headers: { get: () => null } });
  assert.equal(await resolveMap3dTarget({ ...base, origin: 'http://127.0.0.1:5500', fetchFn: nothing }),
    'https://pkuidv.com/tactical-friend/3d/h55_hospital2.html');

  const toy = stubFetch();
  assert.equal(await resolveMap3dTarget({ ...base, pathname: '/toy/pil-tactical-friend/', origin: 'https://toy-cdn.bilibili.com', fetchFn: toy }),
    'https://pkuidv.com/tactical-friend/3d/h55_hospital2.html');
  assert.deepEqual(toy.calls, []);

  const offline = async () => { throw new TypeError('network'); };
  assert.equal(await resolveMap3dTarget({ ...base, origin: 'http://127.0.0.1:5500', fetchFn: offline }),
    'https://pkuidv.com/tactical-friend/3d/h55_hospital2.html');
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
