#!/usr/bin/env node
/**
 * Fails when the committed public/r does not match what the committed code
 * produces. Run it right after `pnpm build:registry`: the working tree holds the
 * regenerated output, HEAD holds what was committed.
 *
 * Three real failures from 2026-08-02 were all this same bug wearing different
 * hats: the derived layer generated but never committed, derive-doc.mjs left out
 * of the repo while its output went in, and production serving a stale registry
 * for days. None of them would survive this check.
 *
 * generatedAt and sourceCommit are excluded — a wall-clock stamp and the current
 * SHA differ on every run by construction, and comparing them would make the
 * check fire always, which is the same as not having it.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { globSync } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '..');
const VOLATILE = ['generatedAt', 'sourceCommit'];

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

/**
 * Strip the fields that legitimately change on every build, wherever they sit.
 *
 * Recursive and level-agnostic on purpose. Two files taught this the hard way:
 * shadcn/registry.json nests them under items[].meta.derived, and
 * content-coverage.json carries generatedAt at the root. A normaliser tied to a
 * particular level reports those as drifting on every single run, which trains
 * you to ignore the check — the worst possible outcome for a gate.
 *
 * Both names are build stamps by definition, so dropping them anywhere is safe.
 */
function normalise(value) {
  if (Array.isArray(value)) {
    value.forEach(normalise);
    return value;
  }
  if (!value || typeof value !== 'object') return value;

  for (const key of VOLATILE) {
    if (key in value) delete value[key];
  }
  for (const child of Object.values(value)) normalise(child);
  return value;
}

function parse(text, label) {
  try {
    return normalise(JSON.parse(text));
  } catch (err) {
    throw new Error(`${label}: not valid JSON — ${err.message}`);
  }
}

const tracked = git(['ls-files', 'public/r'])
  .split('\n')
  .filter((f) => f.endsWith('.json'));

const onDisk = globSync('public/r/**/*.json', { cwd: ROOT }).map((f) => f.replaceAll('\\', '/'));

const drifted = [];
const missing = [];
const added = [];

for (const file of tracked) {
  if (!existsSync(resolve(ROOT, file))) {
    missing.push(file);
    continue;
  }
  const committed = parse(git(['show', `HEAD:${file}`]), `HEAD:${file}`);
  const rebuilt = parse(readFileSync(resolve(ROOT, file), 'utf8'), file);
  if (JSON.stringify(committed) !== JSON.stringify(rebuilt)) drifted.push(file);
}

for (const file of onDisk) {
  if (!tracked.includes(file)) added.push(file);
}

const problems = drifted.length + missing.length + added.length;

if (problems === 0) {
  console.log(`registry sin deriva — ${tracked.length} archivos reproducibles desde el codigo commiteado`);
  process.exit(0);
}

console.error('\nEl registry commiteado no coincide con lo que produce el build.\n');

if (drifted.length) {
  console.error(`  ${drifted.length} con contenido distinto:`);
  for (const f of drifted.slice(0, 20)) console.error(`    ${f}`);
  if (drifted.length > 20) console.error(`    ... y ${drifted.length - 20} mas`);
}
if (added.length) {
  console.error(`\n  ${added.length} generados pero NO commiteados:`);
  for (const f of added.slice(0, 20)) console.error(`    ${f}`);
}
if (missing.length) {
  console.error(`\n  ${missing.length} commiteados pero el build ya no los genera:`);
  for (const f of missing.slice(0, 20)) console.error(`    ${f}`);
}

console.error(
  '\nCorre `pnpm build:registry` y commitea public/r. Si el emisor cambio,\n' +
    'el emisor tambien va en el commit — publicar la salida sin su generador\n' +
    'deja main sirviendo algo que no puede reproducir.\n',
);

process.exit(1);
