import { test, expect } from '@playwright/test';

// 验证：手机横屏下顶栏保持单行、右侧卡片列为可收起抽屉；竖屏/首页不出现抽屉开关。

test.describe('portrait phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('portrait: no drawer toggle, normal two-column layout untouched', async ({ page }) => {
    await page.goto('/');
    await page.locator('.home-card').first().click();
    await page.waitForTimeout(300);
    // 竖屏不出现抽屉开关，面板仍在文档流中（非 fixed）
    await expect(page.locator('#drawerToggle')).toBeHidden();
    const pos = await page.locator('#tacPanel').evaluate((el) => getComputedStyle(el).position);
    expect(pos).not.toBe('fixed');
  });
});

test.describe('landscape layout', () => {
  test.use({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });

  test('landscape: single-line top bar, collapsible card drawer', async ({ page }) => {
    await page.goto('/');
    // 首页不显示抽屉开关
    await expect(page.locator('#drawerToggle')).toBeHidden();
    await page.locator('.home-card').first().click();
    await page.waitForTimeout(300);
    const topH = await page.locator('.view.active .top-bar').first().evaluate((el) => el.offsetHeight);
    expect(topH).toBeLessThan(60);
    // 单栏布局：地图占满宽度
    const cols = await page.locator('#tacticView .content-grid').evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').map((v) => parseFloat(v)));
    expect(cols).toHaveLength(1);
    // 抽屉默认收起：面板在屏幕右侧之外，悬浮开关可见
    const panel = page.locator('#tacPanel');
    const toggle = page.locator('#drawerToggle');
    await expect(toggle).toBeVisible();
    const closedBox = await panel.boundingBox();
    expect(closedBox.x).toBeGreaterThanOrEqual(844);
    // 打开抽屉：面板滑入、遮罩出现
    await toggle.click();
    await expect(panel).toHaveClass(/drawer-open/);
    await expect(page.locator('#drawerScrim')).toBeVisible();
    await page.waitForTimeout(350);
    const openBox = await panel.boundingBox();
    expect(openBox.width).toBeLessThanOrEqual(380);
    expect(openBox.x).toBeLessThan(844);
    // 打开时把手移到抽屉左缘，不压住面板内容（避免误点关闭）
    const toggleBox = await toggle.boundingBox();
    expect(toggleBox.x + toggleBox.width).toBeLessThanOrEqual(openBox.x + 1);
    // 点遮罩关闭
    await page.locator('#drawerScrim').click();
    await expect(panel).not.toHaveClass(/drawer-open/);
    await expect(page.locator('#drawerScrim')).toBeHidden();
    await page.waitForTimeout(350);
    const reclosedBox = await panel.boundingBox();
    expect(reclosedBox.x).toBeGreaterThanOrEqual(844);
    // 无横向溢出
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(844 + 1);
  });
});
