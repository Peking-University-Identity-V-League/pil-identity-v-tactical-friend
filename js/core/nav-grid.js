// 导航栅格加载与挂人范围洪泛计算。
// 栅格由 scripts/build_nav_grid.py 离线生成（grid-data/<scene>.png），
// 与底图像素坐标对齐：格 (gx,gy) 中心 = 底图像素 (gx*cellPx + cellPx/2, ...)。

import { NAV_GRID_MANIFEST } from '../data/nav-grid-manifest.js';
import { carryBandAt, carryRangeBands } from './carry-model.js';
import { tideBandAt, tideRangeBands } from './tide-model.js';

const gridCache = new Map();  // mapId -> Promise<{grid, gridW, gridH, cellPx, metersPerCell} | null>

export function navGridAvailable(mapId) {
  return !!NAV_GRID_MANIFEST[String(mapId)];
}

export function loadNavGrid(mapId) {
  const key = String(mapId);
  if (gridCache.has(key)) return gridCache.get(key);
  const meta = NAV_GRID_MANIFEST[key];
  if (!meta) return Promise.resolve(null);
  const promise = (async () => {
    try {
      const res = await fetch(`./${meta.file}`);
      if (!res.ok) return null;
      const bmp = await createImageBitmap(await res.blob());
      const canvas = document.createElement('canvas');
      canvas.width = meta.gridW;
      canvas.height = meta.gridH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(bmp, 0, 0);
      const data = ctx.getImageData(0, 0, meta.gridW, meta.gridH).data;
      const grid = new Uint8Array(meta.gridW * meta.gridH);
      for (let i = 0; i < grid.length; i++) grid[i] = data[i * 4] >= 128 ? 1 : 0;
      return { grid, ...meta };
    } catch {
      return null;
    }
  })();
  gridCache.set(key, promise);
  return promise;
}

// 底图像素坐标 -> 最近可走格（spiral 扩大搜索），找不到返回 null
export function snapToWalkable(g, px, py, maxRadiusCells = 25) {
  const { grid, gridW, gridH, cellPx } = g;
  const cx = Math.round(px / cellPx - 0.5);
  const cy = Math.round(py / cellPx - 0.5);
  for (let r = 0; r <= maxRadiusCells; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && y >= 0 && x < gridW && y < gridH && grid[y * gridW + x]) return { x, y };
      }
    }
  }
  return null;
}

// 二叉堆（按到达秒数）
function makeHeap() {
  const keys = [], vals = [];
  const up = (i) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (keys[p] <= keys[i]) break;
      [keys[p], keys[i]] = [keys[i], keys[p]];
      [vals[p], vals[i]] = [vals[i], vals[p]];
      i = p;
    }
  };
  const down = (i) => {
    for (;;) {
      const l = i * 2 + 1, r = l + 1;
      let m = i;
      if (l < keys.length && keys[l] < keys[m]) m = l;
      if (r < keys.length && keys[r] < keys[m]) m = r;
      if (m === i) break;
      [keys[m], keys[i]] = [keys[i], keys[m]];
      [vals[m], vals[i]] = [vals[i], vals[m]];
      i = m;
    }
  };
  return {
    push(k, v) { keys.push(k); vals.push(v); up(keys.length - 1); },
    pop() {
      const top = vals[0], lastK = keys.pop(), lastV = vals.pop();
      if (keys.length) { keys[0] = lastK; vals[0] = lastV; down(0); }
      return top;
    },
    topKey() { return keys[0]; },
    get size() { return keys.length; },
  };
}

/**
 * 从起点格出发的分块 Dijkstra（时间依赖速度，限时加成到期后降速仍满足 FIFO）。
 * onProgress(0..1) 每块回调一次；返回 Promise<{
 *   bands, bandOf: Int8Array, time: Float64Array, reached: number, budget: number }>
 * bandOf: 每格色带编号 0-4，未到达/不可走为 -1。
 * bands/bandAt 由调用方注入（挂椅用 carry 色带，搏命用 tide 色带）。
 * initialSeconds：起点已耗时（地下室椅子从楼梯出口起搜时，椅子→出口的
 * 耗时），色带判定与速度曲线从该时刻开始。
 */
function computeField(g, startCell, profile, { onProgress, initialSeconds = 0, bands, bandAt }) {
  const { grid, gridW, gridH, metersPerCell } = g;
  const budget = profile.remainingSeconds;
  const total = gridW * gridH;
  const time = new Float64Array(total).fill(Infinity);
  const bandOf = new Int8Array(total).fill(-1);
  const startIdx = startCell.y * gridW + startCell.x;
  if (!grid[startIdx]) return Promise.resolve({ bands, bandOf, time, reached: 0, budget });
  time[startIdx] = initialSeconds;
  bandOf[startIdx] = bandAt(bands, initialSeconds);
  const heap = makeHeap();
  heap.push(initialSeconds, startIdx);
  const orth = metersPerCell, diag = metersPerCell * Math.SQRT2;
  let settled = 0;
  let cancelled = false;
  const token = { cancel() { cancelled = true; } };

  const CHUNK = 20000;
  const promise = new Promise((resolve) => {
    const step = () => {
      if (cancelled) { resolve({ bands, bandOf, time, reached: settled, budget, cancelled: true }); return; }
      let n = 0;
      while (heap.size && n < CHUNK) {
        const t = heap.topKey();
        if (t > budget) { heap.pop(); continue; }
        const idx = heap.pop();
        if (t > time[idx] + 1e-12) continue;  // 过期堆条目
        n++;
        settled++;
        const x = idx % gridW, y = (idx / gridW) | 0;
        const speed = profile.speedAt(t);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= gridW || ny >= gridH) continue;
            const ni = ny * gridW + nx;
            if (!grid[ni]) continue;
            if (dx && dy && (!grid[y * gridW + nx] || !grid[ny * gridW + x])) continue; // 禁穿墙角
            const nt = t + ((dx && dy) ? diag : orth) / speed;
            if (nt + 1e-12 < time[ni]) {
              time[ni] = nt;
              bandOf[ni] = bandAt(bands, nt);
              heap.push(nt, ni);
            }
          }
        }
      }
      onProgress?.(heap.size ? Math.min(0.99, (heap.topKey() ?? budget) / budget) : 1);
      if (heap.size) setTimeout(step, 0);
      else resolve({ bands, bandOf, time, reached: settled, budget });
    };
    setTimeout(step, 0);
  });
  return { promise, cancel: token.cancel };
}

export function computeCarryField(g, startCell, profile, opts = {}) {
  return computeField(g, startCell, profile,
    { ...opts, bands: carryRangeBands(profile), bandAt: carryBandAt });
}

export function computeTideField(g, startCell, profile, opts = {}) {
  return computeField(g, startCell, profile,
    { ...opts, bands: tideRangeBands(), bandAt: tideBandAt });
}
