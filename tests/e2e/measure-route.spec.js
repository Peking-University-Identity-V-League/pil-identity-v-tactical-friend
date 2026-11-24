import { test, expect, tool, clickPoint, read } from './helpers.js';

// 路径线模式：连续分段、段内按最优路径连接；「点此取消添加」行；「允许翻窗」开关。

async function drawRouteSeg(page) {
  await tool(page, 'measure');
  await page.locator('[data-mmode="route"]').click();
  await clickPoint(page, 0.3, 0.3);
  await clickPoint(page, 0.6, 0.3);
}

test('measure: route mode draws chain segments that bend to the optimal path', async ({ page }) => {
  await drawRouteSeg(page);
  // 先落直线段，异步计算后写入最优路径
  let segs = (await read(page)).board.measures;
  expect(segs).toHaveLength(1);
  expect(segs[0].chain).not.toBeNull();
  await expect.poll(async () => {
    const ms = (await read(page)).board.measures;
    return ms[0] && ms[0].path ? ms[0].path.length : 0;
  }).toBeGreaterThanOrEqual(2);

  segs = (await read(page)).board.measures;
  const path = segs[0].path;
  expect(path[0].x).toBeCloseTo(0.3, 1);
  expect(path[path.length - 1].x).toBeCloseTo(0.6, 1);

  // 再加一段：同一链
  await clickPoint(page, 0.6, 0.6);
  await expect.poll(async () => (await read(page)).board.measures.length).toBe(2);
  segs = (await read(page)).board.measures;
  expect(segs[1].chain).toBe(segs[0].chain);

  // 渲染层：路径段以折线呈现
  await expect(page.locator('#tacArrowSvg polyline').first()).toBeVisible();
});

test('measure: arm row shows only in chain/route modes; cancel stops drawing', async ({ page }) => {
  await tool(page, 'measure');
  // 直线模式：不显示「点此取消添加」行
  await expect(page.locator('#tacMeasureArm')).toBeHidden();

  await page.locator('[data-mmode="chain"]').click();
  await expect(page.locator('#tacMeasureArm')).toBeVisible();
  await expect(page.locator('#tacMeasureCancel')).toBeDisabled();

  // 开始连续绘制后按钮可点，点击后取消绘制（等价 Esc）
  await clickPoint(page, 0.3, 0.3);
  await expect(page.locator('#tacMeasureCancel')).toBeEnabled();
  await page.locator('#tacMeasureCancel').click();
  await expect(page.locator('#tacMeasureCancel')).toBeDisabled();
  // 取消后下一点是新起点，不产生分段
  await clickPoint(page, 0.6, 0.3);
  expect((await read(page)).board.measures).toHaveLength(0);

  // 路径线模式同样显示
  await page.locator('[data-mmode="route"]').click();
  await expect(page.locator('#tacMeasureArm')).toBeVisible();

  // 切回直线模式：隐藏
  await page.locator('[data-mmode="single"]').click();
  await expect(page.locator('#tacMeasureArm')).toBeHidden();
});

test('measure: vault checkbox defaults on and persists', async ({ page }) => {
  await tool(page, 'measure');
  await page.locator('#tacDrawSettingsToggle').click();
  await page.locator('#tacDrawOtherToggle').click();
  await expect(page.locator('#tacMeasureVault')).toBeChecked();
  await page.locator('#tacMeasureVault').uncheck();
  await page.reload();
  await page.locator('.home-card').first().click();
  await tool(page, 'measure');
  await page.locator('#tacDrawSettingsToggle').click();
  await page.locator('#tacDrawOtherToggle').click();
  await expect(page.locator('#tacMeasureVault')).not.toBeChecked();
});
