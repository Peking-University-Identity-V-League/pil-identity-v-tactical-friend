import { test, expect } from '@playwright/test';

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`published bytes load immutable 2D/3D dependencies under ${prefix}`, async ({ page }) => {
    test.setTimeout(120000);
    const requests = [], errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { const url = new URL(request.url()); if (url.hostname === '127.0.0.1') requests.push(url.pathname); });
    await page.route('https://**/*', route => route.fulfill(route.request().resourceType() === 'script'
      ? { status: 200, contentType: 'application/javascript', body: '' }
      : { status: 200, contentType: 'image/svg+xml', headers: { 'access-control-allow-origin': '*' }, body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"/>' }));
    await page.goto(prefix + '/');
    const assets = JSON.parse(await page.locator('#pil-assets').textContent());
    expect(assets['js/bootstrap.js']).toMatch(/^\.\/_assets\/[a-f0-9]{64}\/js\/bootstrap\.js$/);
    await page.evaluate(() => localStorage.setItem('pil-cache-preservation-test', 'keep'));
    await page.reload();
    expect(await page.evaluate(() => localStorage.getItem('pil-cache-preservation-test'))).toBe('keep');
    await page.locator('.home-card').first().click();
    await page.locator('[data-map-3d]:visible').first().click();
    await expect(page).toHaveURL(new RegExp(prefix + '/3d/ordnance_factory1\\.html$'));
    await page.waitForFunction(() => window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready);
    await expect(page.locator('.pil-handoff-back')).toHaveAttribute('href', new RegExp(prefix + '/\\?map=0$'));
    const dependencies = requests.filter(path => /\.(js|css|json)$/.test(path));
    expect(dependencies.length).toBeGreaterThan(15);
    expect(dependencies.every(path => /\/_assets\/[a-f0-9]{64}\//.test(path))).toBe(true);
    expect(dependencies.some(path => path.endsWith('/3d/board-calibration.json'))).toBe(true);
    await page.locator('.pil-handoff-back').click();
    await expect(page).toHaveURL(new RegExp(prefix + '/\\?map=0$'));
    expect(errors).toEqual([]);
  });
}
