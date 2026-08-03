#!/usr/bin/env node
/**
 * Snapshot de metricas del DS. Escribe metrics/YYYY-MM-DD.json y lo imprime.
 *
 * No instrumenta nada: lee lo que git y el registry ya registran. Por eso la
 * primera corrida no arranca en cero — reconstruye meses de historia hacia atras.
 *
 * git es la base de datos de series temporales: un snapshot por corrida,
 * commiteado. Sin infra, sin costo, sin nada que mantener.
 *
 * Nunca falla el build. Es observabilidad, no un gate — si algo no se puede
 * medir se reporta como null y se sigue.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { globSync } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '..');
const REPO = 'karenrebecag/atom-uikit-ds';
const DAY_MS = 24 * 60 * 60 * 1000;

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
  } catch {
    return '';
  }
}

/** Fecha ISO del commit que ANADIO un path (soporta glob de git). */
function addedAt(pathspec) {
  const out = git(['log', '--diff-filter=A', '--format=%aI', '-1', '--', pathspec]);
  return out || null;
}

const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS);
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

/* ---------- 1. Tiempo hasta publicar ---------- */

function timeToPublish() {
  const items = globSync('public/r/*.json', { cwd: ROOT })
    .map((f) => basename(f, '.json'))
    .filter((s) => !['index', 'tokens-nested', 'registry'].includes(s));

  const rows = [];
  for (const slug of items) {
    // Los layouts se publican como unidad, no tienen fuente propia comparable.
    if (slug.startsWith('layout--')) continue;

    const source =
      addedAt(`packages/css/src/components/*/${slug}.css`) ??
      addedAt(`packages/animations/src/${slug}.ts`);
    const published = addedAt(`public/r/${slug}.json`);
    if (!source || !published) continue;

    const d = days(source, published);
    if (d >= 0) rows.push({ slug, source: source.slice(0, 10), published: published.slice(0, 10), days: d });
  }

  const ds = rows.map((r) => r.days);
  return {
    measured: rows.length,
    medianDays: median(ds),
    maxDays: ds.length ? Math.max(...ds) : null,
    sameDay: ds.filter((d) => d === 0).length,
    slowest: [...rows].sort((a, b) => b.days - a.days).slice(0, 5),
  };
}

/* ---------- 2. Cobertura por capa ---------- */

/**
 * Se LEE de public/r/content-coverage.json (F16), no se recalcula.
 *
 * Recalcularlo aqui daria dos numeros de cobertura mantenidos por separado, que
 * es exactamente el drift que este proyecto existe para matar — solo que
 * aplicado a las propias metricas. Un tablero que contradice a su fuente no lo
 * cree nadie, y con razon.
 *
 * Lo que este colector aporta de nuevo es tiempo-hasta-publicar y deriva.
 */
function coverage() {
  const path = resolve(ROOT, 'public/r/content-coverage.json');
  if (!existsSync(path)) {
    return { available: false, reason: 'falta public/r/content-coverage.json — corre build:registry' };
  }
  try {
    const cc = JSON.parse(readFileSync(path, 'utf8'));
    return { available: true, source: 'public/r/content-coverage.json', totals: cc.totals ?? null };
  } catch (err) {
    return { available: false, reason: String(err?.message ?? err) };
  }
}

/* ---------- 3. Incidentes de deriva ---------- */

async function driftIncidents() {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) return { available: false, reason: 'sin GITHUB_TOKEN — se omite' };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/validate-tokens.yml/runs?per_page=100`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) return { available: false, reason: `GitHub API ${res.status}` };

    const runs = (await res.json()).workflow_runs ?? [];
    const done = runs.filter((r) => r.conclusion);
    const failed = done.filter((r) => r.conclusion === 'failure');
    return {
      available: true,
      runs: done.length,
      failures: failed.length,
      failureRate: done.length ? Math.round((failed.length / done.length) * 100) : 0,
      lastFailure: failed[0]?.created_at ?? null,
    };
  } catch (err) {
    return { available: false, reason: String(err?.message ?? err) };
  }
}

/* ---------- salida ---------- */

const snapshot = {
  date: new Date().toISOString().slice(0, 10),
  commit: git(['rev-parse', '--short', 'HEAD']) || null,
  timeToPublish: timeToPublish(),
  coverage: coverage(),
  drift: await driftIncidents(),
};

mkdirSync(resolve(ROOT, 'metrics'), { recursive: true });
const out = resolve(ROOT, 'metrics', `${snapshot.date}.json`);
writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n');

const t = snapshot.timeToPublish;
const c = snapshot.coverage;
const d = snapshot.drift;

console.log(`\nmetricas ${snapshot.date} (${snapshot.commit})\n`);
console.log('  tiempo hasta publicar');
console.log(`    mediana ${t.medianDays}d sobre ${t.measured} componentes  (max ${t.maxDays}d, mismo dia ${t.sameDay})`);
if (t.slowest.length) {
  for (const s of t.slowest) console.log(`      ${String(s.days).padStart(3)}d  ${s.slug}`);
}
console.log('\n  cobertura  (fuente: content-coverage.json, F16)');
if (c.available && c.totals) {
  const T = c.totals;
  const line = (label, n, of) =>
    console.log(`    ${label.padEnd(12)} ${String(n).padStart(3)}/${of}  ${String(Math.round((n / of) * 100)).padStart(3)}%`);
  if (T.metaAgent && T.eligibleAgent) line('meta.agent', T.metaAgent.full, T.eligibleAgent);
  if (T.editorial) line('editorial', T.editorial.yes, T.editorial.eligible);
  if (T.derived && T.items) line('derived', T.derived.withSourceCommit, T.items);
  if (T.webflow && T.items) line('webflow', T.webflow.emitted, T.items);
} else {
  console.log(`    no disponible: ${c.reason}`);
}
console.log('\n  deriva del registry');
if (d.available) {
  console.log(`    ${d.failures} fallos en ${d.runs} corridas  (${d.failureRate}%)`);
} else {
  console.log(`    no disponible: ${d.reason}`);
}
console.log(`\n  escrito en ${out.replace(ROOT + '/', '')}\n`);
