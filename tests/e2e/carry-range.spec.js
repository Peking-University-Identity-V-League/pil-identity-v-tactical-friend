import { test, expect, tool } from './helpers.js';

// 选椅看范围：推算工具 → 共享椅子行 → 点选椅子 → 计算色带 → 清除
test('carry range card picks a chair, computes bands and clears', async ({ page }) => {
  await tool(page, 'deduce');
  const card = page.locator('#tacCarryCard');
  await expect(card).toBeVisible();
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryNote')).toBeHidden();

  // 椅子默认不显示；卡片内的椅子行与显示设置共享
  await expect(page.locator('.tac-chair')).toHaveCount(0);
  await page.locator('#tacCarryShowChairs').check();
  const chairs = page.locator('.tac-chair[data-chair-kind]');
  expect(await chairs.count()).toBeGreaterThan(0);

  // 进入选椅模式：状态变为请选择，悬停椅子出现红色波纹
  await page.locator('#tacCarryPickBtn').click();
  await expect(page.locator('#tacCarryChairName')).toHaveText('请选择狂欢之椅');
  const first = chairs.first();
  const box = await first.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('.tac-snap-ripple.chair.show')).toBeVisible();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); // 确认停住
  await first.click({ force: true });
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中狂欢之椅：像素坐标(');
  await expect(first).toHaveClass(/tac-carry-selected/);
  await expect(page.locator('.tac-carry-ring')).toHaveCount(1);
  await expect(page.locator('.tac-snap-ripple.chair.show')).toHaveCount(0);

  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarrySummary')).toContainText('挣扎剩余 16.0 秒');
  await expect(page.locator('#tacCarrySummary')).toContainText('牵起 2.0 秒');
  await expect(page.locator('#tacCarryLegend .tac-carry-band')).toHaveCount(5);
  await expect(page.locator('#tacCarryNote')).toBeVisible();

  await page.locator('#tacCarryClear').click();
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryNote')).toBeHidden();
});

// 选椅模式中切走工具，选椅模式立即退出
test('switching tools while picking disarms the chair picker', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await expect(page.locator('#tacCarryChairName')).toHaveText('请选择狂欢之椅');
  await tool(page, 'measure');
  await expect(page.locator('#tacCarryPickBtn')).not.toHaveClass(/active/);
  await tool(page, 'deduce');
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
});

// 天赋弹窗添加加成，明细表列出且可删除，并影响计算结果
test('talent modals fill the buff detail table and change the budget', async ({ page }) => {
  await tool(page, 'deduce');
  // 弹窗2：巨钳 3 层（明细两行）
  await page.locator('#tacCarryHuntTalentBtn').click();
  const huntList = page.locator('#tacCarryHuntList');
  await huntList.locator('.tac-talent-row', { hasText: '巨钳' }).locator('select').selectOption('3');
  await huntList.locator('.tac-talent-row', { hasText: '巨钳' }).locator('.tac-talent-add').click();
  // 弹窗2：嬉弄
  await page.locator('#tacCarryHuntTalentBtn').click();
  await huntList.locator('.tac-talent-row', { hasText: '嬉弄' }).locator('.tac-talent-add').click();
  // 弹窗3：好客之道 3 层
  await page.locator('#tacCarrySpeedTalentBtn').click();
  const speedList = page.locator('#tacCarrySpeedList');
  await speedList.locator('.tac-talent-row', { hasText: '好客之道' }).locator('select').selectOption('3');
  await speedList.locator('.tac-talent-row', { hasText: '好客之道' }).locator('.tac-talent-add').click();

  const rows = page.locator('#tacCarryBuffBody tbody tr');
  await expect(rows).toHaveCount(4); // 巨钳两行 + 嬉弄 + 好客之道
  await expect(page.locator('#tacCarryBuffBody')).toContainText('巨钳 3层');
  await expect(page.locator('#tacCarryBuffBody')).toContainText('-15%');
  await expect(page.locator('#tacCarryBuffBody')).toContainText('放下求生者增加进度');
  await expect(page.locator('#tacCarryBuffBody')).toContainText('好客之道 3层');

  // 删除巨钳（两行一起消失）
  await rows.first().locator('.tac-carry-buff-del').click();
  await expect(page.locator('#tacCarryBuffBody tbody tr')).toHaveCount(2);
  await expect(page.locator('#tacCarryBuffBody')).not.toContainText('巨钳');

  // 计算：嬉弄牵起 2/1.2≈1.7s，好客之道 8% 加速
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarrySummary')).toContainText('牵起 1.7 秒');
});

// 初始挣扎进度拉高后，可放下的色带数减少
test('initial struggle progress shrinks the band count', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await page.locator('#tacCarryInitial').fill('80');
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarrySummary')).toContainText('挣扎剩余 3.2 秒');
  // 剩余 3.2s 只够走到 90% 风险区（3.2s 进度 20%→100%），安全带为空
  const legend = page.locator('#tacCarryLegend .tac-carry-band');
  expect(await legend.count()).toBeLessThan(5);
});

// 图例按钮可点击开关对应色带（重绘不重算）
test('legend band buttons toggle their overlay band', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await page.locator('#tacCarryRun').click();
  const canvas = page.locator('.tac-carry-canvas');
  await expect(canvas).toBeVisible({ timeout: 30000 });
  const before = await canvas.evaluate((c) => c.toDataURL());
  const band = page.locator('#tacCarryLegend .tac-carry-band').first();
  await band.click();
  await expect(band).toHaveClass(/off/);
  const hidden = await canvas.evaluate((c) => c.toDataURL());
  expect(hidden).not.toBe(before);
  await band.click();
  await expect(band).not.toHaveClass(/off/);
  const restored = await canvas.evaluate((c) => c.toDataURL());
  expect(restored).toBe(before);
});

// 透明度滑条改变色带透明度（重绘不重算），默认比旧版更浅
test('opacity slider re-renders bands without recomputing', async ({ page }) => {
  await tool(page, 'deduce');
  await expect(page.locator('#tacCarryOpacityRow')).toBeHidden();
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await page.locator('#tacCarryRun').click();
  const canvas = page.locator('.tac-carry-canvas');
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarryOpacityRow')).toBeVisible();
  const before = await canvas.evaluate((c) => c.toDataURL());
  await page.locator('#tacCarryOpacity').fill('20');
  const faded = await canvas.evaluate((c) => c.toDataURL());
  expect(faded).not.toBe(before);
  await page.locator('#tacCarryClear').click();
  await expect(page.locator('#tacCarryOpacityRow')).toBeHidden();
});

// 隐藏选中圈：勾选后立即隐藏，再次选中也不再显示
test('hide-ring checkbox suppresses the selected-chair circle', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await expect(page.locator('.tac-carry-ring')).toHaveCount(1);
  await page.locator('#tacCarryHideRing').check();
  await expect(page.locator('.tac-carry-ring')).toHaveCount(0);
  // 重新选择另一把椅子，圆框依然不出现
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').nth(1).click({ force: true });
  await expect(page.locator('.tac-carry-ring')).toHaveCount(0);
  await page.locator('#tacCarryHideRing').uncheck();
  await expect(page.locator('.tac-carry-ring')).toHaveCount(1);
});

// 监管者下拉：双形态监管出现形态二级下拉并联动基础移速数字框
test('hunter dropdown exposes a form select for dual-form hunters', async ({ page }) => {
  await tool(page, 'deduce');
  await expect(page.locator('#tacCarryHunterForm')).toBeHidden();
  await page.locator('#tacCarryHunter').selectOption('wuchang');
  const form = page.locator('#tacCarryHunterForm');
  await expect(form).toBeVisible();
  await expect(page.locator('#tacCarryHunterSpeed')).toHaveValue('4.73');
  await form.selectOption('1');
  await expect(page.locator('#tacCarryHunterSpeed')).toHaveValue('4.56');
  // 手改数字 → 下拉跳到「自定义」并收起形态下拉
  await page.locator('#tacCarryHunterSpeed').fill('5');
  await expect(page.locator('#tacCarryHunter')).toHaveValue('custom');
  await expect(form).toBeHidden();
});
