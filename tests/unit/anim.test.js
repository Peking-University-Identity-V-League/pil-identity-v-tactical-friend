import assert from 'node:assert/strict';
import test from 'node:test';
import { animAllPositions, animAvgSpeed, animDuration, animPathLenM, animPointAlongPath, animPositionAt, animSegPath, animSegmentLenM, animSegments }
  from '../../js/core/anim.js';

// 1000×1000 底图、横向 100m：0.1 相对距离 = 10m
const GEOM = { dw: 1000, dh: 1000, widthM: 100 };

test('segment length converts relative coords to meters like tacMeasureLen', () => {
  assert.equal(animSegmentLenM({ x: 0, y: 0 }, { x: 0.1, y: 0 }, GEOM), 10);
  assert.equal(animSegmentLenM({ x: 0, y: 0 }, { x: 0.3, y: 0.4 }, GEOM), 50);
});

test('time mode: segments use explicit times and derive average speed', () => {
  const anim = { mode: 'time', points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.1, y: 0.1 }], times: [0, 5, 9] };
  const segs = animSegments(anim, GEOM);
  assert.equal(segs.length, 2);
  assert.deepEqual([segs[0].t0, segs[0].t1, segs[0].lenM], [0, 5, 10]);
  assert.deepEqual([segs[1].t0, segs[1].t1, segs[1].lenM], [5, 9, 10]);
  assert.equal(animAvgSpeed(anim, GEOM, 0), 2);
  assert.equal(animAvgSpeed(anim, GEOM, 1), 2.5);
  assert.deepEqual(animDuration(anim, GEOM), { start: 0, end: 9, total: 9 });
});

test('time mode: position interpolates linearly within a segment', () => {
  const anim = { mode: 'time', points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }], times: [0, 5] };
  const mid = animPositionAt(anim, GEOM, 2.5);
  assert.ok(Math.abs(mid.x - 0.05) < 1e-9 && mid.y === 0 && !mid.done);
  assert.deepEqual(animPositionAt(anim, GEOM, -1), { x: 0, y: 0, done: false });
  const end = animPositionAt(anim, GEOM, 99);
  assert.equal(end.x, 0.1);
  assert.equal(end.done, true);
});

test('time mode: non-decreasing correction and zero-duration teleport segments', () => {
  // 第二段时刻倒挂时被钳为瞬移段
  const anim = { mode: 'time', points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.2, y: 0 }], times: [0, 5, 3] };
  const segs = animSegments(anim, GEOM);
  assert.equal(segs[1].dur, 0);
  assert.equal(animAvgSpeed(anim, GEOM, 1), null);
  const pos = animPositionAt(anim, GEOM, 5);
  assert.ok(pos.x >= 0.1);
});

test('speed mode: segment durations derive from length and speed', () => {
  const anim = {
    mode: 'speed',
    points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.1, y: 0.1 }],
    speeds: [{ name: 'run', speed: 5 }, { name: 'walk', speed: 2 }],
  };
  const segs = animSegments(anim, GEOM);
  assert.equal(segs[0].dur, 2);   // 10m ÷ 5m/s
  assert.equal(segs[1].dur, 5);   // 10m ÷ 2m/s
  assert.equal(segs[1].t0, 2);    // 第二段接续第一段结束时刻
  assert.deepEqual(animDuration(anim, GEOM), { start: 0, end: 7, total: 7 });
  // t=3 时处于第二段 1/5 处
  const pos = animPositionAt(anim, GEOM, 3);
  assert.ok(Math.abs(pos.x - 0.1) < 1e-9 && Math.abs(pos.y - 0.02) < 1e-9 && !pos.done);
});

test('speed mode: missing or invalid speed falls back to teleport, not crash', () => {
  const anim = { mode: 'speed', points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }], speeds: [{ name: 'x', speed: 0 }] };
  const segs = animSegments(anim, GEOM);
  assert.equal(segs[0].dur, 0);
  assert.deepEqual(animDuration(anim, GEOM), { start: 0, end: 0, total: 0 });
  assert.equal(animPositionAt(anim, GEOM, 0).done, true);
});

test('degenerate paths: empty and single point', () => {
  assert.equal(animPositionAt({ mode: 'time', points: [] }, GEOM, 0), null);
  assert.deepEqual(animPositionAt({ mode: 'time', points: [{ x: 0.5, y: 0.5 }] }, GEOM, 0),
    { x: 0.5, y: 0.5, done: true });
  assert.deepEqual(animDuration({ mode: 'time', points: [{ x: 0, y: 0 }] }, GEOM),
    { start: 0, end: 0, total: 0 });
});

test('missing widthM falls back to relative units', () => {
  const geom = { dw: 1000, dh: 1000, widthM: null };
  assert.equal(animSegmentLenM({ x: 0, y: 0 }, { x: 0.1, y: 0 }, geom), 100);
});

test('time mode: missing times default to continuous schedule', () => {
  const anim = { mode: 'time', points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.2, y: 0 }], times: [0, 4] };
  const segs = animSegments(anim, GEOM);
  assert.equal(segs[1].t0, 4);
  assert.equal(segs[1].t1, 4); // 缺失时刻默认与上一时刻相同（瞬移段）
});

test('speed mode: segDurFn overrides segment duration (buff simulation hook)', () => {
  const anim = { mode: 'speed', points: [{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.2, y: 0 }],
    speeds: [{ name: 'a', speed: 2 }, { name: 'b', speed: 5 }] };
  // 无 fn：10m/2 + 10m/5 = 7s
  assert.equal(animDuration(anim, GEOM).total, 7);
  // 有 fn：第一段时长翻倍（模拟减速 buff），第二段不变
  const fn = (i, lenM, v) => (i === 0 ? (lenM / v) * 2 : lenM / v);
  const segs = animSegments(anim, GEOM, fn);
  assert.deepEqual([segs[0].t0, segs[0].t1], [0, 10]);
  assert.deepEqual([segs[1].t0, segs[1].t1], [10, 12]);
  assert.equal(animDuration(anim, GEOM, fn).total, 12);
  // 位置插值也走覆盖后的时长
  const pos = animPositionAt(anim, GEOM, 11, fn);
  assert.ok(Math.abs(pos.x - 0.15) < 1e-9 && !pos.done);
});

test('animAllPositions: batch-locates entries for the global timeline', () => {
  const a = { mode: 'time', points: [{ x: 0, y: 0 }, { x: 0.2, y: 0 }], times: [0, 4] };
  const b = { mode: 'time', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.6 }], times: [2, 6] };
  const at0 = animAllPositions([{ anim: a }, { anim: b }, null], GEOM, 0);
  assert.deepEqual(at0[0], { x: 0, y: 0, done: false });
  assert.deepEqual(at0[1], { x: 0.5, y: 0.5, done: false }); // 未到起点时刻，停在首点
  assert.equal(at0[2], null);
  const at3 = animAllPositions([{ anim: a }, { anim: b }], GEOM, 3);
  assert.ok(Math.abs(at3[0].x - 0.15) < 1e-9);
  assert.ok(Math.abs(at3[1].y - 0.525) < 1e-9);
  const at9 = animAllPositions([{ anim: a }, { anim: b }], GEOM, 9);
  assert.ok(at9[0].done && at9[1].done);
});

test('optimal route: segment length and position follow the route polyline', () => {
  // L 形最优路径 (0,0)→(0.1,0)→(0.1,0.1)：沿路径 20m，直线仅 ~14.14m
  const anim = {
    mode: 'time',
    points: [{ x: 0, y: 0 }, { x: 0.1, y: 0.1 }],
    times: [0, 10],
    paths: [[{ x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.1, y: 0.1 }]],
  };
  const segs = animSegments(anim, GEOM);
  assert.equal(segs[0].lenM, 20); // 距离采用最优路径长度
  // t=5（弧长一半=10m）：正好到达拐角 (0.1, 0)
  const mid = animPositionAt(anim, GEOM, 5);
  assert.ok(Math.abs(mid.x - 0.1) < 1e-9 && Math.abs(mid.y) < 1e-9 && !mid.done);
  // t=2.5（5m）：水平段中点
  const q = animPositionAt(anim, GEOM, 2.5);
  assert.ok(Math.abs(q.x - 0.05) < 1e-9 && Math.abs(q.y) < 1e-9);
});

test('animSegPath falls back to the straight segment when no route is stored', () => {
  const anim = { points: [{ x: 0, y: 0 }, { x: 0.2, y: 0 }] };
  assert.deepEqual(animSegPath(anim, 0), [{ x: 0, y: 0 }, { x: 0.2, y: 0 }]);
  assert.equal(animPathLenM(animSegPath(anim, 0), GEOM), 20);
});

test('animPointAlongPath clamps to both ends and tolerates degenerate paths', () => {
  const path = [{ x: 0, y: 0 }, { x: 0.1, y: 0 }];
  assert.deepEqual(animPointAlongPath(path, -1, GEOM), { x: 0, y: 0 });
  assert.deepEqual(animPointAlongPath(path, 2, GEOM), { x: 0.1, y: 0 });
  assert.deepEqual(animPointAlongPath([{ x: 0.3, y: 0.3 }], 0.5, GEOM), { x: 0.3, y: 0.3 });
});
