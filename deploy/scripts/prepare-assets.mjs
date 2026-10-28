import { execFileSync } from 'node:child_process';
import { copyFile, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const allowedExtensions = new Map([
  ['css', '.css'],
  ['js', '.js'],
  ['locales', '.json'],
]);

export async function prepareAssets(sourceRoot, commit, configRevision = 'local') {
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Expected a full source commit SHA');
  if (!/^(local|[a-f0-9]{40})$/.test(configRevision)) throw new Error('Invalid config revision');
  const source = resolve(sourceRoot);
  const output = join(projectRoot, 'dist');
  const applicationRoot = resolve(projectRoot, '..');
  if (source === projectRoot || source.startsWith(output + sep) || source === output
      || source !== applicationRoot && projectRoot.startsWith(source + sep)) {
    throw new Error('Source must be the application root or a separate checkout');
  }

  // Only this fixed generated directory is replaced, never an upstream path.
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  let bytes = 0;
  let files = 0;

  async function copyAsset(relativePath) {
    const sourcePath = join(source, relativePath);
    const info = await lstat(sourcePath);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('Non-regular asset: ' + relativePath);
    bytes += info.size;
    files += 1;
    if (bytes > 10 * 1024 * 1024 || files > 2000) throw new Error('Static asset budget exceeded');
    const target = join(output, relativePath);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(sourcePath, target);
  }

  async function copyDirectory(relativePath, extension) {
    const folder = join(source, relativePath);
    const info = await lstat(folder);
    if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Invalid asset directory: ' + relativePath);
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const child = join(relativePath, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Symlink in assets: ' + child);
      if (entry.isDirectory()) await copyDirectory(child, extension);
      else if (extname(entry.name) === extension) await copyAsset(child);
    }
  }

  await copyAsset('index.html');
  for (const [folder, extension] of allowedExtensions) await copyDirectory(folder, extension);
  const htmlPath = join(output, 'index.html');
  let html = await readFile(htmlPath, 'utf8');
  if (!/<\/head\s*>/i.test(html)) throw new Error('Application HTML has no closing head');
  // This deployment owns its tracker configuration; avoid duplicate pageviews
  // if the upstream application later adds the same tracker host.
  html = html.replace(/<script\b[^>]*\bsrc=["']https:\/\/umami\.pkuidv\.com\/script\.js["'][^>]*>\s*<\/script>/gi, '');
  const scripts = [
    '<script defer src="telemetry/privacy.js"></script>',
    '<script defer src="https://umami.pkuidv.com/script.js" data-website-id="d8c95849-978e-48d7-ba4d-7a783397609b" data-domains="pkuidv.com" data-tag="tactical-friend" data-exclude-search="true" data-exclude-hash="true" data-do-not-track="true" data-before-send="pkuidvTelemetryBeforeSend"></script>',
    '<script type="module" src="telemetry/client.js"></script>',
  ].join('\n');
  await writeFile(htmlPath, html.replace(/<\/head\s*>/i, scripts + '\n</head>'));
  await mkdir(join(output, 'telemetry'), { recursive: true });
  for (const name of ['privacy.js', 'client.js', 'summary.js']) {
    await copyFile(join(projectRoot, 'telemetry', name), join(output, 'telemetry', name));
    files += 1;
  }
  await writeFile(join(output, '__release.json'), JSON.stringify({
    source_commit: commit,
    config_revision: configRevision,
  }) + '\n');
  return { files: files + 1, bytes, commit };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = resolve(process.argv[2] || join(projectRoot, '..'));
  const commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const result = await prepareAssets(source, commit, process.env.DEPLOY_CONFIG_REVISION || 'local');
  console.log('Prepared ' + result.files + ' static files from ' + commit);
}
