import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { cacheClass, digest, filesIn, policy, policyVersion } from './asset-policy.mjs';
import { inspectMapInventory, loadingHelpers, runtimeFiles, scenes } from './maps3d-inventory.mjs';

export async function verifyPackage(output) {
  const manifest = JSON.parse(await readFile(join(output, 'asset-manifest.json')));
  const metadata = JSON.parse(await readFile(join(output, '__release.json')));
  assert.equal(manifest.policy_version, policyVersion);
  assert.equal(manifest.source_commit, metadata.source_commit);
  assert.equal(manifest.asset_version, metadata.asset_version);
  assert.equal(digest(JSON.stringify({ policy: policyVersion, files: metadata.asset_files })), metadata.asset_version);
  const disk = await filesIn(output);
  assert.deepEqual(disk.sort(), [...Object.keys(manifest.files), 'asset-manifest.json'].flatMap(n => [n, n + '.gz', n + '.br']).sort(), 'Unexpected files or missing compression variants');
  assert.deepEqual(disk.filter(n => !/\.(gz|br)$/.test(n) && n !== 'asset-manifest.json').sort(), Object.keys(manifest.files).sort());
  let rawBytes = 0, gzipBytes = 0, brotliBytes = 0;
  for (const [name, row] of Object.entries(manifest.files)) {
    const bytes = await readFile(join(output, name));
    assert.equal(digest(bytes), row.sha256, name + ': content hash');
    assert.equal(bytes.length, row.bytes);
    assert.equal(row.cache, cacheClass(name));
    rawBytes += bytes.length;
    for (const [encoding, decompress] of [['gz', gunzipSync], ['br', brotliDecompressSync]]) {
      const compressed = await readFile(join(output, name + '.' + encoding));
      assert.equal(digest(compressed), row.encodings[encoding].sha256, name + ': sidecar hash');
      assert.equal(compressed.length, row.encodings[encoding].bytes);
      assert.equal(digest(decompress(compressed)), row.sha256, name + ': compression round trip');
      if (encoding === 'gz') gzipBytes += compressed.length; else brotliBytes += compressed.length;
    }
  }
  for (const [name, hash] of Object.entries(metadata.asset_files)) assert.equal(manifest.files[metadata.asset_urls[name]].sha256, hash);
  const entry = await readFile(join(output, 'index.html'), 'utf8');
  assert.ok(entry.includes('id="pil-assets"'));
  const imports = JSON.parse(entry.match(/<script type="importmap">(.*?)<\/script>/s)[1]).imports;
  for (const [key, url] of Object.entries(imports)) {
    assert.equal(url, './' + metadata.asset_urls[key.slice(2)]);
    assert.ok(manifest.files[url.slice(2)], 'Missing import: ' + url);
  }
  for (const match of entry.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
    const url = match[1];
    if (/^(?:https?:|data:|#|\/)/.test(url)) continue;
    if (/\.(js|css)(?:[?#]|$)/.test(url)) assert.ok(/^\.\/_assets\/[a-f0-9]{64}\//.test(url), 'Unversioned HTML dependency: ' + url);
  }
  if (metadata.maps3d_version) {
    const maps = JSON.parse(await readFile(join(output, '3d/__release.json')));
    assert.deepEqual(Object.keys(maps.files).sort(), runtimeFiles);
    assert.deepEqual(Object.keys(maps.asset_urls).sort(), runtimeFiles);
    assert.equal(maps.asset_version, metadata.maps3d_version);
    assert.equal(digest(JSON.stringify(maps.files)), maps.asset_version);
    const loading = maps.loading_progress === 1;
    const files = loading ? maps.full_files : maps.files, urls = loading ? maps.full_asset_urls : maps.asset_urls;
    assert.ok(files && urls, 'Missing complete 3D inventory');
    assert.deepEqual(Object.keys(files).sort(), Object.keys(urls).sort());
    assert.deepEqual(Object.keys(metadata.asset_files).filter(name => name.startsWith('3d/')).sort(), Object.keys(files).map(name => '3d/' + name).sort());
    if (loading) {
      assert.equal(Object.keys(files).length, 31);
      assert.equal(digest(JSON.stringify(files)), maps.full_asset_version);
      assert.deepEqual(Object.keys(maps.runtime_urls).sort(), scenes);
    } else {
      for (const key of ['full_files', 'full_asset_urls', 'full_asset_version', 'runtime_urls']) assert.ok(!(key in maps), 'Unexpected partial loading inventory: ' + key);
    }
    for (const name of runtimeFiles) {
      assert.equal(maps.files[name], files[name], 'Stable entry hash differs from complete inventory: ' + name);
      assert.equal(maps.asset_urls[name], urls[name], 'Stable entry URL differs from complete inventory: ' + name);
    }
    const base = policy.canonicalPrefix + '/';
    for (const [name, hash] of Object.entries(files)) {
      const path = urls[name];
      assert.equal(path, policy.immutableDirectory + '/' + digest(policyVersion + ':' + hash) + '/3d/' + name, 'Invalid immutable 3D identity: ' + name);
      assert.equal(metadata.asset_files['3d/' + name], hash, '3D asset missing from global inventory: ' + name);
      assert.equal(metadata.asset_urls['3d/' + name], path, '3D URL missing from global inventory: ' + name);
      assert.equal(manifest.files[path].sha256, hash);
      if (!name.endsWith('.html')) continue;
      const html = await readFile(join(output, path), 'utf8');
      const shell = loading && scenes.some(scene => name === scene + '.html');
      const tracker = base + metadata.asset_urls['telemetry/maps.js'];
      assert.equal(html.split(tracker).length - 1, shell ? 0 : 1, '3D pageview tracker must run exactly once after loading: ' + name);
      if (!shell) assert.ok(html.includes('data-pil-optional="telemetry" src="' + tracker + '"'), '3D telemetry must be explicitly optional: ' + name);
      assert.ok(!/\.\/(camera-controls\.js|roaming-controller\.js|pil-handoff\.(js|css)|loading(?:-stage)?\.js|loading\.css)/.test(html), 'Unversioned 3D dependency: ' + name);
      const mapText = html.match(/<script type="importmap">(.*?)<\/script>/s)?.[1];
      if (mapText) {
        const map = JSON.parse(mapText);
        const targets = [...Object.values(map.imports), ...Object.values(map.scopes || {}).flatMap(scope => Object.values(scope))];
        for (const url of targets) if (url.startsWith(base + policy.immutableDirectory + '/')) assert.ok(manifest.files[url.slice(base.length)], 'Missing 3D dependency: ' + url);
      }
    }
    const inventory = await inspectMapInventory(Object.keys(files), name => readFile(join(output, urls[name])), loading ? urls : null);
    assert.equal(inventory.loading, loading);
    if (loading) {
      for (const scene of scenes) assert.equal(maps.runtime_urls[scene], urls[inventory.bindings[scene].name]);
      for (const name of loadingHelpers) assert.ok(files[name] && urls[name], 'Missing loading helper: ' + name);
    }
  }
  const report = { files: Object.keys(manifest.files).length, rawBytes, gzipBytes, brotliBytes, asset_version: metadata.asset_version, policy_version: policyVersion };
  return report;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verifyPackage(fileURLToPath(new URL('../dist/', import.meta.url)))));
