#!/usr/bin/env node
/**
 * Smoke-test a deployed public channel (or local out/ via file:// not useful).
 * Usage: node smoke.mjs https://atom-web-ds.vercel.app
 */
const base = process.argv[2];
if (!base) {
  console.error('Usage: node smoke.mjs https://<host>');
  process.exit(1);
}

const paths = [
  '/v1/tokens.css',
  '/v1/foundation.css',
  '/v1/atom.css',
  '/v1/tokens.json',
  '/v1/tokens-nested.json',
];

let failed = 0;
for (const p of paths) {
  const url = new URL(p, base).href;
  const res = await fetch(url, { method: 'HEAD' });
  const acao = res.headers.get('access-control-allow-origin');
  const cache = res.headers.get('cache-control') || '';
  const ok = res.status === 200 && acao === '*';
  console.log(
    `${ok ? 'OK' : 'FAIL'} ${res.status} ${p}  ACAO=${acao}  cache=${cache}`
  );
  if (!ok) failed++;
}

// Ensure no sourcemaps exposed
const mapRes = await fetch(new URL('/v1/tokens.css.map', base).href, { method: 'HEAD' });
if (mapRes.status === 200) {
  console.log('FAIL sourcemap tokens.css.map is publicly reachable');
  failed++;
} else {
  console.log(`OK  sourcemap not exposed (${mapRes.status})`);
}

process.exit(failed ? 1 : 0);
