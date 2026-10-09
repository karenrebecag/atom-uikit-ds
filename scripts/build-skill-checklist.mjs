#!/usr/bin/env node
/**
 * Genera la mitad CONTABLE de skills/atom-uikit/cierre.md desde conformance/skill-checks.json
 * (invariante G-6: el checklist y lo que comprueba finalize son la misma fuente).
 * Solo se reescribe lo que queda entre los marcadores; la mitad de criterio es prosa a mano.
 *
 *   node scripts/build-skill-checklist.mjs          # escribe
 *   node scripts/build-skill-checklist.mjs --check  # sale 1 si no coincide
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FILE = join(ROOT, 'skills', 'atom-uikit', 'cierre.md');
export const START = '<!-- contable:start -->';
export const END = '<!-- contable:end -->';

/** @param {{ tool: string, checks: { id: string, mide: string, arregla: string }[] }} registry */
export function renderChecklist(registry) {
  const ids = registry.checks.map((c) => c.id);
  if (new Set(ids).size !== ids.length) throw new Error('skill-checks.json tiene ids duplicados');
  return registry.checks
    .map((c) => `- [ ] ${c.mide}. Si falla: ${c.arregla}. <!-- check:${c.id} -->`)
    .join('\n');
}

/** Devuelve el contenido de cierre.md con la mitad contable regenerada. */
export function applyChecklist(source, registry) {
  const a = source.indexOf(START);
  const b = source.indexOf(END);
  if (a === -1 || b === -1 || b < a) throw new Error(`cierre.md necesita los marcadores ${START} y ${END}`);
  return `${source.slice(0, a + START.length)}\n${renderChecklist(registry)}\n${source.slice(b)}`;
}

function main() {
  const registry = JSON.parse(readFileSync(join(ROOT, 'conformance', 'skill-checks.json'), 'utf8'));
  const current = existsSync(FILE) ? readFileSync(FILE, 'utf8') : '';
  const next = applyChecklist(current, registry);
  if (process.argv.includes('--check')) {
    if (next !== current) {
      console.error('cierre.md: la mitad contable no coincide con conformance/skill-checks.json (corre node scripts/build-skill-checklist.mjs)');
      process.exit(1);
    }
    return;
  }
  writeFileSync(FILE, next);
  console.log(`  [skill] cierre.md: ${registry.checks.length} checks contables`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) main();
