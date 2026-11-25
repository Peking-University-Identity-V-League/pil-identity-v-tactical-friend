import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Run with Node 24 and set PIL_EXTREMA_CACHE (the verified 全参数 directory)
// and PIL_EXTREMA_QUERY (the frozen toolkit's tools/extrema/query.mjs).
// The service binds to loopback. Expose /extrema through a separately
// configured same-origin reverse proxy when the production cache is ready.
const cache = process.env.PIL_EXTREMA_CACHE;
const modulePath = process.env.PIL_EXTREMA_QUERY;
if (!path.isAbsolute(cache ?? '') || !path.isAbsolute(modulePath ?? '')) {
  throw new Error('Set PIL_EXTREMA_CACHE and PIL_EXTREMA_QUERY to absolute paths');
}
const { readPrecomputedExtrema } = await import(pathToFileURL(modulePath));
const catalogue = JSON.parse(await readFile(path.join(cache, 'catalogue.json'), 'utf8'));
const keyFor = (...values) => JSON.stringify(values);
const layouts = new Set(catalogue.layouts.map(({ spec }) =>
  keyFor(spec.scene, spec.chairPatternId, spec.cipherPatternId, spec.basement)));
const speeds = new Set(['4.56', '4.64', '4.73', '5.10']);
const fields = ['scene', 'chairPatternId', 'cipherPatternId', 'basement', 'speed', 'hospitality', 'carnival', 'control', 'pointId'];
const choices = new Map([['hospitality', ['0', '3']], ['carnival', ['0', '3']], ['control', ['0', '1']]]);

function respond(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(JSON.stringify(value));
}

let active = 0;
createServer(async (request, response) => {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return respond(response, 405, { status: 'method_not_allowed' });
  }
  if (!request.url?.startsWith('/') || request.url.length > 2048) return respond(response, 400, { status: 'invalid_query' });
  const { pathname, searchParams: params } = new URL(request.url, 'http://localhost');
  if (pathname !== '/extrema') return respond(response, 404, { status: 'not_found' });
  if ([...params.keys()].some(name => !fields.includes(name) || params.getAll(name).length !== 1)) {
    return respond(response, 400, { status: 'invalid_query' });
  }
  const layout = fields.slice(0, 4).map(name => params.get(name));
  const [scene, chairPatternId, cipherPatternId, basement] = layout;
  const speed = params.get('speed') ?? '4.64';
  const pointId = params.get('pointId');
  if (!layouts.has(keyFor(...layout)) || !speeds.has(speed) ||
      [...choices].some(([name, allowed]) => !allowed.includes(params.get(name) ?? '0')) ||
      (pointId !== null && (!pointId || pointId.length > 128))) {
    return respond(response, 400, { status: 'invalid_query' });
  }
  if (active >= 4) return respond(response, 503, { status: 'busy' });
  active++;
  try {
    const talents = Object.fromEntries([...choices.keys()].map(name => [name, Number(params.get(name) ?? 0)]));
    const selection = { baseSpeed: Number(speed), talents, state: { carnivalRemainingSeconds: talents.carnival ? 120 : 0 } };
    const result = await readPrecomputedExtrema(cache, { scene, chairPatternId, cipherPatternId, basement, selection });
    if (result.status !== 'ok') return respond(response, 404, { status: result.status, reason: result.reason });
    if (pointId !== null) {
      const picked = result.choosePoint(pointId);
      if (!picked.route) return respond(response, 404, { status: 'point_not_found' });
      return respond(response, 200, { status: 'ok', pointId, chairId: picked.chairId, seconds: picked.seconds, path: picked.route.path });
    }
    const points = result.result.points.map(({ id, point, chairId, seconds, rank }) => ({ id, point, chairId, seconds, rank }));
    return respond(response, 200, { status: 'ok', sampled: true, sourceComplete: result.precomputation.sourceComplete, points });
  } catch (error) {
    console.error(JSON.stringify({ event: 'extrema_query_error', name: error.name }));
    return respond(response, 500, { status: 'cache_error' });
  } finally {
    active--;
  }
}).listen(Number(process.env.PORT ?? 8788), '127.0.0.1');
