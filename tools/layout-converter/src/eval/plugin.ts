import type { BunPlugin } from "bun";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isAllowed } from "./stubs/index";

const HERE = import.meta.dir;
const JSX_RUNTIME = resolve(HERE, "jsx-runtime.ts");
const STUBS = resolve(HERE, "stubs/index.ts");

export class ForbiddenImport extends Error {}

const verifier = new Bun.Transpiler({ loader: "tsx" });

// Construcciones que permiten cargar o ejecutar codigo fuera de la lista blanca. El corpus no usa
// ninguna (verificado), asi que se rechazan sin excepcion: falla cerrado ante un falso positivo.
const BANNED = /\bimport\s*\(|\brequire\s*\(|\beval\s*\(|\bnew\s+Function\b|\bconstructor\b|__proto__|\bglobalThis\b|\bBun\s*\.|\bprocess\s*\.|\bfetch\s*\(|\bexport\s*(\*|\{[^}]*\})\s*from\b/;

// Declaraciones import estaticas (el corpus no usa import() dinamico ni require).
const IMPORT_DECL = /^[ \t]*import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["'];?[ \t]*$/gm;
const SIDE_EFFECT = /^[ \t]*import\s+["']([^"']+)["'];?[ \t]*$/gm;

// Gramatica estricta de la clausula: el texto de la clausula se inyecta como codigo, asi que solo
// se aceptan identificadores (default, { a, b as c, type d }, * as ns).
const CLAUSE = /^(?:\*\s+as\s+\w+|\w+|\w+\s*,\s*\{[\w\s,]*\}|\{[\w\s,]*\})$/;

/** Traduce la clausula de import a declaraciones const sobre el objeto del modulo stub. */
function bindings(clause: string, modVar: string): string {
  const out: string[] = [];
  let rest = clause.trim();
  const ns = rest.match(/^\*\s+as\s+(\w+)$/);
  if (ns) return `const ${ns[1]} = ${modVar};`;
  const named = rest.match(/\{([\s\S]*)\}/);
  if (named) rest = rest.replace(named[0], "").replace(/,\s*$/, "").trim();
  const def = rest.replace(/,$/, "").trim();
  if (def) out.push(`const ${def} = ${modVar}.default ?? ${modVar};`);
  if (named) {
    const parts = named[1]
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("type "))
      .map((s) => s.replace(/\s+as\s+/, ": "));
    if (parts.length) out.push(`const { ${parts.join(", ")} } = ${modVar};`);
  }
  return out.join(" ");
}

/**
 * Reescribe los imports del TSX a lecturas del registro de stubs. Si alguno no esta en la lista
 * blanca falla ANTES de ejecutar el modulo: el codigo descargado nunca corre con un import desconocido.
 */
export function rewriteSource(source: string, file: string): string {
  const forbidden: string[] = [];
  let n = 0;
  // key solo sirve a React y el IR lo descarta; quitarlo evita que Bun aborte cuando va tras un spread.
  let out = source.replace(/\s+key=\{[^{}]*\}/g, "").replace(IMPORT_DECL, (_m, typeOnly: string | undefined, clause: string, spec: string) => {
    if (typeOnly) return "";
    if (!CLAUSE.test(clause.trim())) {
      forbidden.push(`clausula invalida: ${clause.trim().slice(0, 40)}`);
      return "";
    }
    if (!isAllowed(spec)) {
      forbidden.push(spec);
      return "";
    }
    const v = `__wfc_m${n++}`;
    return `const ${v} = __wfc_mod(${JSON.stringify(spec)}); ${bindings(clause, v)}`;
  });
  out = out.replace(SIDE_EFFECT, (_m, spec: string) => {
    if (!isAllowed(spec)) forbidden.push(spec);
    return "";
  });
  if (forbidden.length) {
    throw new ForbiddenImport(`imports fuera de la lista blanca en ${file}: ${[...new Set(forbidden)].join(", ")}`);
  }
  const banned = source.match(BANNED);
  if (banned) throw new ForbiddenImport(`construccion prohibida "${banned[0]}" en ${file}`);
  // Verificacion posterior: tras reescribir no puede quedar ningun import real. Cubre lo que los
  // regex no casan (comentario al final de linea, varias sentencias por linea, clausulas raras).
  // El escaner anade siempre react/jsx-dev-runtime y react como require-call implicitos del JSX.
  const left = verifier
    .scanImports(out)
    .filter((i) => !(i.kind === "require-call" && (i.path === "react" || i.path === "react/jsx-dev-runtime")));
  if (left.length) {
    throw new ForbiddenImport(`imports sin reescribir en ${file}: ${left.map((i) => i.path).join(", ")}`);
  }
  // El runtime JSX automatico de Bun buscaria react real (e incluso lo autoinstalaria):
  // se fuerza el pragma clasico hacia nuestro runtime.
  const header =
    "/** @jsxRuntime classic */\n/** @jsx __wfc_jsx */\n/** @jsxFrag __wfc_Fragment */\n" +
    `import { createElement as __wfc_jsx, Fragment as __wfc_Fragment } from ${JSON.stringify(JSX_RUNTIME)};\n` +
    `import { mod as __wfc_mod } from ${JSON.stringify(STUBS)};\n`;
  return header + out;
}

export const evalPlugin: BunPlugin = {
  name: "wfc-eval",
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, (args) => {
      if (args.path.startsWith(HERE)) return undefined;
      return { contents: rewriteSource(readFileSync(args.path, "utf8"), args.path), loader: "tsx" };
    });
  },
};
