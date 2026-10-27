import assert from 'node:assert/strict';
import test from 'node:test';
import { getTreasureRings } from '../../js/core/treasure.js';

const map = {
  mapSize: [1000, 500], widthM: 100,
  ciphers: [
    { id: 'A', location: [100, 200] },
    { id: 'B', location: [900, 400] },
    { id: 'C', location: [700, 100] },
  ],
  cipherCombinations: [['A', 'B', 'C'], ['B']],
};
const rule = { rangeM: 70, ringM: [5.5, 7.3] };
const token = { x: 0.1, y: 0.4, showTreasureRange: true };

test('treasure prediction is empty without an enabled explorer or map scale', () => {
  assert.deepEqual(getTreasureRings(map, undefined, 0, rule), []);
  assert.deepEqual(getTreasureRings(map, { ...token, showTreasureRange: false }, 0, rule), []);
  assert.deepEqual(getTreasureRings({ ...map, widthM: 0 }, token, 0, rule), []);
});

test('treasure rings retain physical size and exclude the nearest cipher on a rectangular map', () => {
  const rings = getTreasureRings(map, token, 0, rule);
  assert.deepEqual(rings.map(ring => ring.cipherId), ['A', 'C']);
  assert.deepEqual(rings[0], {
    cipherId: 'A', x: 0.1, y: 0.4, innerRadius: 0.055, outerRadius: 0.073, excluded: true,
  });
  assert.equal(rings[1].excluded, false);
});

test('changing cipher groups removes previous candidates and tolerates missing references', () => {
  const changed = { ...map, cipherCombinations: [['A', 'missing'], ['B']] };
  const centre = { ...token, x: 0.5, y: 0.5 };
  assert.deepEqual(getTreasureRings(changed, centre, 0, rule).map(r => r.cipherId), ['A']);
  assert.deepEqual(getTreasureRings(changed, centre, 1, rule).map(r => r.cipherId), ['B']);
  assert.deepEqual(getTreasureRings(changed, centre, 2, rule), []);
});

test('range boundary and same-cipher exclusion tolerance keep the existing semantics', () => {
  const boundary = {
    ...map,
    ciphers: [...map.ciphers, { id: 'edge', location: [800, 200] }, { id: 'outside', location: [801, 200] }],
    cipherCombinations: [['A', 'edge', 'outside']],
  };
  assert.deepEqual(getTreasureRings(boundary, token, 0, rule).map(r => r.cipherId), ['A', 'edge']);
  assert.equal(getTreasureRings(map, { ...token, x: 0.02 }, 0, rule)[0].excluded, true);
  assert.equal(getTreasureRings(map, { ...token, x: 0.019 }, 0, rule)[0].excluded, false);
});
