#!/usr/bin/env node
/**
 * F9c — Post-merge smoke: is a slug propagated to docs registry + webflow + /v1?
 *
 *   pnpm smoke:publish chip
 *   DOCS_BASE=https://uikit.atomchat.io ATOM_REGISTRY_KEY=… node scripts/smoke-publish.mjs chip
 *
 * Exit 0 if all required checks pass; 1 if any required fails.
 */

const slug = process.argv[2] || 'chip'
const DOCS_BASE = (process.env.DOCS_BASE || 'https://uikit.atomchat.io').replace(/\/$/, '')
const V1_BASE = (process.env.V1_BASE || 'https://atom-web-ds.vercel.app').replace(/\/$/, '')
const KEY = process.env.ATOM_REGISTRY_KEY || ''

const headers = {
  Accept: 'application/json',
  ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}),
}

async function check(label, url, { method = 'GET', required = true } = {}) {
  const t0 = Date.now()
  try {
    const res = await fetch(url, { method, headers, redirect: 'follow' })
    const ms = Date.now() - t0
    const ok = res.ok
    let detail = `${res.status} ${ms}ms`
    if (ok && method === 'GET' && url.endsWith('.json')) {
      const j = await res.json()
      if (j.name || j.slug) detail += ` name=${j.name || j.slug}`
      if (j.format) detail += ` format=${j.format}`
    }
    return { label, url, ok, required, detail }
  } catch (e) {
    return { label, url, ok: false, required, detail: e.message }
  }
}

const rows = []
rows.push(
  await check(
    `/api/r/${slug}.json`,
    `${DOCS_BASE}/api/r/${slug}.json`,
    { required: true },
  ),
)
// El tramo webflow es requerido SOLO si el canal declara el slug como emitido
// (auditoría F9: un 404 de un slug emitido debe ser FAIL, no n/a — "excluido
// por diseño" ≠ "falta propagar").
let webflowRequired = false
try {
  const idxRes = await fetch(`${DOCS_BASE}/api/r/webflow/index.json`, { headers })
  if (idxRes.ok) {
    const idx = await idxRes.json()
    const emitted = idx.emitted ?? idx.pilots ?? []
    webflowRequired = emitted.includes(slug)
  }
} catch { /* canal index inaccesible → mantener opcional */ }
rows.push(
  await check(
    `/api/r/webflow/${slug}.json`,
    `${DOCS_BASE}/api/r/webflow/${slug}.json`,
    { required: webflowRequired },
  ),
)
rows.push(
  await check(`/v1/components.css`, `${V1_BASE}/v1/components.css`, {
    method: 'HEAD',
    required: true,
  }),
)
rows.push(
  await check(`/v1/tokens.css`, `${V1_BASE}/v1/tokens.css`, {
    method: 'HEAD',
    required: true,
  }),
)

console.log(`\nsmoke:publish ${slug}`)
console.log(`docs=${DOCS_BASE}  v1=${V1_BASE}  auth=${KEY ? 'yes' : 'no (public may 401)'}\n`)
console.log('| Tramo | Status | Detalle |')
console.log('|-------|--------|---------|')
for (const r of rows) {
  const mark = r.ok ? '✓' : r.required ? '✗ FAIL' : '○ n/a'
  console.log(`| ${r.label} | ${mark} | ${r.detail} |`)
}

const failed = rows.filter((r) => r.required && !r.ok)
if (failed.length) {
  console.log('\nFaltante:')
  for (const f of failed) {
    if (f.label.includes('/api/r/') && !f.label.includes('webflow')) {
      console.log(`  → Registry item: merge public/r/${slug}.json en DS + sync docs (workflow sync-docs).`)
    } else if (f.label.includes('webflow')) {
      console.log(`  → Webflow channel: componente excluido del emit o no propagado aún.`)
    } else if (f.label.includes('/v1/')) {
      console.log(`  → CDN /v1: workflow deploy-public-dist (tokens/css/animations paths).`)
    }
  }
  process.exit(1)
}
console.log('\nPropagación OK (checks requeridos).')
process.exit(0)
