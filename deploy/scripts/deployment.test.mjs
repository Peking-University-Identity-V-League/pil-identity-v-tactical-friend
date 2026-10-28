import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { prepareAssets } from './prepare-assets.mjs';

test('packaging excludes deployment credentials and rejects symlinks', async () => {
  const source = await mkdtemp(join(tmpdir(), 'tactical-friend-source-'));
  try {
    for (const directory of ['js', 'css', 'locales']) await mkdir(join(source, directory));
    await writeFile(join(source, 'index.html'), '<html><head></head><body>fixture</body></html>');
    await writeFile(join(source, 'js/main.js'), 'export {};');
    await writeFile(join(source, 'css/style.css'), 'body {}');
    await writeFile(join(source, 'locales/zh-CN.json'), '{}');
    await writeFile(join(source, 'package.json'), '{"scripts":{"postinstall":"exit 1"}}');
    await writeFile(join(source, '.env'), 'PRIVATE=fixture');
    await writeFile(join(source, 'js/.env'), 'PRIVATE=fixture');
    await writeFile(join(source, '_worker.js'), 'throw new Error();');
    const commit = 'a'.repeat(40);
    await prepareAssets(source, commit);
    const output = new URL('../dist/', import.meta.url);
    assert.deepEqual((await readdir(output)).sort(), ['__release.json', 'css', 'index.html', 'js', 'locales', 'telemetry']);
    assert.deepEqual(await readdir(new URL('js/', output)), ['main.js']);
    const html = await readFile(new URL('index.html', output), 'utf8');
    assert.equal((html.match(/https:\/\/umami\.pkuidv\.com\/script\.js/g) || []).length, 1);
    assert.ok(html.indexOf('telemetry/privacy.js') < html.indexOf('umami.pkuidv.com/script.js'));
    assert.ok(html.includes('data-do-not-track="true"'));
    assert.deepEqual((await readdir(new URL('telemetry/', output))).sort(), ['client.js', 'privacy.js', 'summary.js']);
    assert.equal(JSON.parse(await readFile(new URL('__release.json', output))).source_commit, commit);
    await symlink(join(source, '.env'), join(source, 'js/leak.js'));
    await assert.rejects(prepareAssets(source, commit), /Symlink/);
  } finally {
    await rm(source, { recursive: true, force: true });
  }
});
