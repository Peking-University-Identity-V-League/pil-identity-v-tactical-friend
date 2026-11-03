import { readFile } from 'node:fs/promises';
import { test, expect, tool, clickPoint } from './helpers.js';

// 导出设置：「缩放后的地图」与「旋转后的地图」两个开关的常驻回归。
// 外部图片在测试中被灰块替换，背景干净，可用金色（测距标签 #eab308）做像素断言。

async function exportPNG(page, testInfo, name) {
  const pending = page.waitForEvent('download');
  await page.locator('#tacExportBtn').click();
  const download = await pending;
  const path = testInfo.outputPath(`${name}.png`);
  await download.saveAs(path);
  return (await readFile(path)).toString('base64');
}

// 在输出分数窗口 win 内统计金色像素数量与包围盒（宽高以像素计）
async function analyzePNG(page, png, win) {
  return page.evaluate(async ({ png, win }) => {
    const image = new Image();
    image.src = `data:image/png;base64,${png}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
    const x0 = Math.floor(win.x0 * canvas.width), x1 = Math.ceil(win.x1 * canvas.width);
    const y0 = Math.floor(win.y0 * canvas.height), y1 = Math.ceil(win.y1 * canvas.height);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * canvas.width + x) * 4;
        const [r, g, b] = [d[i], d[i + 1], d[i + 2]];
        if (r > g + 5 && g > b + 15) {
          count++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return {
      width: canvas.width, height: canvas.height, count,
      bw: count ? maxX - minX + 1 : 0, bh: count ? maxY - minY + 1 : 0,
      fx: count ? minX / canvas.width : -1, fy: count ? minY / canvas.height : -1,
      fx1: count ? (maxX + 1) / canvas.width : -1, fy1: count ? (maxY + 1) / canvas.height : -1,
    };
  }, { png, win });
}

async function mapSize(page) {
  return page.evaluate(async () => {
    const { MAPS_DATA } = await import('/js/data/maps.js');
    const { S } = await import('/js/core/state.js');
    return MAPS_DATA[S.currentMapId].mapSize;
  });
}

// 画一条水平测距线：地图 (0.25,0.5) → (0.55,0.5)，米数标签在线中点下方
async function drawMeasure(page) {
  await tool(page, 'measure');
  await clickPoint(page, 0.25, 0.5);
  await clickPoint(page, 0.55, 0.5);
  await page.keyboard.press('Escape');
}

test('旋转导出：尺寸宽高互换，米数标签正立（横向）', async ({ page }, testInfo) => {
  const [W0, H0] = await mapSize(page);
  await drawMeasure(page);
  await page.locator('#tacRotateBtn').click(); // k=1
  const png = await exportPNG(page, testInfo, 'rot90');
  // 未缩放导出：旋转后画布宽高互换
  expect(png).toBeTruthy();
  const rot = await analyzePNG(page, png, { x0: 0.505, x1: 0.66, y0: 0.55, y1: 0.65 });
  expect(rot.width).toBe(H0);
  expect(rot.height).toBe(W0);
  // 窗口内只有米数标签（金 #eab308）：正立文本宽大于高
  expect(rot.count).toBeGreaterThan(30);
  expect(rot.bw).toBeGreaterThan(rot.bh * 1.5);
});

test('取消勾选「旋转后的地图」导出未旋转原图，标签仍正立', async ({ page }, testInfo) => {
  const [W0, H0] = await mapSize(page);
  await drawMeasure(page);
  await page.locator('#tacRotateBtn').click(); // 屏幕旋转 90°
  await tool(page, 'display');
  await page.locator('#tacExportRot').uncheck();
  const png = await exportPNG(page, testInfo, 'unrot');
  expect(png).toBeTruthy();
  const out = await analyzePNG(page, png, { x0: 0.36, x1: 0.48, y0: 0.47, y1: 0.54 });
  expect(out.width).toBe(W0);
  expect(out.height).toBe(H0);
  // 标签在地图中点下方：窗口覆盖标签与测距线，应有金色像素
  expect(out.count).toBeGreaterThan(30);
  expect(out.bw).toBeGreaterThan(out.bh);
});
