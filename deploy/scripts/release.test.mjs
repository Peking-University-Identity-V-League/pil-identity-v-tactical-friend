import assert from 'node:assert/strict';
import test from 'node:test';
import { describeRelease } from './deploy.mjs';

test('the publisher accepts only tactical releases for the current workflow commit', () => {
  const commit = 'a'.repeat(40);
  const metadata = { source_commit: commit, config_revision: commit };
  const release = describeRelease(metadata, commit);
  assert.equal(release.component, 'tactical');
  assert.deepEqual(release.paths, ['/tactical-friend/__release.json', '/zhanshuyanlian/__release.json']);
  for (const invalid of [
    {},
    { homepage_commit: commit },
    { source_commit: '../escape', config_revision: commit },
    { source_commit: commit, config_revision: 'b'.repeat(40) },
    { ...metadata, homepage_commit: commit },
  ]) assert.throws(() => describeRelease(invalid, commit));
  assert.throws(() => describeRelease(metadata, 'b'.repeat(40)));
});
