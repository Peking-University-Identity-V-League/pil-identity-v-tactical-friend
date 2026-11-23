import { test, expect, tool, clickPoint, pickRole, read } from './helpers.js';

// 造物动画：放点 / 模式切换 / 播放与重置 / 撤销 / 拖点。

async function placeRole(page, role, x = 0.3, y = 0.3) {
  await tool(page, 'roles');
  await pickRole(page, role);
  await clickPoint(page, x, y);
  await tool(page, 'select');
}

async function setupAnim(page) {
  await placeRole(page, 'luckyGuy', 0.3, 0.3);
  await tool(page, 'anim');
  await clickPoint(page, 0.3, 0.3); // 选中造物
  await clickPoint(page, 0.6, 0.3); // 路径点 2
  await clickPoint(page, 0.6, 0.6); // 路径点 3
}

const setTime = (page, i, v) => page.locator('.tac-anim-pt input.tac-anim-num').nth(i)
  .evaluate((el, val) => { el.value = val; el.dispatchEvent(new Event('change')); }, v);

test('anim: waypoints get default times; first point is the token position', async ({ page }) => {
  await setupAnim(page);
  const dots = page.locator('.tac-anim-dot');
  await expect(dots).toHaveCount(3);
  await expect(dots.nth(0)).toHaveText('1');

  const token = (await read(page)).board.tokens[0];
  expect(token.anim.mode).toBe('time');
  expect(token.anim.points.length).toBe(3);
  expect(token.anim.times).toEqual([0, 3, 6]);
  expect(token.anim.points[0].x).toBeCloseTo(0.3, 3);
  expect(token.anim.points[0].y).toBeCloseTo(0.3, 3);

  await expect(page.locator('.tac-anim-ctl .tac-anim-derive')).toContainText('6');
});

test('anim: play moves the token to the last point; reset restores it', async ({ page }) => {
  await setupAnim(page);
  // 缩短到 0.4s 总时长：0 → 0.2 → 0.4
  await setTime(page, 1, '0.2');
  await setTime(page, 2, '0.4');

  const token = page.locator('.tac-token').first();
  await page.locator('.tac-anim-play-btn').click();
  await expect.poll(async () => token.evaluate((el) => el.style.left)).toBe('60%');
  await expect.poll(async () => token.evaluate((el) => el.style.top)).toBe('60%');
  // 坐标不写回：动画只改 DOM
  const st = (await read(page)).board.tokens[0];
  expect(st.x).toBeCloseTo(0.3, 3);

  await page.locator('.tac-anim-ctl .tac-anim-btn', { hasText: '重置' }).click();
  await expect.poll(async () => token.evaluate((el) => el.style.left)).toBe('30%');
  await expect.poll(async () => token.evaluate((el) => el.style.top)).toBe('30%');
});

test('anim: mode switch keeps points and derives speeds both ways', async ({ page }) => {
  await setupAnim(page);
  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '移速' }).click();
  let token = (await read(page)).board.tokens[0];
  expect(token.anim.mode).toBe('speed');
  expect(token.anim.speeds.length).toBe(2);
  expect(token.anim.points.length).toBe(3);
  await expect(page.locator('.tac-anim-speed-sel')).toHaveCount(2);

  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '时刻' }).click();
  token = (await read(page)).board.tokens[0];
  expect(token.anim.mode).toBe('time');
  expect(token.anim.times.length).toBe(3);
});

test('anim: undo removes the last waypoint', async ({ page }) => {
  await setupAnim(page);
  await page.keyboard.press('Control+z');
  const token = (await read(page)).board.tokens[0];
  expect(token.anim.points.length).toBe(2);
  await expect(page.locator('.tac-anim-dot')).toHaveCount(2);
});

test('anim: dragging a waypoint updates its position', async ({ page }) => {
  await setupAnim(page);
  const dot = page.locator('.tac-anim-dot').nth(2);
  const from = await dot.boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x - 80, from.y - 60, { steps: 5 });
  await page.mouse.up();
  const token = (await read(page)).board.tokens[0];
  expect(token.anim.points[2].x).toBeLessThan(0.6);
  expect(token.anim.points[2].y).toBeLessThan(0.6);
});

test('anim: dots and path stay visible in select tool; hide toggles work', async ({ page }) => {
  await setupAnim(page);
  await tool(page, 'select');
  // 选择工具下：时刻点与动画线仍然显示（选中造物有动画时）
  await expect(page.locator('.tac-anim-dot')).toHaveCount(3);
  await expect(page.locator('#tacArrowSvg polyline')).toHaveCount(1);

  // 隐藏时刻点 / 隐藏动画线
  await page.locator('.tac-manage-box input[data-h="dots"]').click();
  await expect(page.locator('.tac-anim-dot')).toHaveCount(0);
  await page.locator('.tac-manage-box input[data-h="path"]').click();
  await expect(page.locator('#tacArrowSvg polyline')).toHaveCount(0);

  // 取消勾选恢复显示
  await page.locator('.tac-manage-box input[data-h="dots"]').click();
  await expect(page.locator('.tac-anim-dot')).toHaveCount(3);
  await page.locator('.tac-manage-box input[data-h="path"]').click();
  await expect(page.locator('#tacArrowSvg polyline')).toHaveCount(1);
});

test('anim: hint differs between select tool and anim tool', async ({ page }) => {
  await placeRole(page, 'luckyGuy', 0.3, 0.3);
  await clickPoint(page, 0.3, 0.3);
  await expect(page.locator('.tac-manage-box .tac-box-hint').last()).toHaveText('未设置动画');
  await tool(page, 'anim');
  await expect(page.locator('.tac-anim-status')).toHaveText('在地图上点击添加路径点');
});

test('anim: arm toggle controls map-click adding and shows status', async ({ page }) => {
  await placeRole(page, 'luckyGuy', 0.3, 0.3);
  await tool(page, 'anim');
  await clickPoint(page, 0.3, 0.3);
  // 进入动画工具默认处于添加状态：按钮显示「点此取消添加」
  const status = page.locator('.tac-anim-status');
  const armBtn = page.locator('.tac-anim-arm-btn');
  await expect(status).toHaveText('在地图上点击添加路径点');
  await expect(armBtn).toHaveClass(/active/);
  await expect(armBtn).toHaveText('点此取消添加');
  // 取消添加：按钮回到「添加路径点」，无动画时状态文字变为「未设置动画」，地图点击不再加点
  await armBtn.click();
  await expect(armBtn).toHaveText('添加路径点');
  await expect(status).toHaveText('未设置动画');
  await clickPoint(page, 0.6, 0.3);
  await expect(page.locator('.tac-anim-dot')).toHaveCount(0);
  // 重新开启后可以加点
  await page.locator('.tac-anim-arm-btn').click();
  await clickPoint(page, 0.6, 0.3);
  await expect(page.locator('.tac-anim-dot')).toHaveCount(2);
  // Esc 取消添加状态
  await page.keyboard.press('Escape');
  await expect(page.locator('.tac-anim-arm-btn')).not.toHaveClass(/active/);
});

test('anim: time and speed inputs carry units', async ({ page }) => {
  await setupAnim(page);
  // 时刻模式：数字框后有 s
  const timeRow = page.locator('.tac-anim-pt').nth(1);
  await expect(timeRow.locator('.tac-anim-derive').first()).toHaveText('s');
  // 移速模式：数字框后有 m/s
  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '移速' }).click();
  const speedRow = page.locator('.tac-anim-pt').nth(1);
  await expect(speedRow.locator('.tac-anim-derive').nth(0)).toHaveText('m/s');
});

test('anim: speed buff shortens segment time and can be removed', async ({ page }) => {
  await setupAnim(page);
  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '移速' }).click();
  const total = page.locator('.tac-anim-ctl .tac-anim-derive');
  const before = parseFloat((await total.textContent()).match(/[\d.]+/)[0]);
  // 给第一段添加「膝跳反射」（+50% 持续 3s）
  const buffLine = page.locator('.tac-anim-buffs').first();
  await buffLine.locator('.tac-anim-buff-sel').first().selectOption({ label: '膝跳反射' });
  await buffLine.locator('.tac-anim-buff-add').click();
  await expect(page.locator('.tac-anim-chip')).toHaveCount(1);
  const during = parseFloat((await total.textContent()).match(/[\d.]+/)[0]);
  expect(during).toBeLessThan(before);
  // buff 已写入存档
  const token = (await read(page)).board.tokens[0];
  expect(token.anim.speeds[0].buffs.length).toBe(1);
  // 删除 chip 后恢复
  await page.locator('.tac-anim-chip-x').click();
  const after = parseFloat((await total.textContent()).match(/[\d.]+/)[0]);
  expect(after).toBeCloseTo(before, 2);
});

test('anim: speed presets follow the animated role', async ({ page }) => {
  // 普通求生者：四姿态 + 自定义，无角色专属移速
  await setupAnim(page);
  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '移速' }).click();
  const opts1 = await page.locator('.tac-anim-speed-sel').first().locator('option').allTextContents();
  expect(opts1.some((o) => o.includes('3.8'))).toBe(true);
  expect(opts1.some((o) => o.includes('滑翔'))).toBe(false);
  expect(opts1[opts1.length - 1]).toContain('自定义');

  // 玩具商：含专属移速「滑翔」
  await tool(page, 'roles');
  await pickRole(page, 'toyMerchant');
  await clickPoint(page, 0.8, 0.8);
  await tool(page, 'anim');
  await clickPoint(page, 0.8, 0.8);
  await clickPoint(page, 0.7, 0.7);
  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '移速' }).click();
  const opts2 = await page.locator('.tac-anim-speed-sel').first().locator('option').allTextContents();
  expect(opts2.some((o) => o.includes('滑翔') && o.includes('5.74'))).toBe(true);

  // 红蝶：美人相 / 般若相 两档
  await tool(page, 'roles');
  await pickRole(page, 'geisha');
  await clickPoint(page, 0.5, 0.8);
  await tool(page, 'anim');
  await clickPoint(page, 0.5, 0.8);
  await clickPoint(page, 0.4, 0.7);
  await page.locator('.tac-anim-mode .tac-anim-btn', { hasText: '移速' }).click();
  const opts3 = await page.locator('.tac-anim-speed-sel').first().locator('option').allTextContents();
  expect(opts3.some((o) => o.includes('美人相') && o.includes('4.73'))).toBe(true);
  expect(opts3.some((o) => o.includes('般若相') && o.includes('4.56'))).toBe(true);
  expect(opts3.some((o) => o.includes('3.8'))).toBe(false);
});
