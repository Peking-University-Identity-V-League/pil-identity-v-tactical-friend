import { test, expect } from './helpers.js';

// 两点寻路完整管线数据级回归（1px 精确栅格 A* + 栅格视线拉直）：
// - 原始路径每格可走；
// - 拉直后每段满足栅格视线（supercover 不碰障碍格、不斜穿墙角）；
// - 拉直不使路径变长（误差 5% 内）。
test.setTimeout(180000);

test('grid path pipeline stays walkable on any map', async ({ page }) => {
  const report = await page.evaluate(async () => {
    const { NAV_GRID_MANIFEST } = await import('/js/data/nav-grid-manifest.js');
    const { loadNavGrid, computePath, smoothPathOnGrid, gridLineOfSight } = await import('/js/core/nav-grid.js');
    const results = [];
    for (const [mapId, meta] of Object.entries(NAV_GRID_MANIFEST)) {
      const g = await loadNavGrid(mapId);
      if (!g) { results.push({ mapId, error: 'missing grid' }); continue; }
      // 只从最大连通块取样：建筑内部等封闭孤岛在栅格上本就连不通
      const comp = new Int32Array(g.gridW * g.gridH).fill(-1);
      let bestComp = -1, bestSize = 0;
      const queue = new Int32Array(g.gridW * g.gridH);
      for (let s = 0; s < g.gridW * g.gridH; s++) {
        if (!g.grid[s] || comp[s] >= 0) continue;
        const id = s;
        let head = 0, tail = 0, size = 0;
        queue[tail++] = s; comp[s] = id;
        while (head < tail) {
          const cur = queue[head++]; size++;
          const cx0 = cur % g.gridW, cy0 = (cur / g.gridW) | 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              const nx = cx0 + dx, ny = cy0 + dy;
              if (nx < 0 || ny < 0 || nx >= g.gridW || ny >= g.gridH) continue;
              const ni = ny * g.gridW + nx;
              if (!g.grid[ni] || comp[ni] >= 0) continue;
              comp[ni] = id; queue[tail++] = ni;
            }
          }
        }
        if (size > bestSize) { bestSize = size; bestComp = id; }
      }
      const cells = [];
      for (let y = 0; y < g.gridH; y += 7) {
        for (let x = 0; x < g.gridW; x += 7) {
          if (g.grid[y * g.gridW + x] && comp[y * g.gridW + x] === bestComp) cells.push([x, y]);
        }
      }
      const rand = (() => { let s = 42; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
      let checked = 0, unreachable = 0, badCell = 0, badLos = 0, longer = 0;
      for (let i = 0; i < 30; i++) {
        const ca = cells[(rand() * cells.length) | 0];
        const cb = cells[(rand() * cells.length) | 0];
        const run = computePath(g, { x: ca[0], y: ca[1] }, { x: cb[0], y: cb[1] }, { speedAt: () => 3.8 });
        const res = await run.promise;
        if (res.unreachable) { unreachable++; continue; }
        checked++;
        for (const c of res.path) {
          if (!g.grid[c.y * g.gridW + c.x]) { badCell++; break; }
        }
        const sm = smoothPathOnGrid(g, res.path);
        for (let s = 1; s < sm.length; s++) {
          if (!gridLineOfSight(g, sm[s - 1].x, sm[s - 1].y, sm[s].x, sm[s].y)) { badLos++; break; }
        }
        const lenOf = (pts) => {
          let d = 0;
          for (let s = 1; s < pts.length; s++) d += Math.hypot(pts[s].x - pts[s - 1].x, pts[s].y - pts[s - 1].y);
          return d;
        };
        if (lenOf(sm) > lenOf(res.path) * 1.05) longer++;
      }
      results.push({ mapId, scene: meta.scene, checked, unreachable, badCell, badLos, longer });
    }
    return results;
  });
  console.log(JSON.stringify(report));
  for (const r of report) {
    expect(r.error, `map ${r.mapId} data`).toBeUndefined();
    expect(r.checked, `map ${r.mapId} pipeline coverage`).toBeGreaterThan(15);
    expect(r.badCell, `map ${r.mapId} unwalkable path cells`).toBe(0);
    expect(r.badLos, `map ${r.mapId} smoothed segments crossing walls`).toBe(0);
    expect(r.longer, `map ${r.mapId} smoothing lengthened path`).toBe(0);
  }
});

// 翻窗开关回归：红教堂窗带应使「允许翻窗」的路径显著短于不允许；
// 不允许时窗带等效纯阻挡（牵气球-上椅的行为）
test('vault toggle opens window bands on red church', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const { loadNavGrid, computePath, smoothPathOnGrid } = await import('/js/core/nav-grid.js');
    const { NAV_GRID_MANIFEST } = await import('/js/data/nav-grid-manifest.js');
    const mapId = Object.keys(NAV_GRID_MANIFEST).find((k) => NAV_GRID_MANIFEST[k].scene === 'h55_demo');
    const g = await loadNavGrid(mapId);
    const profile = { speedAt: () => 3.8 };
    const W = g.gridW, H = g.gridH;
    const winCells = [];
    for (let i = 0; i < W * H; i++) if (g.win[i]) winCells.push(i);
    if (!winCells.length) return { error: 'no window band' };
    const c = winCells[(winCells.length / 2) | 0];
    const cx = c % W, cy = (c / W) | 0;
    const snap = (x, y) => {
      for (let r = 0; r < 40; r++)
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H && g.grid[ny * W + nx]) return { x: nx, y: ny };
          }
      return null;
    };
    const len = (pts) => { let d = 0; for (let s = 1; s < pts.length; s++) d += Math.hypot(pts[s].x - pts[s - 1].x, pts[s].y - pts[s - 1].y); return d; };
    const cases = [];
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      const A = snap(cx - dx * 20, cy - dy * 20);
      const B = snap(cx + dx * 20, cy + dy * 20);
      if (!A || !B) continue;
      const noVault = await computePath(g, A, B, profile, { vault: false }).promise;
      const vault = await computePath(g, A, B, profile, { vault: true }).promise;
      cases.push({
        noVault: noVault.path.length ? len(smoothPathOnGrid(g, noVault.path, false)) : null,
        vault: vault.path.length ? len(smoothPathOnGrid(g, vault.path, true)) : null,
      });
    }
    return { cases };
  });
  console.log(JSON.stringify(r));
  expect(r.error).toBeUndefined();
  const improved = r.cases.filter((c) => c.vault != null && (c.noVault == null || c.vault < c.noVault - 1));
  expect(improved.length, JSON.stringify(r.cases)).toBeGreaterThan(0);
});
