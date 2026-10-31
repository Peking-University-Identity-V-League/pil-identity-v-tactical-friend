import { test, expect, tool, clickPoint, pickRole, read } from './helpers.js';

// 多实例造物（同角色/同道具可放多个）+ 连线系统（同种两两相连 / 异造物相连）回归。

const linkBox = (page) =>
  page.locator('#tacManageList .tac-manage-box', { hasText: '连线管理' }).first();

async function placeRole(page, role, x = 0.3, y = 0.3) {
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

test('same role can be placed multiple times with numbered manage buttons', async ({ page }) => {
  await placeRole(page, 'doctor', 0.2, 0.2);
  await placeRole(page, 'doctor', 0.4, 0.4);
  const board = await state(page);
  expect(board.tokens.filter((t) => t.role === 'doctor')).toHaveLength(2);
  expect(board.tokens[0].tid).not.toBe(board.tokens[1].tid);
  const names = await page.locator('.tac-manage-btn-name').allTextContents();
  expect(names.filter((n) => /^医生 \d$/.test(n.trim()))).toHaveLength(2);
});

test('manage numbering counts by display name across roles and items', async ({ page }) => {
  await placeRole(page, 'disciple', 0.2, 0.2);
  await placeItem(page, 'disciple', 'guide', 0.3, 0.3);
  await placeItem(page, 'disciple', 'cat', 0.4, 0.4);
  await placeItem(page, 'disciple', 'guide', 0.5, 0.5);
  const names = (await page.locator('.tac-manage-btn-name').allTextContents()).map((n) => n.trim());
  expect(names).toEqual(['使徒', '指引 1', '爱猫', '指引 2']);
});

test('same item can be placed multiple times (lasso x2)', async ({ page }) => {
  await placeItem(page, 'cowboy', 'lasso', 0.2, 0.5);
  await placeItem(page, 'cowboy', 'lasso', 0.4, 0.5);
  const board = await state(page);
  expect(board.items.filter((it) => it.kind === 'lasso')).toHaveLength(2);
});

test('same-kind link: warp pairs automatically, third stays unlinked, relink on delete', async ({ page }) => {
  await placeRole(page, 'trait', 0.1, 0.1);
  await placeItem(page, 'trait', 'warp', 0.2, 0.3);
  await placeItem(page, 'trait', 'warp', 0.4, 0.3);
  await placeItem(page, 'trait', 'warp', 0.6, 0.3);
  let board = await state(page);
  const [w1, w2, w3] = board.items.filter((it) => it.kind === 'warp');
  expect(w1.linkIid).toBe(w2.iid);
  expect(w2.linkIid).toBe(w1.iid);
  expect(w3.linkIid == null).toBe(true);
  // 删除 1 号后，3 号自动与 2 号相连
  await tool(page, 'delete');
  await clickPoint(page, 0.2, 0.3);
  board = await state(page);
  const rest = board.items.filter((it) => it.kind === 'warp');
  expect(rest).toHaveLength(2);
  expect(rest[0].linkIid).toBe(rest[1].iid);
  expect(rest[1].linkIid).toBe(rest[0].iid);
});

test('same-kind link manage box: toggles checked, show-link hides the line', async ({ page }) => {
  await placeRole(page, 'trait', 0.1, 0.1);
  await placeItem(page, 'trait', 'warp', 0.2, 0.3);
  await placeItem(page, 'trait', 'warp', 0.4, 0.3);
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.3);
  const box = linkBox(page);
  await expect(box).toBeVisible();
  const hint = await box.locator('.tac-box-hint:not(.tac-link-status)').first().textContent().catch(() => '');
  expect(hint).toContain('60');
  // 状态行在说明文字之前
  await expect(box.locator('.tac-link-status')).toContainText(/当前已与 移行 ?2 连线/);
  const [autoCb, showCb] = await box.locator('input[type="checkbox"]').all();
  await expect(autoCb).toBeChecked();
  await expect(showCb).toBeChecked();
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(1);
  await showCb.uncheck();
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(0);
});

test('cross-kind link: umbrella links earliest wuchang, relinks on wuchang delete', async ({ page }) => {
  // 先创建镇魂伞，再创建宿伞之魂：创建角色时自动连线
  await placeItem(page, 'wuchang', 'umbrella', 0.5, 0.5);
  await placeRole(page, 'wuchang', 0.2, 0.2);
  await placeRole(page, 'wuchang', 0.8, 0.2);
  let board = await state(page);
  const [w1, w2] = board.tokens.filter((t) => t.role === 'wuchang');
  const umbrella = board.items.find((it) => it.kind === 'umbrella');
  expect(umbrella.linkTid).toBe(w1.tid);
  // 角色侧也有连线管理框，且状态行为「当前已与 镇魂伞 连线」
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.2);
  await expect(linkBox(page)).toBeVisible();
  await expect(linkBox(page).locator('.tac-link-status')).toContainText('当前已与 镇魂伞 连线');
  await expect(linkBox(page)).toContainText('84.4');
  // 删除 1 号宿伞之魂，镇魂伞自动连 2 号
  await tool(page, 'delete');
  await clickPoint(page, 0.2, 0.2);
  board = await state(page);
  expect(board.items.find((it) => it.kind === 'umbrella').linkTid).toBe(w2.tid);
});

test('cross-kind link: unchecking auto-link breaks pair and relinks partner', async ({ page }) => {
  await placeRole(page, 'wuchang', 0.2, 0.2);
  await placeItem(page, 'wuchang', 'umbrella', 0.5, 0.5);
  await placeItem(page, 'wuchang', 'umbrella', 0.6, 0.6);
  let board = await state(page);
  const [u1, u2] = board.items.filter((it) => it.kind === 'umbrella');
  const w1 = board.tokens.find((t) => t.role === 'wuchang');
  expect(u1.linkTid).toBe(w1.tid);
  expect(u2.linkTid == null).toBe(true);
  // 取消 u1 的自动连线 → u1 断开，u2 自动连上宿伞之魂
  await tool(page, 'select');
  await clickPoint(page, 0.5, 0.5);
  const autoCb = linkBox(page).locator('input[data-lk="auto"]');
  await autoCb.uncheck();
  board = await state(page);
  const [n1, n2] = board.items.filter((it) => it.kind === 'umbrella');
  expect(n1.linkTid == null).toBe(true);
  expect(n2.linkTid).toBe(w1.tid);
});

test('unlimited link: portal / ultralong passage pair with 无限制 hint and visible line', async ({ page }) => {
  await placeItem(page, 'priestess', 'straightPassage', 0.2, 0.3);
  await placeItem(page, 'priestess', 'straightPassage', 0.4, 0.3);
  await placeItem(page, 'priestess', 'ultralongPassage', 0.2, 0.6);
  await placeItem(page, 'priestess', 'ultralongPassage', 0.4, 0.6);
  let board = await state(page);
  const [p1, p2] = board.items.filter((it) => it.kind === 'straightPassage');
  expect(p1.linkIid).toBe(p2.iid);
  const [u1, u2] = board.items.filter((it) => it.kind === 'ultralongPassage');
  expect(u1.linkIid).toBe(u2.iid);
  // 两对连线都渲染
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(2);
  // 门之匙连线管理：无距离限制文案
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.3);
  const box = linkBox(page);
  await expect(box).toBeVisible();
  await expect(box.locator('.tac-link-status')).toContainText(/当前已与 门之匙 ?2 连线/);
  await expect(box).toContainText('两者距离无限制');
});

test('link-moment show sync: any checked -> both checked; both unchecked -> stays unchecked', async ({ page }) => {
  await placeRole(page, 'trait', 0.1, 0.1);
  await placeItem(page, 'trait', 'warp', 0.2, 0.3);
  // 移行1 未连线时取消显示连线
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.3);
  await linkBox(page).locator('input[data-lk="show"]').uncheck();
  // 创建移行2 自动相连：一端打勾（默认）→ 相连瞬间两端都勾
  await placeItem(page, 'trait', 'warp', 0.4, 0.3);
  let board = await state(page);
  const [w1, w2] = board.items.filter((it) => it.kind === 'warp');
  expect(w1.linkShow).toBe(true);
  expect(w2.linkShow).toBe(true);
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(1);
  // 两端都取消后再重连：保持未勾、线隐藏
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.3);
  await linkBox(page).locator('input[data-lk="show"]').uncheck();
  board = await state(page);
  expect(board.items.filter((it) => it.kind === 'warp')[1].linkShow).toBe(false);
  const allowCb = linkBox(page).locator('input[data-lk="auto"]');
  await allowCb.uncheck();
  await allowCb.check();
  board = await state(page);
  const [n1, n2] = board.items.filter((it) => it.kind === 'warp');
  expect(n1.linkShow).toBe(false);
  expect(n2.linkShow).toBe(false);
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(0);
});

test('link manage box sits right before the range manage box', async ({ page }) => {
  await placeItem(page, 'gameKeeper', 'chainHook', 0.3, 0.3);
  await tool(page, 'select');
  await clickPoint(page, 0.3, 0.3);
  const boxes = page.locator('#tacManageList .tac-manage-box');
  await expect(boxes.first()).toContainText('连线管理');
  await expect(boxes.nth(1)).toContainText('范围管理');
});
