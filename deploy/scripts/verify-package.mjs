import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { cacheClass, digest, filesIn, policyVersion } from './asset-policy.mjs';

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
    for (const [name, hash] of Object.entries(maps.files)) {
      const path = maps.asset_urls[name];
      assert.equal(manifest.files[path].sha256, hash);
      if (!name.endsWith('.html')) continue;
      const html = await readFile(join(output, path), 'utf8');
      assert.ok(html.includes('/tactical-friend/' + metadata.asset_urls['telemetry/maps.js']), 'Missing 3D pageview tracker: ' + name);
      assert.ok(!/\.\/(camera-controls\.js|roaming-controller\.js|pil-handoff\.(js|css))/.test(html), 'Unversioned 3D dependency: ' + name);
      const mapText = html.match(/<script type="importmap">(.*?)<\/script>/s)?.[1];
      if (mapText) {
        const map = JSON.parse(mapText);
        const targets = [...Object.values(map.imports), ...Object.values(map.scopes || {}).flatMap(scope => Object.values(scope))];
        for (const url of targets) if (url.startsWith('/tactical-friend/_assets/')) assert.ok(manifest.files[url.slice('/tactical-friend/'.length)], 'Missing 3D dependency: ' + url);
      }
    }
  }
  const report = { files: Object.keys(manifest.files).length, rawBytes, gzipBytes, brotliBytes, asset_version: metadata.asset_version, policy_version: policyVersion };
  return report;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verifyPackage(fileURLToPath(new URL('../dist/', import.meta.url)))));
