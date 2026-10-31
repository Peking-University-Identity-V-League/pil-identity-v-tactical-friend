import { execFileSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { readFile } from 'node:fs/promises';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const commit = process.env.GITHUB_SHA || git('rev-parse', 'HEAD');
const config = process.env.DEPLOY_CONFIG_REVISION || process.env.GITHUB_SHA || git('rev-parse', 'HEAD');
const paths = ['/tactical-friend', '/zhanshuyanlian'].flatMap(prefix => [
  '/', '/js/bootstrap.js', '/css/style.css', '/locales/zh-CN.json',
  '/telemetry/privacy.js', '/telemetry/client.js', '/telemetry/summary.js', '/__release.json',
].map(path => prefix + path));

async function verify() {
  for (const path of paths) {
    const response = await fetch('https://pkuidv.com' + path + '?check=' + Date.now(), { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('The public response is unavailable at ' + path);
    if (path.endsWith('/__release.json')) {
      const release = await response.json();
      if (release.source_commit !== commit || release.config_revision !== config) throw new Error('Unexpected release at ' + path);
    } else if (path.endsWith('/')) {
      const html = await response.text();
      if (!html.includes('umami.pkuidv.com/script.js') || !html.includes('homeMapGrid')) throw new Error('Unexpected entry page at ' + path);
    } else {
      const expected = path.endsWith('.js') ? 'javascript' : path.endsWith('.css') ? 'text/css' : path.endsWith('.json') ? 'application/json' : path.endsWith('.webp') ? 'image/webp' : 'image/svg+xml';
      if (!(response.headers.get('content-type') || '').includes(expected)) throw new Error('Unexpected static asset type at ' + path);
      await response.body?.cancel();
    }
  }
  const expectedMaps = JSON.parse(await readFile(new URL('../dist/3d/__release.json', import.meta.url), 'utf8'));
  const mapsResponse = await fetch('https://pkuidv.com/tactical-friend/3d/__release.json?check=' + Date.now(), { signal: AbortSignal.timeout(15000) });
  if (!mapsResponse.ok) throw new Error('3D release metadata is unavailable');
  const maps = await mapsResponse.json();
  if (maps.source_commit !== commit || maps.asset_version !== expectedMaps.asset_version) throw new Error('Unexpected 3D release');
  for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
    const entry = await fetch('https://pkuidv.com' + prefix + '/3d/', { redirect: 'error', signal: AbortSignal.timeout(15000) });
    const html = await entry.text();
    if (!entry.ok || !html.includes('class="grid"') || html.includes('location.replace(')) throw new Error('3D entry must serve the map list at its stable URL');
    const aliasMetadata = await (await fetch('https://pkuidv.com' + prefix + '/3d/__release.json?check=' + Date.now(), { signal: AbortSignal.timeout(15000) })).json();
    if (aliasMetadata.source_commit !== commit || aliasMetadata.asset_version !== maps.asset_version) throw new Error('Unexpected 3D alias release');
  }
  for (const name of Object.keys(maps.files)) {
    const response = await fetch('https://pkuidv.com/tactical-friend/3d/releases/' + maps.asset_version + '/' + name, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
    if (!response.ok || !response.headers.get('cache-control')?.includes('immutable')) throw new Error('3D immutable asset unavailable: ' + name);
  }
}

for (let attempt = 1; attempt <= 12; attempt++) {
  try { await verify(); console.log('Public paths serve the expected release and assets.'); break; }
  catch (error) { if (attempt === 12) throw error; console.log('Waiting for the public CST release. Attempt ' + attempt + '/12.'); await setTimeout(5000); }
}
