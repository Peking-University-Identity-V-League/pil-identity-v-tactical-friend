import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { compressFile, digest, filesIn, policyVersion, writeManifest } from './asset-policy.mjs';
import { snapshotAssets } from './asset-snapshot.mjs';
import { loadingFixture } from './maps3d-fixture.mjs';
import { prepareMaps } from './maps3d.mjs';
import { verifyPackage } from './verify-package.mjs';

test('complete loading package binds all 31 assets, retains 18 stable entries and rejects inconsistent extended metadata', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'pil-loading-package-')), source = join(temp, 'source'), output = join(temp, 'output');
  try {
    await loadingFixture(join(source, 'maps-3d'));
    await mkdir(join(output, 'telemetry'), { recursive: true });
    await writeFile(join(output, 'telemetry/maps.js'), '/* tracker fixture */');
    await writeFile(join(output, 'index.html'), '<html><head></head><body>fixture</body></html>');
    const commit = 'b'.repeat(40), snapshot = await snapshotAssets(source, output, commit, true);
    const maps = await prepareMaps(source, output, commit, snapshot.asset_urls);
    const metadata = { source_commit: commit, ...snapshot, maps3d_version: maps.asset_version };
    for (const [name, hash] of Object.entries(maps.full_files)) {
      metadata.asset_files['3d/' + name] = hash;
      metadata.asset_urls['3d/' + name] = maps.full_asset_urls[name];
    }
    metadata.asset_files = Object.fromEntries(Object.entries(metadata.asset_files).sort(([a], [b]) => a < b ? -1 : 1));
    metadata.asset_urls = Object.fromEntries(Object.entries(metadata.asset_urls).sort(([a], [b]) => a < b ? -1 : 1));
    metadata.asset_version = digest(JSON.stringify({ policy: policyVersion, files: metadata.asset_files }));
    await writeFile(join(output, '__release.json'), JSON.stringify(metadata));
    for (const name of await filesIn(output)) await compressFile(join(output, name));
    await writeManifest(output, metadata);
    const result = await verifyPackage(output);
    assert.ok(result.files > 31);
    assert.equal(Object.keys(metadata.asset_files).filter(name => name.startsWith('3d/')).length, 31);
    assert.equal(Object.keys(maps.files).length, 18);
    const original = await readFile(join(output, '3d/__release.json'));
    for (const mutate of [
      value => { delete value.full_files['loading.js']; },
      value => { value.runtime_urls.h55_demo = value.runtime_urls.h55_demo2; },
      value => { value.files['h55_demo.html'] = '0'.repeat(64); value.asset_version = digest(JSON.stringify(value.files)); },
      value => { value.full_asset_version = '0'.repeat(64); },
    ]) {
      const changed = JSON.parse(original); mutate(changed);
      await writeFile(join(output, '3d/__release.json'), JSON.stringify(changed));
      await compressFile(join(output, '3d/__release.json'));
      await writeManifest(output, metadata);
      await assert.rejects(verifyPackage(output));
    }
  } finally { await rm(temp, { recursive: true, force: true }); }
});
