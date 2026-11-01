import { test, expect } from './helpers.js';

// 微信 / B 站 App 的 webview 拦截 <a download>，导出改为弹出图片供长按保存。

const UA_WECHAT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.44';
const UA_BILIBILI = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 bili/7.62.0';

for (const [name, userAgent] of [['WeChat', UA_WECHAT], ['Bilibili', UA_BILIBILI]]) {
  test.describe(`${name} webview export`, () => {
    test.use({ userAgent });

    test(`export shows long-press save overlay instead of download (${name})`, async ({ page }) => {
      await page.locator('#tacExportBtn').click();
      const overlay = page.locator('#tacSaveOverlay');
      await expect(overlay).toBeVisible();
      await expect(overlay.locator('.tac-save-tip')).toHaveText('长按图片保存到相册');
      const src = await page.locator('#tacSaveImg').getAttribute('src');
      expect(src).toMatch(/^data:image\/png;base64,/);
      // 关闭按钮与点背景均可关闭
      await page.locator('#tacSaveClose').click();
      await expect(overlay).toBeHidden();
      await page.locator('#tacExportBtn').click();
      await expect(overlay).toBeVisible();
      await overlay.click({ position: { x: 10, y: 10 } });
      await expect(overlay).toBeHidden();
    });
  });
}
