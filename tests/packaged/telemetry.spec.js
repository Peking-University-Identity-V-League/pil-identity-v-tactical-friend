import { test, expect } from '@playwright/test';
import { renderNginx } from '../../deploy/scripts/render-policy.mjs';

const csp = renderNginx().match(/Content-Security-Policy "([^"]+)"/)[1];
const tracker = `
const script = document.currentScript;
window.umami = { track(name, data) {
 const payload = window[script.dataset.beforeSend]('event', {
  website: script.dataset.websiteId, url: location.href, title: 'PRIVATE_TITLE', id: 'PRIVATE_ID',
  referrer: 'https://example.org/PRIVATE?token=PRIVATE', name, data
 });
 if (payload) return fetch('https://umami.pkuidv.com/api/send', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'event',payload})});
}};
document.addEventListener('click', e => { const link=e.target.closest('[data-umami-event]'); if(link) window.umami.track(link.dataset.umamiEvent); });
window.umami.track();`;

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`packaged 3D pageviews and sponsor clicks respect the privacy boundary under ${prefix}`, async ({ page }) => {
    const sent = [];
    // 路由处理器与页面跳转/测试拆除并发时，Playwright 会对已处置的请求抛出
    // "Route is already handled!"/"Fetch response has been disposed" 竞态错误；
    // 这些请求不参与任何断言，忽略即可，真正的失败仍由断言暴露。
    const ignoreRoutingRace = (err) => {
      if (!/already handled|has been disposed|has been closed|context or browser/i.test(String(err && err.message || err))) throw err;
    };
    await page.route('https://**/*', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"/>' }));
    await page.route('https://pkuidv.com/**', async route => {
      try {
        const url = new URL(route.request().url());
        const response = await route.fetch({ url: 'http://127.0.0.1:8787' + url.pathname + url.search });
        const headers = response.headers();
        if (url.pathname.includes('/3d/')) headers['content-security-policy'] = csp;
        await route.fulfill({ response, headers });
      } catch (err) {
        ignoreRoutingRace(err);
      }
    });
    await page.route('https://umami.pkuidv.com/script.js', route => route.fulfill({ contentType: 'application/javascript', body: tracker }));
    await page.route('https://umami.pkuidv.com/api/send', async route => {
      try {
        if (route.request().method() === 'POST') sent.push(route.request().postDataJSON());
        await route.fulfill({ contentType:'application/json', headers:{'Access-Control-Allow-Origin':'https://pkuidv.com','Access-Control-Allow-Headers':'content-type'},body:'{}' });
      } catch (err) {
        ignoreRoutingRace(err);
      }
    });
    await page.addInitScript(() => document.addEventListener('click', e => { if(e.target.closest?.('a[href^="https://afdian.com/"]'))e.preventDefault(); },true));
    try {
    await page.goto('https://pkuidv.com' + prefix + '/3d/?token=PRIVATE#PRIVATE_COORDINATES');
    await expect.poll(() => sent.length).toBe(1);
    expect(sent[0].payload.url).toBe(prefix + '/3d/');
    expect(sent[0].payload.tag).toBe('tactical-3d');
    expect(JSON.stringify(sent)).not.toContain('PRIVATE');
    await page.evaluate(() => window.umami.track('unknown', { coordinates: 'PRIVATE' }));
    expect(sent.length).toBe(1);
    await page.goto('https://pkuidv.com' + prefix + '/');
    await page.locator('.footer-sponsor').click();
    await expect.poll(() => sent.some(x => x.payload.name === 'sponsor_afdian_open')).toBe(true);
    expect(sent.find(x => x.payload.name === 'sponsor_afdian_open').payload.data).toEqual({ application: 'tactical-friend', entry: prefix.slice(1) });
    } finally {
      // The app may still be importing telemetry dependencies after the click.
      // Finish intercepted requests before Playwright disposes their responses.
      await page.unrouteAll({ behavior: 'wait' });
    }
  });
}
