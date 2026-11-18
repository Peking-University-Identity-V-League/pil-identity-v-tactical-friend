import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } });

test('the public 3D path opens the map list and a complete self-contained scene', async ({ page }) => {
  // 自包含 3D 场景就绪是纯 CPU 工作（解析 40MB runtime、构建碰撞 BVH）；
  // GitHub 共享 runner（软件渲染）上可能远慢于本地，放宽到 5 分钟。
  test.setTimeout(300000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tactical-friend/3d/');
  await expect(page.locator('.grid a')).toHaveCount(10, { timeout: 30000 });
  await page.getByRole('link', { name: '军工厂', exact: true }).click();
  await expect(page).toHaveURL(/\/tactical-friend\/3d\/ordnance_factory1\.html$/, { timeout: 60000 });
  // waitForFunction 默认仅 30s 且不吃 test.setTimeout，CI 软件渲染下必须显式放宽
  await page.waitForFunction(() => window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready && window.viewerAPI?.worldCollision?.().state === 'ready', null, { timeout: 240000 });
  expect(await page.evaluate(() => window.viewerAPI.worldCollision().triangleCount)).toBeGreaterThan(0);
  await expect(page.locator('.pil-handoff-back')).toHaveAttribute('href', /\/tactical-friend\/\?map=0$/);
  expect(errors).toEqual([]);
});

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`2D/3D navigation preserves ${prefix} in both directions`, async ({ page }) => {
    // 同上：3D 就绪在 CI 软件渲染下耗时不可控，放宽到 4 分钟。
    test.setTimeout(240000);
    await page.route('https://**/*', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"/>' }));
    await page.goto(prefix + '/');
    await page.locator('.home-card').first().click();
    await page.locator('[data-map-3d]:visible').first().click();
    await expect(page).toHaveURL(new RegExp(prefix + '/3d/ordnance_factory1\\.html$'), { timeout: 60000 });
    // waitForFunction 默认仅 30s 且不吃 test.setTimeout，CI 软件渲染下必须显式放宽
    await page.waitForFunction(() => window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready, null, { timeout: 180000 });
    await expect(page.locator('.pil-handoff-back')).toHaveAttribute('href', new RegExp(prefix + '/\\?map=0$'), { timeout: 30000 });
    await page.locator('.pil-handoff-back').click();
    await expect(page).toHaveURL(new RegExp(prefix + '/\\?map=0$'), { timeout: 60000 });
  });
}
