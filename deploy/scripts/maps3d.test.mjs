import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import test from 'node:test';
import { prepareMaps, runtimeFiles } from './maps3d.mjs';
import { emitAsset } from './asset-snapshot.mjs';

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

test('changing one map only changes that map URL; unchanged maps and helpers retain their URLs', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pil-map-granularity-'));
  const source = join(temp, 'source'), output = join(temp, 'output'), maps = join(source, 'maps-3d');
  try {
    await mkdir(maps, { recursive: true });
    const urls = {};
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
