import assert from 'node:assert/strict';
import test from 'node:test';
import { measureIdCounters, restoreMeasureReferences, simulateMovement } from '../../js/core/measurements.js';

const config = (speed = 5, n = 2, buffs = []) => ({
  lid: 1, bases: [{ from: 0, to: n, speed }], buffs,
});

test('restore shared route configs from v1 JSON without sharing across boards or routes', () => {
  const lc = config();
  const boards = JSON.parse(JSON.stringify({
    0: { measures: [{ chain: 1, lc }, { chain: 1, lc }, { chain: 2, lc }, { chain: null, lc }] },
    1: { measures: [{ chain: 1, lc }, { chain: 1, lc }] },
  }));
  restoreMeasureReferences(boards);
  assert.equal(boards[0].measures[0].lc, boards[0].measures[1].lc);
  assert.equal(boards[1].measures[0].lc, boards[1].measures[1].lc);
  for (const other of [boards[0].measures[2], boards[0].measures[3], boards[1].measures[0]]) {
    assert.notEqual(boards[0].measures[0].lc, other.lc);
  }
  boards[0].measures[0].lc.bases[0].speed = 8;
  assert.equal(boards[0].measures[1].lc.bases[0].speed, 8);
  assert.equal(boards[0].measures[2].lc.bases[0].speed, 5);
});

test('ID counters include all maps and linked bonus IDs', () => {
  const boards = {
    0: { measures: [{ chain: 3, lc: { lid: 8, buffs: [{ id: 9, linkId: 12 }] } }] },
    1: { measures: [{ chain: 17, lc: { lid: 4, buffs: [{ id: 10 }] } }] },
  };
  assert.deepEqual(measureIdCounters(boards), { route: 17, config: 8, buff: 12 });
  assert.deepEqual(measureIdCounters({}), { route: 0, config: 0, buff: 0 });
});

test('unmodified speed produces distance / speed', () => {
  const result = simulateMovement([10, 20], config());
  assert.equal(result.total, 6);
  assert.equal(result.dist, 30);
  assert.deepEqual(result.arrival, [0, 2, 6]);
});

test('timed bonus expires inside a segment and continues across vertices', () => {
  const result = simulateMovement([5, 15], config(5, 2, [{ from: 0, to: 2, mult: 2, duration: 1 }]));
  assert.equal(result.total, 3);
  assert.deepEqual(result.segs[1].parts, [
    { dist: 5, t: 0.5, v: 10, pct: 100 },
    { dist: 10, t: 2, v: 5, pct: 0 },
  ]);
});

test('fixed speed ignores additive and post-multiplied bonuses in either segment order', () => {
  for (const fixedIndex of [0, 1]) {
    const lc = config(4, 2, [
      { from: 0, to: 2, mult: 1.5 },
      { from: 0, to: 2, mult: 2, postMult: true },
    ]);
    lc.bases = [0, 1].map((i) => ({ from: i, to: i + 1, speed: 4, fixed: i === fixedIndex }));
    const result = simulateMovement([12, 12], lc);
    assert.equal(result.segs[fixedIndex].parts[0].v, 4);
    assert.equal(result.segs[1 - fixedIndex].parts[0].v, 12);
    assert.equal(result.total, 4);
  }
});

test('bonus time elapses while travelling through a fixed-speed segment', () => {
  const lc = config(2, 3, [{ from: 0, to: 3, mult: 2, duration: 2 }]);
  lc.bases = [0, 1, 2].map((i) => ({ from: i, to: i + 1, speed: 2, fixed: i === 1 }));
  const result = simulateMovement([4, 4, 4], lc);
  assert.deepEqual(result.arrival, [0, 1, 3, 5]);
  assert.equal(result.segs[2].parts[0].v, 2);
});

test('segment eligibility does not apply a bonus to an incompatible base', () => {
  const lc = config(2, 2, [{ from: 0, to: 2, mult: 2 }]);
  lc.bases = [{ from: 0, to: 1, speed: 2, stKey: 'run' }, { from: 1, to: 2, speed: 2, stKey: 'crawl' }];
  const result = simulateMovement([4, 4], lc, (_, base) => base.stKey === 'run');
  assert.deepEqual(result.arrival, [0, 1, 3]);
});

test('zero-length segments have zero time and do not consume bonus duration', () => {
  const result = simulateMovement([0, 10, 0], config(5, 3, [{ from: 0, to: 3, mult: 2, duration: 1 }]));
  assert.equal(result.total, 1);
  assert.deepEqual(result.arrival, [0, 0, 1, 1]);
  assert.deepEqual(result.segs[0], { dist: 0, t: 0, t0: 0, parts: [] });
  assert.deepEqual(result.segs[2], { dist: 0, t: 0, t0: 0, parts: [] });
});
