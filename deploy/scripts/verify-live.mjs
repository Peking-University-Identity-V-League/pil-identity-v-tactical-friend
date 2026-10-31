import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { readFile } from 'node:fs/promises';
import { digest, policy } from './asset-policy.mjs';
import { jsonScript, loadingHelpers, scenes } from './maps3d-inventory.mjs';

const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const expected = JSON.parse(await readFile(new URL('../dist/__release.json', import.meta.url)));
const manifest = JSON.parse(await readFile(new URL('../dist/asset-manifest.json', import.meta.url)));
const maps = JSON.parse(await readFile(new URL('../dist/3d/__release.json', import.meta.url)));
async function request(path, options = {}) {
  const response = await fetch('https://pkuidv.com' + path, { redirect: 'error', signal: AbortSignal.timeout(20000), ...options });
  assert.ok(response.ok, path + ': HTTP ' + response.status);
  assert.equal(response.headers.get('x-pil-asset-policy'), expected.policy_version, 'Server policy drift: ' + path);
  return response;
}
async function verify() {
  for (const prefix of policy.prefixes) {
    const release = await request(prefix + '/__release.json');
    assert.equal(release.headers.get('cache-control'), policy.cache.metadata);
    const metadata = await release.json();
    assert.equal(metadata.source_commit, commit);
    assert.equal(metadata.asset_version, expected.asset_version);
    assert.equal(metadata.maps3d_version, expected.maps3d_version);
    assert.equal(metadata.policy_version, expected.policy_version);
    const publicManifest = await (await request(prefix + '/asset-manifest.json')).json();
    assert.deepEqual(publicManifest, manifest);
    const publicMaps = await (await request(prefix + '/3d/__release.json')).json();
    assert.deepEqual(publicMaps, maps, '3D release inventory differs: ' + prefix);
    const entry = await request(prefix + '/');
    assert.equal(entry.headers.get('cache-control'), policy.cache.entry);
    const html = await entry.text();
    assert.ok(html.includes('name="pil-client-revision" content="' + commit + '"'));
    assert.ok(html.includes('id="pil-assets"'));
    assert.ok(html.includes('homeMapGrid') && html.includes('umami.pkuidv.com/script.js'));
    for (const [name, row] of Object.entries(manifest.files)) {
      const response = await request(prefix + '/' + name, { method: 'HEAD' });
      assert.equal(response.headers.get('cache-control'), policy.cache[row.cache], 'Cache policy: ' + name);
    }
    for (const name of Object.keys(maps.files).filter(n => n.endsWith('.html'))) {
      const response = await request(prefix + '/3d/' + name, { method: 'HEAD' });
      assert.equal(response.headers.get('cache-control'), policy.cache.entry);
      assert.ok(response.headers.get('content-security-policy')?.includes('https://umami.pkuidv.com'), '3D telemetry is blocked by CSP: ' + name);
      // Cloudflare can omit ETag on transformed HTML. Browsers then revalidate
      // using Last-Modified; both must avoid transferring an unchanged map.
      const etag = response.headers.get('etag');
      const modified = response.headers.get('last-modified');
      assert.ok(etag || modified, 'Missing map cache validator: ' + name);
      const conditional = await fetch('https://pkuidv.com' + prefix + '/3d/' + name, {
        method: 'HEAD', signal: AbortSignal.timeout(20000), redirect: 'error',
        headers: etag ? { 'If-None-Match': etag } : { 'If-Modified-Since': modified },
      });
      assert.equal(conditional.status, 304, 'Unchanged map must revalidate: ' + name);
    }
    if (maps.loading_progress === 1) {
      // Check each small stable shell against the already verified package's
      // complete runtime inventory, without downloading every large model.
      for (const scene of scenes) {
        const html = Buffer.from(await (await request(prefix + '/3d/' + scene + '.html')).arrayBuffer());
        assert.equal(digest(html), maps.files[scene + '.html'], 'Published loading shell differs: ' + scene);
        const config = jsonScript(html.toString('utf8'), 'pil-loading-config');
        const runtime = maps.runtime_urls[scene];
        assert.equal(config.entryName, scene + '.html');
        assert.equal(config.runtime, policy.canonicalPrefix + '/' + runtime);
        assert.equal(config.sha256, manifest.files[runtime].sha256);
        assert.equal(config.bytes, manifest.files[runtime].bytes);
      }
    }
    for (const suffix of ['js/bootstrap.js', 'js/core/map-handoff.js', 'css/style.css', 'locales/zh-CN.json', '3d/pil-handoff.js', '3d/board-calibration.json', 'telemetry/maps.js', 'telemetry/privacy.js', ...(maps.loading_progress === 1 ? loadingHelpers.map(name => '3d/' + name) : [])]) {
      const name = expected.asset_urls[suffix];
      for (const encoding of ['gzip', 'br']) {
        const response = await request(prefix + '/' + name, { headers: { 'Accept-Encoding': encoding } });
        assert.equal(response.headers.get('content-encoding'), encoding, 'Encoding: ' + name);
        assert.equal(digest(Buffer.from(await response.arrayBuffer())), manifest.files[name].sha256, 'Decoded response: ' + name);
      }
    }
    const missing = await fetch('https://pkuidv.com' + prefix + '/' + expected.asset_urls['js/bootstrap.js'] + '.missing.js');
    assert.equal(missing.status, 404);
    assert.ok(!missing.headers.get('cache-control')?.includes('immutable'));
  }
}
for (let attempt = 1; attempt <= 4; attempt++) {
  try { await verify(); console.log('Verified both public entries, full asset inventory, immutable cache policy, and gzip/Brotli delivery.'); break; }
  catch (error) { if (attempt === 4) throw error; console.log('Public verification retry ' + attempt + '/4: ' + error.message); await setTimeout(5000); }
}
