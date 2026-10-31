import { digest, policy } from './asset-policy.mjs';

export const scenes = ['h55_chinatown', 'h55_deadforest_sp', 'h55_demo', 'h55_demo2', 'h55_fishingvillage', 'h55_hospital2', 'h55_playground', 'h55_sleepingtown3', 'ordnance_factory1', 'ordnance_factory2'];
export const legacyHelpers = ['board-calibration.json', 'camera-controls.js', 'handoff-protocol.js', 'pil-handoff.css', 'pil-handoff.js', 'roaming-controller.js'];
export const loadingHelpers = ['loading.js', 'loading-stage.js', 'loading.css'];
export const runtimeFiles = ['__release.json', 'index.html', ...legacyHelpers, ...scenes.map(scene => scene + '.html')].sort();
export const maxMapBytes = 80 * 1024 * 1024;
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

function jsonBlock(html, id) {
  // These are generated data blocks, not arbitrary HTML. Refuse script-like
  // commented markup rather than guessing at the browser's error recovery.
  for (const comment of html.matchAll(/<!--[\s\S]*?(?:-->|$)/g)) if (/<script\b/i.test(comment[0])) throw Error('Invalid 3D JSON block: ' + id);
  const matches = [];
  for (const block of html.matchAll(/(<script\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>)([\s\S]*?)(<\/script\s*>)/gi)) {
    // Consume each entire attribute, including its quoted value, so text inside
    // data-* values cannot masquerade as a separate id attribute.
    const attributes = [...block[2].matchAll(/(?:^|\s+)([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g)];
    const ids = attributes.filter(value => value[1].toLowerCase() === 'id').map(value => (value[2] ?? value[3] ?? value[4] ?? '').replace(/&#(?:x([a-f0-9]+)|(\d+));?/gi, (all, hex, decimal) => {
      const code = parseInt(hex || decimal, hex ? 16 : 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '\ufffd';
    }));
    if (ids.includes(id)) {
      const types = attributes.filter(value => value[1].toLowerCase() === 'type');
      if (ids.length !== 1 || types.length !== 1 || (types[0][2] ?? types[0][3] ?? types[0][4] ?? '').toLowerCase() !== 'application/json'
          || attributes.some(value => value[1].toLowerCase() === 'src')) throw Error('Invalid 3D JSON block: ' + id);
      matches.push(block);
    }
  }
  if (matches.length !== 1) throw Error('Invalid 3D JSON block: ' + id);
  return matches[0];
}

export function jsonScript(html, id) {
  try { return JSON.parse(jsonBlock(html, id)[3]); } catch { throw Error('Invalid 3D JSON block: ' + id); }
}

export function replaceJsonScript(html, id, value) {
  jsonScript(html, id);
  const block = jsonBlock(html, id);
  return html.slice(0, block.index) + block[1] + JSON.stringify(value).replace(/</g, '\\u003c') + block[4] + html.slice(block.index + block[0].length);
}

/** Validate the complete incoming inventory, or a final rewritten inventory.
 * read(name) must return only the explicitly listed regular file's bytes.
 */
export async function inspectMapInventory(names, read, assetURLs = null) {
  const release = JSON.parse((await read('__release.json')).toString('utf8'));
  if (!release || typeof release !== 'object' || Array.isArray(release)) throw Error('Invalid 3D runtime metadata');
  const loading = release.loading_progress === 1 || names.some(name => loadingHelpers.includes(name) || name.includes('.runtime-'));
  if (!loading) {
    if (JSON.stringify(names.slice().sort()) !== JSON.stringify(runtimeFiles)) throw Error('Unexpected or missing 3D runtime files');
    return { loading: false, names: runtimeFiles, bindings: {}, release };
  }
  if (release.component !== 'maps-3d' || release.map_count !== scenes.length || release.loading_progress !== 1 || release.endpoint_validation !== 1
      || !/^[a-f0-9]{40}$/.test(release.source_commit || '') || !sha(release.worker_sha256)) throw Error('Invalid loading runtime metadata');
  const expected = [...runtimeFiles, ...loadingHelpers], bindings = {};
  for (const scene of scenes) {
    const config = jsonScript((await read(scene + '.html')).toString('utf8'), 'pil-loading-config');
    if (!config || JSON.stringify(Object.keys(config).sort()) !== JSON.stringify(['bytes', 'entryName', 'runtime', 'sha256'])
        || config.entryName !== scene + '.html' || !sha(config.sha256) || !Number.isSafeInteger(config.bytes)
        || config.bytes <= 0 || config.bytes > maxMapBytes) throw Error('Invalid 3D loading binding: ' + scene);
    const name = scene + '.runtime-' + config.sha256.slice(0, 16) + '.html';
    const target = assetURLs ? policy.canonicalPrefix + '/' + assetURLs[name] : './' + name;
    if (config.runtime !== target || assetURLs && !new RegExp('^' + policy.immutableDirectory + '/[a-f0-9]{64}/3d/' + name.replaceAll('.', '\\.') + '$').test(assetURLs[name] || '')) throw Error('Invalid 3D runtime binding path: ' + scene);
    expected.push(name);
    const bytes = await read(name);
    if (bytes.length !== config.bytes || digest(bytes) !== config.sha256) throw Error('3D runtime binding checksum or length mismatch: ' + scene);
    const runtime = bytes.toString('utf8');
    if (jsonScript(runtime, 'map-info').mapId !== scene) throw Error('3D runtime scene mismatch: ' + scene);
    const worker = jsonScript(runtime, 'worker-source').base64;
    if (typeof worker !== 'string' || Buffer.from(worker, 'base64').toString('base64') !== worker || digest(Buffer.from(worker, 'base64')) !== release.worker_sha256) throw Error('3D runtime worker checksum mismatch: ' + scene);
    bindings[scene] = { name, config };
  }
  expected.sort();
  if (expected.length !== 31 || JSON.stringify(names.slice().sort()) !== JSON.stringify(expected)) throw Error('Unexpected or missing 3D runtime files');
  return { loading: true, names: expected, bindings, release };
}
