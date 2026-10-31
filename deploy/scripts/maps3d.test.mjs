import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import test from 'node:test';
import { prepareMaps, runtimeFiles } from './maps3d.mjs';
import { emitAsset } from './asset-snapshot.mjs';
import { loadingFixture } from './maps3d-fixture.mjs';

test('3D packaging preserves bytes and compression, versions changed content, and rejects extra or linked files', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pil-3d-'));
  const source = join(temp, 'source'), output = join(temp, 'output'), maps = join(source, 'maps-3d');
  try {
    await mkdir(maps, { recursive: true });
    for (const name of runtimeFiles) await writeFile(join(maps, name), name === '__release.json' ? JSON.stringify({ source_commit: 'a'.repeat(40) }) : 'fixture ' + name);
    const first = await prepareMaps(source, output, 'b'.repeat(40));
    assert.equal(first.entry_mode, 'stable');
    await assert.rejects(readFile(join(output, '3d/index.html')), { code: 'ENOENT' }, 'do not package client redirects to version URLs');
    const second = await prepareMaps(source, output, 'c'.repeat(40));
    assert.equal(first.asset_version, second.asset_version, 'unrelated commits retain the asset version');
    for (const name of runtimeFiles) {
      const data = await readFile(join(maps, name));
      const base = join(output, '3d/releases', first.asset_version, name);
      assert.deepEqual(await readFile(base), data);
      assert.deepEqual(gunzipSync(await readFile(base + '.gz')), data);
      assert.deepEqual(brotliDecompressSync(await readFile(base + '.br')), data);
      assert.equal(createHash('sha256').update(data).digest('hex'), first.files[name]);
    }
    await writeFile(join(maps, 'index.html'), 'changed');
    assert.notEqual((await prepareMaps(source, output, 'd'.repeat(40))).asset_version, first.asset_version);
    await writeFile(join(maps, 'private.py'), 'private fixture');
    await assert.rejects(prepareMaps(source, output, 'd'.repeat(40)), /Unexpected/);
    await rm(join(maps, 'private.py'));
    await rm(join(maps, 'camera-controls.js'));
    await symlink(join(maps, 'index.html'), join(maps, 'camera-controls.js'));
    await assert.rejects(prepareMaps(source, output, 'd'.repeat(40)), /Invalid 3D asset/);
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('loading runtime inventory is byte-bound before publication and rebound after immutable dependency rewriting', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pil-loading-maps-'));
  const source = join(temp, 'source'), output = join(temp, 'output'), maps = join(source, 'maps-3d');
  try {
    const fixture = await loadingFixture(maps), urls = {};
    urls['telemetry/maps.js'] = (await emitAsset(output, 'telemetry/maps.js', Buffer.from('/* analytics fixture */'))).url;
    for (const [name, data] of Object.entries(fixture.files)) if (!name.endsWith('.html')) urls['3d/' + name] = (await emitAsset(output, '3d/' + name, Buffer.from(data))).url;
    const release = await prepareMaps(source, output, 'b'.repeat(40), urls);
    assert.equal(Object.keys(release.files).length, 18);
    assert.equal(Object.keys(release.asset_urls).length, 18);
    assert.equal(Object.keys(release.full_files).length, 31);
    assert.equal(Object.keys(release.full_asset_urls).length, 31);
    const repeated = await prepareMaps(source, output, 'c'.repeat(40), urls);
    assert.equal(repeated.full_asset_version, release.full_asset_version);
    assert.deepEqual(repeated.full_asset_urls, release.full_asset_urls, 'commit-only changes keep all runtime URLs');
    for (const [scene, original] of Object.entries(fixture.bindings)) {
      const shell = await readFile(join(output, release.asset_urls[scene + '.html']), 'utf8');
      const config = JSON.parse(shell.match(/id="pil-loading-config" type="application\/json">(.*?)<\/script>/s)[1]);
      const name = scene + '.runtime-' + config.sha256.slice(0, 16) + '.html';
      const runtime = await readFile(join(output, release.full_asset_urls[name]));
      assert.equal(runtime.length, config.bytes);
      assert.equal(createHash('sha256').update(runtime).digest('hex'), config.sha256);
      assert.equal(config.entryName, scene + '.html');
      assert.equal(config.runtime, '/tactical-friend/' + release.full_asset_urls[name]);
      assert.equal(release.runtime_urls[scene], release.full_asset_urls[name]);
      assert.notEqual(name, original.name, 'rewritten dependency bytes require a new runtime name and binding');
      assert.ok(runtime.includes(Buffer.from('/tactical-friend/_assets/')));
      assert.ok(!shell.includes('src="./loading.js"'));
      assert.ok(!shell.includes('/telemetry/maps.js'), 'shells must not count a second page view');
      assert.equal(runtime.toString().split('/telemetry/maps.js').length - 1, 1);
      assert.ok(runtime.includes(Buffer.from('data-pil-optional="telemetry"')));
    }
    await loadingFixture(maps, { changedScene: 'ordnance_factory1' });
    await rm(join(maps, fixture.bindings.ordnance_factory1.name));
    const changed = await prepareMaps(source, output, 'c'.repeat(40), urls);
    assert.notEqual(changed.asset_version, release.asset_version);
    assert.notEqual(changed.full_asset_version, release.full_asset_version);
    assert.notEqual(changed.runtime_urls.ordnance_factory1, release.runtime_urls.ordnance_factory1);
    for (const scene of Object.keys(fixture.bindings).filter(scene => scene !== 'ordnance_factory1')) {
      assert.equal(changed.runtime_urls[scene], release.runtime_urls[scene], 'unrelated runtime remains cached: ' + scene);
      assert.equal(changed.asset_urls[scene + '.html'], release.asset_urls[scene + '.html'], 'unrelated shell remains cached: ' + scene);
    }
    await rm(maps, { recursive: true });
    await loadingFixture(maps);
    const bad = fixture.bindings.ordnance_factory1;
    await writeFile(join(maps, bad.name), fixture.files[bad.name] + 'corrupt');
    await assert.rejects(prepareMaps(source, output, 'c'.repeat(40), urls), /binding|checksum|length/i);
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('changing one map only changes that map URL; unchanged maps and helpers retain their URLs', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pil-map-granularity-'));
  const source = join(temp, 'source'), output = join(temp, 'output'), maps = join(source, 'maps-3d');
  try {
    await mkdir(maps, { recursive: true });
    const urls = {};
    urls['telemetry/maps.js'] = (await emitAsset(output, 'telemetry/maps.js', Buffer.from('/* analytics fixture */'))).url;
    for (const name of runtimeFiles) {
      const data = Buffer.from(name === '__release.json' ? JSON.stringify({ source_commit: 'a'.repeat(40) }) : 'fixture ' + name);
      await writeFile(join(maps, name), data);
      if (!name.endsWith('.html')) urls['3d/' + name] = (await emitAsset(output, '3d/' + name, data)).url;
    }
    const first = await prepareMaps(source, output, 'a'.repeat(40), urls);
    const second = await prepareMaps(source, output, 'b'.repeat(40), urls);
    assert.deepEqual(first.asset_urls, second.asset_urls, 'commits do not version unchanged map bytes');
    await writeFile(join(maps, 'ordnance_factory1.html'), 'changed map geometry');
    const changed = await prepareMaps(source, output, 'b'.repeat(40), urls);
    assert.deepEqual(runtimeFiles.filter(name => first.asset_urls[name] !== changed.asset_urls[name]), ['ordnance_factory1.html']);
  } finally { await rm(temp, { recursive: true, force: true }); }
});
