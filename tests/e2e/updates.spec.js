import { test, expect } from './helpers.js';

// 左下角「更新公告」提示按钮与弹窗常驻回归。

test('footer updates button opens announcement dialog and closes via button or backdrop', async ({ page }) => {
  const btn = page.locator('#footerUpdatesBtn');
  await expect(btn).toBeVisible();
  const overlay = page.locator('#updatesOverlay');
  await expect(overlay).toBeHidden();
  // 打开：标题与最近更新内容
  await btn.click();
  await expect(overlay).toBeVisible();
  await expect(overlay.locator('.updates-title')).toHaveText('更新公告');
  await expect(overlay.locator('.updates-body')).toContainText('2026-11-03');
  await expect(overlay.locator('.updates-body .upd-list li').first()).not.toHaveText('');
  // 关闭按钮
  await overlay.locator('.updates-close').click();
  await expect(overlay).toBeHidden();
  // 再次打开后点击遮罩关闭
  await btn.click();
  await expect(overlay).toBeVisible();
  await overlay.click({ position: { x: 8, y: 8 } });
  await expect(overlay).toBeHidden();
});
