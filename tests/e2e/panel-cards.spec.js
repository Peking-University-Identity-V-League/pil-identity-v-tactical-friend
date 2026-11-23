import { test, expect, tool } from './helpers.js';

test('top toolbar buttons are visible in the sticky header', async ({ page }) => {
  const tools = page.locator('#tacTopTools .tac-tool');
  await expect(tools).toHaveCount(10);
  await expect(page.locator('#tacTopTools .tac-tool[data-tool="select"]')).toBeVisible();
  await expect(page.locator('#tacTopTools #tacExportBtn')).toBeVisible();
  // 管理卡片仍是面板第一张卡片，可折叠展开
  const card = page.locator('#tacManageCard');
  await expect(card).toHaveJSProperty('open', true);
  await card.locator('summary').first().click();
  await expect(card).toHaveJSProperty('open', false);
  await card.locator('summary').first().click();
  await expect(card).toHaveJSProperty('open', true);
});

test('switching tools reopens the matching sub card', async ({ page }) => {
  await tool(page, 'roles');
  const rolesCard = page.locator('#tacRolesCard');
  await expect(rolesCard).toBeVisible();
  await rolesCard.locator('summary').click();
  await expect(rolesCard).toHaveJSProperty('open', false);
  await tool(page, 'select');
  await expect(page.locator('#tacManageCard')).toHaveJSProperty('open', true);
  await page.locator('#tacManageCard summary').click();
  await expect(page.locator('#tacManageCard')).toHaveJSProperty('open', false);
  await tool(page, 'measure');
  await expect(page.locator('#tacMeasureCard')).toHaveJSProperty('open', true);
  await tool(page, 'display');
  await expect(page.locator('#tacDisplayCard')).toHaveJSProperty('open', true);
});
