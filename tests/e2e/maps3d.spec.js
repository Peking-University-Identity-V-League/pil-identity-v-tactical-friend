import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } });

test('the public 3D path opens the map list and a complete self-contained scene', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tactical-friend/3d/');
  await expect(page.locator('.grid a')).toHaveCount(10);
  await page.getByRole('link', { name: '军工厂', exact: true }).click();
  await expect(page).toHaveURL(/\/tactical-friend\/3d\/ordnance_factory1\.html$/);
  await page.waitForFunction(() => window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready && window.viewerAPI?.worldCollision?.().state === 'ready');
  expect(await page.evaluate(() => window.viewerAPI.worldCollision().triangleCount)).toBeGreaterThan(0);
  await expect(page.locator('.pil-handoff-back')).toHaveAttribute('href', /\/tactical-friend\/\?map=0$/);
  expect(errors).toEqual([]);
});
