import { test, expect, read, waitForSave, tool, point, clickPoint, drag, reloadMap, drawRoute, selectSegment } from './helpers.js';

test('new route after reload gets a different ID and deletes independently', async ({ page }) => {
  await drawRoute(page);
  const original = (await read(page)).board.measures;
  await reloadMap(page);
  await tool(page, 'measure');
  await page.locator('[data-mmode="chain"]').click();
  await clickPoint(page, 0.14, 0.72);
  await clickPoint(page, 0.38, 0.78);
  await page.keyboard.press('Escape');
  const all = (await read(page)).board.measures;
  expect(all).toHaveLength(3);
  expect(all[2].chain).not.toBe(original[0].chain);
  expect(all[2].lc.lid).not.toBe(original[0].lc.lid);
  await tool(page, 'delete');
  await selectSegment(page, 2);
  expect((await read(page)).board.measures).toEqual(original);
});

test('whole-route editing still updates every segment after reload', async ({ page }) => {
  await drawRoute(page);
  await reloadMap(page);
  await tool(page, 'measure');
  await page.locator('[data-mmode="chain"]').click();
  await selectSegment(page, 0);
  expect((await read(page)).selectedSegments).toBe(2);
  expect((await read(page)).shared).toBe(true);
  await page.locator('#tacBaseSpeed').fill('8');
  for (const segment of (await read(page)).board.measures) {
    expect(segment.lc.bases).toHaveLength(1);
    expect(segment.lc.bases[0]).toMatchObject({ from: 0, to: 2, speed: 8 });
  }
  await waitForSave(page);
  await reloadMap(page);
  expect((await read(page)).board.measures[1].lc.bases[0].speed).toBe(8);
});

test('a new bonus after reload has a unique ID and deletes independently', async ({ page }) => {
  await drawRoute(page);
  await selectSegment(page, 0);
  await page.locator('#tacBuffAddBtn').click();
  await page.locator('#tacBuffName').fill('original');
  await page.locator('#tacBuffPct').fill('10');
  await page.locator('#tacBuffOk').click();
  const original = (await read(page)).board.measures[0].lc.buffs;
  expect(original).toHaveLength(1);
  await waitForSave(page);
  await reloadMap(page);
  await tool(page, 'measure');
  await page.locator('[data-mmode="chain"]').click();
  await selectSegment(page, 0);
  await page.locator('#tacBuffAddBtn').click();
  await page.locator('#tacBuffName').fill('new');
  await page.locator('#tacBuffPct').fill('20');
  await page.locator('#tacBuffOk').click();
  const buffs = (await read(page)).board.measures[0].lc.buffs;
  expect(buffs).toHaveLength(2);
  expect(buffs[1].id).not.toBe(original[0].id);
  if (!await page.locator('#tacBuffDetailBody').isVisible()) {
    await page.locator('#tacBuffDetailToggle').click();
  }
  await page.locator(`[data-bdel="${buffs[1].id}"]`).click();
  expect((await read(page)).board.measures[0].lc.buffs).toEqual(original);
});

for (const fixedIndex of [0, 1]) {
  test(`whole-route bonus skips fixed speed at segment ${fixedIndex + 1}`, async ({ page }) => {
    await drawRoute(page);
    await page.locator('[data-scope="seg"]').click();
    await selectSegment(page, fixedIndex);
    await page.locator('#tacSpeedRole').selectOption('fixed');
    await page.locator('#tacSpeedForm').selectOption('toyMerchant:0');
    await page.locator('[data-scope="chain"]').click();
    await page.locator('#tacBuffAddBtn').click();
    await page.locator('#tacBuffName').fill('test');
    await page.locator('#tacBuffPct').fill('50');
    await page.locator('#tacBuffOk').click();
    const rows = page.locator('#tacResult tr.tac-seg-sum');
    await expect(rows.nth(fixedIndex).locator('td').nth(3)).toHaveText('5.74');
    await expect(rows.nth(fixedIndex).locator('td').nth(4)).toHaveText('0%');
    await expect(rows.nth(1 - fixedIndex).locator('td').nth(3)).toHaveText('5.70');
  });
}

test('overlapping endpoints render zero time and can be dragged apart again', async ({ page }) => {
  await tool(page, 'measure');
  await clickPoint(page, 0.15, 0.36);
  await clickPoint(page, 0.4, 0.36);
  const segment = (await read(page)).board.measures[0];
  await drag(page, await point(page, segment.x2, segment.y2), await point(page, segment.x1, segment.y1));
  const cells = page.locator('#tacResult tr.tac-seg-sum td');
  await expect(cells.nth(1)).toHaveText('0');
  await expect(cells.nth(2)).toHaveText('0.00');
  await expect(cells.nth(3)).toHaveText('--');
  await waitForSave(page);
  await reloadMap(page);
  await tool(page, 'measure');
  await expect(cells.nth(2)).toHaveText('0.00');
  await drag(page, await point(page, segment.x1, segment.y1), await point(page, 0.4, 0.36));
  await expect(cells.nth(2)).not.toHaveText('0.00');
});

test('undo single-segment deletion restores route IDs, configs and shared references', async ({ page }) => {
  await drawRoute(page, 3);
  // Include a segment-specific base so undo must restore more than geometry.
  await page.locator('[data-scope="seg"]').click();
  await selectSegment(page, 1);
  await page.locator('#tacBaseSpeed').fill('5');
  const original = (await read(page)).board.measures;
  await tool(page, 'display');
  await page.locator('#tacDelSegOnly').check();
  await tool(page, 'delete');
  await selectSegment(page, 1);
  expect((await read(page)).board.measures).toHaveLength(2);
  await page.locator('#tacUndoBtn').click();
  expect((await read(page)).board.measures).toEqual(original);
  expect((await read(page)).shared).toBe(true);
  await waitForSave(page);
  await reloadMap(page);
  expect((await read(page)).board.measures).toEqual(original);
  expect((await read(page)).shared).toBe(true);
});
