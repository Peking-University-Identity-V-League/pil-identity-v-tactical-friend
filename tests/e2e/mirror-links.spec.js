import { test, expect, tool, clickPoint, pickRole, read } from './helpers.js';

// 范围描述行删除×、水镜重复子按钮修复、连线状态行、显示连线共享、镜像管理共享。

const rangeBox = (page) =>
  page.locator('#tacManageList .tac-manage-box:has(.tac-range-opt)').first();
const lv1 = (page, text) =>
  rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)', { hasText: text });
const lv2 = (page, text) =>
  rangeBox(page).locator('.tac-range-sub', { hasText: text });
const linkBox = (page) =>
  page.locator('#tacManageList .tac-manage-box', { hasText: '连线管理' }).first();
const mirrorBox = (page) =>
  page.locator('#tacManageList .tac-manage-box', { hasText: '镜像管理' }).first();

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

test('range desc lines have hover delete × that removes range and un-highlights sub button', async ({ page }) => {
  await placeRole(page, 'bloodyQueen', 0.3, 0.3);
  await tool(page, 'select');
  await clickPoint(page, 0.3, 0.3);
  await lv1(page, '显示特质范围').click();
  await expect(lv1(page, '显示特质范围')).toHaveClass(/active/);
  // 一级按钮只展示二级按钮，不点亮；不出现与旧一级按钮重复的子按钮
  await expect(lv2(page, '显示水镜范围')).toHaveCount(0);
  await expect(lv2(page, '水镜可放置范围')).toHaveCount(1);
  await expect(lv2(page, '水镜可放置范围')).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(0);
  await expect(page.locator('.tac-role-circle')).toHaveCount(0);
  // 亲手点击二级按钮才点亮并显示描述
  await lv2(page, '水镜可放置范围').click();
  await expect(lv2(page, '水镜可放置范围')).toHaveClass(/active/);
  const descs = rangeBox(page).locator('.tac-range-desc');
  await expect(descs).toHaveCount(1);
  await expect(descs.first()).toContainText('水镜可放置范围 25.3m');
  // 悬浮删除 ×：描述消失、范围隐藏
  await descs.first().hover();
  await descs.first().locator('.tac-range-del').click();
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(0);
  await expect(page.locator('.tac-role-circle')).toHaveCount(0);

  // 二级按钮选中后出现描述，点 × 取消绿色
  await lv1(page, '显示天赋范围').click();
  await lv2(page, '成瘾症').click();
  await expect(lv2(page, '成瘾症')).toHaveClass(/active/);
  const tDesc = rangeBox(page).locator('.tac-range-desc', { hasText: '成瘾症' });
  await expect(tDesc).toHaveCount(1);
  await tDesc.hover();
  await tDesc.locator('.tac-range-del').click();
  await expect(lv2(page, '成瘾症')).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(0);
});

test('link box shows linked status name; show-link is shared by both ends', async ({ page }) => {
  await placeRole(page, 'trait', 0.1, 0.1);
  await placeItem(page, 'trait', 'warp', 0.2, 0.3);
  await placeItem(page, 'trait', 'warp', 0.4, 0.3);
  await tool(page, 'select');
  await clickPoint(page, 0.2, 0.3);
  const box = linkBox(page);
  await expect(box).toBeVisible();
  await expect(box.locator('.tac-link-status')).toContainText(/当前已与 移行 ?2 连线/);
  // 取消一端的显示连线，另一端一并取消
  await box.locator('input[data-lk="show"]').uncheck();
  let board = await state(page);
  const [w1, w2] = board.items.filter((it) => it.kind === 'warp');
  expect(w1.linkShow).toBe(false);
  expect(w2.linkShow).toBe(false);
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(0);
  // 重新勾选一端，两端都恢复
  await box.locator('input[data-lk="show"]').check();
  board = await state(page);
  const [n1, n2] = board.items.filter((it) => it.kind === 'warp');
  expect(n1.linkShow).not.toBe(false);
  expect(n2.linkShow).not.toBe(false);
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(1);
});

test('mirror manage: shared box, linked status, mirror create/remove via aqua state', async ({ page }) => {
  await placeRole(page, 'bloodyQueen', 0.3, 0.3);
  // 第一步：只有红夫人时也显示镜像管理（当前未连线，显示镜像等不可用）
  await tool(page, 'select');
  await clickPoint(page, 0.3, 0.3);
  let box = mirrorBox(page);
  await expect(box).toBeVisible();
  await expect(box.locator('.tac-link-status')).toHaveText('当前未连线');
  await expect(box.locator('input[data-mq="allow"]')).toBeChecked();
  await expect(box.locator('input[data-mq="link"]')).toBeDisabled();
  await expect(box.locator('input[data-mq="show"]')).toBeDisabled();
  await expect(box.locator('button[data-mq="fix"]')).toBeDisabled();
  await expect(box.locator('button.tac-manage-swap')).toBeDisabled();

  await placeItem(page, 'bloodyQueen', 'aquaMirror', 0.5, 0.3);
  let board = await state(page);
  const bq = board.tokens.find((t) => t.role === 'bloodyQueen');
  const aq = board.items.find((it) => it.kind === 'aquaMirror');
  // 水镜创建后自动与红夫人相连
  expect(aq.linkTid).toBe(bq.tid);
  // 选中红夫人：镜像管理共享框
  await tool(page, 'select');
  await clickPoint(page, 0.3, 0.3);
  box = mirrorBox(page);
  await expect(box).toBeVisible();
  await expect(box.locator('.tac-link-status')).toContainText('当前已与 水镜 连线');
  await expect(box).toContainText('允许连线');
  await expect(box).toContainText('显示连线');
  await expect(box).toContainText('显示镜像');
  await expect(box).toContainText('固定水镜位置');
  await expect(box).toContainText('交换镜像');
  // 勾选显示镜像 → 生成镜像造物，状态存于水镜
  await box.locator('input[data-mq="show"]').check();
  board = await state(page);
  const aq2 = board.items.find((it) => it.kind === 'aquaMirror');
  expect(aq2.showMirror).toBe(true);
  expect(board.items.some((it) => it.kind === 'mirrorImage')).toBe(true);
  // 选中水镜取消显示镜像 → 镜像销毁（共享状态）
  await clickPoint(page, 0.5, 0.3);
  await mirrorBox(page).locator('input[data-mq="show"]').uncheck();
  board = await state(page);
  expect(board.items.find((it) => it.kind === 'aquaMirror').showMirror).toBe(false);
  expect(board.items.some((it) => it.kind === 'mirrorImage')).toBe(false);
});

test('mirror swap and delete-relink of bloody queen', async ({ page }) => {
  await placeRole(page, 'bloodyQueen', 0.3, 0.3);
  await placeRole(page, 'bloodyQueen', 0.7, 0.3);
  await placeItem(page, 'bloodyQueen', 'aquaMirror', 0.5, 0.5);
  let board = await state(page);
  const [bq1, bq2] = board.tokens.filter((t) => t.role === 'bloodyQueen');
  expect(board.items.find((it) => it.kind === 'aquaMirror').linkTid).toBe(bq1.tid);
  // 显示镜像后交换
  await tool(page, 'select');
  await clickPoint(page, 0.3, 0.3);
  const box = mirrorBox(page);
  await box.locator('input[data-mq="show"]').check();
  board = await state(page);
  const mi = board.items.find((it) => it.kind === 'mirrorImage');
  const bqX = board.tokens.find((t) => t.tid === bq1.tid);
  const bx = bqX.x, by = bqX.y;
  await box.locator('button.tac-manage-swap').click();
  board = await state(page);
  const bqAfter = board.tokens.find((t) => t.tid === bq1.tid);
  const miAfter = board.items.find((it) => it.kind === 'mirrorImage');
  expect(bqAfter.x).toBeCloseTo(mi.x, 5);
  expect(miAfter.x).toBeCloseTo(bx, 5);
  expect(bqAfter.y).toBeCloseTo(mi.y, 5);
  expect(miAfter.y).toBeCloseTo(by, 5);
  // 删除相连的红夫人1：水镜改连红夫人2；相连瞬间镜像状态重置（显示镜像未打勾、镜像销毁）
  await tool(page, 'delete');
  await clickPoint(page, bqAfter.x, bqAfter.y);
  board = await state(page);
  const restBq = board.tokens.filter((t) => t.role === 'bloodyQueen');
  expect(restBq).toHaveLength(1);
  const relinkedAq = board.items.find((it) => it.kind === 'aquaMirror');
  expect(relinkedAq.linkTid).toBe(restBq[0].tid);
  expect(relinkedAq.showMirror).toBe(false);
  expect(board.items.some((it) => it.kind === 'mirrorImage')).toBe(false);
});

test('mirror link moment: showMirror/fixedMirror reset and mirror destroyed on link', async ({ page }) => {
  await placeRole(page, 'bloodyQueen', 0.3, 0.3);
  await placeItem(page, 'bloodyQueen', 'aquaMirror', 0.5, 0.5);
  await tool(page, 'select');
  await clickPoint(page, 0.5, 0.5);
  // 相连后勾选显示镜像 + 固定水镜位置
  const box = mirrorBox(page);
  await box.locator('input[data-mq="show"]').check();
  await box.locator('button[data-mq="fix"]').click();
  let board = await state(page);
  const aq = board.items.find((it) => it.kind === 'aquaMirror');
  expect(aq.showMirror).toBe(true);
  expect(aq.fixedMirror).toBe(true);
  expect(board.items.some((it) => it.kind === 'mirrorImage')).toBe(true);
  // 取消允许连线 → 解除相连
  await box.locator('input[data-mq="allow"]').uncheck();
  board = await state(page);
  expect(board.items.find((it) => it.kind === 'aquaMirror').linkTid == null).toBe(true);
  // 重新勾选允许连线 → 相连瞬间重置：显示镜像未打勾、固定水镜位置未点亮、镜像销毁
  await mirrorBox(page).locator('input[data-mq="allow"]').check();
  board = await state(page);
  const aq2 = board.items.find((it) => it.kind === 'aquaMirror');
  expect(aq2.linkTid).toBe(board.tokens.find((t) => t.role === 'bloodyQueen').tid);
  expect(aq2.showMirror).toBe(false);
  expect(aq2.fixedMirror).toBe(false);
  expect(board.items.some((it) => it.kind === 'mirrorImage')).toBe(false);
  // 未连线时显示连线默认打勾（禁用态）
  await mirrorBox(page).locator('input[data-mq="allow"]').uncheck();
  const showLinkCb = mirrorBox(page).locator('input[data-mq="link"]');
  await expect(showLinkCb).toBeChecked();
  await expect(showLinkCb).toBeDisabled();
});

test('mirror pair semantics: second pair, uncheck allow breaks link without stealing partner', async ({ page }) => {
  await placeRole(page, 'bloodyQueen', 0.15, 0.2);
  await placeItem(page, 'bloodyQueen', 'aquaMirror', 0.25, 0.35);
  await placeItem(page, 'bloodyQueen', 'aquaMirror', 0.55, 0.35);
  let board = await state(page);
  const bq1 = board.tokens.find((t) => t.role === 'bloodyQueen');
  const [aq1, aq2] = board.items.filter((it) => it.kind === 'aquaMirror');
  expect(aq1.linkTid).toBe(bq1.tid);
  expect(aq2.linkTid == null).toBe(true);
  // 水镜2 当前未连线；显示连线默认打勾（禁用）
  await tool(page, 'select');
  await clickPoint(page, 0.55, 0.35);
  await expect(mirrorBox(page).locator('.tac-link-status')).toHaveText('当前未连线');
  await expect(mirrorBox(page).locator('input[data-mq="link"]')).toBeChecked();
  await expect(mirrorBox(page).locator('input[data-mq="link"]')).toBeDisabled();
  // 创建红夫人2：水镜2 自动相连
  await placeRole(page, 'bloodyQueen', 0.65, 0.2);
  board = await state(page);
  const bq2 = board.tokens.filter((t) => t.role === 'bloodyQueen')[1];
  expect(board.items.filter((it) => it.kind === 'aquaMirror')[1].linkTid).toBe(bq2.tid);
  // 红夫人2 视角：当前已与 水镜 2 连线，且两对连线都渲染（红夫人2-水镜2 的线可见）
  await tool(page, 'select');
  await clickPoint(page, 0.65, 0.2);
  await expect(mirrorBox(page).locator('.tac-link-status')).toContainText(/当前已与 水镜 ?2 连线/);
  await expect(page.locator('#tacArrowSvg line')).toHaveCount(2);
  // 取消红夫人1 允许连线：解除相连，水镜1 保持未连线（不改抢红夫人2）
  await clickPoint(page, 0.15, 0.2);
  await mirrorBox(page).locator('input[data-mq="allow"]').uncheck();
  board = await state(page);
  const [r1, r2] = board.tokens.filter((t) => t.role === 'bloodyQueen');
  const [m1, m2] = board.items.filter((it) => it.kind === 'aquaMirror');
  expect(m1.linkTid == null).toBe(true);
  expect(m2.linkTid).toBe(r2.tid);
  await expect(mirrorBox(page).locator('.tac-link-status')).toHaveText('当前未连线');
  // 红夫人2 不受影响
  await clickPoint(page, 0.65, 0.2);
  await expect(mirrorBox(page).locator('.tac-link-status')).toContainText(/当前已与 水镜 ?2 连线/);
});

test('mirror drag: all of its range circles follow together', async ({ page }) => {
  await placeRole(page, 'bloodyQueen', 0.3, 0.3);
  await placeItem(page, 'bloodyQueen', 'aquaMirror', 0.5, 0.3);
  await tool(page, 'select');
  await clickPoint(page, 0.3, 0.3);
  const box = mirrorBox(page);
  await box.locator('input[data-mq="show"]').check();
  let board = await state(page);
  const miIdx = board.items.findIndex((it) => it.kind === 'mirrorImage');
  expect(miIdx).toBeGreaterThanOrEqual(0);
  const rangeBoxEl = page.locator('#tacManageList .tac-manage-box:has(.tac-range-opt)').first();
  // 点亮镜像自带的三个道具范围（第一个默认点亮）
  await clickPoint(page, board.items[miIdx].x, board.items[miIdx].y);
  await rangeBoxEl.locator('.tac-range-opt:not(.tac-range-sub)', { hasText: '显示道具范围' }).click();
  await expect(rangeBoxEl.locator('.tac-range-sub').nth(0)).toHaveClass(/active/);
  for (let i = 1; i < 3; i++) {
    await rangeBoxEl.locator('.tac-range-sub').nth(i).click();
    await page.waitForTimeout(150);
  }
  await expect(rangeBoxEl.locator('.tac-range-sub.active')).toHaveCount(3);
  const circles = page.locator(`.tac-item-circle[data-idx="${miIdx}"]`);
  await expect(circles).toHaveCount(3);
  const before = await circles.evaluateAll((els) =>
    els.map((el) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
  // 拖动镜像
  const wrap = await page.locator('#tacMapWrap').boundingBox();
  board = await state(page);
  const mi = board.items[miIdx];
  const from = { x: wrap.x + mi.x * wrap.width, y: wrap.y + mi.y * wrap.height };
  const to = { x: from.x + 40, y: from.y + 25 };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await page.mouse.up();
  board = await state(page);
  const miAfter = board.items[miIdx];
  expect(miAfter.x).not.toBeCloseTo(mi.x, 5);
  // 所有范围圈都应位于镜像新位置（回归：旧实现只移动第一个圈）
  const wrap2 = await page.locator('#tacMapWrap').boundingBox();
  const expX = wrap2.x + miAfter.x * wrap2.width;
  const expY = wrap2.y + miAfter.y * wrap2.height;
  const actual = await circles.evaluateAll((els) =>
    els.map((el) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
  actual.forEach((c, i) => {
    expect(Math.hypot(c.x - expX, c.y - expY)).toBeLessThan(2);
    expect(Math.hypot(c.x - before[i].x, c.y - before[i].y)).toBeGreaterThan(10);
  });
});
