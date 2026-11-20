import { readFile } from 'node:fs/promises';
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

test('all nine maps expose their own spawn groups', async ({ page }) => {
  // 地图顺序与选择器一致：军工厂、圣心医院、红教堂、湖景村、月亮河公园、里奥的回忆、永眠镇、唐人街、不归林
  const groups = [6, 6, 6, 7, 7, 9, 7, 6, 5];
  await tool(page, 'display');
  for (let i = 0; i < groups.length; i++) {
    if (i > 0) {
      await switchMap(page, i);
      await tool(page, 'display');
    }
    await expect(entry(page)).toBeVisible();
    await expect(entry(page).locator('#tacSpawnText')).toHaveText(`第 1 / ${groups[i]} 组位置`);
  }
});

test('sacred heart hospital has its own six spawn groups', async ({ page }) => {
  await tool(page, 'display');
  await switchMap(page, 1);
  await tool(page, 'display');
  await expect(entry(page)).toBeVisible();
  await expect(entry(page).locator('#tacSpawnText')).toHaveText('第 1 / 6 组位置');
  await entry(page).locator('#tacShowSpawns').check();
  await expect(icons(page)).toHaveCount(5);
  // 圣心医院第 1 组：首个求生者出生点 (250, 72) / 地图 (644, 604)
  const pos = await icons(page).first().evaluate(el => [el.style.left, el.style.top]);
  expect(parseFloat(pos[0])).toBeCloseTo(250 / 644 * 100, 1);
  expect(parseFloat(pos[1])).toBeCloseTo(72 / 604 * 100, 1);
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

test('spawn icons stay upright after rotating the map on screen', async ({ page }) => {
  await tool(page, 'display');
  await entry(page).locator('#tacShowSpawns').check();
  await page.locator('#tacRotateBtn').click(); // k=1，正立补偿应即时刷新
  expect(await icons(page).first().evaluate(el => el.style.transform)).toContain('rotate(90deg)');
});

test('spawn icons are exported, and stay upright in rotated export', async ({ page }, testInfo) => {
  // 图标替换为纯红块，导出后用像素断言确认出生点图标落位
  await page.route('https://**/*', (route) => route.fulfill({
    status: 200, contentType: 'image/svg+xml',
    headers: { 'access-control-allow-origin': '*' },
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#ff0000"/></svg>',
  }));
  const exportPNG = async (name) => {
    const pending = page.waitForEvent('download');
    await page.locator('#tacExportBtn').click();
    const download = await pending;
    const path = testInfo.outputPath(`${name}.png`);
    await download.saveAs(path);
    return (await readFile(path)).toString('base64');
  };
  const redCount = (png, win) => page.evaluate(async ({ png, win }) => {
    const image = new Image();
    image.src = `data:image/png;base64,${png}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    const x0 = Math.floor(win.x0 * canvas.width), x1 = Math.ceil(win.x1 * canvas.width);
    const y0 = Math.floor(win.y0 * canvas.height), y1 = Math.ceil(win.y1 * canvas.height);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * canvas.width + x) * 4;
      if (d[i] > 200 && d[i + 1] < 60 && d[i + 2] < 60) count++;
    }
    return count;
  }, { png, win });

  await tool(page, 'display');
  await entry(page).locator('#tacShowSpawns').check();

  // 未旋转导出：军工厂第 1 组首个求生点 (143/750, 235/644) ≈ (0.191, 0.365)
  const png0 = await exportPNG('spawn-k0');
  expect(await redCount(png0, { x0: 0.15, x1: 0.23, y0: 0.32, y1: 0.41 })).toBeGreaterThan(50);

  // 旋转 90° 导出：输出位置 (u,v)=(fy,1-fx)≈(0.365,0.809)，图标仍正立落位
  await page.locator('#tacRotateBtn').click();
  const png1 = await exportPNG('spawn-k1');
  expect(await redCount(png1, { x0: 0.32, x1: 0.41, y0: 0.77, y1: 0.85 })).toBeGreaterThan(50);
});
