#!/usr/bin/env node
/**
 * Genera skills/atom-uikit/bloques.md desde los bloques ejemplares (region -> bloque -> hermano).
 * Escrita a mano envejeceria como instructions.ts: aqui no hay nada que mantener.
 *
 *   node scripts/build-skill-blocks.mjs          # escribe
 *   node scripts/build-skill-blocks.mjs --check  # sale 1 si el archivo no coincide
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'skills', 'atom-uikit', 'bloques.md');

async function evalModule(file) {
  const tmpDir = join(ROOT, 'node_modules', '.skill-tmp');
  mkdirSync(tmpDir, { recursive: true });
  const tmp = join(tmpDir, `m-${Math.random().toString(36).slice(2)}.mjs`);
  writeFileSync(tmp, readFileSync(file, 'utf8'));
  try {
    return Object.values(await import(pathToFileURL(tmp).href))[0];
  } finally {
    rmSync(tmp, { force: true });
  }
}

export async function loadExemplars(root = ROOT) {
  const dir = join(root, 'packages', 'layouts', 'src');
  const out = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.exemplar.ts')).sort()) {
    const slug = f.replace('.exemplar.ts', '');
    out.push({ slug, exemplar: await evalModule(join(dir, f)), layout: await evalModule(join(dir, `${slug}.ts`)) });
  }
  return out;
}

const cell = (s) => String(s).replace(/\|/g, '/').replace(/\n/g, ' ');

/**
 * @param {{ slug: string, exemplar: any }[]} blocks
 * @param {Record<string, string[]>} regions region -> slugs (conformance/skill-contract.json)
 */
export function renderBlocks(blocks, regions) {
  const bySlug = new Map(blocks.map((b) => [b.slug, b.exemplar]));
  const lines = [
    '<!-- GENERADO por scripts/build-skill-blocks.mjs desde los .exemplar.ts. No editar a mano. -->',
    '',
    '# Bloques ejemplares',
    '',
    'Cada region de la pagina sale de un bloque. Elige por `Cuando si` y `Cuando no`, no por el nombre:',
    'el segundo dice a que hermano irte. Instala el bloque y pega su `layouts/<slug>.exemplar.html`;',
    'toda la copy que trae es de referencia y se sustituye con la del brief.',
    '',
  ];
  for (const [region, slugs] of Object.entries(regions)) {
    lines.push(`## ${region}`, '', '| Bloque | Cuando si | Cuando no | Ritmo | Motion | h1 |', '|---|---|---|---|---|---|');
    for (const slug of slugs) {
      const ex = bySlug.get(slug);
      if (!ex) throw new Error(`la region ${region} nombra ${slug}, que no tiene .exemplar.ts`);
      const motion = ex.motion?.hook ? `\`hook:${ex.motion.hook}\`` : 'ninguno';
      lines.push(
        `| \`layout/${slug}\` | ${cell(ex.whenToUse.join(' '))} | ${cell(ex.whenNotToUse.join(' '))} | \`.${ex.rhythm}\` | ${motion} | ${ex.a11y.carriesH1 ? 'elegible' : 'no'} |`,
      );
    }
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const regions = JSON.parse(readFileSync(join(ROOT, 'conformance', 'skill-contract.json'), 'utf8')).regions;
  const text = renderBlocks(await loadExemplars(), regions);
  if (process.argv.includes('--check')) {
    const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (current !== text) {
      console.error('skills/atom-uikit/bloques.md no coincide con lo generado: corre node scripts/build-skill-blocks.mjs');
      process.exit(1);
    }
    return;
  }
  mkdirSync(join(ROOT, 'skills', 'atom-uikit'), { recursive: true });
  writeFileSync(OUT, text);
  console.log(`  [skill] bloques.md: ${Object.values(regions).flat().length} bloques`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) await main();
