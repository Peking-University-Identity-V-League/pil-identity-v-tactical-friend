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
