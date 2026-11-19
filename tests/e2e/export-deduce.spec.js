import { readFile } from 'node:fs/promises';
import { test, expect, tool } from './helpers.js';

// 导出地图需包含推算绘制：路径规划折线/A-B 端点、狂欢之椅推算的红圈与时间标注。
// 外部图片被灰块替换，背景干净，可用颜色像素断言：
// 路径折线 #22c55e（绿），选中椅红圈与起点标注 #ff5252（红）。

async function exportPNG(page, testInfo, name) {
  const pending = page.waitForEvent('download');
  await page.locator('#tacExportBtn').click();
  const download = await pending;
  const path = testInfo.outputPath(`${name}.png`);
  await download.saveAs(path);
  return (await readFile(path)).toString('base64');
}

// 统计整图中目标颜色像素数量
async function countColor(page, png, match) {
  return page.evaluate(async ({ png, match }) => {
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
    const hit = match === 'green'
      ? (r, g, b) => g > 150 && g > r + 60 && g > b + 60          // #22c55e 折线
      : (r, g, b) => r > 200 && g > 40 && g < 130 && b > 40 && b < 130; // #ff5252 红圈/红字
    for (let i = 0; i < d.length; i += 4) {
      if (hit(d[i], d[i + 1], d[i + 2])) count++;
    }
    return count;
  }, { png, match });
}

const clickMap = async (page, fx, fy) => {
  const box = await page.locator('#tacMapWrap').boundingBox();
  await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
};

test('export includes the planned path, endpoint labels and the selected-chair ring', async ({ page }, testInfo) => {
  await tool(page, 'deduce');

  // 两点最优路径规划：选 A/B 并计算（绿色折线 + 端点圆点与文字）
  await page.locator('#tacPathPickA').click();
  await clickMap(page, 0.3, 0.5);
  await page.locator('#tacPathPickB').click();
  await clickMap(page, 0.7, 0.5);
  await page.locator('#tacPathRun').click();
  await expect(page.locator('.tac-path-canvas')).toBeVisible({ timeout: 30000 });

  // 狂欢之椅推算：选中一把椅子即出现正圆红框（无需计算）
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await expect(page.locator('.tac-carry-ring')).toHaveCount(1);

  const png = await exportPNG(page, testInfo, 'deduce');
  expect(png).toBeTruthy();
  // 绿色折线（含发光）应出现在导出图中
  expect(await countColor(page, png, 'green')).toBeGreaterThan(50);
  // 红色选中圈 + 起点 A 圆点/文字应出现在导出图中
  expect(await countColor(page, png, 'red')).toBeGreaterThan(50);
});

test('export includes point-mode chair time labels and the start marker', async ({ page }, testInfo) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();

  // 选点看挂椅：选起点并计算，各椅子上出现时间标注 + 起点红色文字
  await page.locator('#tacCarryModePoint').click();
  await page.locator('#tacCarryPickBtn').click();
  await clickMap(page, 0.5, 0.55);
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('#tacCarrySummary')).toContainText('挣扎剩余', { timeout: 60000 });
  await expect(page.locator('.tac-carry-time-start')).toBeVisible();
  const timeCount = await page.locator('.tac-carry-time').count();
  expect(timeCount).toBeGreaterThan(2);

  const png = await exportPNG(page, testInfo, 'deduce-point');
  expect(png).toBeTruthy();
  // 起点红色文字「牵气球起点」与起点圆点应出现在导出图中
  expect(await countColor(page, png, 'red')).toBeGreaterThan(20);
});
