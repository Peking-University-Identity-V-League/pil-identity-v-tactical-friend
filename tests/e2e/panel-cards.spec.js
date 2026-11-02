import { test, expect, tool } from './helpers.js';

test('toolbar card collapses and expands via summary', async ({ page }) => {
  const card = page.locator('#tacPanel details.ded-card').first();
  await expect(card.locator('.tac-tools')).toBeVisible();
  await card.locator('summary').first().click();
  await expect(card.locator('.tac-tools')).toBeHidden();
  await card.locator('summary').first().click();
  await expect(card.locator('.tac-tools')).toBeVisible();
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
