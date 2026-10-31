import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { scenes } from './maps3d.mjs';

const source = await readFile(new URL('../telemetry/maps.js', import.meta.url), 'utf8');
const website = 'd8c95849-978e-48d7-ba4d-7a783397609b';
function client(pathname, hostname = 'pkuidv.com', dnt = '0') {
  let tracker;
  const context = { URL, location: { hostname, pathname, search: '?token=PRIVATE', hash: '#PRIVATE' }, navigator: { doNotTrack: dnt },
    document: { createElement: () => ({ setAttribute(key, value) { this[key] = value; } }), head: { append(value) { tracker = value; } } } };
  context.window = context;
  vm.runInNewContext(source, context);
  return { tracker, hook: context.pilMapsBeforeSend };
}

test('both map indexes and all ten scenes load a non-blocking tracker with a minimal pageview', () => {
  for (const prefix of ['tactical-friend', 'zhanshuyanlian']) {
    for (const scene of ['', 'index', ...scenes]) {
      const path = '/' + prefix + '/3d/' + (scene ? scene + '.html' : '');
      const { tracker, hook } = client(path);
      assert.equal(tracker.async, true);
      assert.equal(tracker['data-pil-optional'], 'telemetry');
      assert.equal(tracker['data-before-send'], 'pilMapsBeforeSend');
      const result = hook('event', { website, title: 'PRIVATE', id: 'PRIVATE', url: path + '?token=PRIVATE#PRIVATE',
        referrer: 'https://example.com/PRIVATE?token=PRIVATE', language: 'zh-CN', screen: '1440x900', data: { coordinates: 'PRIVATE' } });
      assert.equal(result.url, scene === 'index' ? '/' + prefix + '/3d/' : path);
      assert.equal(result.tag, 'tactical-3d');
      assert.equal(result.referrer, 'https://example.com');
      assert.doesNotMatch(JSON.stringify(result), /PRIVATE|coordinates|token/);
      assert.equal(hook('identify', { website }), false);
      assert.equal(hook('event', { website, name: 'arbitrary', data: { state: 'PRIVATE' } }), false);
    }
  }
});

test('DNT, development, unknown scenes and raw version URLs are excluded', () => {
  for (const args of [
    ['/tactical-friend/3d/', 'localhost'], ['/tactical-friend/3d/', 'pkuidv.com', '1'],
    ['/tactical-friend/3d/private.html'], ['/maps-3d/ordnance_factory1.html'],
    ['/tactical-friend/_assets/' + 'a'.repeat(64) + '/3d/ordnance_factory1.html'],
  ]) {
    const { tracker, hook } = client(...args);
    assert.equal(tracker, undefined);
    assert.equal(hook('event', { website }), false);
  }
});
