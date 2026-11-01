import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

// The same frozen real Darkwoods gate coordinates used in the algorithm comparison.
const start = { point: [-756.1, 0.8428876382763626, -179.7], polygonId: 257, triangleId: 970 };
const end = { point: [747.1, 1.0895459044593565, 519.4], polygonId: 500, triangleId: 3100 };

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  test(`real packaged Recast worker solves under the delivered CSP at ${prefix}`, async ({ page }) => {
    test.setTimeout(90000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(prefix + '/3d/h55_deadforest_sp.html');
    const csp = response.headers()['content-security-policy'];
    expect(csp).toContain("'wasm-unsafe-eval'");
    expect(csp).not.toMatch(/(?:^|\s)'unsafe-eval'(?:\s|;|$)/);
    await page.waitForFunction(() => window.measureAPI?.stats().ready && window.viewerAPI?.worldCollision?.().state === 'ready', null, { timeout: 60000 });
    const wasmAllowed = await page.evaluate(async () => {
      await WebAssembly.compile(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]));
      try { new Function('return 1')(); return false; } catch (error) { return error.name === 'EvalError'; }
    });
    expect(wasmAllowed).toBe(true);
    await page.selectOption('#precision', 'normal');
    const selected = await page.evaluate(({ start, end }) => {
      window.measureAPI.clear();
      return [window.measureAPI.setPoint('start', start), window.measureAPI.setPoint('end', end)];
    }, { start, end });
    expect(selected.map(r => r.status)).toEqual(['ok', 'ok']);
    await page.waitForFunction(() => !window.measureAPI.stats().busy && window.measureAPI.stats().result, null, { timeout: 30000 });
    const stats = await page.evaluate(() => window.measureAPI.stats());
    expect(stats.result.status).toBe('ok');
    expect(stats.result.solverVersion).toMatch(/^recast-/);
    expect(stats.result.path[0]).toEqual(start.point);
    expect(stats.result.path.at(-1)).toEqual(end.point);
    expect(stats.result.distance / 11.85).toBeLessThan(160);
    expect(stats.result.globalOptimalityProven).not.toBe(true);
    expect(stats.result.routeModel.avatarClearance.ordinarySegmentsValidated).toBe(true);
    const worker = await page.evaluate(() => JSON.parse(document.getElementById('worker-source').textContent).base64);
    const release = await (await page.request.get(prefix + '/3d/__release.json')).json();
    // Packaged metadata points to the original immutable source release.
    const source = await (await page.request.get(prefix + '/' + release.asset_urls['__release.json'])).json();
    expect(createHash('sha256').update(Buffer.from(worker, 'base64')).digest('hex')).toBe(source.worker_sha256);
    expect(errors).toEqual([]);
  });
}
