import { test, expect, tool, clickPoint, pickRole } from './helpers.js';

// 范围管理框（一级黄 / 二级绿 / 天赋行 / 填充 / 换行）常驻回归。

const rangeBox = (page) =>
  page.locator('#tacManageList .tac-manage-box:has(.tac-range-opt)').first();
const lv1 = (page, text) =>
  rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)', { hasText: text });
const lv2 = (page, text) =>
  rangeBox(page).locator('.tac-range-sub', { hasText: text });

async function placeRole(page, role, x = 0.3, y = 0.3) {
  await tool(page, 'roles');
  await pickRole(page, role);
  await clickPoint(page, x, y);
  await tool(page, 'select');
  await clickPoint(page, x, y);
}

test('range box: level-1 yellow, level-2 green toggles, desc lines (explorer)', async ({ page }) => {
  await placeRole(page, 'explorer');
  await lv1(page, '显示探险幻想范围').click();
  await expect(lv1(page, '显示探险幻想范围')).toHaveClass(/active/);
  await expect(lv2(page, '监管者感知范围')).toHaveClass(/active/);
  await expect(lv2(page, '密码书页最远刷新范围')).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveText([/监管者感知范围\s*60m/]);
  // 再点同一个一级按钮：无变化
  await lv1(page, '显示探险幻想范围').click();
  await expect(lv1(page, '显示探险幻想范围')).toHaveClass(/active/);
  await expect(lv2(page, '监管者感知范围')).toHaveCount(1);
  // 二级多选与取消
  await lv2(page, '密码书页最远刷新范围').click();
  await expect(lv2(page, '密码书页最远刷新范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(2);
  await lv2(page, '监管者感知范围').click();
  await expect(lv2(page, '监管者感知范围')).not.toHaveClass(/active/);
  // 切天赋一级：探险幻想二级行隐藏
  await lv1(page, '显示天赋范围').click();
  await expect(lv2(page, '监管者感知范围')).toHaveCount(0);
  await expect(lv2(page, '韦伯定律')).toHaveCount(1);
});

test('range box: role without ranges still gets talents + hide (forward)', async ({ page }) => {
  await placeRole(page, 'forward', 0.5, 0.5);
  await expect(rangeBox(page).locator('.tac-box-title')).toHaveCount(1);
  await expect(lv1(page, '显示天赋范围')).toHaveCount(1);
  await expect(lv1(page, '隐藏范围')).toHaveCount(1);
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveCount(2);
});

test('range box: default group level-1 button is yellow on first selection (catapult item)', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'toyMerchant');
  await clickPoint(page, 0.2, 0.4);
  await page.locator('.tac-item[data-kind="catapult"]').click();
  await clickPoint(page, 0.45, 0.4);
  await tool(page, 'select');
  await clickPoint(page, 0.45, 0.4);
  // 道具默认显示范围：二级「显示弹射板车范围」绿，一级按钮同时变黄
  await expect(lv2(page, '显示弹射板车范围')).toHaveClass(/active/);
  await expect(lv1(page, '显示弹射板车范围')).toHaveClass(/active/);
  await expect(page.locator('.tac-item-circle')).toHaveCount(1);
});

test('range box: unchecking fill keeps the range visible (musicbox)', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'femaleDancer');
  await clickPoint(page, 0.2, 0.6);
  await page.locator('.tac-item[data-kind="fastMusicbox"]').click();
  await clickPoint(page, 0.4, 0.6);
  await tool(page, 'select');
  await clickPoint(page, 0.4, 0.6);
  const circle = page.locator('.tac-item-circle');
  await expect(circle).toHaveCount(1);
  // 道具没有「显示天赋范围」
  await expect(lv1(page, '显示天赋范围')).toHaveCount(0);
  // 默认勾选范围填充；首次取消只取消填充，不隐藏范围
  const fillCb = rangeBox(page).locator('.tac-range-fill input');
  await expect(fillCb).toBeChecked();
  await fillCb.uncheck();
  await expect(circle).toHaveCount(1);
  await expect(fillCb).not.toBeChecked();
});

test('range box: customize has icon, no talents, slider radius 0 hides circle', async ({ page }) => {
  await placeRole(page, 'customize', 0.5, 0.2);
  // 图标正常渲染
  await expect(page.locator('.tac-token[data-role="customize"] img')).toHaveCount(1);
  // camp=other 不显示天赋范围
  await expect(lv1(page, '显示天赋范围')).toHaveCount(0);
  await expect(lv1(page, '显示自定义范围')).toHaveCount(1);
  await lv1(page, '显示自定义范围').click();
  const slider = rangeBox(page).locator('input[type="range"]');
  await expect(slider).toHaveCount(1);
  const roleCircle = page.locator('.tac-role-circle[data-role="customize"]');
  await slider.fill('0');
  await expect(roleCircle).toHaveCount(0);
  await slider.fill('20');
  await expect(roleCircle).toHaveCount(1);
});

test('range box: buttons wrap between each other, not inside', async ({ page }) => {
  await placeRole(page, 'theMindsEye', 0.6, 0.4);
  const wrapCss = await page.evaluate(() => {
    const opts = document.querySelector('#tacManageList .tac-range-opts');
    const btn = opts && opts.querySelector('.tac-range-opt');
    return opts && btn
      ? { wrap: getComputedStyle(opts).flexWrap, ws: getComputedStyle(btn).whiteSpace }
      : null;
  });
  expect(wrapCss).toEqual({ wrap: 'wrap', ws: 'nowrap' });
});
