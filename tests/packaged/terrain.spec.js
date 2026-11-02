import { test, expect } from '@playwright/test';

// Frozen source coordinates; both cases failed before the terrain repair.
const cases = [
  {
    name: 'Leo thin-floor surface', scene: 'ordnance_factory2', cipher: '6001',
    start: { point: [-1275.0557484548037, 1.309600830078125, 1667.3991729373224], polygonId: 267, triangleId: 846 },
    end: { point: [-1779.1, 1.3232657349692165, 2299.3], polygonId: 362, triangleId: 1587 },
    maximumMetres: 90, origin: 'capsule-bottom',
  },
  {
    name: 'hospital cold-worker source entry', scene: 'h55_hospital2', cipher: '31',
    start: { point: [-134.83333333333331, 0.16080474853515625, -164.83333333333331], polygonId: 367, triangleId: 2460 },
    end: { point: [-604.1, 0.16080474853515625, -803.9], polygonId: 121, triangleId: 827 },
    maximumMetres: 90, entry: true,
  },
];

for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
  for (const fixture of cases) {
    test(`${fixture.name} retains exact endpoints at ${prefix}`, async ({ page }) => {
      test.setTimeout(90000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${prefix}/3d/${fixture.scene}.html`);
      await page.waitForFunction(() => window.measureAPI?.stats().ready && window.viewerAPI?.worldCollision?.().state === 'ready', null, { timeout: 60000 });
      await page.selectOption('#precision', 'normal');
      const selected = await page.evaluate(f => {
        const api = window.measureAPI;
        api.clear(); api.setBasement('unknown'); api.setChairPattern('wiki-1'); api.setCipherPattern(f.cipher);
        return [api.setPoint('start', f.start), api.setPoint('end', f.end)];
      }, fixture);
      expect(selected.map(r => r.status)).toEqual(['ok', 'ok']);
      await page.waitForFunction(() => !window.measureAPI.stats().busy && window.measureAPI.stats().result, null, { timeout: 30000 });
      const s = await page.evaluate(() => window.measureAPI.stats());
      console.log('TERRAIN_ROUTING', JSON.stringify({
        prefix, scene: fixture.scene, status: s.result.status,
        firstFeasibleMilliseconds: s.result.routeEngine?.firstFeasibleMilliseconds,
        elapsedMilliseconds: s.result.elapsedMilliseconds,
        builds: s.result.routeEngine?.candidateBuilds?.map(build => ({
          origin: build.candidateOrigin?.kind, milliseconds: build.buildMilliseconds,
        })),
        entryBudget: s.result.routeEngine?.entryBudget,
      }));
      expect(s.solveOptions.maxMilliseconds).toBe(5000);
      expect(s.result.status, JSON.stringify({
        scene: fixture.scene,
        elapsedMilliseconds: s.result.elapsedMilliseconds,
        routeEngine: s.result.routeEngine,
      })).toBe('ok');
      expect(s.start.point).toEqual(fixture.start.point); expect(s.end.point).toEqual(fixture.end.point);
      expect(s.result.path[0]).toEqual(fixture.start.point); expect(s.result.path.at(-1)).toEqual(fixture.end.point);
      expect(s.result.distance / 11.85).toBeLessThanOrEqual(fixture.maximumMetres);
      expect(s.result.routeEngine.fallback.used).toBe(false);
      expect(s.result.routeEngine.validation.sourceSupport.passed).toBe(true);
      expect(s.result.routeEngine.validation.avatarCapsule).toBe(true);
      expect(s.result.routeEngine.validation.activeBoxes).toBe(true);
      expect(s.result.routeModel.avatarClearance.radiusMeters).toBe(0.23);
      expect(s.result.routeModel.avatarClearance.halfHeightMeters).toBe(0.825);
      expect(s.result.routeEngine.candidateBuilds.length).toBeLessThanOrEqual(2);
      if (fixture.origin) expect(s.result.routeEngine.build.candidateOrigin.kind).toBe(fixture.origin);
      if (fixture.entry) {
        expect(s.result.routeEngine.proposal).toBe('distance');
        const entry = s.result.routeEngine.entrySeeding;
        expect(entry.anchors.length).toBeGreaterThan(0);
        expect(entry.attempts.length).toBeLessThanOrEqual(4);
        for (const anchor of entry.anchors) {
          expect(anchor.distanceMeters).toBeLessThanOrEqual(3);
          expect(anchor.globalAttempt).toBeLessThanOrEqual(4);
          expect(anchor.connector.length).toBeGreaterThan(0);
        }
      }
      let previous = fixture.start.point, sum = 0;
      for (const segment of s.result.segments) {
        expect(Math.hypot(...previous.map((v, i) => v - segment.from[i]))).toBeLessThan(1e-6);
        sum += Math.hypot(...segment.from.map((v, i) => v - segment.to[i])); previous = segment.to;
      }
      expect(previous).toEqual(fixture.end.point); expect(Math.abs(sum - s.result.distance)).toBeLessThan(1e-4);
      expect(errors).toEqual([]);
    });
  }
}
