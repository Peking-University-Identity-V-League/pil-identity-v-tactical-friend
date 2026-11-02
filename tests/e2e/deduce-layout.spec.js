import { test, expect, tab } from './helpers.js';

test('clicking a layout group previews its cipher distribution', async ({ page }) => {
  await tab(page, 'deduce');
  const info = await page.evaluate(async () => {
    const { S } = await import('/js/core/state.js');
    const { MAPS_DATA } = await import('/js/data/maps.js');
    const ded = MAPS_DATA[S.currentMapId].deduction;
    const nonLocked = ded.ciphers.filter((c) => !c.locked).length;
    const groupNonLocked = ded.configs[1].filter((id) => !ded.ciphers[id].locked).length;
    return { nonLocked, groupNonLocked };
  });

  // children: [0] = 全部布局 reset item, [1] = 第1组, [2] = 第2组
  await page.locator('#dedLayouts .ded-layout-btn').nth(2).click();
  await expect(page.locator('#dedConclusion')).toHaveText('第 2 组密码机');
  await expect(page.locator('.ded-marker.inf-yes')).toHaveCount(info.groupNonLocked);
  await expect(page.locator('.ded-marker.inf-no')).toHaveCount(info.nonLocked - info.groupNonLocked);

  // clicking the active group again toggles the preview off
  await page.locator('#dedLayouts .ded-layout-btn').nth(2).click();
  await expect(page.locator('#dedConclusion')).not.toHaveText('第 2 组密码机');
  await expect(page.locator('.ded-marker.inf-yes')).toHaveCount(0);

  // the 全部布局 row resets to the normal deduction view
  await page.locator('#dedLayouts .ded-layout-btn').nth(2).click();
  await expect(page.locator('#dedConclusion')).toHaveText('第 2 组密码机');
  await page.locator('#dedLayouts .ded-layout-all').click();
  await expect(page.locator('#dedConclusion')).not.toHaveText('第 2 组密码机');
  await expect(page.locator('.ded-marker.inf-yes')).toHaveCount(0);
});
