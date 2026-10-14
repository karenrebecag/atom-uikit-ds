// Uso: bun --no-install run src/cli.ts convert <archivo.tsx> [--mode b] [--prefix <p>] [--wide] [--tailwind-config <ruta>] [--out <dir>]
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { assignBem } from "./classes/bem";
import { emit, type WebflowPackage } from "./emit/xscp";
import type { IRNode } from "./eval/ir";
import { evaluateSandboxed } from "./eval/sandbox";
import { DEFAULT_TAILWIND_CONFIG, resolveClasses } from "./tailwind/resolve";

function collect(nodes: IRNode[], into: Set<string>): Set<string> {
  for (const n of nodes) {
    if (n.kind === "text") continue;
    for (const c of n.classes) into.add(c);
    collect(n.children, into);
  }
  return into;
}

export interface ConvertOptions {
  prefix?: string;
  wide?: boolean;
  tailwindConfig?: Record<string, unknown>;
}

export async function convertTree(
  slug: string,
  component: string,
  tree: IRNode[],
  { prefix = "", wide = false, tailwindConfig = DEFAULT_TAILWIND_CONFIG }: ConvertOptions = {},
): Promise<WebflowPackage & { cascadeUnsupported: string[] }> {
  const r = await resolveClasses(collect(tree, new Set()), tailwindConfig);
  const a = assignBem(tree, component, r, prefix, wide);
  const pkg = emit({ slug, tree, classesOf: a.classesOf, styles: a.styles });
  return { ...pkg, cascadeUnsupported: [...new Set(a.unsupported)] };
}

async function main(argv: string[]): Promise<void> {
  const [cmd, file, ...rest] = argv;
  const opt = (k: string, d: string) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);
  if (cmd !== "convert" || !file) throw new Error("uso: convert <archivo.tsx> [--mode b] [--prefix <p>] [--wide] [--tailwind-config <ruta>] [--out <dir>]");
  const mode = opt("--mode", "b");
  if (mode !== "b") throw new Error(`modo ${mode} aun no implementado (F5)`);
  const [res] = await evaluateSandboxed([resolve(file)]);
  if (!res.ok) throw new Error(res.error);
  const slug = basename(file, ".tsx");
  const prefix = opt("--prefix", "");
  if (!/^[a-z0-9-]*$/.test(prefix)) throw new Error("--prefix solo admite a-z, 0-9 y guion");
  const configPath = opt("--tailwind-config", "");
  // El config es codigo del propio usuario y corre fuera del sandbox, igual que en su build de Tailwind.
  const tailwindConfig = configPath
    ? ((await import(resolve(configPath))) as { default: Record<string, unknown> }).default
    : DEFAULT_TAILWIND_CONFIG;
  const pkg = await convertTree(slug, res.component, res.tree, { prefix, wide: rest.includes("--wide"), tailwindConfig });
  const out = resolve(opt("--out", "out/convert"));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${slug}.json`), JSON.stringify(pkg.clipboard));
  writeFileSync(join(out, `${slug}.head.css`), pkg.headCss);
  writeFileSync(join(out, `${slug}.report.json`), JSON.stringify({ unsupported: pkg.unsupported, cascade: pkg.cascadeUnsupported, generic: res.generic }, null, 2));
  const p = pkg.clipboard.payload as { nodes: unknown[]; styles: unknown[] };
  process.stdout.write(`${slug}: ${p.nodes.length} nodos, ${p.styles.length} clases, ${pkg.unsupported.length} avisos -> ${out}\n`);
}

if (import.meta.main) await main(process.argv.slice(2));
