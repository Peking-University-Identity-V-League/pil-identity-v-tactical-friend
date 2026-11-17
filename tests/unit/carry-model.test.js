import assert from 'node:assert/strict';
import test from 'node:test';
import {
  carryBandAt, carryDropBudget, carryRangeBands, createCarryProfile, normalizeCarryBuffs,
  normalizeCarrySelection,
} from '../../js/core/carry-model.js';

test('default profile matches the worker baseline numbers', () => {
  const p = createCarryProfile();
  assert.equal(p.selection.survivorId, 'ordinary');
  assert.equal(p.struggleRate, 1);
  assert.equal(p.remainingSeconds, 16);
  assert.equal(p.dropProgressPercent, 25);
  assert.equal(p.pickupSeconds, 2);
  assert.equal(p.speedAt(0), 4.64);
  assert.equal(p.speedAt(999), 4.64);
});

test('default bands cut at 4/8/12/14.4/16 seconds', () => {
  const bands = carryRangeBands(createCarryProfile());
  assert.equal(bands.length, 5);
  const cuts = bands.map((b) => b.maxSeconds);
  assert.ok(Math.abs(cuts[0] - 4) < 1e-9);
  assert.ok(Math.abs(cuts[1] - 8) < 1e-9);
  assert.ok(Math.abs(cuts[2] - 12) < 1e-9);
  assert.ok(Math.abs(cuts[3] - 14.4) < 1e-9);
  assert.ok(Math.abs(cuts[4] - 16) < 1e-9);
  assert.ok(bands.every((b) => !b.empty));
  assert.equal(carryBandAt(bands, 0), 0);
  assert.equal(carryBandAt(bands, 3.999999), 0);
  assert.equal(carryBandAt(bands, 4.000001), 1);
  assert.equal(carryBandAt(bands, 13), 3);
  assert.equal(carryBandAt(bands, 15), 4);
  assert.equal(carryBandAt(bands, 16), -1);
  assert.equal(carryBandAt(bands, Infinity), -1);
});

test('forward with iron grip 3 slows the struggle to 0.95 and drops to 6%', () => {
  const p = createCarryProfile({ survivorId: 'forward', buffs: [{ key: 'ironGrip', level: 3 }] });
  assert.ok(Math.abs(p.struggleRate - 0.95) < 1e-9);
  assert.ok(Math.abs(p.remainingSeconds - 16 / 0.95) < 1e-9);
  assert.equal(p.dropProgressPercent, 6);
});

test('will to survive 3 speeds the struggle up and shortens the budget', () => {
  const p = createCarryProfile({ buffs: [{ key: 'willToSurvive', level: 3 }] });
  assert.ok(Math.abs(p.struggleRate - 1.2) < 1e-9);
  assert.ok(Math.abs(p.remainingSeconds - 16 / 1.2) < 1e-9);
});

test('speed talents stack, wanted slows the hunter', () => {
  const p = createCarryProfile({
    buffs: [
      { key: 'hospitality', level: 3 },
      { key: 'taunt', level: 2 },
      { key: 'wanted', level: 1 },
    ],
  });
  assert.ok(Math.abs(p.speedAt(99) - 4.64 * 1.10) < 1e-9);
});

test('carnival is flat within a carry and control lasts only 3 seconds', () => {
  const p = createCarryProfile({
    buffs: [{ key: 'carnival', level: 3 }, { key: 'control', level: 1 }],
  });
  assert.ok(Math.abs(p.speedAt(0) - 4.64 * 1.15) < 1e-9);
  assert.ok(Math.abs(p.speedAt(2.999) - 4.64 * 1.15) < 1e-9);
  assert.ok(Math.abs(p.speedAt(3.001) - 4.64 * 1.05) < 1e-9);
});

test('playful shortens the pickup animation', () => {
  const p = createCarryProfile({ buffs: [{ key: 'playful', level: 1 }], pickupSeconds: 2 });
  assert.ok(Math.abs(p.pickupSeconds - 2 / 1.2) < 1e-9);
});

test('initial struggle progress shrinks the budget', () => {
  const p = createCarryProfile({ initialProgress: 50 });
  assert.equal(p.remainingSeconds, 8);
  const bands = carryRangeBands(p);
  assert.equal(bands[4].maxSeconds, 8);
});

test('drop budget counts remaining drops and flags the risk zone', () => {
  const p = createCarryProfile();
  assert.deepEqual(carryDropBudget(p, 0), {
    progressPercent: 0, drops: 3, canHang: true, risk: false,
  });
  assert.equal(carryDropBudget(p, 4).drops, 2);
  assert.equal(carryDropBudget(p, 14.4).risk, true);
  assert.equal(carryDropBudget(p, 16).canHang, false);
});

test('normalize clamps invalid input instead of throwing', () => {
  const s = normalizeCarrySelection({
    survivorId: 'nobody',
    buffs: [{ key: 'ironGrip', level: 99 }, { key: 'ghost', level: 1 }, null, { key: 'hunting' }],
    baseSpeed: -5,
    initialProgress: 250,
  });
  assert.equal(s.survivorId, 'ordinary');
  assert.deepEqual(s.buffs, [{ key: 'ironGrip', level: 3 }, { key: 'hunting', level: 3 }]);
  assert.equal(s.baseSpeed, 0.1);
  assert.equal(s.initialProgress, 100);
  assert.deepEqual(normalizeCarryBuffs('junk'), []);
});
