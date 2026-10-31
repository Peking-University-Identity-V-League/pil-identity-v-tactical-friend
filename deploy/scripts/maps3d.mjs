import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

export const scenes = ['h55_chinatown', 'h55_deadforest_sp', 'h55_demo', 'h55_demo2', 'h55_fishingvillage', 'h55_hospital2', 'h55_playground', 'h55_sleepingtown3', 'ordnance_factory1', 'ordnance_factory2'];
export const runtimeFiles = ['__release.json', 'board-calibration.json', 'camera-controls.js', 'handoff-protocol.js', 'index.html', 'pil-handoff.css', 'pil-handoff.js', 'roaming-controller.js', ...scenes.map(s => s + '.html')].sort();
const digest = data => createHash('sha256').update(data).digest('hex');

export function redirectPage(target) {
  if (!/^\/tactical-friend\/3d\/releases\/[a-f0-9]{64}\/[a-z0-9_.-]+\.html$/.test(target)) throw new Error('Invalid 3D redirect');
  return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>三维地图</title><script>location.replace(' + JSON.stringify(target) + ' + location.search + location.hash)</script><p><a href="' + target + '">打开三维地图</a></p></html>\n';
}

export async function prepareMaps(source, output, commit) {
  const root = join(source, 'maps-3d');
  const folder = await lstat(root);
  if (!folder.isDirectory() || folder.isSymbolicLink()) throw new Error('Invalid 3D runtime directory');
  const names = (await readdir(root)).filter(n => !['README.md', 'THIRD_PARTY_NOTICES.md'].includes(n)).sort();
  if (JSON.stringify(names) !== JSON.stringify(runtimeFiles)) throw new Error('Unexpected or missing 3D runtime files');
  const hashes = {};
  for (const name of runtimeFiles) {
    const info = await lstat(join(root, name));
    if (!info.isFile() || info.isSymbolicLink() || info.size > 80 * 1024 * 1024) throw new Error('Invalid 3D asset: ' + name);
    hashes[name] = digest(await readFile(join(root, name)));
  }
  const version = digest(JSON.stringify(hashes));
  const versionDir = join(output, '3d', 'releases', version);
  await mkdir(versionDir, { recursive: true });
  let bytes = 0;
  for (const name of runtimeFiles) {
    const data = await readFile(join(root, name));
    // Each map is already self contained; preserve its exact production bytes.
    await writeFile(join(versionDir, name), data);
    await writeFile(join(versionDir, name + '.gz'), gzipSync(data, { level: 6 }));
    await writeFile(join(versionDir, name + '.br'), brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }));
    bytes += data.length;
    if (bytes > 600 * 1024 * 1024) throw new Error('3D runtime budget exceeded');
    if (name.endsWith('.html')) await writeFile(join(output, '3d', name), redirectPage('/tactical-friend/3d/releases/' + version + '/' + name));
  }
  const original = JSON.parse(await readFile(join(root, '__release.json'), 'utf8'));
  const metadata = { component: 'maps-3d', source_commit: commit, runtime_source_commit: original.source_commit, asset_version: version, map_count: scenes.length, files: hashes };
  await writeFile(join(output, '3d', '__release.json'), JSON.stringify(metadata) + '\n');
  return metadata;
}
