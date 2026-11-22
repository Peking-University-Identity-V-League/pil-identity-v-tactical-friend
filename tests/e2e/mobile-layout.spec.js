import { test, expect } from '@playwright/test';

// 验证：手机横屏下顶栏保持单行、右侧卡片列收窄为两栏布局（抽屉方案已放弃）；
// 竖屏布局不受影响。

// 与 helpers.js 一致：拦截外部图片请求，保证全量并行时测试离线确定，
// 否则真实 CDN 加载在资源紧张时会把 click/goto 拖过 30s 超时（偶发失败）。
test.beforeEach(async ({ page }) => {
  await page.route('https://**/*', (route) => route.fulfill({
    status: 200,
    contentType: 'image/svg+xml',
    headers: { 'access-control-allow-origin': '*' },
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"><rect width="750" height="644" fill="#ccc"/></svg>',
  }));
});

test.describe('portrait phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('portrait: normal two-column layout untouched', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.home-card').first().click();
    await page.waitForTimeout(300);
    const pos = await page.locator('#tacPanel').evaluate((el) => getComputedStyle(el).position);
    expect(pos).not.toBe('fixed');
  });
});

test.describe('landscape layout', () => {
  test.use({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });

  test('landscape: single-line top bar, narrowed two-column layout', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
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
