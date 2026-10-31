import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { digest } from './asset-policy.mjs';
import { emitAsset } from './asset-snapshot.mjs';
import { loadingFixture } from './maps3d-fixture.mjs';
import { jsonScript, replaceJsonScript } from './maps3d-inventory.mjs';
import { prepareMaps } from './maps3d.mjs';

const scene = 'h55_deadforest_sp';
function changeConfig(files, update) {
  const name = scene + '.html', config = jsonScript(files[name], 'pil-loading-config');
  files[name] = replaceJsonScript(files[name], 'pil-loading-config', update(config));
}
function changeRuntime(files, update) {
  const config = jsonScript(files[scene + '.html'], 'pil-loading-config'), old = config.runtime.slice(2);
  const bytes = update(files[old]), sha256 = digest(bytes), name = scene + '.runtime-' + sha256.slice(0, 16) + '.html';
  delete files[old]; files[name] = bytes;
  changeConfig(files, config => ({ ...config, runtime: './' + name, bytes: Buffer.byteLength(bytes), sha256 }));
}

test('loading source rejects incomplete inventories and malformed scene, hash, worker and path bindings', async t => {
  const cases = [
    ['extra source', files => { files['private.py'] = 'private source'; }, /Unexpected/],
    ['missing helper', files => { delete files['loading-stage.js']; }, /ENOENT|missing/],
    ['missing runtime', files => { delete files[jsonScript(files[scene + '.html'], 'pil-loading-config').runtime.slice(2)]; }, /missing/],
    ['wrong length', files => changeConfig(files, config => ({ ...config, bytes: config.bytes + 1 })), /checksum|length/],
    ['wrong hash', files => changeConfig(files, config => ({ ...config, sha256: '0'.repeat(64) })), /binding path|missing/],
    ['cross-scene entry', files => changeConfig(files, config => ({ ...config, entryName: 'h55_demo.html' })), /binding/],
    ['relative traversal', files => changeConfig(files, config => ({ ...config, runtime: '../' + config.runtime.slice(2) })), /binding path/],
    ['absolute external', files => changeConfig(files, config => ({ ...config, runtime: 'https://example.org/' + config.runtime.slice(2) })), /binding path/],
    ['unknown config key', files => changeConfig(files, config => ({ ...config, canonicalEntry: './' + scene + '.html' })), /binding/],
    ['duplicate JSON ID', files => { files[scene + '.html'] += "<script id='pil-loading-config'>{}</script>"; }, /JSON block/],
    ['non-ID attribute', files => { files[scene + '.html'] = files[scene + '.html'].replace('id="pil-loading-config"', 'data-id="pil-loading-config"'); }, /JSON block/],
    ['quoted attribute ID text', files => { files[scene + '.html'] = files[scene + '.html'].replace('id="pil-loading-config"', 'data-note=" id=\'pil-loading-config\'"'); }, /JSON block/],
    ['quoted angle bracket', files => { files[scene + '.html'] = files[scene + '.html'].replace('id="pil-loading-config"', 'data-note=" > id=\'pil-loading-config\'"'); }, /JSON block/],
    ['entity duplicate ID', files => { files[scene + '.html'] += '<script id="pil-loading&#45;config">{}</script>'; }, /JSON block/],
    ['duplicate ID attributes', files => { files[scene + '.html'] = files[scene + '.html'].replace('id="pil-loading-config"', 'id="other" id="pil-loading-config"'); }, /JSON block/],
    ['wrong data type', files => { files[scene + '.html'] = files[scene + '.html'].replace('type="application/json"', 'type="text/javascript"'); }, /JSON block/],
    ['commented data block', files => { files[scene + '.html'] = '<!--' + files[scene + '.html'] + '-->'; }, /JSON block/],
    ['wrong map info', files => changeRuntime(files, html => replaceJsonScript(html, 'map-info', { mapId: 'h55_demo' })), /scene mismatch/],
    ['different worker', files => changeRuntime(files, html => replaceJsonScript(html, 'worker-source', { base64: Buffer.from('different worker').toString('base64') })), /worker checksum/],
    ['invalid worker encoding', files => changeRuntime(files, html => replaceJsonScript(html, 'worker-source', { base64: '@@' })), /worker checksum/],
  ];
  for (const [label, mutate, expected] of cases) await t.test(label, async () => {
    const temp = await mkdtemp(join(tmpdir(), 'pil-map-invalid-')), maps = join(temp, 'source/maps-3d'), output = join(temp, 'output');
    try {
      const fixture = await loadingFixture(maps);
      mutate(fixture.files);
      await rm(maps, { recursive: true });
      await mkdir(maps);
      for (const [name, data] of Object.entries(fixture.files)) await writeFile(join(maps, name), data);
      const urls = { 'telemetry/maps.js': (await emitAsset(output, 'telemetry/maps.js', Buffer.from('tracker'))).url };
      for (const [name, data] of Object.entries(fixture.files)) if (!name.endsWith('.html')) urls['3d/' + name] = (await emitAsset(output, '3d/' + name, Buffer.from(data))).url;
      await assert.rejects(prepareMaps(join(temp, 'source'), output, 'b'.repeat(40), urls), expected);
    } finally { await rm(temp, { recursive: true, force: true }); }
  });
});

test('ignored documentation cannot smuggle a link into the 3D source tree', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pil-map-link-')), maps = join(temp, 'maps-3d');
  try {
    await loadingFixture(maps);
    await symlink(join(maps, 'index.html'), join(maps, 'README.md'));
    await assert.rejects(prepareMaps(temp, join(temp, 'output'), 'b'.repeat(40)), /Invalid 3D asset/);
  } finally { await rm(temp, { recursive: true, force: true }); }
});
