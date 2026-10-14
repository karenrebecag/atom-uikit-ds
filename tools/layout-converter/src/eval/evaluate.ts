import { plugin } from "bun";
import type { IRNode } from "./ir";
import { evalPlugin } from "./plugin";
import { takeReport } from "./report";

let registered = false;

export interface EvalResult {
  component: string;
  tree: IRNode[];
  generic: string[];
}

/** Evalua un TSX: llama a su componente exportado con props vacias (gana Defaults). */
export async function evaluate(file: string): Promise<EvalResult> {
  if (!registered) {
    plugin(evalPlugin);
    registered = true;
  }
  takeReport();
  const mod = (await import(file)) as Record<string, unknown>;
  const name = Object.keys(mod).find(
    (k) => typeof mod[k] === "function" && /^[A-Z]/.test(k) && !k.endsWith("Defaults"),
  );
  if (!name) throw new Error(`sin componente exportado en ${file}`);
  const out = (mod[name] as (p: object) => IRNode | IRNode[])({});
  return { component: name, tree: Array.isArray(out) ? out : [out], generic: takeReport() };
}
