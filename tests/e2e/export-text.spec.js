import { readFile } from 'node:fs/promises';
import { test, expect, tool } from './helpers.js';

// 回归：图文文字曾用错误的字号公式导出（除数里混入了 wrapX），
// 导出图上文字小到不可见。外部图片被灰块替换，背景干净，
// 用紫色 #a855f7 文字做颜色像素断言。

async function exportPNG(page, testInfo, name) {
  const pending = page.waitForEvent('download');
  await page.locator('#tacExportBtn').click();
  const download = await pending;
  const path = testInfo.outputPath(`${name}.png`);
  await download.saveAs(path);
  return (await readFile(path)).toString('base64');
}

async function countPurple(page, png) {
  return page.evaluate(async (pngData) => {
    const image = new Image();
    image.src = `data:image/png;base64,${pngData}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      if (r > 120 && b > 180 && g < 110 && b > g + 80) count++; // #a855f7 紫
    }
    return count;
  }, png);
}

test('export includes text tokens at readable size', async ({ page }, testInfo) => {
  await tool(page, 'draw');
  // 紫色大字，便于像素断言
  await page.locator('#tacTextColors .tac-color[data-color="#a855f7"]').click();
  await page.locator('#tacTextSize').fill('30');
  await page.locator('#tacTextInput').fill('测试文字');
  await page.locator('#tacTextAddBtn').click();
  const box = await page.locator('#tacMapWrap').boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.locator('.tac-text')).toHaveCount(1);

  const png = await exportPNG(page, testInfo, 'text');
  expect(png).toBeTruthy();
  expect(await countPurple(page, png)).toBeGreaterThan(30);
});
