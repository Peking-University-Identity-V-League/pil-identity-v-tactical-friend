import { test, expect, tool } from './helpers.js';

// 密码机卡片：进度设置、图标切换、与显示设置共享行的双向同步
test('cipher card progress & shared row sync', async ({ page }) => {
  await tool(page, 'select');
  const card = page.locator('#tacCipherCard');
  await expect(card).toBeVisible();

  // 首行共享状态与显示设置一致
  await expect(page.locator('#tacCipherCardText')).toHaveText(await page.locator('#tacDispCipherText').textContent());
  await expect(page.locator('#tacCipherCardShow')).toBeChecked();

  // 列表行数等于当前组密码机数量
  const rows = card.locator('.tac-cipher-row');
  const cipherCount = await page.locator('#tacMapWrap img.tac-cipher').count();
  await expect(rows).toHaveCount(cipherCount);

  // 开启第 1 台进度：滑条启用，地图出现百分比数字
  const first = rows.nth(0);
  const enable = first.locator('input[type="checkbox"]');
  const slider = first.locator('.tac-cipher-row-slider');
  await expect(slider).toBeDisabled();
  await enable.check();
  await expect(slider).toBeEnabled();
  await expect(first.locator('.tac-cipher-row-val')).toHaveText('0%');
  await expect(page.locator('.tac-cipher-pct')).toHaveCount(1);

  // 拖到 50%：图标仍为默认图标（仅 100% 才换图标）
  await slider.fill('50');
  await expect(first.locator('.tac-cipher-row-val')).toHaveText('50%');
  const mapIcons = page.locator('#tacMapWrap img.tac-cipher');
  const srcs = await mapIcons.evaluateAll((els) => els.map((e) => e.getAttribute('src')));
  expect(srcs.every((s) => !s.includes('470e117e'))).toBe(true);
  await expect(page.locator('.tac-cipher-pct')).toHaveText('50%');

  // 拖到 100%：图标换成完成图标
  await slider.fill('100');
  const srcs2 = await mapIcons.evaluateAll((els) => els.map((e) => e.getAttribute('src')));
  expect(srcs2.filter((s) => s.includes('470e117efe38e8ff949c47249932ec73262863779'))).toHaveLength(1);

  // 取消勾选：百分比数字消失，图标恢复默认
  await enable.uncheck();
  await expect(page.locator('.tac-cipher-pct')).toHaveCount(0);
  const srcs3 = await mapIcons.evaluateAll((els) => els.map((e) => e.getAttribute('src')));
  expect(srcs3.every((s) => !s.includes('470e117e'))).toBe(true);

  // 双向同步：显示设置里取消显示密码机 → 卡片勾选同步取消
  await tool(page, 'display');
  await page.locator('#tacShowCiphers').uncheck();
  await tool(page, 'select');
  await expect(page.locator('#tacCipherCardShow')).not.toBeChecked();
  await expect(page.locator('#tacMapWrap img.tac-cipher')).toHaveCount(0);
  // 卡片里重新勾选 → 显示设置同步
  await page.locator('#tacCipherCardShow').check();
  await expect(page.locator('#tacShowCiphers')).toBeChecked();
  await expect(page.locator('#tacMapWrap img.tac-cipher')).toHaveCount(cipherCount);

  // 卡片切组 → 显示设置文本同步
  const initialGroupText = await page.locator('#tacDispCipherText').textContent();
  await page.locator('#tacCipherCardNext').click();
  const groupText = await page.locator('#tacDispCipherText').textContent();
  expect(groupText).not.toBe(initialGroupText);
  await expect(page.locator('#tacCipherCardText')).toHaveText(groupText);
  await expect(rows).toHaveCount(cipherCount);

  // 图标大小共享：卡片滑条改动 → 显示设置滑条同步
  await page.locator('#tacCipherCardSize').fill('9');
  await expect(page.locator('#tacCipherSize')).toHaveValue('9');
  await expect(page.locator('#tacCipherCardSizeDef')).not.toBeChecked();
});
