import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { compressFile, digest, policy } from './asset-policy.mjs';
import { emitAsset } from './asset-snapshot.mjs';
import { importMapForAssets } from './client-assets.mjs';

export const scenes = ['h55_chinatown', 'h55_deadforest_sp', 'h55_demo', 'h55_demo2', 'h55_fishingvillage', 'h55_hospital2', 'h55_playground', 'h55_sleepingtown3', 'ordnance_factory1', 'ordnance_factory2'];
export const runtimeFiles = ['__release.json', 'board-calibration.json', 'camera-controls.js', 'handoff-protocol.js', 'index.html', 'pil-handoff.css', 'pil-handoff.js', 'roaming-controller.js', ...scenes.map(s => s + '.html')].sort();

export async function prepareMaps(source, output, commit, assetURLs) {
  const root = join(source, 'maps-3d');
  const folder = await lstat(root);
  if (!folder.isDirectory() || folder.isSymbolicLink()) throw new Error('Invalid 3D runtime directory');
  const names = (await readdir(root)).filter(n => !['README.md', 'THIRD_PARTY_NOTICES.md'].includes(n)).sort();
  if (JSON.stringify(names) !== JSON.stringify(runtimeFiles)) throw new Error('Unexpected or missing 3D runtime files');
  const hashes = {};
  async function runtimeBytes(name) {
    const data = await readFile(join(root, name));
    if (!assetURLs || !name.endsWith('.html')) return data;
    const tracker = assetURLs['telemetry/maps.js'];
    if (!/^_assets\/[a-f0-9]{64}\/telemetry\/maps\.js$/.test(tracker || '')) throw Error('Missing versioned 3D telemetry');
    // Stable page addresses stay readable; every auxiliary dependency lives in
    // the content-addressed asset registry. Absolute asset URLs
    // also work when inspecting a historical version-directory page.
    const own = Object.fromEntries(Object.entries(assetURLs).filter(([path]) => path.startsWith('3d/')));
    const base = policy.canonicalPrefix + '/';
    let html = data.toString('utf8').replace(/\.\/(board-calibration\.json|camera-controls\.js|handoff-protocol\.js|pil-handoff\.css|pil-handoff\.js|roaming-controller\.js)/g,
      (_, file) => base + own['3d/' + file]);
    if (html.includes('type="importmap"')) {
      html = html.replace(/(<script type="importmap">)(.*?)(<\/script>)/s, (_, open, json, close) => {
        const original = JSON.parse(json), generated = importMapForAssets(own, base);
        return open + JSON.stringify({ ...original, imports: { ...original.imports, ...generated.imports }, scopes: { ...original.scopes, ...generated.scopes } }).replace(/</g, '\\u003c') + close;
      });
      html = html.replace('<script type="importmap">', '<script type="application/json" id="pil-assets">' + JSON.stringify(Object.fromEntries(Object.entries(own).map(([key, value]) => [key, base + value]))) + '</script>\n<script type="importmap">');
    }
    const telemetry = '<script async src="' + base + tracker + '"></script>';
    const charset = /<meta\b[^>]*charset[^>]*>/i;
    html = charset.test(html) ? html.replace(charset, value => value + '\n' + telemetry) : telemetry + '\n' + html;
    return Buffer.from(html);
  }
  for (const name of runtimeFiles) {
    const info = await lstat(join(root, name));
    if (!info.isFile() || info.isSymbolicLink() || info.size > 80 * 1024 * 1024) throw new Error('Invalid 3D asset: ' + name);
    hashes[name] = digest(await runtimeBytes(name));
  }
  const version = digest(JSON.stringify(hashes));
  if (assetURLs) {
    const urls = {};
    let bytes = 0;
    for (const name of runtimeFiles) {
      const data = await runtimeBytes(name);
      urls[name] = (await emitAsset(output, '3d/' + name, data)).url;
      bytes += data.length;
      if (bytes > 600 * 1024 * 1024) throw new Error('3D runtime budget exceeded');
    }
    const original = JSON.parse(await readFile(join(root, '__release.json'), 'utf8'));
    const metadata = { component: 'maps-3d', entry_mode: 'stable', asset_format: 'per-file', source_commit: commit, runtime_source_commit: original.source_commit, asset_version: version, map_count: scenes.length, files: hashes, asset_urls: urls };
    await mkdir(join(output, '3d'), { recursive: true });
    await writeFile(join(output, '3d/__release.json'), JSON.stringify(metadata) + '\n');
    return metadata;
  }
  const versionDir = join(output, '3d', 'releases', version);
  await mkdir(versionDir, { recursive: true });
  let bytes = 0;
  for (const name of runtimeFiles) {
    const data = await runtimeBytes(name);
    await writeFile(join(versionDir, name), data);
    await compressFile(join(versionDir, name));
    bytes += data.length;
    if (bytes > 600 * 1024 * 1024) throw new Error('3D runtime budget exceeded');
  }
  const original = JSON.parse(await readFile(join(root, '__release.json'), 'utf8'));
  const metadata = { component: 'maps-3d', entry_mode: 'stable', source_commit: commit, runtime_source_commit: original.source_commit, asset_version: version, map_count: scenes.length, files: hashes };
  await writeFile(join(output, '3d', '__release.json'), JSON.stringify(metadata) + '\n');
  return metadata;
}
