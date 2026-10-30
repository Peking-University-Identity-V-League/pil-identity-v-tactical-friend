import { test, expect, read, waitForSave, tool, tab, pickRole, point, clickPoint, drag, reloadMap, switchMap } from './helpers.js';

test('drawing and deleting an arrow survive reload', async ({ page }) => {
  await tool(page, 'draw');
  await waitForSave(page);
  await drag(page, await point(page, 0.17, 0.23), await point(page, 0.40, 0.33));
  await waitForSave(page);
  const before = (await read(page)).board.arrows;
  expect(before).toHaveLength(1);
  await reloadMap(page);
  expect((await read(page)).board.arrows).toEqual(before);
  await tool(page, 'delete');
  const arrow = before[0];
  await clickPoint(page, (arrow.x1 + arrow.x2) / 2, (arrow.y1 + arrow.y2) / 2);
  await waitForSave(page);
  expect((await read(page)).stored.boards[0].arrows).toEqual([]);
  await reloadMap(page);
  expect((await read(page)).board.arrows).toEqual([]);
});

test('dragging a role saves its final position', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'doctor');
  await clickPoint(page, 0.2, 0.2);
  await waitForSave(page);
  await tool(page, 'select');
  await waitForSave(page);
  await drag(page, await point(page, 0.2, 0.2), await point(page, 0.5, 0.5));
  await waitForSave(page);
  await reloadMap(page);
  const token = (await read(page)).board.tokens.find((t) => t.role === 'doctor');
  expect(token.x).toBeCloseTo(0.5);
  expect(token.y).toBeCloseTo(0.5);
});

for (const kind of ['item', 'text']) {
  test(`dragging ${kind} past the debounce saves its final position`, async ({ page }) => {
    if (kind === 'item') {
      await tool(page, 'roles');
      await pickRole(page, 'doctor');
      await clickPoint(page, 0.15, 0.15);
      await page.locator('.tac-item[data-kind="syringe"]').click();
    } else {
      await tool(page, 'draw');
      await page.locator('#tacTextInput').fill('test');
      await page.locator('#tacTextAddBtn').click();
    }
    await clickPoint(page, 0.3, 0.3);
    await tool(page, 'select');
    await waitForSave(page);
    await page.clock.install();
    await page.clock.pauseAt(Date.now() + 1000);
    const from = await point(page, 0.3, 0.3);
    const to = await point(page, 0.5, 0.6);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    // Selection may save at pointerdown; the final position still needs saving.
    await page.clock.runFor(500);
    await page.mouse.move(to.x, to.y, { steps: 5 });
    await page.mouse.up();
    await page.clock.runFor(500);
    await page.reload();
    await page.locator('.home-card').first().click();
    const entry = (await read(page)).board[kind === 'item' ? 'items' : 'texts'][0];
    expect(entry.x).toBeCloseTo(0.5);
    expect(entry.y).toBeCloseTo(0.6);
  });
}

test('reload flushes a drawing before the debounce expires', async ({ page }) => {
  await tool(page, 'draw');
  await waitForSave(page);
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await drag(page, await point(page, 0.17, 0.23), await point(page, 0.40, 0.33));
  // No timer advance: pagehide must flush the pending save.
  await page.reload();
  await page.locator('.home-card').first().click();
  expect((await read(page)).board.arrows).toHaveLength(1);
});

test('region and board changes share one save without cancelling either', async ({ page }) => {
  await tab(page, 'region');
  await expect.poll(() => page.locator('#mapCanvas').evaluate((canvas) => canvas.width)).toBeGreaterThan(0);
  const zone = await page.evaluate(async () => {
    const { mapsZonesRelative } = await import('/js/data/geo.js');
    const z = mapsZonesRelative[0][0];
    return { x: z.x + z.width / 2, y: z.y + z.height / 2 };
  });
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await clickPoint(page, zone.x, zone.y, '#mapCanvas');
  await tab(page, 'tactic');
  await tool(page, 'roles');
  await pickRole(page, 'doctor');
  await clickPoint(page, 0.2, 0.2);
  await page.clock.runFor(500);
  const state = await read(page);
  expect(state.stored.regions[0].surv[0]).toBe(1);
  expect(state.stored.boards[0].tokens.find((t) => t.role === 'doctor').x).toBeCloseTo(0.2);
});

test('deduction marks survive reload before reopening the deduction tab', async ({ page }) => {
  await tab(page, 'deduce');
  await page.locator('.ded-marker:not([disabled])').first().click();
  await waitForSave(page);
  const marks = (await read(page)).marks;
  expect(Object.keys(marks)).toHaveLength(1);
  await reloadMap(page);
  expect((await read(page)).stored.dedMarks[0]).toEqual(marks);
  await tab(page, 'deduce');
  expect((await read(page)).marks).toEqual(marks);
});

test('pending deduction marks stay with their map during rapid switches', async ({ page }) => {
  await tab(page, 'deduce');
  await waitForSave(page);
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await page.locator('.ded-marker:not([disabled])').first().click();
  const marks = (await read(page)).marks;
  await tab(page, 'region');
  await switchMap(page, 1);
  expect((await read(page)).marks).toEqual({});
  await switchMap(page, 0);
  expect((await read(page)).marks).toEqual(marks);
  await switchMap(page, 1);
  await page.clock.runFor(500);
  const state = await read(page);
  expect(state.stored.dedMarks[0]).toEqual(marks);
  expect(state.stored.dedMarks[1]).toEqual({});
});

test('reset deduction persists across tab changes and reload', async ({ page }) => {
  await tab(page, 'deduce');
  await page.locator('.ded-marker:not([disabled])').first().click();
  await waitForSave(page);
  await page.locator('#dedResetBtn').click();
  await tab(page, 'region');
  await tab(page, 'deduce');
  expect((await read(page)).marks).toEqual({});
  await waitForSave(page);
  expect((await read(page)).stored.dedMarks[0]).toEqual({});
  await reloadMap(page);
  await tab(page, 'deduce');
  expect((await read(page)).marks).toEqual({});
});

test('cipher and dungeon selections are restored per map', async ({ page }) => {
  await tool(page, 'display');
  await page.locator('#tacDispCipherNext').click();
  await page.locator('#tacDungeonNext').click();
  await waitForSave(page);
  await switchMap(page, 1);
  expect((await read(page)).cipher).toBe(0);
  expect((await read(page)).dungeon).toBe(0);
  await switchMap(page, 0);
  expect((await read(page)).cipher).toBe(1);
  expect((await read(page)).dungeon).toBe(1);
  await reloadMap(page);
  expect((await read(page)).cipher).toBe(1);
  expect((await read(page)).dungeon).toBe(1);
});
