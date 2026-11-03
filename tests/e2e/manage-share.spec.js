import { test, expect, tool, clickPoint, pickRole, read } from './helpers.js';

// 固定点位管理（照相机/控制台/零件/鳞片）跨同角色造物共享；密码书页管理不共享。

const state = (page) => read(page).then((r) => r.board);

async function placeRole(page, role, x, y) {
  await tool(page, 'roles');
  await pickRole(page, role);
  await clickPoint(page, x, y);
}

const fsBox = (page) =>
  page.locator('#tacManageList .tac-manage-box:has(.tac-manage-glow)');

test('照相机管理共享：多个摄影师的点位/朝向设置一致', async ({ page }) => {
  await placeRole(page, 'photographer', 0.2, 0.2);
  await placeRole(page, 'photographer', 0.4, 0.2);
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.2);
  const box = fsBox(page);
  await expect(box).toHaveCount(1);
  // 勾选「显示照相机点位」
  await box.locator('label', { hasText: '显示照相机点位' }).locator('input').check();
  await expect(page.locator('.tac-fixed-spawn')).not.toHaveCount(0);
  // 另一个摄影师的管理卡片同样勾选（共享）
  await clickPoint(page, 0.4, 0.2);
  await expect(fsBox(page).locator('label', { hasText: '显示照相机点位' }).locator('input')).toBeChecked();
  // 显示朝向也共享
  await fsBox(page).locator('label', { hasText: '显示朝向' }).locator('input').check();
  await expect(page.locator('.tac-fixed-spawn .cam-dir')).not.toHaveCount(0);
  // 回到第一个摄影师取消 → 两个摄影师的状态都关闭
  await clickPoint(page, 0.2, 0.2);
  await fsBox(page).locator('label', { hasText: '显示照相机点位' }).locator('input').uncheck();
  const board = await state(page);
  expect(board.tokens.filter((t) => t.role === 'photographer')
    .every((t) => !t.showFixedSpawns)).toBe(true);
  await expect(page.locator('.tac-fixed-spawn')).toHaveCount(0);
});

test('鳞片管理共享：多个教授的状态一致', async ({ page }) => {
  await placeRole(page, 'professor', 0.2, 0.3);
  await placeRole(page, 'professor', 0.4, 0.3);
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.3);
  await fsBox(page).locator('label', { hasText: '显示开局鳞片点位' }).locator('input').check();
  await expect(page.locator('.tac-fixed-spawn')).not.toHaveCount(0);
  await clickPoint(page, 0.4, 0.3);
  await expect(fsBox(page).locator('label', { hasText: '显示开局鳞片点位' }).locator('input')).toBeChecked();
});

test('密码书页管理不共享：开启一个冒险家会关闭其它所有冒险家', async ({ page }) => {
  // 第一个冒险家放在密码机密集处，保证有书页圈
  const pos = await page.evaluate(async () => {
    const { MAPS_DATA } = await import('/js/data/maps.js');
    const map = MAPS_DATA[0];
    const candidates = map.cipherCombinations[0].map((id) => map.ciphers.find((c) => c.id === id));
    const [width, height] = map.mapSize;
    candidates.sort((a, b) =>
      Math.hypot(a.location[0] / width - 0.5, a.location[1] / height - 0.5)
      - Math.hypot(b.location[0] / width - 0.5, b.location[1] / height - 0.5));
    return { x: candidates[0].location[0] / width, y: candidates[0].location[1] / height };
  });
  await placeRole(page, 'explorer', pos.x, pos.y);
  await placeRole(page, 'explorer', 0.85, 0.85);
  await tool(page, 'select');
  await clickPoint(page, pos.x, pos.y);
  const tgl = page.locator('.tac-manage-box').filter({ hasText: '密码书页管理' }).locator('input');
  await tgl.check();
  // 开启第二个冒险家的书页管理 → 第一个立即被关闭
  await clickPoint(page, 0.85, 0.85);
  await page.locator('.tac-manage-box').filter({ hasText: '密码书页管理' }).locator('input').check();
  const board = await state(page);
  const flags = board.tokens.filter((t) => t.role === 'explorer')
    .sort((a, b) => a.tid - b.tid)
    .map((t) => !!t.showTreasureRange);
  expect(flags).toEqual([false, true]);
  // 书页圈按开启中的冒险家（第二个）位置推算
  const expected = await page.evaluate(async () => {
    const { S } = await import('/js/core/state.js');
    const { MAPS_DATA } = await import('/js/data/maps.js');
    const { getTreasureRings } = await import('/js/core/treasure.js');
    const { TAC_TREASURE_RULE } = await import('/js/data/tactic-data.js');
    const { tacBoards } = await import('/js/core/persist.js');
    const tok = tacBoards[S.currentMapId].tokens.find((t) => t.role === 'explorer' && t.showTreasureRange);
    return getTreasureRings(MAPS_DATA[S.currentMapId], tok, S.currentCipherIndex, TAC_TREASURE_RULE).length;
  });
  await expect(page.locator('.tac-treasure-ring')).toHaveCount(expected);
});
