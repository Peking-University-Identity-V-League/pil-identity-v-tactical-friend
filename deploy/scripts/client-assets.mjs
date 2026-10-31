// One import map versions the entire module graph, including lazy imports and
// shared modules used by telemetry. Versioning only bootstrap.js is insufficient.
export function versionClientAssets(html, paths, revision) {
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid client revision');
  if (!/<head\b[^>]*>/i.test(html) || /<script\b[^>]*type=["']importmap["']/i.test(html)) throw new Error('Expected an HTML head without an existing import map');
  const files = new Set(paths);
  const versionURL = value => {
    const path = value.replace(/^\.\//, '').split(/[?#]/)[0];
    if (!files.has(path) || path === 'index.html') return value;
    const url = new URL(value, 'https://build.invalid/');
    url.searchParams.set('v', revision);
    return (value.startsWith('./') ? './' : '') + path + url.search + url.hash;
  };
  const imports = Object.fromEntries([...files].filter(p => p.endsWith('.js')).sort()
    .map(path => ['./' + path, versionURL('./' + path)]));
  html = html.replace(/\b(src|href)=(["'])([^"']+)\2/g,
    (_, attribute, quote, value) => attribute + '=' + quote + versionURL(value) + quote);
  const metadata = '<meta name="pil-client-revision" content="' + revision + '">';
  const map = '<script type="importmap">' + JSON.stringify({ imports }).replace(/</g, '\\u003c') + '</script>';
  return html.replace(/<head\b[^>]*>/i, head => head + '\n' + metadata + '\n' + map + '\n');
}
