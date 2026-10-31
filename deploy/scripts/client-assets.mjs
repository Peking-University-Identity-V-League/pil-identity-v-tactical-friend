// One import map versions the entire module graph, including lazy imports and
// shared modules used by telemetry. Versioning only bootstrap.js is insufficient.
export function importMapForAssets(assetURLs, base = './') {
  const modules = Object.keys(assetURLs).filter(p => p.endsWith('.js')).sort();
  const imports = Object.fromEntries(modules.map(path => [base + path, base + assetURLs[path]]));
  const scopes = {};
  // Keep module bytes independent of their dependencies' hashes. A scoped map
  // resolves relative static/dynamic imports from each content-addressed file.
  for (const path of modules) {
    const directory = assetURLs[path].split('/').slice(0, 2).join('/') + '/';
    scopes[base + directory] = Object.fromEntries(modules.map(target => [base + directory + target, base + assetURLs[target]]));
  }
  return { imports, scopes };
}

export function versionClientAssets(html, paths, revision, assetURLs) {
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid client revision');
  if (!/<head\b[^>]*>/i.test(html) || /<script\b[^>]*type=["']importmap["']/i.test(html)) throw new Error('Expected an HTML head without an existing import map');
  const files = new Set(paths);
  const versionURL = value => {
    const path = value.replace(/^\.\//, '').split(/[?#]/)[0];
    if (!files.has(path) || path === 'index.html') return value;
    const url = new URL(value, 'https://build.invalid/');
    if (assetURLs) {
      if (!/^_assets\/[a-f0-9]{64}\//.test(assetURLs[path] || '')) throw new Error('Invalid asset URL: ' + path);
      return './' + assetURLs[path] + url.search + url.hash;
    }
    url.searchParams.set('v', revision);
    return (value.startsWith('./') ? './' : '') + path + url.search + url.hash;
  };
  const imports = Object.fromEntries([...files].filter(p => p.endsWith('.js')).sort()
    .map(path => ['./' + path, versionURL('./' + path)]));
  html = html.replace(/\b(src|href)=(["'])([^"']+)\2/g,
    (_, attribute, quote, value) => attribute + '=' + quote + versionURL(value) + quote);
  const metadata = '<meta name="pil-client-revision" content="' + revision + '">' +
    (assetURLs ? '\n<script type="application/json" id="pil-assets">' + JSON.stringify(Object.fromEntries(Object.entries(assetURLs).map(([name,url]) => [name, './' + url]))).replace(/</g, '\\u003c') + '</script>' : '');
  const map = '<script type="importmap">' + JSON.stringify(assetURLs ? importMapForAssets(assetURLs) : { imports }).replace(/</g, '\\u003c') + '</script>';
  return html.replace(/<head\b[^>]*>/i, head => head + '\n' + metadata + '\n' + map + '\n');
}
