import { test, expect, tool, reloadMap, switchMap } from './helpers.js';

const entry = page => page.locator('#tacSpawnEntry');
const icons = page => page.locator('#tacMapWrap .tac-spawn');

test('spawn display: hidden by default, toggle shows one survivor squad and one hunter icon', async ({ page }) => {
  await tool(page, 'display');
  await expect(entry(page)).toBeVisible();
  await expect(entry(page).locator('#tacShowSpawns')).not.toBeChecked();
  await expect(icons(page)).toHaveCount(0);
  await expect(entry(page).locator('#tacSpawnText')).toHaveText('第 1 / 6 组位置');

  await entry(page).locator('#tacShowSpawns').check();
  await expect(icons(page)).toHaveCount(5);
  // 军工厂第 1 组：首个求生者出生点 (143, 235) / 地图 (750, 644)
  const pos = await icons(page).first().evaluate(el => [el.style.left, el.style.top]);
  expect(parseFloat(pos[0])).toBeCloseTo(143 / 750 * 100, 1);
  expect(parseFloat(pos[1])).toBeCloseTo(235 / 644 * 100, 1);
});

test('switching spawn groups cycles through all six groups and persists per map', async ({ page }) => {
  await tool(page, 'display');
  await entry(page).locator('#tacShowSpawns').check();
  await entry(page).locator('#tacSpawnNext').click();
  await expect(entry(page).locator('#tacSpawnText')).toHaveText('第 2 / 6 组位置');
  await expect(icons(page)).toHaveCount(5);
  await entry(page).locator('#tacSpawnPrev').click();
  await entry(page).locator('#tacSpawnPrev').click();
  await expect(entry(page).locator('#tacSpawnText')).toHaveText('第 6 / 6 组位置');

  await reloadMap(page);
  await expect(entry(page).locator('#tacSpawnText')).toHaveText('第 6 / 6 组位置');
  await expect(entry(page).locator('#tacShowSpawns')).toBeChecked();
  await expect(icons(page)).toHaveCount(5);
});

test('the spawn entry is hidden on maps without spawn data', async ({ page }) => {
  await tool(page, 'display');
  await expect(entry(page)).toBeVisible();
  await switchMap(page, 1);
  await tool(page, 'display');
  await expect(entry(page)).toBeHidden();
  await switchMap(page, 0);
  await tool(page, 'display');
  await expect(entry(page)).toBeVisible();
});

test('spawn icon size follows the slider and the default checkbox restores it', async ({ page }) => {
  await tool(page, 'display');
  await entry(page).locator('#tacShowSpawns').check();
  await entry(page).locator('#tacSpawnSize').evaluate(el => {
    el.value = '10';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  expect(await icons(page).first().evaluate(el => el.style.width)).toBe('10%');
  await entry(page).locator('#tacSpawnSizeDef').check();
  expect(await icons(page).first().evaluate(el => el.style.width)).toBe('6%');
});
