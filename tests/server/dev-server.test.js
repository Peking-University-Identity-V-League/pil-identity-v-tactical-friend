import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

async function startServer(t) {
  const child = spawn(process.execPath, ['scripts/dev-server.js', '--host', '127.0.0.1', '--port', '0'], {
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  let output = '', errors = '';
  child.stderr.on('data', data => { errors += data; });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const stopped = once(child, 'exit');
      child.kill();
      await stopped;
    }
  });
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', code => reject(new Error(`Server exited (${code}): ${errors}`)));
    child.stdout.on('data', data => {
      output += data;
      const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
      if (match) resolve(match[0]);
    });
  });
}

test('malformed URL escapes return 400 without terminating the server', { timeout: 15000 }, async t => {
  const url = await startServer(t);
  for (const path of ['%', '%ZZ', '%E0%A4', '%C0%AF']) {
    const bad = await fetch(url + path);
    assert.equal(bad.status, 400, path);
    assert.equal(await bad.text(), 'Bad request');
    const healthy = await fetch(url);
    assert.equal(healthy.status, 200, `Server remains available after ${path}`);
    assert.match(await healthy.text(), /<!DOCTYPE html>/i);
  }
});

test('valid escaped paths, query strings and missing-file responses still work', { timeout: 15000 }, async t => {
  const url = await startServer(t);
  for (const path of ['%69ndex.html', '?q=%']) {
    const response = await fetch(url + path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /<!DOCTYPE html>/i);
  }
  for (const path of ['missing-file.html', '%2e%2e%2foutside.txt']) {
    const response = await fetch(url + path);
    assert.equal(response.status, 404);
    await response.text();
  }
});
