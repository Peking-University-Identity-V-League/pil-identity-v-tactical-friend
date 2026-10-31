import { execFileSync } from 'node:child_process';
import { access, realpath, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareAssets } from './prepare-assets.mjs';
import { prepareMaps } from './maps3d.mjs';
import { snapshotAssets } from './asset-snapshot.mjs';
import { compressFile, digest, filesIn, policy, policyVersion, writeManifest } from './asset-policy.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    timeout: 90000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  }).trim();
}

export async function build(sourceArgument) {
  const source = resolve(sourceArgument || join(projectRoot, '..'));
  await access(source);
  // Package the checkout that triggered this workflow. Do not fetch another
  // branch, install application dependencies, or execute application scripts.
  if (await realpath(git(['-C', source, 'rev-parse', '--show-toplevel'])) !== await realpath(source)) {
    throw new Error('Application source must be its own Git checkout');
  }
  const commit = git(['-C', source, 'rev-parse', 'HEAD']);
  let revision = process.env.DEPLOY_CONFIG_REVISION;
  if (!revision) {
    try { revision = git(['-C', projectRoot, 'rev-parse', 'HEAD']); } catch { revision = 'local'; }
  }
  const result = await prepareAssets(source, commit, revision, { version: false });
  const output = join(projectRoot, 'dist');
  const snapshot = await snapshotAssets(source, output, commit, source === resolve(projectRoot, '..'));
  const metadata = { source_commit: commit, config_revision: revision, ...snapshot };
  // Explicit fixture checkouts exercise the 2D packager independently.
  if (source === resolve(projectRoot, '..')) {
    const maps = await prepareMaps(source, output, commit, snapshot.asset_urls);
    metadata.maps3d_version = maps.asset_version;
    for (const [name, hash] of Object.entries(maps.full_files || maps.files)) {
      metadata.asset_files['3d/' + name] = hash;
      metadata.asset_urls['3d/' + name] = (maps.full_asset_urls || maps.asset_urls)[name];
    }
  }
  metadata.asset_files = Object.fromEntries(Object.entries(metadata.asset_files).sort(([a],[b]) => a < b ? -1 : 1));
  metadata.asset_urls = Object.fromEntries(Object.entries(metadata.asset_urls).sort(([a],[b]) => a < b ? -1 : 1));
  metadata.asset_version = digest(JSON.stringify({ policy: policyVersion, files: metadata.asset_files }));
  await writeFile(join(output, '__release.json'), JSON.stringify(metadata) + '\n');
  // Map payloads have already been compressed by the same policy helper.
  for (const name of await filesIn(output)) {
    if (!name.startsWith('3d/releases/') && policy.compression.extensions.some(ext => name.endsWith(ext))) await compressFile(join(output, name));
  }
  await writeManifest(output, metadata);
  result.files = (await filesIn(output)).length;
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build(process.argv[2]);
  console.log('Prepared ' + result.files + ' static files from ' + result.commit);
}
