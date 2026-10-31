import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { compressFile, digest, policy } from './asset-policy.mjs';
import { emitAsset } from './asset-snapshot.mjs';
import { importMapForAssets } from './client-assets.mjs';
import { inspectMapInventory, legacyHelpers, loadingHelpers, maxMapBytes, replaceJsonScript, runtimeFiles, scenes } from './maps3d-inventory.mjs';

export { runtimeFiles, scenes };
const sorted = object => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a < b ? -1 : 1));

export async function prepareMaps(source, output, commit, assetURLs) {
  const root = join(source, 'maps-3d');
  const folder = await lstat(root);
  if (!folder.isDirectory() || folder.isSymbolicLink()) throw new Error('Invalid 3D runtime directory');
  const entries = await readdir(root);
  for (const name of entries) {
    const info = await lstat(join(root, name));
    if (!info.isFile() || info.isSymbolicLink() || info.size > maxMapBytes) throw new Error('Invalid 3D asset: ' + name);
  }
  const names = entries.filter(n => !['README.md', 'THIRD_PARTY_NOTICES.md'].includes(n)).sort(), allowed = new Set(names);
  const read = name => {
    if (!allowed.has(name)) throw Error('Unexpected or missing 3D runtime file: ' + name);
    return readFile(join(root, name));
  };
  const inventory = await inspectMapInventory(names, read);
  if (inventory.loading && !assetURLs) throw Error('Loading runtimes require per-file asset publication');
  const hashes = {}, urls = {}, own = {};
  let bytes = 0;
  async function emit(name, data) {
    bytes += data.length;
    if (data.length > maxMapBytes) throw Error('Invalid 3D asset size: ' + name);
    if (bytes > 600 * 1024 * 1024) throw Error('3D runtime budget exceeded');
    hashes[name] = digest(data);
    if (assetURLs) urls[name] = (await emitAsset(output, '3d/' + name, data)).url;
  }
  function rewriteHTML(data, track = true) {
    const tracker = assetURLs['telemetry/maps.js'];
    if (!/^_assets\/[a-f0-9]{64}\/telemetry\/maps\.js$/.test(tracker || '')) throw Error('Missing versioned 3D telemetry');
    // Stable page addresses stay readable; every auxiliary dependency lives in
    // the content-addressed asset registry. Absolute asset URLs
    // also work when inspecting a historical version-directory page.
    const base = policy.canonicalPrefix + '/';
    let html = data.toString('utf8').replace(/\.\/(board-calibration\.json|camera-controls\.js|handoff-protocol\.js|pil-handoff\.css|pil-handoff\.js|roaming-controller\.js|loading(?:-stage)?\.js|loading\.css)/g,
      (_, file) => {
        if (!own['3d/' + file]) throw Error('Missing versioned 3D helper: ' + file);
        return base + own['3d/' + file];
      });
    if (html.includes('type="importmap"')) {
      html = html.replace(/(<script type="importmap">)(.*?)(<\/script>)/s, (_, open, json, close) => {
        const original = JSON.parse(json), generated = importMapForAssets(own, base);
        return open + JSON.stringify({ ...original, imports: { ...original.imports, ...generated.imports }, scopes: { ...original.scopes, ...generated.scopes } }).replace(/</g, '\\u003c') + close;
      });
      html = html.replace('<script type="importmap">', '<script type="application/json" id="pil-assets">' + JSON.stringify(Object.fromEntries(Object.entries(own).map(([key, value]) => [key, base + value]))) + '</script>\n<script type="importmap">');
    }
    if (track) {
      const telemetry = '<script async data-pil-optional="telemetry" src="' + base + tracker + '"></script>';
      const charset = /<meta\b[^>]*charset[^>]*>/i;
      html = charset.test(html) ? html.replace(charset, value => value + '\n' + telemetry) : telemetry + '\n' + html;
    }
    return Buffer.from(html);
  }
  if (assetURLs) {
    for (const name of [...legacyHelpers, ...(inventory.loading ? loadingHelpers : [])]) {
      await emit(name, await read(name));
      if (assetURLs['3d/' + name] !== urls[name]) throw Error('Invalid versioned 3D helper: ' + name);
      own['3d/' + name] = urls[name];
    }
  }
  const runtimeURLs = {};
  if (inventory.loading) {
    // Bind the received bytes first, then bind the final bytes after dependency
    // rewriting and telemetry injection. The shell downloads exactly that file.
    for (const scene of scenes) {
      const data = rewriteHTML(await read(inventory.bindings[scene].name));
      const checksum = digest(data), name = scene + '.runtime-' + checksum.slice(0, 16) + '.html';
      await emit(name, data);
      runtimeURLs[scene] = urls[name];
      const shell = rewriteHTML(await read(scene + '.html'), false).toString('utf8');
      await emit(scene + '.html', Buffer.from(replaceJsonScript(shell, 'pil-loading-config', {
        runtime: policy.canonicalPrefix + '/' + urls[name], entryName: scene + '.html', bytes: data.length, sha256: checksum,
      })));
    }
    for (const name of ['__release.json', 'index.html']) await emit(name, name.endsWith('.html') ? rewriteHTML(await read(name)) : await read(name));
    await inspectMapInventory(Object.keys(hashes), name => readFile(join(output, urls[name])), urls);
  } else {
    for (const name of names) {
      if (hashes[name]) continue;
      const data = await read(name);
      await emit(name, assetURLs && name.endsWith('.html') ? rewriteHTML(data) : data);
    }
  }
  const allHashes = sorted(hashes), allURLs = sorted(urls);
  // The stable entry view remains the existing 18-file receiver contract. All
  // 31 loading assets are also explicit generic client assets, never omitted.
  const files = Object.fromEntries(runtimeFiles.map(name => [name, allHashes[name]]));
  const version = digest(JSON.stringify(files));
  if (assetURLs) {
    const metadata = { component: 'maps-3d', entry_mode: 'stable', asset_format: 'per-file', source_commit: commit, runtime_source_commit: inventory.release.source_commit, asset_version: version, map_count: scenes.length, files, asset_urls: Object.fromEntries(runtimeFiles.map(name => [name, allURLs[name]])) };
    if (inventory.loading) Object.assign(metadata, { loading_progress: 1, full_files: allHashes, full_asset_urls: allURLs, full_asset_version: digest(JSON.stringify(allHashes)), runtime_urls: runtimeURLs });
    await mkdir(join(output, '3d'), { recursive: true });
    await writeFile(join(output, '3d/__release.json'), JSON.stringify(metadata) + '\n');
    return metadata;
  }
  const versionDir = join(output, '3d', 'releases', version);
  await mkdir(versionDir, { recursive: true });
  for (const name of runtimeFiles) {
    const data = await read(name);
    await writeFile(join(versionDir, name), data);
    await compressFile(join(versionDir, name));
  }
  const metadata = { component: 'maps-3d', entry_mode: 'stable', source_commit: commit, runtime_source_commit: inventory.release.source_commit, asset_version: version, map_count: scenes.length, files };
  await writeFile(join(output, '3d', '__release.json'), JSON.stringify(metadata) + '\n');
  return metadata;
}
