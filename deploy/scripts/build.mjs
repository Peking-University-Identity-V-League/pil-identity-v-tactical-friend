import { execFileSync } from 'node:child_process';
import { access, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareAssets } from './prepare-assets.mjs';
import { prepareMaps } from './maps3d.mjs';

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
  if (resolve(git(['-C', source, 'rev-parse', '--show-toplevel'])) !== source) {
    throw new Error('Application source must be its own Git checkout');
  }
  const commit = git(['-C', source, 'rev-parse', 'HEAD']);
  let revision = process.env.DEPLOY_CONFIG_REVISION;
  if (!revision) {
    try { revision = git(['-C', projectRoot, 'rev-parse', 'HEAD']); } catch { revision = 'local'; }
  }
  const result = await prepareAssets(source, commit, revision);
  // Explicit fixture checkouts exercise the 2D packager independently.
  if (source === resolve(projectRoot, '..')) {
    const maps = await prepareMaps(source, join(projectRoot, 'dist'), commit);
    const metadataPath = join(projectRoot, 'dist/__release.json');
    const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
    await writeFile(metadataPath, JSON.stringify({ ...metadata, maps3d_version: maps.asset_version }) + '\n');
    result.files += 66;
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build(process.argv[2]);
  console.log('Prepared ' + result.files + ' static files from ' + result.commit);
}
