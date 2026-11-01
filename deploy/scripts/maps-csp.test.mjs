import assert from 'node:assert/strict';
import test from 'node:test';
import { mapsContentSecurityPolicy, renderNginx } from './render-policy.mjs';
import { requireMapWasmPolicy } from './deploy.mjs';

test('3D policy permits embedded WASM without general JavaScript eval', () => {
  const directives = Object.fromEntries(mapsContentSecurityPolicy.split(';').map(s => s.trim().split(/\s+/)).filter(p => p[0]).map(([name, ...values]) => [name, values]));
  assert.ok(directives['script-src'].includes("'wasm-unsafe-eval'"));
  assert.ok(!directives['script-src'].includes("'unsafe-eval'"));
  assert.deepEqual(directives['worker-src'], ["'self'", 'blob:']);
  const blocks = [...renderNginx().matchAll(/location ([^\n]+) \{\n([\s\S]*?)\n\}/g)];
  const compiled = blocks.filter(([, , body]) => body.includes("'wasm-unsafe-eval'"));
  assert.equal(compiled.length, 4);
  for (const [, location, body] of compiled) {
    assert.match(location, /^\^~ \/(?:tactical-friend|zhanshuyanlian)\/3d\/(?:releases\/)?$/);
    assert.ok(body.includes(mapsContentSecurityPolicy));
  }
});

test('Recast publication refuses an old CSP before static activation', () => {
  assert.doesNotThrow(() => requireMapWasmPolicy(mapsContentSecurityPolicy));
  for (const csp of [null, "default-src 'none'; script-src 'self' data:", "script-src 'self' 'unsafe-eval'", "script-src 'self' 'wasm-unsafe-eval' 'unsafe-eval'"]) {
    assert.throws(() => requireMapWasmPolicy(csp), /Install the generated 3D Nginx CSP/);
  }
});
