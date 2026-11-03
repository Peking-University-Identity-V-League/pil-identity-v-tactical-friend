import { test, expect, tool, pickRole, clickPoint, read, waitForSave, switchMap, reloadMap } from './helpers.js';

// 地图旋转（逆时针 90° 步进）常驻回归。

// 元素中心在 wrap 里的视觉分数位置（经过旋转层变换后的真实显示位置）
const visFrac = (locator) => locator.evaluate((el) => {
  const wrap = document.getElementById('tacMapWrap').getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return {
    u: ((r.x + r.width / 2) - wrap.x) / wrap.width,
    v: ((r.y + r.height / 2) - wrap.y) / wrap.height,
  };
});

test('rotate button cycles 90° CCW: wrap aspect swaps, positions rotate, icons stay upright', async ({ page }) => {
  const btn = page.locator('#tacRotateBtn');
  await expect(btn).toBeVisible();

  // 放置前锋到地图 (0.25, 0.5)
  await tool(page, 'roles');
  await pickRole(page, 'forward');
  await clickPoint(page, 0.25, 0.5);
  await waitForSave(page);
  const token = page.locator('.tac-token').first();
  let vis = await visFrac(token);
  expect(vis.u).toBeCloseTo(0.25, 2);
  expect(vis.v).toBeCloseTo(0.5, 2);

  const aspect0 = await page.locator('#tacMapWrap').evaluate((el) => el.style.aspectRatio);

  // 第 1 次点击：k=1，wrap 宽高比互换，旋转层转 -90°，图标反向补偿 +90°
  await btn.click();
  await expect(btn).toHaveClass(/active/);
  const rot = page.locator('#tacRot');
  await expect(rot).toHaveAttribute('style', /rotate\(-90deg\)/);
  const aspect1 = await page.locator('#tacMapWrap').evaluate((el) => el.style.aspectRatio);
  expect(aspect1).not.toBe(aspect0);
  // 地图 (0.25, 0.5) 视觉位置应为 (y, 1-x) = (0.5, 0.75)
  vis = await visFrac(token);
  expect(vis.u).toBeCloseTo(0.5, 2);
  expect(vis.v).toBeCloseTo(0.75, 2);
  expect(await token.locator('img').evaluate((el) => el.style.transform)).toBe('rotate(90deg)');

  // k=2 → (1-x, 1-y) = (0.75, 0.5)；图标补偿 180°
  await btn.click();
  await expect(rot).toHaveAttribute('style', /rotate\(-180deg\)/);
  vis = await visFrac(token);
  expect(vis.u).toBeCloseTo(0.75, 2);
  expect(vis.v).toBeCloseTo(0.5, 2);
  expect(await token.locator('img').evaluate((el) => el.style.transform)).toBe('rotate(180deg)');

  // k=3 → (1-y, x) = (0.5, 0.25)
  await btn.click();
  await expect(rot).toHaveAttribute('style', /rotate\(-270deg\)/);
  vis = await visFrac(token);
  expect(vis.u).toBeCloseTo(0.5, 2);
  expect(vis.v).toBeCloseTo(0.25, 2);

  // 第 4 次回到 0°：视觉位置还原，按钮取消激活
  await btn.click();
  await expect(btn).not.toHaveClass(/active/);
  vis = await visFrac(token);
  expect(vis.u).toBeCloseTo(0.25, 2);
  expect(vis.v).toBeCloseTo(0.5, 2);
  expect(await token.locator('img').evaluate((el) => el.style.transform)).toBe('');
});

test('rotate: pointer input is inverse-rotated so placement follows the cursor', async ({ page }) => {
  const btn = page.locator('#tacRotateBtn');
  await btn.click(); // k=1

  // 点击 wrap 视觉位置 (0.25, 0.5)：存储的地图坐标应为 (1-0.5, 0.25) = (0.5, 0.25)
  await tool(page, 'roles');
  await pickRole(page, 'forward');
  await clickPoint(page, 0.25, 0.5);
  await waitForSave(page);
  const t = (await read(page)).board.tokens[0];
  expect(t.x).toBeCloseTo(0.5, 2);
  expect(t.y).toBeCloseTo(0.25, 2);

  // 图文同样落在光标处且保持正立
  await tool(page, 'draw');
  await page.locator('#tacTextInput').fill('rotate');
  await page.locator('#tacTextAddBtn').click();
  await clickPoint(page, 0.6, 0.4);
  await waitForSave(page);
  const textEl = page.locator('.tac-text').first();
  const vis = await visFrac(textEl);
  expect(vis.u).toBeCloseTo(0.6, 2);
  expect(vis.v).toBeCloseTo(0.4, 2);
  expect(await textEl.evaluate((el) => el.style.transform)).toBe('translate(-50%, -50%) rotate(90deg)');
  const txt = (await read(page)).board.texts[0];
  expect(txt.x).toBeCloseTo(0.6, 2);
  expect(txt.y).toBeCloseTo(0.6, 2);
});

test('rotate is remembered per map and persists across reloads', async ({ page }) => {
  const btn = page.locator('#tacRotateBtn');
  const rot = page.locator('#tacRot');
  // 地图 A 旋转 90°
  await btn.click();
  await expect(rot).toHaveAttribute('style', /rotate\(-90deg\)/);
  await expect(btn).toHaveClass(/active/);
  // 切到地图 B：不受地图 A 影响
  await switchMap(page, 1);
  await expect(rot).toHaveAttribute('style', /rotate\(0deg\)/);
  await expect(btn).not.toHaveClass(/active/);
  // 切回地图 A：仍是 90°
  await switchMap(page, 0);
  await expect(rot).toHaveAttribute('style', /rotate\(-90deg\)/);
  await expect(btn).toHaveClass(/active/);
  // 刷新重进：旋转状态保持
  await waitForSave(page);
  await reloadMap(page, 0);
  await expect(rot).toHaveAttribute('style', /rotate\(-90deg\)/);
  await expect(btn).toHaveClass(/active/);
});

test('rotate: svg texts (meters label and endpoint letters) stay upright', async ({ page }) => {
  await page.locator('#tacRotateBtn').click(); // k=1
  await tool(page, 'measure');
  await clickPoint(page, 0.3, 0.3);
  await clickPoint(page, 0.5, 0.5);
  // 米数标签绕锚点反向旋转
  const label = page.locator('.tac-measure-label').first();
  await expect(label).toHaveAttribute('transform', /rotate\(90 /);
  // 选中测距线后端点 A/B 字母同样正立
  await clickPoint(page, 0.4, 0.4);
  const letter = page.locator('.tac-mletter').first();
  await expect(letter).toHaveAttribute('transform', /rotate\(90 /);
});
