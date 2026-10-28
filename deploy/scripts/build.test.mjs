import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const buildScript = new URL('./build.mjs', import.meta.url);

test('an explicit application checkout is packaged without running or resetting upstream code', async () => {
  const source = await mkdtemp(join(tmpdir(), 'tactical-build-'));
  try {
    for (const directory of ['css', 'js', 'locales']) await mkdir(join(source, directory));
    await writeFile(join(source, 'index.html'), '<html><head></head><body>committed</body></html>');
    await writeFile(join(source, 'css/style.css'), 'body {}');
    await writeFile(join(source, 'js/main.js'), 'export {};');
    await writeFile(join(source, 'locales/zh-CN.json'), '{}');
    await writeFile(join(source, 'package.json'), '{"scripts":{"build":"exit 99","postinstall":"exit 99"}}');
    const git = (...args) => execFileSync('git', ['-C', source, ...args], { encoding: 'utf8' }).trim();
    git('init', '-b', 'fixture');
    git('add', '.');
    git('-c', 'user.name=Build test', '-c', 'user.email=build-test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-m', 'fixture');
    const head = git('rev-parse', 'HEAD');
    await writeFile(join(source, 'index.html'), '<html><head></head><body>local edit</body></html>');
    const result = execFileSync(process.execPath, [fileURLToPath(buildScript), source], {
      encoding: 'utf8',
      env: { ...process.env, DEPLOY_CONFIG_REVISION: 'b'.repeat(40) },
    });
    assert.match(result, /Prepared .* static files/);
    assert.equal(git('rev-parse', 'HEAD'), head);
    const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
    assert.match(html, /local edit/);
    const release = JSON.parse(await readFile(new URL('../dist/__release.json', import.meta.url), 'utf8'));
    assert.equal(release.source_commit, head);
    assert.equal(release.config_revision, 'b'.repeat(40));
  } finally {
    await rm(source, { recursive: true, force: true });
  }
});
