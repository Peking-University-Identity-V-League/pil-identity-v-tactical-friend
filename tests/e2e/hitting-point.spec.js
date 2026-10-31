import { test, expect, tool, clickPoint, pickRole, read, point, drag } from './helpers.js';

// 击球点链式连线（连线管理：允许连线 / 显示连线 / 提前闭合）回归。

const linkBox = (page) =>
  page.locator('#tacManageList .tac-manage-box', { hasText: '击球点管理' }).first();

async function placePoint(page, x, y) {
  await tool(page, 'roles');
  await pickRole(page, 'cueist');
  await page.locator('.tac-item[data-kind="contactPoint"]').click();
  await clickPoint(page, x, y);
}

async function selectPoint(page, x, y) {
  await tool(page, 'select');
  await clickPoint(page, x, y);
}

const state = (page) => read(page).then((r) => r.board);
const hpOf = (board) => board.items.filter((it) => it.kind === 'contactPoint');
// 边端点无序比较（实现里 a 为较新的点）
const edgeKey = (e) => [Math.min(e.a, e.b), Math.max(e.a, e.b), e.close];
const expectEdges = (edges, pairs) =>
  expect(edges.map(edgeKey)).toEqual(pairs.map(edgeKey));

test('hitting point: chain links in creation order, close-early forms closed shape', async ({ page }) => {
  await placePoint(page, 0.2, 0.3);
  await placePoint(page, 0.4, 0.3);
  await placePoint(page, 0.6, 0.3);
  let board = await state(page);
  const [p1, p2, p3] = hpOf(board);
  // 链式相连：1-2、2-3，均为普通边
  expectEdges(board.hpEdges, [
    { a: p1.iid, b: p2.iid, close: false },
    { a: p2.iid, b: p3.iid, close: false },
  ]);
  // 默认勾选允许连线和显示连线，未封闭态
  expect(p1.linkAuto).not.toBe(false);
  expect(p1.linkShow).not.toBe(false);
  expect(p1.hpClosed == null || p1.hpClosed === false).toBe(true);
  // 点1：单连线状态；两个文案；提前闭合不可用
  await selectPoint(page, 0.2, 0.3);
  let box = linkBox(page);
  await expect(box).toBeVisible();
  await expect(box.locator('.tac-link-status')).toContainText(/当前已与 击球点 ?2 连线/);
  await expect(box).toContainText('场上存在两个击球点造物时，自动连线');
  await expect(box).toContainText('35');
  await expect(box.locator('input[data-hp="allow"]')).toBeChecked();
  await expect(box.locator('input[data-hp="show"]')).toBeChecked();
  // 第3个开放点已出现：提前闭合对链上所有成员（共享）可用
  await expect(box.locator('input[data-hp="close"]')).toBeEnabled();
  // 点2：双连线状态 → 多个文案
  await selectPoint(page, 0.4, 0.3);
  box = linkBox(page);
  await expect(box.locator('.tac-link-status')).toContainText(/当前已与 击球点 ?1 和 击球点 ?3 连线/);
  await expect(box).toContainText('场上存在多个击球点造物时，自动连线');
  await expect(box.locator('input[data-hp="close"]')).toBeEnabled();
  // 点3是第3个开放点：提前闭合可用，点击后与最早的点1形成封闭
  await selectPoint(page, 0.6, 0.3);
  box = linkBox(page);
  await expect(box.locator('input[data-hp="close"]')).toBeEnabled();
  await box.locator('input[data-hp="close"]').click();
  board = await state(page);
  expect(board.hpEdges).toHaveLength(3);
  expect(board.hpEdges.filter((e) => e.close)).toHaveLength(1);
  // 封闭边是 1-3
  expectEdges(board.hpEdges.filter((e) => e.close),
    [{ a: p1.iid, b: p3.iid, close: true }]);
  expect(hpOf(board).every((o) => o.hpClosed)).toBe(true);
  // 三条边都渲染（含一条虚线封闭边）
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(3);
  await expect(page.locator('#tacArrowSvg line[style*="dasharray"], #tacArrowSvg line[stroke-dasharray]')).toHaveCount(1);
  // 封闭后状态文案：点1 与点2连线、与点3封闭；点2 双连线
  await selectPoint(page, 0.2, 0.3);
  await expect(linkBox(page).locator('.tac-link-status'))
    .toContainText(/当前已与 击球点 ?2 连线，与 击球点 ?3 形成封闭/);
  await selectPoint(page, 0.4, 0.3);
  await expect(linkBox(page).locator('.tac-link-status'))
    .toContainText(/当前已与 击球点 ?1 和 击球点 ?3 连线/);
});

test('hitting point: fourth open point auto-closes with the earliest', async ({ page }) => {
  await placePoint(page, 0.2, 0.2);
  await placePoint(page, 0.4, 0.2);
  await placePoint(page, 0.4, 0.4);
  await placePoint(page, 0.2, 0.4);
  const board = await state(page);
  const [p1, p2, p3, p4] = hpOf(board);
  expectEdges(board.hpEdges, [
    { a: p1.iid, b: p2.iid, close: false },
    { a: p2.iid, b: p3.iid, close: false },
    { a: p3.iid, b: p4.iid, close: false },
    { a: p4.iid, b: p1.iid, close: true },
  ]);
  expect(hpOf(board).every((o) => o.hpClosed)).toBe(true);
  // 点4：与点3连线、与点1封闭
  await selectPoint(page, 0.2, 0.4);
  await expect(linkBox(page).locator('.tac-link-status'))
    .toContainText(/当前已与 击球点 ?3 连线，与 击球点 ?1 形成封闭/);
});

test('hitting point: unchecking allow-link dissolves the whole component', async ({ page }) => {
  await placePoint(page, 0.2, 0.3);
  await placePoint(page, 0.4, 0.3);
  await placePoint(page, 0.6, 0.3);
  await selectPoint(page, 0.6, 0.3);
  await linkBox(page).locator('input[data-hp="close"]').click();
  let board = await state(page);
  expect(hpOf(board).every((o) => o.hpClosed)).toBe(true);
  // 取消点2的允许连线：整个组件解除连线、恢复未封闭、全部取消允许连线
  await selectPoint(page, 0.4, 0.3);
  await linkBox(page).locator('input[data-hp="allow"]').uncheck();
  board = await state(page);
  expect(board.hpEdges).toEqual([]);
  expect(hpOf(board).every((o) => o.linkAuto === false)).toBe(true);
  expect(hpOf(board).every((o) => !o.hpClosed)).toBe(true);
  // 全部回到当前未连线
  await selectPoint(page, 0.2, 0.3);
  await expect(linkBox(page).locator('.tac-link-status')).toContainText('当前未连线');
  // 显示连线随允许连线取消而禁用
  await expect(linkBox(page).locator('input[data-hp="show"]')).toBeDisabled();
});

test('hitting point: show-link is shared within the component only', async ({ page }) => {
  await placePoint(page, 0.2, 0.3);
  await placePoint(page, 0.4, 0.3);
  // 取消点1显示连线：组件内共享，两条边都不渲染
  await selectPoint(page, 0.2, 0.3);
  await linkBox(page).locator('input[data-hp="show"]').uncheck();
  let board = await state(page);
  expect(hpOf(board).every((o) => o.linkShow === false)).toBe(true);
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(0);
  // 新建点3（另一个链的开放点未受影响）：点3连点2，相连瞬间显示连线打勾
  await placePoint(page, 0.6, 0.3);
  board = await state(page);
  const [p1, p2, p3] = hpOf(board);
  expect(p1.linkShow).toBe(false);
  expect(p2.linkShow).toBe(true);
  expect(p3.linkShow).toBe(true);
  // 只有新边渲染
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(1);
});

test('hitting point: deleting closed point removes whole shape, open point removes only itself', async ({ page }) => {
  // 封闭图形整体删除
  await placePoint(page, 0.2, 0.2);
  await placePoint(page, 0.4, 0.2);
  await placePoint(page, 0.4, 0.4);
  await selectPoint(page, 0.4, 0.4);
  await linkBox(page).locator('input[data-hp="close"]').click();
  await tool(page, 'delete');
  await clickPoint(page, 0.2, 0.2);
  let board = await state(page);
  expect(hpOf(board)).toHaveLength(0);
  expect(board.hpEdges).toEqual([]);
  // 未封闭链只删自己
  await placePoint(page, 0.2, 0.6);
  await placePoint(page, 0.4, 0.6);
  await tool(page, 'delete');
  await clickPoint(page, 0.2, 0.6);
  board = await state(page);
  expect(hpOf(board)).toHaveLength(1);
  expect(board.hpEdges).toEqual([]);
  expect(hpOf(board)[0].hpClosed == null || hpOf(board)[0].hpClosed === false).toBe(true);
});

test('hitting point: rejoin order follows join time, not creation order (step 9 flow)', async ({ page }) => {
  // 第一链：1-2-3-4，4 个开放点自动闭合（2-4? 不：最早是1 → 封闭边 4-1）
  await placePoint(page, 0.1, 0.1);
  await placePoint(page, 0.2, 0.1);
  await placePoint(page, 0.2, 0.2);
  await placePoint(page, 0.1, 0.2);
  // 第二链：5-6 相连
  await placePoint(page, 0.6, 0.1);
  await placePoint(page, 0.7, 0.1);
  let board = await state(page);
  const [p1, p2, p3, p4, p5, p6] = hpOf(board);
  expectEdges(board.hpEdges, [
    { a: p1.iid, b: p2.iid, close: false },
    { a: p2.iid, b: p3.iid, close: false },
    { a: p3.iid, b: p4.iid, close: false },
    { a: p4.iid, b: p1.iid, close: true },
    { a: p5.iid, b: p6.iid, close: false },
  ]);
  // 第七步：取消击球点2的允许连线 → 1234 全部解散
  await selectPoint(page, 0.2, 0.1);
  await linkBox(page).locator('input[data-hp="allow"]').uncheck();
  board = await state(page);
  expect(board.hpEdges).toHaveLength(1);
  expect(hpOf(board).slice(0, 4).every((o) => o.linkAuto === false)).toBe(true);
  // 第八步：击球点1允许连线 → 与最近加入的击球点6相连
  await selectPoint(page, 0.1, 0.1);
  await linkBox(page).locator('input[data-hp="allow"]').check();
  board = await state(page);
  expectEdges(board.hpEdges, [
    { a: p5.iid, b: p6.iid, close: false },
    { a: p1.iid, b: p6.iid, close: false },
  ]);
  // 第九步：击球点2允许连线 → 与击球点1相连，成为第4个开放点，自动与最早的击球点5封闭
  await selectPoint(page, 0.2, 0.1);
  await linkBox(page).locator('input[data-hp="allow"]').check();
  board = await state(page);
  expectEdges(board.hpEdges, [
    { a: p5.iid, b: p6.iid, close: false },
    { a: p1.iid, b: p6.iid, close: false },
    { a: p2.iid, b: p1.iid, close: false },
    { a: p2.iid, b: p5.iid, close: true },
  ]);
  // 新封闭图形 5-6-1-2 的四个成员转为封闭态（已解散的 3、4 号不在其中）
  const byIid = Object.fromEntries(hpOf(board).map((o) => [o.iid, o]));
  for (const o of [p1, p2, p5, p6]) expect(byIid[o.iid].hpClosed).toBe(true);
  expect(byIid[p3.iid].hpClosed).toBeFalsy();
});

test('hitting point: link distance clamped to 4-35m on join and drag', async ({ page }) => {
  // 创建钳制（上限）：相距约 41m > 35m，放置后钳到 35m
  await placePoint(page, 0.3, 0.5);
  await placePoint(page, 0.55, 0.5);
  let board = await state(page);
  let [p1, p2] = hpOf(board);
  const d0 = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 166.2;
  expect(d0).toBeGreaterThanOrEqual(34);
  expect(d0).toBeLessThanOrEqual(35.6);
  // 拖动钳制（下限）：把点2拖到点1上，重合时推出到 4m
  const from = await point(page, p2.x, p2.y);
  const to = await point(page, p1.x, p1.y);
  await drag(page, from, to);
  board = await state(page);
  [p1, p2] = hpOf(board);
  const d1 = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 166.2;
  expect(d1).toBeGreaterThanOrEqual(3.9);
  expect(d1).toBeLessThanOrEqual(4.1);
  // 封闭图形后仍可拖动：点3、点4形成闭合，拖动点1到远处被钳到 35m 内
  await placePoint(page, 0.35, 0.55);
  await placePoint(page, 0.32, 0.52);
  board = await state(page);
  expect(hpOf(board).every((o) => o.hpClosed)).toBe(true);
  const from2 = await point(page, p1.x, p1.y);
  const to2 = await point(page, 0.85, 0.5);
  await drag(page, from2, to2);
  board = await state(page);
  [p1, p2] = hpOf(board);
  const d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 166.2;
  expect(d2).toBeLessThanOrEqual(35.6);
  expect(p1.x).toBeGreaterThan(0.45); // 确实拖动了
});
