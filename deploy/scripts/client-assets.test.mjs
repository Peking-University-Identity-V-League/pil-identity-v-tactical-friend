import assert from 'node:assert/strict';
import test from 'node:test';
import { versionClientAssets } from './client-assets.mjs';

test('owned entries and all module URLs share a revision without changing external URLs', () => {
  const revision = 'a'.repeat(40);
  const html = versionClientAssets('<html><head><link href="css/style.css"><script type="module" src="js/bootstrap.js"></script><script src="https://example.org/external.js"></script></head></html>', ['css/style.css', 'js/bootstrap.js', 'js/core/map-handoff.js', 'telemetry/client.js'], revision);
  assert.match(html, new RegExp('src="js/bootstrap.js\\?v=' + revision + '"'));
  assert.ok(html.includes('href="css/style.css?v=' + revision + '"'));
  assert.ok(html.includes('src="https://example.org/external.js"'));
  assert.ok(html.indexOf('type="importmap"') < html.indexOf('type="module"'));
  const { imports } = JSON.parse(html.match(/<script type="importmap">(.*?)<\/script>/s)[1]);
  for (const prefix of ['tactical-friend', 'zhanshuyanlian']) {
    const base = 'https://pkuidv.com/' + prefix + '/';
    assert.equal(new URL(imports['./js/core/map-handoff.js'], base).href, base + 'js/core/map-handoff.js?v=' + revision);
    assert.equal(new URL(imports['./telemetry/client.js'], base).searchParams.get('v'), revision);
  }
});

test('invalid versions and existing import maps fail explicitly', () => {
  assert.throws(() => versionClientAssets('<head></head>', [], 'invalid'), /Invalid client revision/);
  assert.throws(() => versionClientAssets('<head><script type="importmap">{}</script></head>', [], 'a'.repeat(40)), /existing import map/);
});
