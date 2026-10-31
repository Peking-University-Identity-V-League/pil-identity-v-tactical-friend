import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { digest, filesIn, policy, policyVersion } from './asset-policy.mjs';
import { versionClientAssets } from './client-assets.mjs';

export async function emitAsset(output, name, bytes) {
  const hash = digest(bytes);
  const identity = digest(policyVersion + ':' + hash);
  const url = policy.immutableDirectory + '/' + identity + '/' + name;
  const target = join(output, url);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return { hash, url };
}

export async function snapshotAssets(source, output, commit, includeMaps) {
  const sources = new Map();
  for (const name of await filesIn(output)) {
    if (/^(js|css|locales|telemetry)\//.test(name)) sources.set(name, join(output, name));
  }
  if (includeMaps) {
    for (const name of ['board-calibration.json', 'camera-controls.js', 'handoff-protocol.js', 'pil-handoff.css', 'pil-handoff.js', 'roaming-controller.js']) {
      sources.set('3d/' + name, join(source, 'maps-3d', name));
    }
  }
  const hashes = {}, urls = {};
  for (const name of [...sources.keys()].sort()) {
    const asset = await emitAsset(output, name, await readFile(sources.get(name)));
    hashes[name] = asset.hash; urls[name] = asset.url;
  }
  const version = digest(JSON.stringify({ policy: policyVersion, files: hashes }));
  const htmlPath = join(output, 'index.html');
  const clientURLs = Object.fromEntries(Object.entries(urls).filter(([name]) => !name.startsWith('3d/')));
  await writeFile(htmlPath, versionClientAssets(await readFile(htmlPath, 'utf8'), Object.keys(clientURLs), commit, clientURLs));
  return { asset_version: version, asset_files: hashes, asset_urls: urls, policy_version: policyVersion, asset_format: 'per-file' };
}
