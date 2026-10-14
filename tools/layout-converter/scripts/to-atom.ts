// Runner: TSX (sección Relume propia) -> layout Atom-nativo.
// Uso: bun --no-install run scripts/to-atom.ts <archivo.tsx> <slug-atom> [--out <dir>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { evaluateSandboxed } from '../src/eval/sandbox';
import { emitAtomLayout } from '../src/emit/atom-layout';

async function main(argv: string[]): Promise<void> {
  const [file, slug, ...rest] = argv;
  if (!file || !slug) throw new Error('uso: to-atom <archivo.tsx> <slug-atom> [--out <dir>]');
  const outDir = resolve(rest[rest.indexOf('--out') + 1] ?? 'out/atom');
  mkdirSync(outDir, { recursive: true });

  const [res] = await evaluateSandboxed([resolve(file)]);
  if (!res.ok) throw new Error(`eval falló: ${JSON.stringify(res)}`);

  const layout = await emitAtomLayout(slug, res.tree);
  writeFileSync(resolve(outDir, `${slug}.html`), layout.html + '\n');
  writeFileSync(resolve(outDir, `${slug}.css`), layout.css + '\n');
  writeFileSync(resolve(outDir, `${slug}.report.json`), JSON.stringify(layout.report, null, 2) + '\n');

  const r = layout.report;
  console.log(
    `${slug}: ${layout.html.split('\n').length} líneas html, ${layout.css.split('}').length - 1} reglas css, ` +
      `${layout.slots.length} slots | visuales-retiradas=${r.droppedVisual.length} attrs-descartados=${r.droppedAttrs.length} ` +
      `bloqueados=${r.blocked.length}${r.blocked.length ? ` [${r.blocked.map((b) => b.name).join(', ')}]` : ''}` +
      `${r.contractViolations.length ? ` viola-contrato=${r.contractViolations.length}` : ''}`,
  );
  // Falla (lo coge CI/el gate) si hay primitiva sin mapa fiel al DS o si el CSS viola el contrato
  // de layout: en ambos casos la salida no es un layout nativo válido.
  const reasons = [
    ...r.blocked.map((b) => `primitiva sin mapa: ${b.name}`),
    ...r.contractViolations.map((v) => `contrato: ${v}`),
  ];
  if (reasons.length) {
    console.error(`FALLO (${reasons.length}): ${reasons.join('; ')}. Ver ${slug}.report.json`);
    process.exit(1);
  }
}

await main(process.argv.slice(2));
