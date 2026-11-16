import { test, expect } from '@playwright/test';

const stubImages = page => page.route('https://**/*', route =>
  route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"/>' }));

test('switching to 3D from the 2D board keeps same-tab navigation on local origins', async ({ page }) => {
  await stubImages(page);
  await page.goto('/');
  await page.locator('.home-card').first().click();
  const popupPromise = page.waitForEvent('popup', { timeout: 1000 }).catch(() => null);
  await page.locator('[data-map-3d]:visible').first().click();
  await expect(page).toHaveURL(/\/tactical-friend\/3d\/ordnance_factory1\.html/);
  expect(await popupPromise).toBeNull();
});

test('the loaded handoff module resolves packaged deployments to the official absolute entry', async ({ page }) => {
  await stubImages(page);
  await page.goto('/');
  await page.locator('.home-card').first().click();
  const result = await page.evaluate(async () => {
    const mod = await import(new URL('js/core/map-handoff.js', location.href).href);
    const external = mod.resolveMap3dEntryPath('/toy/pil-tactical-friend/', 'https://toy-cdn.bilibili.com');
    return {
      external,
      isExternal: mod.isExternalMap3dEntry(external),
      url: mod.map3dURL({ mapId: 0, entryPath: external }),
      local: mod.resolveMap3dEntryPath(location.pathname, location.origin),
      probedLocal: await mod.resolveMap3dTarget({ mapId: 0, pathname: location.pathname, origin: location.origin }),
      probedToy: await mod.resolveMap3dTarget({ mapId: 0, pathname: '/toy/pil-tactical-friend/', origin: 'https://toy-cdn.bilibili.com' }),
    };
  });
  expect(result.external).toBe('https://pkuidv.com/tactical-friend/');
  expect(result.isExternal).toBe(true);
  expect(result.url).toBe('https://pkuidv.com/tactical-friend/3d/ordnance_factory1.html');
  expect(result.local).toBe('/tactical-friend/');
  expect(result.probedLocal).toMatch(/^\/(tactical-friend\/3d|maps-3d)\/ordnance_factory1\.html/);
  expect(result.probedToy).toBe('https://pkuidv.com/tactical-friend/3d/ordnance_factory1.html');
});
