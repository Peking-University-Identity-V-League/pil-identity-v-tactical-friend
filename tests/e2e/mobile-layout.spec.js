import { test, expect } from '@playwright/test';

// 验证：手机横屏下顶栏保持单行、右侧卡片列收窄为两栏布局（抽屉方案已放弃）；
// 竖屏布局不受影响。

test.describe('portrait phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('portrait: normal two-column layout untouched', async ({ page }) => {
    await page.goto('/');
    await page.locator('.home-card').first().click();
    await page.waitForTimeout(300);
    const pos = await page.locator('#tacPanel').evaluate((el) => getComputedStyle(el).position);
    expect(pos).not.toBe('fixed');
  });
});

test.describe('landscape layout', () => {
  test.use({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });

  test('landscape: single-line top bar, narrowed two-column layout', async ({ page }) => {
    await page.goto('/');
    await page.locator('.home-card').first().click();
    await page.waitForTimeout(300);
    // 顶栏单行
    const topH = await page.locator('.view.active .top-bar').first().evaluate((el) => el.offsetHeight);
    expect(topH).toBeLessThan(60);
    // 两栏布局：右侧卡片列收窄
    const cols = await page.locator('#tacticView .content-grid').evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').map((v) => parseFloat(v)));
    expect(cols).toHaveLength(2);
    expect(cols[1]).toBeLessThanOrEqual(380);
    // 面板在文档流中（非抽屉）
    const panel = page.locator('#tacPanel');
    const pos = await panel.evaluate((el) => getComputedStyle(el).position);
    expect(pos).not.toBe('fixed');
    await expect(panel).toBeVisible();
    // 抽屉开关与遮罩已移除
    await expect(page.locator('#drawerToggle')).toHaveCount(0);
    await expect(page.locator('#drawerScrim')).toHaveCount(0);
    // 无横向溢出
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(844 + 1);
  });
});
