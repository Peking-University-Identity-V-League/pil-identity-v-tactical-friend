import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { boardFingerprint, summarizeBoard } from '../telemetry/summary.js';

test('board summaries contain only counts and coarse nine-grid occupancy', () => {
  const privateText = 'PRIVATE_TACTIC_NOTE';
  const board = {
    tokens: { Gardener: { x: 0.12, y: 0.27, note: privateText }, Hunter: { x: 1, y: 1 } },
    items: [{ x: 0.5, y: 0.5, kind: 'secret-kind', route: [{ x: 0.1234, y: 0.9876 }] }],
    arrows: [{ route: privateText }], measures: [{ customName: privateText }],
    texts: [{ get text() { throw new Error('Summary must not read annotation text'); } }],
  };
  const summary = summarizeBoard(board);
  assert.equal(summary.role_count, 2);
  assert.equal(summary.text_count, 1);
  assert.equal(summary.zone_1, 1);
  assert.equal(summary.zone_5, 1);
  assert.equal(summary.zone_9, 1);
  assert.equal(Object.values(summary).every(Number.isInteger), true);
  assert.equal(Object.keys(summary).length, 14);
  assert.doesNotMatch(JSON.stringify(summary), /PRIVATE|secret-kind|route|Gardener|0\.1234/);
});

test('invalid positions cannot leak as event values', () => {
  const summary = summarizeBoard({ tokens: { a: { x: NaN, y: 0 }, b: { x: -1, y: 2 } }, items: [null] });
  assert.equal(Object.entries(summary).filter(([key]) => key.startsWith('zone_')).reduce((sum, [, value]) => sum + value, 0), 0);
  assert.equal(Object.values(summary).every(Number.isFinite), true);
});

test('local change detection notices text edits without adding text to summaries', () => {
  const before = { texts: [{ text: 'first private note' }] };
  const after = { texts: [{ text: 'second private note' }] };
  assert.notEqual(boardFingerprint(before), boardFingerprint(after));
  assert.deepEqual(summarizeBoard(before), summarizeBoard(after));
  const cyclic = {}; cyclic.self = cyclic;
  assert.equal(boardFingerprint(cyclic), null);
});

async function privacyHook(hostname = 'pkuidv.com') {
  const sandbox = { window: { location: { hostname, pathname: '/tactical-friend/' } }, URL };
  vm.runInNewContext(await readFile(new URL('../telemetry/privacy.js', import.meta.url), 'utf8'), sandbox);
  return sandbox.window.pkuidvTelemetryBeforeSend;
}

test('tracker hook removes raw content, identity data and URL parameters', async () => {
  const hook = await privacyHook();
  const payload = hook('event', {
    website: 'd8c95849-978e-48d7-ba4d-7a783397609b', name: 'tf_edit_summary',
    id: 'PRIVATE_ID', title: 'PRIVATE_NOTE', url: '/tactical-friend/?note=PRIVATE_NOTE',
    referrer: 'https://example.com/private/path?email=PRIVATE_EMAIL',
    data: { map_id: 0, mode: 'tactic', role_count: 2, zone_1: 1,
      text: 'PRIVATE_NOTE', email: 'PRIVATE_EMAIL', x: 0.1234, y: 0.9876,
      board: { secret: 'PRIVATE_NOTE' }, route: ['PRIVATE_NOTE'] },
  });
  assert.equal(payload.url, '/tactical-friend/');
  assert.equal(payload.referrer, 'https://example.com');
  assert.equal(payload.data.role_count, 2);
  assert.doesNotMatch(JSON.stringify(payload), /PRIVATE|email|0\.1234|route|board|private\/path/);
});

test('identity requests, unknown events and non-production hosts are rejected', async () => {
  const hook = await privacyHook();
  const payload = { website: 'd8c95849-978e-48d7-ba4d-7a783397609b' };
  assert.equal(hook('identify', payload), false);
  assert.equal(hook('event', { ...payload, name: 'unapproved-event' }), false);
  assert.equal((await privacyHook('localhost'))('event', payload), false);
  assert.equal(hook('event', { website: 'another-website' }), false);
  assert.equal(hook('event', payload).tag, 'tactical-friend');
});

test('the sponsor event is allowlisted without inheriting arbitrary data', async () => {
  const payload = (await privacyHook())('event', { website: 'd8c95849-978e-48d7-ba4d-7a783397609b',
    name: 'sponsor_afdian_open', data: { secret: 'PRIVATE', map_id: 5, entry: 'PRIVATE' } });
  assert.equal(payload.name, 'sponsor_afdian_open');
  assert.deepEqual(JSON.parse(JSON.stringify(payload.data)), { application: 'tactical-friend', entry: 'tactical-friend' });
});
