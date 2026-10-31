import { test, expect, tool, clickPoint, pickRole, read, drag, point } from './helpers.js';

// 水渊管理（渔女/渔猎 连线语义）回归。

async function placeRole(page, role, x, y) {
  await tool(page, 'roles');
  await pickRole(page, role);
  await clickPoint(page, x, y);
}

async function placeItem(page, role, kind, x, y) {
  await tool(page, 'roles');
  await pickRole(page, role);
  await page.locator(`.tac-item[data-kind="${kind}"]`).click();
  await clickPoint(page, x, y);
}

const state = (page) => read(page).then((r) => r.board);

test('two naiad-spearfishing pairs simulate water independently', async ({ page }) => {
  await placeRole(page, 'naiad', 0.2, 0.2);
  await placeItem(page, 'naiad', 'spearfishing', 0.5, 0.2);
  await placeRole(page, 'naiad', 0.2, 0.6);
  await placeItem(page, 'naiad', 'spearfishing', 0.5, 0.6);

  let board = await state(page);
  const naiads = board.tokens.filter((t) => t.role === 'naiad');
  const spears = board.items.filter((it) => it.kind === 'spearfishing');
  expect(spears).toHaveLength(2);
  expect(spears[0].linkTid).toBe(naiads[0].tid);
  expect(spears[1].linkTid).toBe(naiads[1].tid);

  // 依次对两个渔女勾选 模拟水渊
  for (const [px, py] of [[0.2, 0.2], [0.2, 0.6]]) {
    await clickPoint(page, px, py);
    const cb = page.locator('.tac-manage-box input[data-ab="abyss"]');
    await expect(cb).toBeEnabled();
    await cb.click();
  }
  board = await state(page);
  expect(board.items.filter((it) => it.kind === 'spearfishing')
    .every((it) => it.abyss && it.abyss.on)).toBe(true);

  // 拖动第二个渔女：水渊只记录在相连的第二对渔猎上
  const from = await point(page, 0.2, 0.6);
  const to = await point(page, 0.35, 0.75);
  await drag(page, from, to);

  board = await state(page);
  const [sp1, sp2] = board.items.filter((it) => it.kind === 'spearfishing');
  expect(sp1.abyss.on).toBe(true);
  expect(sp1.abyss.recording).toBe(false);
  expect(sp1.abyss.done == null).toBe(true);
  expect(sp1.abyss.trail.length).toBe(0);
  expect(sp2.abyss.on).toBe(true);
  expect(sp2.abyss.recording).toBe(false);
  expect(sp2.abyss.done.length).toBeGreaterThan(1);
  await expect(page.locator('#tacArrowSvg polygon')).toHaveCount(1);
});

test('hidden role token renders as a dot instead of a character', async ({ page }) => {
  await placeRole(page, 'doctor', 0.3, 0.3);
  const token = page.locator('.tac-token');
  await expect(token).toHaveClass(/has-img/);
  // 选中后勾选 隐藏图标
  await clickPoint(page, 0.3, 0.3);
  await page.locator('.tac-manage-settings .tac-manage-hide input').check();
  await expect(token).toHaveClass(/as-dot/);
  await expect(token).not.toHaveClass(/has-img/);
  await expect(token).toHaveText('');
});
