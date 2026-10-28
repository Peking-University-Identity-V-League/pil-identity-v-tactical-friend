import { execFileSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

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
    if (!response.ok || !/^nginx(?:\/|$)/i.test(response.headers.get('server') || '') || response.headers.has('cf-ray')) throw new Error('The direct CST response is unavailable at ' + path);
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
}

for (let attempt = 1; attempt <= 12; attempt++) {
  try { await verify(); console.log('Public direct CST paths serve the expected release and assets.'); break; }
  catch (error) { if (attempt === 12) throw error; console.log('Waiting for the public CST release. Attempt ' + attempt + '/12.'); await setTimeout(5000); }
}
