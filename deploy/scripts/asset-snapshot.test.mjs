import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { snapshotAssets } from './asset-snapshot.mjs';

test('content snapshots remain stable across commits, cover lazy dependencies, and change with any asset', async () => {
  const output = await mkdtemp(join(tmpdir(), 'asset-snapshot-'));
  const entry = '<html><head><script type="module" src="js/main.js"></script></head><body><img src="https://example.org/map.png"></body></html>';
  try {
    await mkdir(join(output, 'js'));
    await mkdir(join(output, 'locales'));
    await writeFile(join(output, 'js/main.js'), 'export const lazy = () => import("./lazy.js");');
    await writeFile(join(output, 'js/lazy.js'), 'export const answer = 42;');
    await writeFile(join(output, 'locales/zh-CN.json'), '{"hello":"world"}');
    await writeFile(join(output, 'index.html'), entry);
    const first = await snapshotAssets('', output, 'a'.repeat(40), false);
    const html = await readFile(join(output, 'index.html'), 'utf8');
    assert.ok(html.includes('./' + first.asset_urls['js/lazy.js']));
    assert.ok(html.includes('https://example.org/map.png'));
    assert.deepEqual(await readFile(join(output, first.asset_urls['js/lazy.js'])), await readFile(join(output, 'js/lazy.js')));
    await writeFile(join(output, 'index.html'), entry);
    const second = await snapshotAssets('', output, 'b'.repeat(40), false);
    assert.equal(first.asset_version, second.asset_version);
    await writeFile(join(output, 'js/lazy.js'), 'export const answer = 43;');
    await writeFile(join(output, 'index.html'), entry);
    const third = await snapshotAssets('', output, 'b'.repeat(40), false);
    assert.notEqual(third.asset_urls['js/lazy.js'], first.asset_urls['js/lazy.js']);
    assert.equal(third.asset_urls['js/main.js'], first.asset_urls['js/main.js'], 'an unchanged importer must keep its cached URL');
    assert.equal(third.asset_urls['locales/zh-CN.json'], first.asset_urls['locales/zh-CN.json']);
  } finally { await rm(output, { recursive: true, force: true }); }
});
