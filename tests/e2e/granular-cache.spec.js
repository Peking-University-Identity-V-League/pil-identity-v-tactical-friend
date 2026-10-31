import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { versionClientAssets } from '../../deploy/scripts/client-assets.mjs';

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`only changed module and icon download across releases at ${prefix}`, async ({ page }) => {
    const sources = generation => ({
      'js/main.js': 'import {answer} from "./answer.js"; window.answer=answer;',
      'js/answer.js': 'export const answer=' + generation + ';',
      'icons/pin.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><title>' + generation + '</title></svg>',
    });
    const revisions = [1, 2].map(generation => {
      const files = sources(generation);
      const urls = Object.fromEntries(Object.entries(files).map(([name, bytes]) => [name, '_assets/' + createHash('sha256').update(bytes).digest('hex') + '/' + name]));
      const html = versionClientAssets('<head><script type="module" src="js/main.js"></script></head><body><img src="icons/pin.svg"></body>', Object.keys(files), String(generation).repeat(40), urls);
      return { files, urls, html };
    });
    const served = [], lookup = new Map();
    for (const release of revisions) for (const [name, url] of Object.entries(release.urls)) lookup.set(prefix + '/' + url, release.files[name]);
    let generation = 0;
    const server = createServer((req, res) => {
      served.push(req.url);
      if (req.url === prefix + '/') { res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }); res.end(revisions[generation].html); return; }
      if (req.url === '/away') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('away'); return; }
      if (lookup.has(req.url)) { res.writeHead(200, { 'Content-Type': req.url.endsWith('.svg') ? 'image/svg+xml' : 'application/javascript', 'Cache-Control': 'public, max-age=31536000, immutable' }); res.end(lookup.get(req.url)); return; }
      res.writeHead(404); res.end();
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    try {
      await page.goto(base + prefix + '/');
      await expect.poll(() => page.evaluate(() => window.answer)).toBe(1);
      await page.goto(base + '/away'); generation = 1;
      await page.goto(base + prefix + '/');
      await expect.poll(() => page.evaluate(() => window.answer)).toBe(2);
      const unchanged = prefix + '/' + revisions[0].urls['js/main.js'];
      expect(revisions[0].urls['js/main.js']).toBe(revisions[1].urls['js/main.js']);
      expect(served.filter(path => path === unchanged)).toHaveLength(1);
      for (const name of ['js/answer.js', 'icons/pin.svg']) {
        expect(revisions[0].urls[name]).not.toBe(revisions[1].urls[name]);
        expect(served.filter(path => path === prefix + '/' + revisions[0].urls[name])).toHaveLength(1);
        expect(served.filter(path => path === prefix + '/' + revisions[1].urls[name])).toHaveLength(1);
      }
    } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  });
}
