import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cacheClass, policy } from './asset-policy.mjs';
import { mapsContentSecurityPolicy } from './render-policy.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const maps = JSON.parse(await readFile(join(root, '3d/__release.json')));
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const prefix = policy.prefixes.find(p => url.pathname.startsWith(p + '/'));
    if (!prefix && url.pathname !== '/') throw Error('Not found');
    let name = decodeURIComponent(prefix ? url.pathname.slice(prefix.length + 1) : '') || 'index.html';
    const mapRequest = name.startsWith('3d/') || name.startsWith(policy.immutableDirectory + '/') && name.includes('/3d/');
    if (name.endsWith('/')) name += 'index.html';
    if (name.startsWith('3d/') && !name.startsWith('3d/releases/') && name !== '3d/__release.json') name = maps.asset_urls[name.slice(3)];
    const target = resolve(root, name);
    if (!target.startsWith(resolve(root) + sep) || name.split('/').some(p => p.startsWith('.'))) throw Error('Invalid path');
    const info = await stat(target);
    if (!info.isFile()) throw Error('Not a file');
    res.writeHead(200, { 'Content-Type': mime[extname(name)] || 'application/octet-stream', 'Cache-Control': policy.cache[cacheClass(name)], ...(mapRequest ? { 'Content-Security-Policy': mapsContentSecurityPolicy } : {}) });
    createReadStream(target).pipe(res);
  } catch { res.writeHead(404, { 'Cache-Control': 'no-store' }); res.end(); }
}).listen(Number(process.env.PORT || 8787), '127.0.0.1', () => console.log('Packaged preview: http://127.0.0.1:' + (process.env.PORT || 8787) + '/tactical-friend/'));
