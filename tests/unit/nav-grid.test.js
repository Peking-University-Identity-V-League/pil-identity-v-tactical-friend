import assert from 'node:assert/strict';
import test from 'node:test';
import { computePath, snapToWalkable } from '../../js/core/nav-grid.js';

// 构造内存栅格：cellPx=1、metersPerCell=1，blocked 为不可走格
function makeGrid(w, h, blocked = []) {
  const grid = new Uint8Array(w * h).fill(1);
  for (const [x, y] of blocked) grid[y * w + x] = 0;
  return { grid, gridW: w, gridH: h, cellPx: 1, metersPerCell: 1, basements: [] };
}
const walk1 = { speedAt: () => 1 };   // 1 m/s
const walk2 = { speedAt: () => 2 };   // 2 m/s

test('straight line on open grid: exact time, distance and endpoints', async () => {
  const g = makeGrid(10, 10);
  const { promise } = computePath(g, { x: 0, y: 0 }, { x: 9, y: 0 }, walk1);
  const r = await promise;
  assert.ok(!r.unreachable && !r.cancelled);
  assert.ok(Math.abs(r.seconds - 9) < 1e-9);
  assert.ok(Math.abs(r.distM - 9) < 1e-9);
  assert.equal(r.path.length, 10);
  assert.deepEqual(r.path[0], { x: 0, y: 0 });
  assert.deepEqual(r.path[r.path.length - 1], { x: 9, y: 0 });
});

test('diagonal step costs sqrt(2) meters and respects speed profile', async () => {
  const g = makeGrid(4, 4);
  const { promise } = computePath(g, { x: 0, y: 0 }, { x: 1, y: 1 }, walk2);
  const r = await promise;
  assert.ok(Math.abs(r.distM - Math.SQRT2) < 1e-9);
  assert.ok(Math.abs(r.seconds - Math.SQRT2 / 2) < 1e-9);
});

test('wall forces a detour longer than the straight line', async () => {
  // 第 5 列整列为墙（留顶部缺口），直线路径被堵
  const blocked = [];
  for (let y = 1; y < 10; y++) blocked.push([5, y]);
  const g = makeGrid(10, 10, blocked);
  const { promise } = computePath(g, { x: 2, y: 5 }, { x: 8, y: 5 }, walk1);
  const r = await promise;
  assert.ok(!r.unreachable);
  // 必须绕过缺口：距离大于直线 6m，且路径不经过任何墙格
  assert.ok(r.distM > 6);
  for (const p of r.path) assert.equal(g.grid[p.y * 10 + p.x], 1);
});

test('corner cutting is forbidden through blocked orthogonal neighbours', async () => {
  // (1,0) 被堵：从 (0,0) 到 (1,1) 不能走对角线，需绕行
  const g = makeGrid(3, 3, [[1, 0], [0, 1]]);
  const { promise } = computePath(g, { x: 0, y: 0 }, { x: 1, y: 1 }, walk1);
  const r = await promise;
  // 两个正交邻居都被堵，起点到终点完全被隔断
  assert.ok(r.unreachable);
});

test('unreachable when the end cell is not walkable', async () => {
  const g = makeGrid(5, 5, [[4, 4]]);
  const { promise } = computePath(g, { x: 0, y: 0 }, { x: 4, y: 4 }, walk1);
  const r = await promise;
  assert.ok(r.unreachable);
  assert.equal(r.path.length, 0);
});

test('initialSeconds is excluded from the reported seconds', async () => {
  const g = makeGrid(6, 1);
  const { promise } = computePath(g, { x: 0, y: 0 }, { x: 5, y: 0 }, walk1, { initialSeconds: 100 });
  const r = await promise;
  assert.ok(Math.abs(r.seconds - 5) < 1e-9);
});

test('snapToWalkable finds the nearest free cell', () => {
  const g = makeGrid(5, 5, [[2, 2]]);
  const s = snapToWalkable(g, 2.5, 2.5);
  assert.ok(s);
  assert.equal(g.grid[s.y * 5 + s.x], 1);
  assert.ok(Math.max(Math.abs(s.x - 2), Math.abs(s.y - 2)) === 1);
  // 完全不可走的图返回 null
  const none = makeGrid(3, 3, Array.from({ length: 9 }, (_, i) => [i % 3, (i / 3) | 0]));
  assert.equal(snapToWalkable(none, 1, 1), null);
});
