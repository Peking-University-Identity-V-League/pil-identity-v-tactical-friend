import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { versionClientAssets } from '../../deploy/scripts/client-assets.mjs';

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`a warm browser updates the entire module graph under ${prefix} without losing saved tactics`, async ({ page }) => {
    const revision = 'b'.repeat(40);
    const assetURLs = Object.fromEntries(['js/bootstrap.js', 'js/route.js', 'js/observer.js', 'js/core/map-handoff.js'].map((p,i)=>[p, '_assets/' + String(i+1).repeat(64) + '/' + p]));
    const currentHelper = await readFile(new URL('../../js/core/map-handoff.js', import.meta.url), 'utf8');
    const paths = ['js/bootstrap.js', 'js/route.js', 'js/observer.js', 'js/core/map-handoff.js'];
    const entry = '<html><head></head><body><button id="open">切换三维</button><script type="module" src="js/bootstrap.js"></script><script type="module" src="js/observer.js"></script></body></html>';
    const modules = {
      'js/bootstrap.js': 'import {map3dURL} from "./route.js"; window.appFunction=map3dURL; window.destination=map3dURL({mapId:0,entryPath:location.pathname}); document.querySelector("#open").onclick=()=>location.assign(window.destination);',
      'js/route.js': 'export {map3dURL} from "./core/map-handoff.js";',
      'js/observer.js': 'const {map3dURL}=await import("./core/map-handoff.js"); window.observerFunction=map3dURL;',
    };
    const requests = [];
    let updated = false;
    const server = createServer((req, res) => {
      const url = new URL(req.url, 'http://fixture');
      requests.push(url.pathname + url.search);
      if (url.pathname === '/away') { res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }); res.end('<p>Away</p>'); return; }
      const file = url.pathname.slice(prefix.length + 1).replace(/^_assets\/[a-f0-9]{64}\//, '');
      if (url.pathname === prefix + '/') { res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }); res.end(updated ? versionClientAssets(entry, paths, revision, assetURLs) : entry); return; }
      if (paths.includes(file)) {
        res.writeHead(200, { 'Content-Type': 'application/javascript', 'Cache-Control': 'public, max-age=31536000, immutable' });
        res.end(file === 'js/core/map-handoff.js' ? (updated ? currentHelper : 'export function map3dURL(){return "/maps-3d/ordnance_factory1.html";}') : modules[file]); return;
      }
      res.writeHead(file === '3d/ordnance_factory1.html' ? 200 : 404, { 'Content-Type': 'text/html' });
      res.end('<p>Map destination</p>');
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    try {
      await page.goto(base + prefix + '/');
      await expect.poll(() => page.evaluate(() => window.destination)).toBe('/maps-3d/ordnance_factory1.html');
      const saved = JSON.stringify({ maps: [{ note: 'keep this saved tactic' }] });
      await page.evaluate(value => localStorage.setItem('idv5_tactic_v1', value), saved);
      await page.goto(base + '/away');
      const before = requests.length;
      updated = true;
      await page.goto(base + prefix + '/');
      await expect.poll(() => page.evaluate(() => window.destination)).toBe(prefix + '/3d/ordnance_factory1.html');
      await expect.poll(() => page.evaluate(() => window.appFunction === window.observerFunction)).toBe(true);
      expect(await page.evaluate(() => localStorage.getItem('idv5_tactic_v1'))).toBe(saved);
      for (const file of paths) expect(requests.slice(before)).toContain(prefix + '/' + assetURLs[file]);
      expect(requests.filter(url => url === prefix + '/js/core/map-handoff.js')).toHaveLength(1);
      await page.locator('#open').click();
      await expect(page).toHaveURL(base + prefix + '/3d/ordnance_factory1.html');
    } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  });
}
