import { test, expect, tool } from './helpers.js';

// 合并卡片：狂欢之椅推算（#tacCarryCard）内含 牵气球-上椅 / 化险为夷-下椅 两个场景，
// 共用椅子行/选择/结果区；设置区整体默认收起，两个场景子容器随场景切换显隐
const openSettings = async (page) => {
  await page.locator('#tacCarrySettingsToggle').click();
  await expect(page.locator('#tacCarrySettingsBody')).toBeVisible();
};

const toTide = async (page) => {
  await page.locator('#tacDedScenarioTide').click();
  await expect(page.locator('#tacDedScenarioTide')).toHaveClass(/active/);
};

// 场景/模式切换：计算按钮文案四态 + 模式按钮文案随场景变化
test('scenario and mode switches update run button and mode labels', async ({ page }) => {
  await tool(page, 'deduce');
  const run = page.locator('#tacCarryRun');
  const modePoint = page.locator('#tacCarryModePoint');
  await expect(page.locator('#tacDedScenarioCarry')).toHaveClass(/active/);
  await expect(run).toHaveText('计算挂椅范围');
  await expect(modePoint).toHaveText('选点看可挂椅');

  await modePoint.click();
  await expect(run).toHaveText('计算可挂椅');

  await toTide(page);
  await expect(run).toHaveText('计算化险为夷可达椅');
  await expect(modePoint).toHaveText('选点看可达椅');
  // 设置区子容器随场景切换
  await openSettings(page);
  await expect(page.locator('#tacDedSettingsCarry')).toBeHidden();
  await expect(page.locator('#tacDedSettingsTide')).toBeVisible();

  await page.locator('#tacCarryModeChair').click();
  await expect(run).toHaveText('计算化险为夷可达范围');

  await page.locator('#tacDedScenarioCarry').click();
  await expect(page.locator('#tacDedScenarioCarry')).toHaveClass(/active/);
  await expect(run).toHaveText('计算挂椅范围');
  await expect(modePoint).toHaveText('选点看可挂椅');
  await expect(page.locator('#tacDedSettingsCarry')).toBeVisible();
  await expect(page.locator('#tacDedSettingsTide')).toBeHidden();
});

// 化险为夷 · 选椅看范围：点选椅子 → 计算色带 → 清除
test('tide scenario picks a chair, computes bands and clears', async ({ page }) => {
  await tool(page, 'deduce');
  await toTide(page);
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryNote')).toBeHidden();

  await page.locator('#tacCarryShowChairs').check();
  const chairs = page.locator('.tac-chair[data-chair-kind]');
  expect(await chairs.count()).toBeGreaterThan(0);

  await page.locator('#tacCarryPickBtn').click();
  await expect(page.locator('#tacCarryChairName')).toHaveText('请在地图上选择狂欢之椅');
  const first = chairs.first();
  const box = await first.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('.tac-snap-ripple.chair.show')).toBeVisible();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await first.click({ force: true });
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中狂欢之椅：像素坐标 (');
  await expect(first).toHaveClass(/tac-carry-selected/);
  await expect(page.locator('.tac-carry-ring')).toHaveCount(1);

  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarrySummary')).toContainText('化险为夷 20 秒');
  // 5 档色带：0–5 / 5–10 / 10–15 / 15–20 秒 + 20–21 秒余量
  const legend = page.locator('#tacCarryLegend .tac-carry-band');
  await expect(legend).toHaveCount(5);
  await expect(legend.nth(4)).toContainText('余量');
  await expect(page.locator('#tacCarryNote')).toBeVisible();
  await expect(page.locator('#tacCarryNote')).toContainText('化险为夷 20 秒');

  await page.locator('#tacCarryClear').click();
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryNote')).toBeHidden();
});

// 场景切换清除计算结果，但保留选中的椅子
test('switching scenario clears the computed result but keeps the chair', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  const chair = page.locator('.tac-chair[data-chair-kind]').first();

  // 牵气球-上椅先算
  await page.locator('#tacCarryPickBtn').click();
  await chair.click({ force: true });
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarryResultBox')).toBeVisible();
  await expect(page.locator('#tacCarryNote')).toBeVisible();

  // 切到化险为夷-下椅：绘制结果被清除，选中椅子保留
  await toTide(page);
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('#tacCarryResultBox')).toBeHidden();
  await expect(page.locator('#tacCarryNote')).toBeHidden();
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中狂欢之椅：像素坐标 (');

  // tide 场景直接可算（无需重新选椅）
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#tacCarrySummary')).toContainText('化险为夷 20 秒');

  // 切回牵气球-上椅：结果同样被清除，椅子仍保留
  await page.locator('#tacDedScenarioCarry').click();
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('#tacCarryResultBox')).toBeHidden();
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中狂欢之椅：像素坐标 (');
});

// 化险为夷 · 选点看可达椅：切换模式 → 选起点 → 计算 → 椅子时间标注与明细
test('tide point mode labels chairs within 20 seconds of the start point', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await toTide(page);
  await expect(page.locator('#tacCarryModeChair')).toHaveClass(/active/);

  await page.locator('#tacCarryModePoint').click();
  await expect(page.locator('#tacCarryModePoint')).toHaveClass(/active/);
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我选择起点');
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中起点');
  await expect(page.locator('#tacCarryHideRingLabel')).toBeHidden();

  await page.locator('#tacCarryPickBtn').click();
  const box = await page.locator('#tacMapWrap').boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.locator('#tacCarryChairName')).toContainText('当前已选中起点：像素坐标 (');
  await expect(page.locator('.tac-carry-point')).toHaveCount(1);
  // 选中起点的同时，点位上立即显示「起点」文字
  await expect(page.locator('.tac-carry-time-start')).toHaveCount(1);
  await expect(page.locator('.tac-carry-time-start')).toHaveText('起点');

  await page.locator('#tacCarryRun').click();
  // 选点模式不画颜色覆盖层，只标注各椅到达时间
  await expect(page.locator('#tacCarrySummary')).toContainText('化险为夷 20 秒', { timeout: 60000 });
  await expect(page.locator('.tac-carry-canvas')).toHaveCount(0);
  await expect(page.locator('#tacCarryOpacityRow')).toBeHidden();

  // 图例只是颜色含义说明，不是按钮
  await expect(page.locator('#tacCarryLegend')).toBeVisible();
  await expect(page.locator('#tacCarryLegend button')).toHaveCount(0);
  expect(await page.locator('#tacCarryLegend .tac-carry-band').count()).toBeGreaterThan(0);

  // 每把可达椅子标出到达时间（颜色随色带），超过 21 秒的不标注；起点处标「起点」
  const times = page.locator('.tac-carry-time');
  expect(await times.count()).toBeGreaterThan(0);
  await expect(page.locator('.tac-carry-time-start')).toHaveText('起点');
  const texts = await times.allTextContents();
  expect(texts.some((t) => /^\d+\.\d 秒$/.test(t) || t.startsWith('余量 · '))).toBe(true);

  // 摘要：化险为夷 20 秒内可赶到椅子数（余量带不计入）；明细默认展开、按时间升序
  const chairCount = page.locator('#tacCarryChairCount');
  await expect(chairCount).toBeVisible();
  const m = (await chairCount.textContent()).match(/可从 (\d+) 个狂欢之椅出发/);
  expect(m).toBeTruthy();
  await expect(page.locator('#tacCarryDetailToggle')).toHaveText('▾ 椅子明细');
  const rows = page.locator('#tacCarryDetailBody tbody tr');
  expect(await rows.count()).toBeGreaterThanOrEqual(+m[1]);
  const timeVals = (await page.locator('#tacCarryDetailBody tbody tr td:nth-child(2)').allTextContents()).map(Number);
  expect(timeVals.every((v, i) => i === 0 || v >= timeVals[i - 1])).toBe(true);

  // 明细行点击：正圆红框框出对应椅子；再点取消；点别的行切换
  await rows.nth(0).click();
  await expect(page.locator('.tac-carry-mark-ring')).toHaveCount(1);
  await expect(rows.nth(0)).toHaveClass(/marked/);
  await rows.nth(1).click();
  await expect(page.locator('.tac-carry-mark-ring')).toHaveCount(1);
  await expect(rows.nth(1)).toHaveClass(/marked/);
  await rows.nth(1).click();
  await expect(page.locator('.tac-carry-mark-ring')).toHaveCount(0);

  // 切回选椅模式：清除绘制结果并回到未选中状态
  await page.locator('#tacCarryModeChair').click();
  await expect(page.locator('.tac-carry-time')).toHaveCount(0);
  await expect(page.locator('.tac-carry-point')).toHaveCount(0);
  await expect(chairCount).toBeHidden();
  await expect(page.locator('#tacCarryDetailBox')).toBeHidden();
  await expect(page.locator('#tacCarryChairName')).toHaveText('当前未选中狂欢之椅');
  await expect(page.locator('#tacCarryHideRingLabel')).toBeVisible();
});

// tide 场景求生者移速设置区：与测算卡片同结构，但状态独立互不共享
test('tide speed settings are independent from the measure card', async ({ page }) => {
  await tool(page, 'deduce');
  await openSettings(page);
  await toTide(page);

  // 基础明细默认展开：默认求生者跑动 3.8 m/s，20 秒 76 m
  await expect(page.locator('#tacTideBaseDetailToggle')).toHaveText('▾ 基础明细');
  await expect(page.locator('#tacTideBaseDetailBody')).toBeVisible();
  await expect(page.locator('#tacTideBaseDetailBody')).toContainText('跑动');
  await expect(page.locator('#tacTideBaseDetailBody')).toContainText('3.8');
  await expect(page.locator('#tacTideBaseDetailBody')).toContainText('76');

  // 下拉切换为走路 → 数字框联动 2.11
  await page.locator('#tacTideSpeedRole').selectOption('walk');
  await expect(page.locator('#tacTideBaseSpeed')).toHaveValue('2.11');
  await expect(page.locator('#tacTideBaseDetailBody')).toContainText('走路');

  // 测算卡片的基础移速不受影响（状态不共享）
  await tool(page, 'measure');
  await expect(page.locator('#tacBaseSpeed')).toHaveValue('3.8');
  await tool(page, 'deduce');
  await expect(page.locator('#tacTideBaseSpeed')).toHaveValue('2.11');
  await expect(page.locator('#tacTideBaseDetailBody')).toContainText('走路');

  // 手改数字 → 下拉跳到「自定义」
  await page.locator('#tacTideBaseSpeed').fill('4');
  await expect(page.locator('#tacTideSpeedRole')).toHaveValue('custom');
});

// 加成弹窗：天赋加成进入明细表并可删除；自定义加成同样生效
test('tide buff modals fill the private buff table', async ({ page }) => {
  await tool(page, 'deduce');
  await openSettings(page);
  await toTide(page);

  // 天赋加成：膝跳反射（50% 3s，表格内不带 s 单位，列头为“时间 s”）
  await page.locator('#tacTideTalentAddBtn').click();
  const talentList = page.locator('#tacTideTalentList');
  await talentList.locator('.tac-talent-row', { hasText: '膝跳反射' }).locator('.tac-talent-add').click();
  await expect(page.locator('#tacTideBuffBody')).toContainText('膝跳反射');
  await expect(page.locator('#tacTideBuffBody')).toContainText('50%');
  await expect(page.locator('#tacTideBuffBody')).toContainText('50%3');

  // 自定义加成：测试 +20% 时间不限
  await page.locator('#tacTideBuffAddBtn').click();
  await page.locator('#tacTideBuffName').fill('测试');
  await page.locator('#tacTideBuffPct').fill('20');
  await page.locator('#tacTideBuffOk').click();
  await expect(page.locator('#tacTideBuffBody')).toContainText('测试');
  await expect(page.locator('#tacTideBuffBody')).toContainText('20%');
  await expect(page.locator('#tacTideBuffBody tbody tr')).toHaveCount(2);

  // 测算卡片的加成明细不受污染（状态不共享）
  await tool(page, 'measure');
  await expect(page.locator('#tacBuffDetailBody')).not.toContainText('膝跳反射');
  await expect(page.locator('#tacBuffDetailBody')).not.toContainText('测试');
  await tool(page, 'deduce');

  // 删除膝跳反射
  await page.locator('.tac-tide-buff-del').first().click();
  await expect(page.locator('#tacTideBuffBody tbody tr')).toHaveCount(1);
  await expect(page.locator('#tacTideBuffBody')).not.toContainText('膝跳反射');
});

// 图例按钮可点击开关对应色带（重绘不重算）
test('tide legend band buttons toggle their overlay band', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacCarryShowChairs').check();
  await toTide(page);
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
