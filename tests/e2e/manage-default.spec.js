import { test, expect, tool, pickRole, clickPoint } from './helpers.js';

// 回归：放置带范围的道具后，其「默认」勾选曾永远勾不上
// （itemRangeIsDefault 误判 rangeBox 存在即非默认）。
// 默认 = 第一项范围显示、无天赋/档位/自定义半径，勾选后应恢复并可保持勾选。

test('range item default checkbox reflects and restores the default state', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'femaleDancer');
  await clickPoint(page, 0.4, 0.4);
  await page.locator('.tac-item[data-kind="fastMusicbox"]').click();
  await clickPoint(page, 0.6, 0.6);
  await tool(page, 'select');
  await clickPoint(page, 0.6, 0.6);

  const defCb = page.locator('#tacManageList .tac-manage-def input');
  // 新放置的范围道具处于默认状态 → 已勾选
  await expect(defCb).toBeChecked();

  // 改动范围（隐藏）→ 取消勾选
  await page.locator('.tac-range-opt', { hasText: /隐藏|Hide|Ẩn/ }).first().click();
  await expect(defCb).not.toBeChecked();

  // 勾选「默认」→ 恢复默认范围并保持勾选
  await page.locator('#tacManageList .tac-manage-def').click();
  await expect(defCb).toBeChecked();
});

// 回归：文字实际最小字号曾停在 12（floor 2.2cqw），现支持到 6
test('text size 6 renders smaller than size 12', async ({ page }) => {
  await tool(page, 'draw');
  await page.locator('#tacTextSize').fill('6');
  await page.locator('#tacTextInput').fill('小字');
  await page.locator('#tacTextAddBtn').click();
  await clickPoint(page, 0.5, 0.3);
  // 刷新清空选中态：否则刚放置的文字处于选中，改滑杆会回改它
  await page.reload();
  await page.locator('.home-card').first().click();
  await tool(page, 'draw');
  await page.locator('#tacTextSize').fill('12');
  await page.locator('#tacTextInput').fill('中字');
  await page.locator('#tacTextAddBtn').click();
  await clickPoint(page, 0.5, 0.6);

  await expect(page.locator('.tac-text')).toHaveCount(2);
  const fs6 = await page.locator('.tac-text').nth(0)
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const fs12 = await page.locator('.tac-text').nth(1)
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fs6).toBeGreaterThan(3);
  expect(fs6).toBeLessThan(fs12);
});
