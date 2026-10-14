// Runner: TSX (sección Relume propia) -> layout Atom-nativo.
//
// Camino primario (Relume-like): recupera el modelo semántico, lo liga al layout del catálogo del
// DS y rellena sus slots. Si el tipo de sección no tiene layout (unknown), cae al emisor plano
// (compón) con el gate del contrato. Uso:
//   bun --no-install run scripts/to-atom.ts <archivo.tsx> <slug-atom> [--out <dir>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { evaluateSandboxed } from '../src/eval/sandbox';
import { emitFill } from '../src/emit/atom-fill';
import { emitAtomLayout } from '../src/emit/atom-layout';

async function main(argv: string[]): Promise<void> {
  const [file, slug, ...rest] = argv;
  if (!file || !slug) throw new Error('uso: to-atom <archivo.tsx> <slug-atom> [--out <dir>]');
  const outDir = resolve(rest[rest.indexOf('--out') + 1] ?? 'out/atom');
  mkdirSync(outDir, { recursive: true });

  const [res] = await evaluateSandboxed([resolve(file)]);
  if (!res.ok) throw new Error(`eval falló: ${JSON.stringify(res)}`);

  const fill = await emitFill(slug, res.tree);
  const reasons: string[] = [];

  if (fill.report.matched) {
    writeFileSync(resolve(outDir, `${slug}.html`), fill.html + '\n');
    writeFileSync(resolve(outDir, `${slug}.css`), fill.css + '\n');
    writeFileSync(resolve(outDir, `${slug}.report.json`), JSON.stringify(fill.report, null, 2) + '\n');
    const r = fill.report;
    console.log(
      `${slug}: ${r.kind} -> ${r.layoutSlug} | slots llenos=${r.filledSlots.length} vacíos=${r.emptySlots.length}` +
        `${r.overflow.length ? ` desborde=[${r.overflow.join('; ')}]` : ''}` +
        `${r.staleBindings.length ? ` binding-obsoleto=[${r.staleBindings.join(', ')}]` : ''}`,
    );
    // Falla solo si el binding no está alineado con el layout del DS: un slot que el binding da pero
    // el layout no declara = contrato roto. Slots vacíos o desborde son reporte honesto, no fallo.
    reasons.push(...r.staleBindings.map((s) => `binding fuera del layout: ${s}`));
  } else {
    // Sin layout en el catálogo: compón con el emisor plano y aplica el gate del contrato.
    const layout = await emitAtomLayout(slug, res.tree);
    writeFileSync(resolve(outDir, `${slug}.html`), layout.html + '\n');
    writeFileSync(resolve(outDir, `${slug}.css`), layout.css + '\n');
    writeFileSync(resolve(outDir, `${slug}.report.json`), JSON.stringify({ fill: fill.report, compose: layout.report }, null, 2) + '\n');
    console.log(`${slug}: ${fill.report.kind} sin layout en catálogo -> compuesto plano (bloqueados=${layout.report.blocked.length})`);
    reasons.push(
      ...layout.report.blocked.map((b) => `primitiva sin mapa: ${b.name}`),
      ...layout.report.contractViolations.map((v) => `contrato: ${v}`),
    );
  }

  if (reasons.length) {
    console.error(`FALLO (${reasons.length}): ${reasons.join('; ')}. Ver ${slug}.report.json`);
    process.exit(1);
  }
}

await main(process.argv.slice(2));
