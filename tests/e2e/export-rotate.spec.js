import { readFile } from 'node:fs/promises';
import { test, expect, tool, clickPoint, pickRole } from './helpers.js';

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
    // red=true 时统计纯红像素（图标 stub），否则统计金色（测距标签 #eab308）
    const match = win.red
      ? (r, g, b) => r > 200 && g < 60 && b < 60
      : (r, g, b) => r > g + 5 && g > b + 15;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * canvas.width + x) * 4;
        if (match(d[i], d[i + 1], d[i + 2])) {
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

test('旋转导出：尺寸宽高互换，米数标签正立（横向），图标落位正确', async ({ page }, testInfo) => {
  const [W0, H0] = await mapSize(page);
  // 把外部图标替换成纯红块以便像素断言（须在放置角色前注册，避免命中灰块缓存）
  await page.route('https://**/*', (route) => route.fulfill({
    status: 200, contentType: 'image/svg+xml',
    headers: { 'access-control-allow-origin': '*' },
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#ff0000"/></svg>',
  }));
  await drawMeasure(page);
  // 放一个角色到地图 (0.4, 0.5)
  await tool(page, 'roles');
  await pickRole(page, 'forward');
  await clickPoint(page, 0.4, 0.5);
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
  // 角色图标：k=1 输出位置 (u,v)=(fy,1-fx)=(0.5,0.6)，必须画在期望位置
  const box = await analyzePNG(page, png, { x0: 0.47, x1: 0.53, y0: 0.57, y1: 0.63, red: true });
  expect(box.count).toBeGreaterThan(100);
});

test('旋转 180° 导出：尺寸不变，图标落位正确', async ({ page }, testInfo) => {
  const [W0, H0] = await mapSize(page);
  await page.route('https://**/*', (route) => route.fulfill({
    status: 200, contentType: 'image/svg+xml',
    headers: { 'access-control-allow-origin': '*' },
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#ff0000"/></svg>',
  }));
  await tool(page, 'roles');
  await pickRole(page, 'forward');
  await clickPoint(page, 0.4, 0.5);
  const btn = page.locator('#tacRotateBtn');
  await btn.click();
  await btn.click(); // k=2
  const png = await exportPNG(page, testInfo, 'rot180');
  const out = await analyzePNG(page, png, { x0: 0, x1: 1, y0: 0, y1: 1, red: true });
  expect(out.width).toBe(W0);
  expect(out.height).toBe(H0);
  // k=2 输出位置 (1-fx, 1-fy) = (0.6, 0.5)
  const box = await analyzePNG(page, png, { x0: 0.57, x1: 0.63, y0: 0.47, y1: 0.53, red: true });
  expect(box.count).toBeGreaterThan(100);
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
