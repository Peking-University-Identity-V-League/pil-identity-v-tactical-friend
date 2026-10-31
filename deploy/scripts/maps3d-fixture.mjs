import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { digest } from './asset-policy.mjs';
import { scenes } from './maps3d.mjs';

export async function loadingFixture(root, { changedScene = null, change = 'changed' } = {}) {
  await mkdir(root, { recursive: true });
  const worker = Buffer.from('self.onmessage=()=>{};');
  const release = { component: 'maps-3d', source_commit: 'a'.repeat(40), protocol: 1, map_count: 10,
    endpoint_validation: 1, loading_progress: 1, worker_sha256: digest(worker) };
  const files = {
    '__release.json': JSON.stringify(release), 'board-calibration.json': '{"maps":[]}',
    'index.html': '<html><head></head><body>maps</body></html>',
  };
  for (const name of ['camera-controls.js', 'handoff-protocol.js', 'pil-handoff.css', 'pil-handoff.js', 'roaming-controller.js', 'loading.js', 'loading-stage.js', 'loading.css']) files[name] = '/* fixture ' + name + ' */';
  const bindings = {};
  for (const scene of scenes) {
    const runtime = '<html><head><link rel="stylesheet" href="./loading.css">' +
      '<script type="importmap">{"imports":{"camera-controls":"./camera-controls.js"}}</script></head><body>' +
      '<script src="./loading-stage.js"></script>' +
      '<script id="map-info" type="application/json">' + JSON.stringify({ mapId: scene }) + '</script>' +
      '<script id="worker-source" type="application/json">' + JSON.stringify({ base64: worker.toString('base64') }) + '</script>' +
      '<script type="module" src="./pil-handoff.js"></script>' + (changedScene === scene ? change : scene) + '</body></html>';
    const sha256 = digest(runtime), name = scene + '.runtime-' + sha256.slice(0, 16) + '.html';
    const config = { runtime: './' + name, entryName: scene + '.html', bytes: Buffer.byteLength(runtime), sha256 };
    files[name] = runtime;
    files[scene + '.html'] = '<html><head><link rel="stylesheet" href="./loading.css"></head><body>' +
      '<script id="pil-loading-config" type="application/json">' + JSON.stringify(config) + '</script><script src="./loading.js"></script></body></html>';
    bindings[scene] = { name, config };
  }
  await Promise.all(Object.entries(files).map(([name, data]) => writeFile(join(root, name), data)));
  return { files, bindings, release };
}
