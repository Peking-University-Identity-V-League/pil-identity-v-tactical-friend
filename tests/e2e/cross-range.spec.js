import { test, expect, tool, clickPoint, pickRole } from './helpers.js';

// 26号守卫炸弹（定时炸弹/遥控炸弹）十字形范围与角度管理常驻回归。

const rangeBox = (page) =>
  page.locator('#tacManageList .tac-manage-box:has(.tac-range-opt)').first();

async function placeBomb(page, kind) {
  await tool(page, 'roles');
  await pickRole(page, 'guard26');
  await clickPoint(page, 0.2, 0.3);
  await page.locator(`.tac-item[data-kind="${kind}"]`).click();
  await clickPoint(page, 0.5, 0.5);
  await tool(page, 'select');
  await clickPoint(page, 0.5, 0.5);
}

test('timeBomb: cross range two tiers, radius/width desc, multi-select', async ({ page }) => {
  await placeBomb(page, 'timeBomb');
  // 道具一级按钮统一为两个
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示道具范围', '隐藏范围']);
  // 新创建默认显示第一个范围：十字形（两个矩形臂）
  const cross = page.locator('.tac-item-circle.tac-item-cross');
  await expect(cross).toHaveCount(1);
  await expect(cross.locator('.tac-item-cross-svg rect')).toHaveCount(2);
  // 描述行：半径 + 宽度
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveText('0阶1阶爆炸范围 半径 10.5m 宽度 2.53m×');
  // 二级按钮多选：两个挡同时显示，出现两个十字
  await rangeBox(page).locator('.tac-range-sub', { hasText: '2阶爆炸范围' }).click();
  await expect(page.locator('.tac-item-circle.tac-item-cross')).toHaveCount(2);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(2);
  // 删除文本行的 ×：取消对应挡位
  await rangeBox(page).locator('.tac-range-desc', { hasText: '2阶爆炸范围' }).locator('.tac-range-del').click();
  await expect(page.locator('.tac-item-circle.tac-item-cross')).toHaveCount(1);
});

test('timeBomb: fill toggles cross fill; selected highlight is circular', async ({ page }) => {
  await placeBomb(page, 'timeBomb');
  const cross = page.locator('.tac-item-circle.tac-item-cross');
  const rect = cross.locator('.tac-item-cross-svg rect').first();
  const fillCb = rangeBox(page).locator('.tac-range-fill input');
  // 默认未勾选填充：十字无填充
  await expect(fillCb).not.toBeChecked();
  await expect(rect).toHaveCSS('fill', /none/);
  // 勾选填充：十字两个臂都填充，范围仍在
  await fillCb.check();
  await expect(rect).toHaveCSS('fill', /226, 232, 240/);
  await expect(cross).toHaveCount(1);
  await fillCb.uncheck();
  await expect(rect).toHaveCSS('fill', /none/);
  // 选中高亮边框为圆形
  await expect(cross).toHaveClass(/selected/);
  await expect(cross).toHaveCSS('border-radius', '50%');
});

test('dentist: mirror ranges render as annulus with inner/outer desc and fill', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'dentist');
  await clickPoint(page, 0.5, 0.5);
  await tool(page, 'select');
  await clickPoint(page, 0.5, 0.5);
  // 一级按钮显示二级：点亮 5档位口腔镜范围
  await rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)', { hasText: '显示特质范围' }).click();
  await rangeBox(page).locator('.tac-range-sub', { hasText: '5档位口腔镜范围' }).click();
  // 圆环形：SVG 环形路径
  const ring = page.locator('.tac-role-circle.tac-role-ring');
  await expect(ring).toHaveCount(1);
  await expect(ring.locator('.tac-role-ring-svg path')).toHaveCount(1);
  await expect(ring.locator('.tac-role-ring-svg path')).toHaveAttribute('fill-rule', 'evenodd');
  // 描述行：内半径/外半径
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveText('5档位口腔镜范围 内半径 4.56m 外半径 6.56m×');
  // 填充：默认无填充，勾选后圆环填充
  const path = ring.locator('.tac-role-ring-svg path');
  await expect(path).toHaveCSS('fill', /none/);
  const fillCb = rangeBox(page).locator('.tac-range-fill input');
  await fillCb.check();
  await expect(path).toHaveCSS('fill', /226, 232, 240/);
  await expect(ring).toHaveCount(1);
  // 多选：再点亮 10档位，出现两个圆环
  await rangeBox(page).locator('.tac-range-sub', { hasText: '10档位口腔镜范围' }).click();
  await expect(page.locator('.tac-role-circle.tac-role-ring')).toHaveCount(2);
});

test('remoteControlledBomb: angle box rotates cross and icon', async ({ page }) => {
  await placeBomb(page, 'remoteControlledBomb');
  const angleBox = page.locator('#tacManageList .tac-manage-box', { hasText: '角度管理' });
  await expect(angleBox).toHaveCount(1);
  const slider = angleBox.locator('input[type="range"]');
  // 拖动角度滑杆
  await slider.fill('90');
  await expect(angleBox.locator('.tac-range-val')).toHaveText('90°');
  // 十字形随角度旋转
  await expect(page.locator('.tac-item-circle.tac-item-cross g')).toHaveAttribute('transform', 'rotate(90 50 50)');
  // 图标随之旋转
  const transform = await page.locator('.tac-item-circle[data-idx] img').evaluate((el) => el.style.transform);
  expect(transform).toContain('rotate(90deg)');
  // 角度持久化到造物数据
  const angle = await page.evaluate(async () => {
    const { S } = await import('/js/core/state.js');
    const persist = await import('/js/core/persist.js');
    return persist.tacBoards[S.currentMapId].items[0].angle;
  });
  expect(angle).toBe(90);
  // 恢复默认（默认按钮）后角度清零、十字回到 0°
  await page.locator('#tacManageList .tac-manage-row .tac-manage-def input').click();
  await expect(angleBox.locator('.tac-range-val')).toHaveText('0°');
  await expect(page.locator('.tac-item-circle.tac-item-cross g')).toHaveAttribute('transform', 'rotate(0 50 50)');
});
