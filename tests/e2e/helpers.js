import { test as base, expect } from '@playwright/test';

export { expect };
export const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    // Keep the tests offline and deterministic; they exercise state and input,
    // not image appearance or the availability of the external image host.
    await page.route('https://**/*', (route) => route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      headers: { 'access-control-allow-origin': '*' },
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"><rect width="750" height="644" fill="#ccc"/></svg>',
    }));
    await page.goto('/');
    await page.locator('.home-card').first().click();
    await waitForSave(page);
    await use(page);
    expect(errors, 'Uncaught browser errors').toEqual([]);
  },
});

// Read-only inspection: all board edits in the tests go through the UI.
export async function read(page) {
  return page.evaluate(async () => {
    const tactic = await import('/js/tactic.js');
    const persist = await import('/js/core/persist.js');
    const { S } = await import('/js/core/state.js');
    const board = persist.tacBoards[S.currentMapId];
    return {
      map: S.currentMapId,
      board,
      stored: JSON.parse(localStorage.getItem(persist.TAC_LS_KEY)),
      marks: S.dedMarks,
      survivors: S.survivorState,
      cipher: S.currentCipherIndex,
      dungeon: S.tacDungeonIndex,
      selectedSegments: tactic.tacSelLine()?.n,
      shared: board.measures.length > 1 && board.measures[0].lc === board.measures[1].lc,
    };
  });
}

export async function waitForSave(page) {
  await expect.poll(() => page.evaluate(async () =>
    (await import('/js/core/persist.js')).tacSaveTimer === null)).toBe(true);
}

export const tool = (page, name) => page.locator(`.tac-tool[data-tool="${name}"]`).click();
export const tab = (page, name) => page.locator(`.tab-btn[data-tab="${name}"]`).click();
export async function pickRole(page, role) {
  const btn = page.locator(`.tac-role[data-role="${role}"]`);
  const camp = page.locator(`.tac-camp:has(.tac-role[data-role="${role}"])`);
  if (await camp.evaluate((el) => el.classList.contains('collapsed'))) {
    await camp.locator('.tac-camp-header').click();
  }
  await btn.click();
}

export async function point(page, x, y, selector = '#tacMapWrap') {
  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  const rect = await locator.boundingBox();
  return { x: rect.x + rect.width * x, y: rect.y + rect.height * y };
}

export async function clickPoint(page, x, y, selector) {
  const p = await point(page, x, y, selector);
  await page.mouse.click(p.x, p.y);
}

export async function drag(page, from, to) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await page.mouse.up();
}

export async function reloadMap(page, map = 0) {
  await page.reload();
  await page.locator('.home-card').nth(map).click();
  await waitForSave(page);
}

export async function switchMap(page, map) {
  await page.locator('.view.active .map-title-group').click();
  await page.locator('.map-switch-item').nth(map).click();
}

export async function drawRoute(page, count = 2) {
  await tool(page, 'measure');
  await page.locator('[data-mmode="chain"]').click();
  for (let i = 0; i <= count; i++) await clickPoint(page, 0.12 + i * 0.19, 0.42 + (i % 2) * 0.09);
  await page.keyboard.press('Escape');
  await waitForSave(page);
}

export async function selectSegment(page, index) {
  const segment = (await read(page)).board.measures[index];
  await clickPoint(page, (segment.x1 + segment.x2) / 2, (segment.y1 + segment.y2) / 2);
}
