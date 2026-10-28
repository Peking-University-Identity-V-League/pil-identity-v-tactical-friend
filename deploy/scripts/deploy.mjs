import { spawnSync } from 'node:child_process';
import { appendFile, mkdtemp, readFile, rm } from 'node:fs/promises';
import { get, request as httpsRequest } from 'node:https';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
export function describeRelease(metadata, expectedCommit) {
  if (sha(metadata.source_commit) && sha(metadata.config_revision) && !metadata.homepage_commit) {
    if (expectedCommit && (!sha(expectedCommit) || metadata.source_commit !== expectedCommit || metadata.config_revision !== expectedCommit)) {
      throw new Error('Static release does not match this workflow commit.');
    }
    return { component: 'tactical', release: 'tactical-' + metadata.source_commit + '-' + metadata.config_revision, paths: ['/tactical-friend/__release.json', '/zhanshuyanlian/__release.json'] };
  }
  throw new Error('Static release metadata is invalid.');
}

function remoteMetadata(host, path) {
  return new Promise((resolve, reject) => {
    const request = get({ hostname: host, servername: 'pkuidv.com', path, headers: { Host: 'pkuidv.com' }, signal: AbortSignal.timeout(15000) }, response => {
      if (response.statusCode !== 200) { response.resume(); reject(new Error('Unexpected release response.')); return; }
      let size = 0;
      const chunks = [];
      response.on('data', chunk => {
        size += chunk.length;
        if (size > 65536) request.destroy(new Error('Release response is too large.'));
        else chunks.push(chunk);
      });
      response.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch { reject(new Error('Invalid release response.')); }
      });
      response.on('error', reject);
    });
    request.on('error', reject);
  });
}

export async function deploy() {
  const metadata = JSON.parse(await readFile('dist/__release.json', 'utf8'));
  const expected = describeRelease(metadata, process.env.GITHUB_SHA);
  const { CST_HOST: host, CST_DEPLOY_TOKEN: token, ...environment } = process.env;
  if (!/^[a-z0-9][a-z0-9.-]*$/i.test(host || '') || !/^[A-Za-z0-9_-]{40,128}$/.test(token || '')) {
    throw new Error('CST deployment credentials are missing or invalid.');
  }
  const temporary = await mkdtemp(join(tmpdir(), 'pil-cst-deploy-'));
  try {
    const archivePath = join(temporary, 'release.tar.gz');
    const tar = spawnSync('tar', ['-czf', archivePath, '-C', 'dist', '.'], { timeout: 30000, env: environment, encoding: 'utf8' });
    if (tar.error || tar.status !== 0) throw new Error('Static release packaging failed.');
    const archive = await readFile(archivePath);
    if (archive.length > 24 * 1024 * 1024) throw new Error('Static release is too large.');
    let receipt;
    try {
      receipt = await new Promise((resolve, reject) => {
        const request = httpsRequest({ hostname: host, servername: 'pkuidv.com', path: '/_deploy/' + expected.component, method: 'POST', signal: AbortSignal.timeout(180000), headers: { Host: 'pkuidv.com', Authorization: 'Bearer ' + token, 'Content-Type': 'application/gzip', 'Content-Length': archive.length } }, response => {
          let size = 0;
          const chunks = [];
          response.on('data', chunk => { size += chunk.length; if (size > 65536) request.destroy(); else chunks.push(chunk); });
          response.on('error', reject);
          response.on('end', () => { try { const result = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (response.statusCode !== 200 || result.ok !== true) reject(new Error()); else resolve(result); } catch { reject(new Error()); } });
        });
        request.on('error', reject);
        request.end(archive);
      });
    } catch { throw new Error('CST HTTPS upload failed. Raw credential-bearing request diagnostics are suppressed.'); }
    if (receipt?.ok !== true || receipt.component !== expected.component || receipt.release !== expected.release) {
      throw new Error('CST returned an unexpected deployment receipt.');
    }
    try {
      for (const path of expected.paths) {
        const actual = describeRelease(await remoteMetadata(host, path));
        if (actual.release !== expected.release || actual.component !== expected.component) throw new Error();
      }
    } catch { throw new Error('Upload completed, but CST HTTPS release verification failed.'); }
    const message = 'CST static release activated and verified over HTTPS: ' + expected.component + '; ' + expected.release;
    console.log(message);
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, message + '\n');
    return receipt;
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await deploy(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
