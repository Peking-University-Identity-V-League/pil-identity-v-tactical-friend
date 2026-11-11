import { test, expect } from '@playwright/test';

async function openChairTools(page, prefix) {
  await page.goto(prefix + '/3d/h55_demo.html');
  await page.waitForFunction(() => window.chairToolsUI && window.measureAPI?.stats().ready
    && window.viewerAPI?.worldCollision().state === 'ready', null, { timeout: 90000 });
  // The 2D handoff finishes asynchronously and establishes the initial view.
  // Wait for it before switching views through the map controls.
  await page.waitForFunction(() => document.querySelector('.pil-handoff')?.dataset.state === 'map-only');
}

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`packaged chair tools and the map legend switch load at ${prefix}`, async ({ page }) => {
    test.setTimeout(120000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await openChairTools(page, prefix);
    await page.evaluate(() => {
      window.workspaceTools.show('route', 'extrema');
      window.tacticsAPI.planar.setMode('planar');
      window.workspaceTools.collapse();
    });
    await expect(page.locator('#planar-options-toggle')).toHaveText('地图图例');
    await page.locator('#planar-options-toggle').click();
    const guide = page.locator('#planar-color-legend');
    await expect(guide).toHaveText('颜色说明');
    await expect(guide).toHaveAttribute('aria-pressed', 'false');
    await guide.click();
    expect(await page.evaluate(() => window.tacticsAPI.planar.getState().colorLegend)).toBe(true);
    const panel = page.locator('.planar-legend');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-planar-legend-marker]')).toHaveCount(4);
    await expect(panel).toContainText('1 号是当前配置下最难挂椅的候选点');
    await panel.getByRole('button', { name: '显示全部极值点', exact: true }).click();
    expect(await page.locator('#extrema-display-limit').inputValue()).toBe('all');
    expect(await page.locator('#extrema-prominence').inputValue()).toBe('0');
    const before = await panel.boundingBox();
    const mapView = await page.locator('#planar-map').getAttribute('viewBox');
    await panel.locator('.planar-legend-move').focus();
    await page.keyboard.press('ArrowRight');
    expect((await panel.boundingBox()).x).toBeCloseTo(before.x + 5, 0);
    await panel.locator('.planar-legend-resize').focus();
    await page.keyboard.press('ArrowLeft');
    expect((await panel.boundingBox()).width).toBeCloseTo(before.width - 5, 0);
    expect(await page.locator('#planar-map').getAttribute('viewBox')).toBe(mapView);
    await panel.locator('.planar-legend-reset').focus();
    await page.keyboard.press('Enter');
    expect((await panel.boundingBox()).width).toBeCloseTo(before.width, 0);
    await page.locator('#planar-options-toggle').click();
    await guide.focus();
    await page.keyboard.press('Space');
    await expect(guide).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Escape');
    await page.evaluate(() => window.workspaceTools.show('route', 'carry'));
    await expect(page.locator('[data-ui-control="carry-direction"] button[data-value="destination"]')).toBeVisible();
    const release = await (await page.request.get(prefix + '/3d/__release.json')).json();
    const source = await (await page.request.get(prefix + '/' + release.asset_urls['__release.json'])).json();
    expect(source.chair_reachability).toBe(1);
    expect(source.chair_destination).toBe(1);
    expect(source.chair_extrema).toBe(1);
    expect(source.chair_rank_by_time).toBe(1);
    expect(source.movable_color_legend).toBe(1);
    expect(source.carry_drop_bands).toBe(1);
    expect(errors).toEqual([]);
  });
}

test('fixed chair 2 produces four tide bands under the packaged CSP and toggles only their legend', async ({ page }) => {
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openChairTools(page, '/tactical-friend');
  await page.evaluate(() => window.workspaceTools.show('route', 'tide'));
  const chairId = await page.locator('#tide-chair option').evaluateAll(options => options.find(o => o.textContent === '固定椅 2').value);
  await page.locator(`[data-ui-control="tide-chair"] button[data-value="${chairId}"]`).click();
  await page.locator('#tide-compute').click();
  await page.waitForFunction(() => !window.chairTools.stats().busy, null, { timeout: 120000 });
  expect(await page.evaluate(() => window.chairTools.stats().result.region.positions.length)).toBeGreaterThan(0);
  await page.evaluate(() => {
    window.tacticsAPI.planar.setMode('planar');
    window.workspaceTools.collapse();
    window.__chairLegendResult = window.chairTools.stats().result;
  });
  await expect(page.locator('[data-chair-range]')).toHaveCount(4);
  await expect(page.locator('[data-planar-range-legend]')).toHaveText('');
  await page.locator('#planar-options-toggle').click();
  await page.locator('#planar-color-legend').click();
  await expect(page.locator('[data-planar-legend-band]')).toHaveCount(4);
  await expect(page.locator('[data-planar-legend-band="tide-0"]')).toContainText('0–5 秒');
  await expect(page.locator('[data-planar-legend-band="tide-3"]')).toContainText('15–20 秒');
  await page.locator('#planar-color-legend').click();
  await expect(page.locator('[data-planar-range-legend]')).toHaveText('');
  expect(await page.evaluate(() => window.__chairLegendResult === window.chairTools.stats().result)).toBe(true);
  await expect(page.locator('[data-chair-range]')).toHaveCount(4);
  expect(errors).toEqual([]);
});
