import { test, expect, tool, switchMap } from './helpers.js';

// 设置区默认收起，需要先展开再操作其中的控件
const openSettings = async (page) => {
  await page.locator('#tacCarrySettingsToggle').click();
  await expect(page.locator('#tacCarrySettingsBody')).toBeVisible();
};

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
  await expect(page.locator('#tacCarryChairName')).toHaveText('请在地图上选择狂欢之椅');
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
  await expect(page.locator('#tacCarryChairName')).toHaveText('请在地图上选择狂欢之椅');
  await tool(page, 'measure');
  await expect(page.locator('#tacCarryPickBtn')).not.toHaveClass(/active/);
  await tool(page, 'deduce');
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
});

// 天赋弹窗添加加成，明细表列出且可删除，并影响计算结果
test('talent modals fill the buff detail table and change the budget', async ({ page }) => {
  await tool(page, 'deduce');
  await openSettings(page);
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
  await openSettings(page);
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

// 地下室行：与显示设置共享状态，地下室椅子纳入点选
test('basement chairs become pickable when the basement row is enabled', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await expect(page.locator('.tac-chair[data-chair-kind="basement"]')).toHaveCount(0);
  await page.locator('#tacCarryChairBasement').check();
  const basementChairs = page.locator('.tac-chair[data-chair-kind="basement"]');
  expect(await basementChairs.count()).toBeGreaterThan(0);
  // 与显示设置共享勾选状态
  await tool(page, 'display');
  await expect(page.locator('#tacShowChairBasement')).toBeChecked();
  await page.locator('#tacShowChairBasement').uncheck();
  await tool(page, 'deduce');
  await expect(page.locator('#tacCarryChairBasement')).not.toBeChecked();
  await expect(page.locator('.tac-chair[data-chair-kind="basement"]')).toHaveCount(0);
  // 开启后可点选地下室椅子（点正中心，最近的一定是它自己）
  await page.locator('#tacCarryChairBasement').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind="basement"]').first().click({ force: true });
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中狂欢之椅：像素坐标(');
  await expect(page.locator('.tac-chair.tac-carry-selected[data-chair-kind="basement"]')).toHaveCount(1);
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
  await openSettings(page);
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

// 选点看挂椅：切换模式 → 选起点 → 计算 → 切回清除
test('point mode picks a start point, computes and resets on mode switch', async ({ page }) => {
  await tool(page, 'deduce');
  await expect(page.locator('#tacCarryModeChair')).toHaveClass(/active/);

  await page.locator('#tacCarryModePoint').click();
  await expect(page.locator('#tacCarryModePoint')).toHaveClass(/active/);
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我选择起点');
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中起点');
  await expect(page.locator('#tacCarryHideRingLabel')).toBeHidden();

  await page.locator('#tacCarryPickBtn').click();
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我取消选择');
  await expect(page.locator('#tacCarryChairName')).toHaveText('请在地图上选择起点');
  const box = await page.locator('#tacMapWrap').boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中起点：像素坐标(');
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我选择起点');
  await expect(page.locator('.tac-carry-point')).toHaveCount(1);

  await page.locator('#tacCarryRun').click();
  // 选点模式不画颜色覆盖层，只标注各椅挂椅时间
  await expect(page.locator('#tacCarrySummary')).toContainText('挣扎剩余 16.0 秒', { timeout: 60000 });
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('#tacCarryOpacityRow')).toBeHidden();

  // 图例只是颜色含义说明，不是按钮
  await expect(page.locator('#tacCarryLegend')).toBeVisible();
  await expect(page.locator('#tacCarryLegend button')).toHaveCount(0);
  expect(await page.locator('#tacCarryLegend .tac-carry-band').count()).toBeGreaterThan(0);

  // 每把可挂椅子标出挂椅时间（颜色随色带），挂不上的不标注；起点处标「牵气球起点」
  const times = page.locator('.tac-carry-time');
  expect(await times.count()).toBeGreaterThan(0);
  await expect(page.locator('.tac-carry-time-start')).toHaveText('牵气球起点');
  const texts = await times.allTextContents();
  expect(texts.some((t) => /^\d+\.\d 秒$/.test(t) || t.startsWith('风险 · '))).toBe(true);
  expect(texts.some((t) => t === '未确认')).toBe(false);

  // 摘要：最多可挂椅子数；明细默认收起，展开后按时间升序
  const chairCount = page.locator('#tacCarryChairCount');
  await expect(chairCount).toBeVisible();
  const countText = await chairCount.textContent();
  const m = countText.match(/最多可挂上 (\d+) 个狂欢之椅/);
  expect(m).toBeTruthy();
  const n = +m[1];
  expect(n).toBeGreaterThan(0);
  await expect(page.locator('#tacCarryDetailToggle')).toHaveText('▾ 挂椅明细');
  const rows = page.locator('#tacCarryDetailBody tbody tr');
  expect(await rows.count()).toBe(n);
  const timeTexts = await page.locator('#tacCarryDetailBody tbody tr td:nth-child(2)').allTextContents();
  const timeVals = timeTexts.map(Number);
  expect(timeVals.every((v, i) => i === 0 || v >= timeVals[i - 1])).toBe(true);
  // 明细可收起再展开
  await page.locator('#tacCarryDetailToggle').click();
  await expect(page.locator('#tacCarryDetailToggle')).toHaveText('▸ 挂椅明细');
  await expect(page.locator('#tacCarryDetailBody')).toBeHidden();
  await page.locator('#tacCarryDetailToggle').click();
  await expect(page.locator('#tacCarryDetailToggle')).toHaveText('▾ 挂椅明细');

  // 计算结果区整体可收起，默认展开；设置区整体可收起，默认收起
  await expect(page.locator('#tacCarryResultToggle')).toHaveText('▾ 计算结果');
  await page.locator('#tacCarryResultToggle').click();
  await expect(page.locator('#tacCarryResultToggle')).toHaveText('▸ 计算结果');
  await expect(page.locator('#tacCarryResultBody')).toBeHidden();
  await page.locator('#tacCarryResultToggle').click();
  await expect(page.locator('#tacCarryResultBody')).toBeVisible();
  await expect(page.locator('#tacCarrySettingsToggle')).toHaveText('▸ 设置区');
  await expect(page.locator('#tacCarrySettingsBody')).toBeHidden();
  await page.locator('#tacCarrySettingsToggle').click();
  await expect(page.locator('#tacCarrySettingsToggle')).toHaveText('▾ 设置区');
  await expect(page.locator('#tacCarrySettingsBody')).toBeVisible();
  await page.locator('#tacCarrySettingsToggle').click();

  // 明细行点击：正圆红框框出对应椅子；再点取消；点别的行切换
  await rows.nth(0).click();
  await expect(page.locator('.tac-carry-mark-ring')).toHaveCount(1);
  await expect(rows.nth(0)).toHaveClass(/marked/);
  await rows.nth(1).click();
  await expect(page.locator('.tac-carry-mark-ring')).toHaveCount(1);
  await expect(rows.nth(0)).not.toHaveClass(/marked/);
  await expect(rows.nth(1)).toHaveClass(/marked/);
  await rows.nth(1).click();
  await expect(page.locator('.tac-carry-mark-ring')).toHaveCount(0);
  await expect(rows.nth(1)).not.toHaveClass(/marked/);

  await page.locator('#tacCarryModeChair').click();
  await expect(page.locator('.tac-carry-time')).toHaveCount(0);
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('.tac-carry-point')).toHaveCount(0);
  await expect(chairCount).toBeHidden();
  await expect(page.locator('#tacCarryDetailBox')).toBeHidden();
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我选择狂欢之椅');
  await expect(page.locator('#tacCarryHideRingLabel')).toBeVisible();
});

// 切换地图：推算结果按地图各自保留——切走不带入新地图，切回后恢复选中椅与色带
test('switching maps keeps each map\'s own carry selection and result', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  const chairs = page.locator('.tac-chair[data-chair-kind]');
  await page.locator('#tacCarryPickBtn').click();
  await chairs.first().click({ force: true });
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中狂欢之椅：像素坐标(');
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  const chairName = await page.locator('#tacCarryChairName').textContent();
  const summary = await page.locator('#tacCarrySummary').textContent();

  // 切到另一张图：选中椅与结果不显示
  await switchMap(page, 1);
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('.tac-carry-ring')).toHaveCount(0);
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryResultBox')).toBeHidden();

  // 切回原图：选中椅红圈、色带与摘要恢复（切图后工具栏重置为「选择」，需重新打开推算）
  await switchMap(page, 0);
  await tool(page, 'deduce');
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.tac-carry-ring')).toHaveCount(1);
  await expect(page.locator('#tacCarryChairName')).toHaveText(chairName);
  await expect(page.locator('#tacCarrySummary')).toHaveText(summary);
  await expect(page.locator('#tacCarryResultBox')).toBeVisible();
});
