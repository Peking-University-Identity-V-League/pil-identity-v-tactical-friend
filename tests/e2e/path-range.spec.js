import { test, expect, tool, switchMap } from './helpers.js';

// 两点最优路径规划（#tacPathCard）：选择起点 A / 终点 B → 计算最优路径 →
// 计算结果（默认展开）→ 设置区（默认收起，移速设置与测算卡片同构但状态私有）
const clickMap = async (page, fx, fy) => {
  const box = await page.locator('#tacMapWrap').boundingBox();
  await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
};

const openSettings = async (page) => {
  await page.locator('#tacPathSettingsToggle').click();
  await expect(page.locator('#tacPathSettingsBody')).toBeVisible();
};

// 选点 → 计算 → 摘要/折线/说明 → 清除
test('path card picks A and B, computes the optimal path and clears', async ({ page }) => {
  await tool(page, 'deduce');
  await expect(page.locator('#tacPathCard')).toBeVisible();
  await expect(page.locator('#tacPathStatusA')).toHaveText('当前未选择起点 A');
  await expect(page.locator('#tacPathStatusB')).toHaveText('当前未选择终点 B');

  // 选择起点 A
  await page.locator('#tacPathPickA').click();
  await expect(page.locator('#tacPathPickA')).toHaveText('点我取消选择');
  await expect(page.locator('#tacPathStatusA')).toHaveText('请在地图上选择起点 A');
  await clickMap(page, 0.3, 0.5);
  await expect(page.locator('#tacPathStatusA')).toHaveText(/像素坐标\(\d+, \d+\)/);
  await expect(page.locator('.tac-path-point.a')).toHaveCount(1);
  await expect(page.locator('.tac-path-label').first()).toHaveText('起点 A');

  // 选择终点 B
  await page.locator('#tacPathPickB').click();
  await expect(page.locator('#tacPathStatusB')).toHaveText('请在地图上选择终点 B');
  await clickMap(page, 0.7, 0.5);
  await expect(page.locator('#tacPathStatusB')).toHaveText(/像素坐标\(\d+, \d+\)/);
  await expect(page.locator('.tac-path-point.b')).toHaveCount(1);
  await expect(page.locator('.tac-path-label').nth(1)).toHaveText('终点 B');

  // 计算最优路径：折线 + 摘要 + 说明文字
  await page.locator('#tacPathRun').click();
  await expect(page.locator('.tac-path-canvas')).toBeVisible({ timeout: 30000 });
  const summary = page.locator('#tacPathSummary');
  await expect(summary).toContainText(/总距离 [\d.]+ m · 用时 [\d.]+ s · 途经 \d+ 格/);
  await expect(page.locator('#tacPathResultBox')).toBeVisible();
  await expect(page.locator('#tacPathResultToggle')).toHaveText('▾ 计算结果');
  await expect(page.locator('#tacPathNote')).toBeVisible();
  await expect(page.locator('#tacPathNote')).toContainText('地面层二维近似');

  // 清除：端点、折线与结果一起消失
  await page.locator('#tacPathClear').click();
  await expect(page.locator('.tac-path-canvas')).toHaveCount(0);
  await expect(page.locator('.tac-path-point')).toHaveCount(0);
  await expect(page.locator('.tac-path-label')).toHaveCount(0);
  await expect(page.locator('#tacPathStatusA')).toHaveText('当前未选择起点 A');
  await expect(page.locator('#tacPathStatusB')).toHaveText('当前未选择终点 B');
  await expect(page.locator('#tacPathResultBox')).toBeHidden();
});

// 未选择端点时点击计算：提示选择对应端点
test('run without endpoints keeps the result hidden', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacPathRun').click();
  await expect(page.locator('#tacPathResultBox')).toBeHidden();
  await page.locator('#tacPathPickA').click();
  await clickMap(page, 0.3, 0.5);
  await page.locator('#tacPathRun').click();
  await expect(page.locator('#tacPathResultBox')).toBeHidden();
});

// 与狂欢之椅推算的点选互斥：一方进入选择模式，另一方退出
test('path picking disarms the carry card picking and vice versa', async ({ page }) => {
  await tool(page, 'deduce');
  // 狂欢之椅推算进入选择 → 路径规划进入选择后，前者退出
  await page.locator('#tacCarryPickBtn').click();
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我取消选择');
  await page.locator('#tacPathPickA').click();
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我选择狂欢之椅');
  await expect(page.locator('#tacPathPickA')).toHaveText('点我取消选择');
  // 反向：路径选择中，狂欢之椅推算进入选择，路径退出
  await page.locator('#tacCarryPickBtn').click();
  await expect(page.locator('#tacPathPickA')).toHaveText('点我选择起点 A');
  await expect(page.locator('#tacCarryPickBtn')).toHaveText('点我取消选择');
});

// 与狂欢之椅推算的计算结果可以共存：两边覆盖层互不清除
test('path and carry overlays coexist', async ({ page }) => {
  await tool(page, 'deduce');
  // 先算路径
  await page.locator('#tacPathPickA').click();
  await clickMap(page, 0.3, 0.5);
  await page.locator('#tacPathPickB').click();
  await clickMap(page, 0.7, 0.5);
  await page.locator('#tacPathRun').click();
  await expect(page.locator('.tac-path-canvas')).toBeVisible({ timeout: 30000 });

  // 再算狂欢之椅推算：路径折线保留，两张覆盖层共存
  await page.locator('#tacCarryShowChairs').check();
  await page.locator('#tacCarryPickBtn').click();
  await page.locator('.tac-chair[data-chair-kind]').first().click({ force: true });
  await page.locator('#tacCarryRun').click();
  await expect(page.locator('.tac-carry-canvas:not(.tac-path-canvas)')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.tac-path-canvas')).toHaveCount(1);
  await expect(page.locator('#tacPathResultBox')).toBeVisible();

  // 再算路径：狂欢之椅推算覆盖层同样保留
  await page.locator('#tacPathRun').click();
  await expect(page.locator('.tac-path-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.tac-carry-canvas:not(.tac-path-canvas)')).toHaveCount(1);
});

// 切换地图：起点 A / 终点 B 与计算结果按地图各自保留——
// 切走的地图不带入新地图，切回后恢复原图的端点、折线与摘要
test('switching maps keeps each map\'s own path endpoints and result', async ({ page }) => {
  await tool(page, 'deduce');
  await page.locator('#tacPathPickA').click();
  await clickMap(page, 0.3, 0.5);
  await page.locator('#tacPathPickB').click();
  await clickMap(page, 0.7, 0.5);
  await page.locator('#tacPathRun').click();
  await expect(page.locator('.tac-path-canvas')).toBeVisible({ timeout: 30000 });
  const statusA = await page.locator('#tacPathStatusA').textContent();
  const summary = await page.locator('#tacPathSummary').textContent();
  expect(statusA).toContain('像素坐标(');

  // 切到另一张图：端点与结果不显示
  await switchMap(page, 1);
  await expect(page.locator('.tac-path-canvas')).toHaveCount(0);
  await expect(page.locator('.tac-path-point')).toHaveCount(0);
  await expect(page.locator('.tac-path-label')).toHaveCount(0);
  await expect(page.locator('#tacPathStatusA')).toHaveText('当前未选择起点 A');
  await expect(page.locator('#tacPathStatusB')).toHaveText('当前未选择终点 B');
  await expect(page.locator('#tacPathResultBox')).toBeHidden();

  // 切回原图：端点、折线与计算结果恢复（切图后工具栏重置为「选择」，需重新打开推算）
  await switchMap(page, 0);
  await tool(page, 'deduce');
  await expect(page.locator('.tac-path-canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.tac-path-point')).toHaveCount(2);
  await expect(page.locator('.tac-path-label')).toHaveCount(2);
  await expect(page.locator('#tacPathStatusA')).toHaveText(statusA);
  await expect(page.locator('#tacPathSummary')).toHaveText(summary);
  await expect(page.locator('#tacPathResultBox')).toBeVisible();
});

// 移速设置区：与测算卡片同结构但状态私有；走路比跑动慢，计算结果随之变化
test('path speed settings are private and affect the computed time', async ({ page }) => {
  await tool(page, 'deduce');
  await openSettings(page);

  // 基础明细默认展开：默认求生者跑动 3.8 m/s
  await expect(page.locator('#tacPathBaseDetailToggle')).toHaveText('▾ 基础明细');
  await expect(page.locator('#tacPathBaseDetailBody')).toBeVisible();
  await expect(page.locator('#tacPathBaseDetailBody')).toContainText('跑动');
  await expect(page.locator('#tacPathBaseDetailBody')).toContainText('3.8');

  // 选好端点并计算（跑动 3.8）
  await page.locator('#tacPathPickA').click();
  await clickMap(page, 0.3, 0.5);
  await page.locator('#tacPathPickB').click();
  await clickMap(page, 0.7, 0.5);
  await page.locator('#tacPathRun').click();
  const summary = page.locator('#tacPathSummary');
  await expect(summary).toContainText(/用时 [\d.]+ s/, { timeout: 30000 });
  const runTime = +(await summary.textContent()).match(/用时 ([\d.]+) s/)[1];

  // 下拉切换为走路（2.11 m/s）→ 用时变长（设置区保持展开）
  await page.locator('#tacPathSpeedRole').selectOption('walk');
  await expect(page.locator('#tacPathBaseSpeed')).toHaveValue('2.11');
  await expect(page.locator('#tacPathBaseDetailBody')).toContainText('走路');

  // 测算卡片的基础移速不受影响（状态不共享）
  await tool(page, 'measure');
  await expect(page.locator('#tacBaseSpeed')).toHaveValue('3.8');
  await tool(page, 'deduce');
  await expect(page.locator('#tacPathBaseSpeed')).toHaveValue('2.11');

  await page.locator('#tacPathRun').click();
  await expect(summary).toContainText(/用时 [\d.]+ s/, { timeout: 30000 });
  const walkTime = +(await summary.textContent()).match(/用时 ([\d.]+) s/)[1];
  expect(walkTime).toBeGreaterThan(runTime);

  // 手改数字 → 下拉跳到「自定义」（设置区保持展开）
  await page.locator('#tacPathBaseSpeed').fill('4');
  await expect(page.locator('#tacPathSpeedRole')).toHaveValue('custom');

  // 切到监管者阵营：下拉出现厂长，速度写入数字框
  await page.locator('#tacPathCampToggle .side-btn[data-camp="hunter"]').click();
  await expect(page.locator('#tacPathSpeedRole')).toHaveValue('hellEmber');
  await expect(page.locator('#tacPathBaseSpeed')).toHaveValue('4.73');
  await expect(page.locator('#tacPathBaseDetailBody')).toContainText('厂长');
});

// 加成弹窗：天赋加成进入私有明细表并可删除，不污染测算卡片
test('path buff modals fill the private buff table', async ({ page }) => {
  await tool(page, 'deduce');
  await openSettings(page);

  // 天赋加成：膝跳反射（50% 3s）
  await page.locator('#tacPathTalentAddBtn').click();
  const talentList = page.locator('#tacPathTalentList');
  await talentList.locator('.tac-talent-row', { hasText: '膝跳反射' }).locator('.tac-talent-add').click();
  await expect(page.locator('#tacPathBuffBody')).toContainText('膝跳反射');
  await expect(page.locator('#tacPathBuffBody')).toContainText('50%');
  await expect(page.locator('#tacPathBuffBody')).toContainText('3s');

  // 自定义加成：测试 +20% 时间不限
  await page.locator('#tacPathBuffAddBtn').click();
  await page.locator('#tacPathBuffName').fill('测试');
  await page.locator('#tacPathBuffPct').fill('20');
  await page.locator('#tacPathBuffOk').click();
  await expect(page.locator('#tacPathBuffBody')).toContainText('测试');
  await expect(page.locator('#tacPathBuffBody')).toContainText('20%');
  await expect(page.locator('#tacPathBuffBody tbody tr')).toHaveCount(2);

  // 测算卡片的加成明细不受污染（状态不共享）
  await tool(page, 'measure');
  await expect(page.locator('#tacBuffDetailBody')).not.toContainText('膝跳反射');
  await expect(page.locator('#tacBuffDetailBody')).not.toContainText('测试');
  await tool(page, 'deduce');

  // 删除膝跳反射
  await page.locator('.tac-path-buff-del').first().click();
  await expect(page.locator('#tacPathBuffBody tbody tr')).toHaveCount(1);
  await expect(page.locator('#tacPathBuffBody')).not.toContainText('膝跳反射');
});
