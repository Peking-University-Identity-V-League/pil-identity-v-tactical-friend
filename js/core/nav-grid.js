// 导航栅格加载与挂人范围洪泛计算。
// 栅格由 scripts/build_nav_grid_exact.mjs 离线烘焙（grid-data/<scene>.png，
// 1px 分辨率，直接复用 3D 碰撞模型逐像素判定），
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
      const win = new Uint8Array(meta.gridW * meta.gridH);
      for (let i = 0; i < grid.length; i++) {
        const v = data[i * 4];
        grid[i] = v >= 192 ? 1 : 0;   // 255 = 可走
        win[i] = (v >= 96 && v < 192) ? 1 : 0;  // 128 = 窗带（允许翻窗时可走）
      }
      return { grid, win, ...meta };
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
function computeField(g, startCell, profile, { onProgress, initialSeconds = 0, bands, bandAt, vault = false }) {
  const { grid, win, gridW, gridH, metersPerCell } = g;
  const walk = (i) => grid[i] || (vault && win[i]);
  const budget = profile.remainingSeconds;
  const total = gridW * gridH;
  const time = new Float64Array(total).fill(Infinity);
  const bandOf = new Int8Array(total).fill(-1);
  const startIdx = startCell.y * gridW + startCell.x;
  if (!walk(startIdx)) return Promise.resolve({ bands, bandOf, time, reached: 0, budget });
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
            if (!walk(ni)) continue;
            if (dx && dy && (!walk(y * gridW + nx) || !walk(ny * gridW + x))) continue; // 禁穿墙角
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
    { ...opts, vault: false, bands: carryRangeBands(profile), bandAt: carryBandAt });
}

export function computeTideField(g, startCell, profile, opts = {}) {
  return computeField(g, startCell, profile,
    { ...opts, vault: true, bands: tideRangeBands(), bandAt: tideBandAt });
}

/**
 * 两点间最优路径（分块 Dijkstra + 父指针回溯）。
 * 与 computeField 同一套 8 连通/禁穿墙角/时间依赖速度模型，
 * 但只搜到终点格被 settle 为止，并记录父指针用于回溯折线。
 * 返回 Promise<{ seconds, distM, path, reached, cancelled, unreachable }>：
 * - seconds/distM：起点格到终点格的最短用时（秒）与折线距离（米）。
 * - path：[{x, y}...] 栅格坐标序列，含起点与终点，按行进顺序排列。
 * - unreachable：终点不可走或搜尽全图仍未到达。
 * initialSeconds：起点已耗时（例如从地下室椅子先走到楼梯出口）。
 */
export function computePath(g, startCell, endCell, profile, { onProgress, initialSeconds = 0, vault = false } = {}) {
  const { grid, win, gridW, gridH, metersPerCell } = g;
  const walk = (i) => grid[i] || (vault && win[i]);
  const total = gridW * gridH;
  const time = new Float64Array(total).fill(Infinity);
  const distM = new Float64Array(total).fill(Infinity);
  const parent = new Int32Array(total).fill(-1);
  const startIdx = startCell.y * gridW + startCell.x;
  const endIdx = endCell.y * gridW + endCell.x;
  const empty = { seconds: Infinity, distM: Infinity, path: [], reached: 0, unreachable: true };
  if (!walk(startIdx) || !walk(endIdx)) return { promise: Promise.resolve(empty), cancel() {} };
  time[startIdx] = initialSeconds;
  distM[startIdx] = 0;
  // A* 启发式：到终点的欧氏距离 / 全程最大速度（速度只随加成到期降低时严格容许；
  // 偶有提速也只损失极少最优性，换大图数倍加速）
  let maxSpeed = 0;
  for (const t of [0, 5, 30, 130, 300, 1e9]) maxSpeed = Math.max(maxSpeed, profile.speedAt(t));
  if (!(maxSpeed > 0)) maxSpeed = 1;
  const hOf = (idx) => {
    const x = idx % gridW, y = (idx / gridW) | 0;
    return Math.hypot(x - endCell.x, y - endCell.y) * metersPerCell / maxSpeed;
  };
  const heap = makeHeap();
  heap.push(initialSeconds + hOf(startIdx), startIdx);
  const orth = metersPerCell, diag = metersPerCell * Math.SQRT2;
  let settled = 0;
  let cancelled = false;
  const token = { cancel() { cancelled = true; } };

  const CHUNK = 20000;
  const promise = new Promise((resolve) => {
    const finish = (extra = {}) => {
      if (extra.cancelled || extra.unreachable) {
        resolve({ seconds: Infinity, distM: Infinity, path: [], reached: settled, ...extra });
        return;
      }
      const path = [];
      for (let i = endIdx; i !== -1; i = parent[i]) {
        path.push({ x: i % gridW, y: (i / gridW) | 0 });
      }
      path.reverse();
      resolve({
        seconds: time[endIdx] - initialSeconds,
        distM: distM[endIdx],
        path,
        reached: settled,
        ...extra,
      });
    };
    const step = () => {
      if (cancelled) { finish({ cancelled: true }); return; }
      let n = 0;
      while (heap.size && n < CHUNK) {
        const key = heap.topKey();
        const idx = heap.pop();
        const t = key - hOf(idx);
        if (t > time[idx] + 1e-12) continue;  // 过期堆条目
        n++;
        settled++;
        if (idx === endIdx) { finish(); return; }
        const x = idx % gridW, y = (idx / gridW) | 0;
        const speed = profile.speedAt(t);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= gridW || ny >= gridH) continue;
            const ni = ny * gridW + nx;
            if (!walk(ni)) continue;
            if (dx && dy && (!walk(y * gridW + nx) || !walk(ny * gridW + x))) continue; // 禁穿墙角
            const edgeM = (dx && dy) ? diag : orth;
            const nt = t + edgeM / speed;
            if (nt + 1e-12 < time[ni]) {
              time[ni] = nt;
              distM[ni] = distM[idx] + edgeM;
              parent[ni] = idx;
              heap.push(nt + hOf(ni), ni);
            }
          }
        }
      }
      onProgress?.(heap.size ? Math.min(0.99, settled / Math.max(settled + heap.size, 1)) : 1);
      if (heap.size) setTimeout(step, 0);
      else finish({ unreachable: true });
    };
    setTimeout(step, 0);
  });
  return { promise, cancel: token.cancel };
}

// 栅格视线检查（supercover 走查，格坐标；禁斜穿墙角；vault 时窗带视为可走）
export function gridLineOfSight(g, x0, y0, x1, y1, vault = false) {
  const { grid, win, gridW, gridH } = g;
  const walk = (x, y) => x >= 0 && y >= 0 && x < gridW && y < gridH
    && (grid[y * gridW + x] || (vault && win[y * gridW + x]));
  let x = x0, y = y0;
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  for (;;) {
    if (!walk(x, y)) return false;
    if (x === x1 && y === y1) return true;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      if (!walk(x + sx, y)) return false;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      if (!walk(x, y + sy)) return false;
      y += sy;
    }
  }
}

// 栅格路径拉直：贪心保留最远可视拐点，输入/输出均为格坐标 [{x,y}...]
export function smoothPathOnGrid(g, path, vault = false) {
  if (!path || path.length < 3) return path ? path.slice() : [];
  const out = [path[0]];
  let anchor = 0;
  for (let i = 2; i < path.length; i++) {
    if (!gridLineOfSight(g, path[anchor].x, path[anchor].y, path[i].x, path[i].y, vault)) {
      out.push(path[i - 1]);
      anchor = i - 1;
    }
  }
  out.push(path[path.length - 1]);
  return out;
}
