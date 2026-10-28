import { execFileSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareAssets } from './prepare-assets.mjs';

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
  return prepareAssets(source, commit, revision);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build(process.argv[2]);
  console.log('Prepared ' + result.files + ' static files from ' + result.commit);
}
