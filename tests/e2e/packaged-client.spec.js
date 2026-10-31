import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareAssets } from '../../deploy/scripts/prepare-assets.mjs';
import { snapshotAssets } from '../../deploy/scripts/asset-snapshot.mjs';

test('the packaged application versions every module and locale under both entry paths', async ({ page }) => {
  test.setTimeout(120000);
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const revision = 'c'.repeat(40);
  await prepareAssets(root, revision, revision, { version: false });
  const dist = resolve(root, 'deploy/dist');
  const snapshot = await snapshotAssets(root, dist, revision, false);
  const requests = [], errors = [];
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://fixture');
    requests.push(url.pathname + url.search);
    const relative = url.pathname.replace(/^\/(?:tactical-friend|zhanshuyanlian)\//, '') || 'index.html';
    if (relative.startsWith('3d/')) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<p>3D destination</p>'); return; }
    const path = resolve(dist, relative);
    try {
      if (!path.startsWith(dist + sep)) throw Error('Invalid path');
      const body = await readFile(path);
      const type = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' }[extname(path)];
      res.writeHead(200, { 'Content-Type': type || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(body);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**/*', route => route.fulfill(route.request().resourceType() === 'script'
    ? { status: 200, contentType: 'application/javascript', body: '' }
    : { status: 200, contentType: 'image/svg+xml', headers: { 'access-control-allow-origin': '*' }, body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"/>' }));
  try {
    for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
      await page.goto(base + prefix + '/');
      await page.locator('.home-card').first().click();
      await page.locator('[data-map-3d]:visible').first().click();
      await expect(page).toHaveURL(base + prefix + '/3d/ordnance_factory1.html');
      const own = requests.filter(path => path.startsWith(prefix + '/') && /\.(?:js|css|json)(?:\?|$)/.test(path));
      expect(own.length).toBeGreaterThan(10);
      expect(own.every(path => /\/_assets\/[a-f0-9]{64}\//.test(path))).toBe(true);
      expect(own).toContain(prefix + '/' + snapshot.asset_urls['locales/zh-CN.json']);
    }
    expect(errors).toEqual([]);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
