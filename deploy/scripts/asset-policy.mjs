import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { readdir, readFile, stat, utimes, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

export const policy = JSON.parse(readFileSync(new URL('../asset-policy.json', import.meta.url), 'utf8'));
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const policyVersion = digest(JSON.stringify(policy));
export async function filesIn(root, prefix = '') {
  const files = [];
  for (const entry of (await readdir(join(root, prefix), { withFileTypes: true })).sort((a,b) => a.name < b.name ? -1 : 1)) {
    const name = prefix + entry.name;
    if (entry.isSymbolicLink()) throw Error('Symlinks are not allowed: ' + name);
    if (entry.isDirectory()) files.push(...await filesIn(root, name + '/'));
    else if (entry.isFile()) files.push(name);
    else throw Error('Non-regular asset: ' + name);
  }
  return files;
}
export async function compressFile(file) {
  const data = await readFile(file);
  const info = await stat(file);
  const variants = {
    gz: gzipSync(data, { level: policy.compression.gzipLevel }),
    br: brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: policy.compression.brotliQuality } }),
  };
  for (const [extension, bytes] of Object.entries(variants)) {
    await writeFile(file + '.' + extension, bytes);
    await utimes(file + '.' + extension, info.atime, info.mtime);
  }
  return variants;
}
export async function compressTree(root) {
  for (const name of await filesIn(root)) {
    if (policy.compression.extensions.includes(extname(name))) await compressFile(join(root, name));
  }
}
export function cacheClass(name) {
  if (name.startsWith(policy.immutableDirectory + '/') || name.startsWith('3d/releases/')) return 'immutable';
  if (['__release.json', '3d/__release.json', 'asset-manifest.json'].includes(name)) return 'metadata';
  return 'entry';
}
export async function writeManifest(output, metadata) {
  const files = {};
  for (const name of await filesIn(output)) {
    if (name === 'asset-manifest.json' || /\.(gz|br)$/.test(name)) continue;
    const data = await readFile(join(output, name));
    const row = { sha256: digest(data), bytes: data.length, cache: cacheClass(name), encodings: {} };
    for (const extension of ['gz', 'br']) {
      try {
        const compressed = await readFile(join(output, name + '.' + extension));
        row.encodings[extension] = { sha256: digest(compressed), bytes: compressed.length };
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    files[name] = row;
  }
  const manifest = { schema: policy.schema, policy_version: policyVersion, source_commit: metadata.source_commit, asset_version: metadata.asset_version, external_images: policy.externalImages, files };
  await writeFile(join(output, 'asset-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await compressFile(join(output, 'asset-manifest.json'));
  return manifest;
}
