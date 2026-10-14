// Clases Tailwind -> reglas CSS reales con el preset configurado (tailwindcss 3.4.19).
import postcss, { type AtRule, type Rule } from "postcss";
import preset from "@relume_io/relume-tailwind";
import tailwind from "tailwindcss";

export interface Entry {
  min: number; // min-width del media (0 = sin media)
  state: string; // sufijo del selector: "", ":hover", '[data-state="active"]'...
  decls: [string, string][];
  order: number; // posicion en el CSS generado: decide la cascada entre utilidades
}

export interface Resolved {
  byClass: Map<string, Entry[]>;
  defaults: Map<string, string>; // custom props --tw-* del selector universal
  unknownMedia: string[];
}

// Una clase escapada termina en el primer caracter especial sin escapar.
function splitSelector(sel: string): { cls: string; state: string } | null {
  if (!sel.startsWith(".")) return null;
  let i = 1;
  let cls = "";
  while (i < sel.length) {
    const c = sel[i];
    if (c === "\\") {
      cls += sel[i + 1];
      i += 2;
      continue;
    }
    if (/[:\[\s>+~,.]/.test(c)) break;
    cls += c;
    i++;
  }
  return { cls, state: sel.slice(i) };
}

// Config por defecto: el preset de Relume, porque es el dialecto de los componentes con los que se valido.
export const DEFAULT_TAILWIND_CONFIG: Record<string, unknown> = { presets: [preset] };

/**
 * config: el tailwind.config del proyecto a convertir. Su `content` y el preflight se sustituyen: solo deben
 * generarse las clases del componente. Los breakpoints propios se aproximan a los rangos fijos de Webflow.
 */
export async function resolveClasses(
  classes: Iterable<string>,
  config: Record<string, unknown> = DEFAULT_TAILWIND_CONFIG,
): Promise<Resolved> {
  const raw = [...new Set(classes)].join(" ");
  const out = await postcss([
    tailwind({ ...config, content: [{ raw, extension: "html" }], corePlugins: { preflight: false } }),
  ]).process("@tailwind base;@tailwind components;@tailwind utilities;", { from: undefined });

  const byClass = new Map<string, Entry[]>();
  const defaults = new Map<string, string>();
  const unknownMedia = new Set<string>();
  let order = 0;

  out.root.walkRules((rule: Rule) => {
    const parent = rule.parent as AtRule | undefined;
    if (parent?.type === "atrule" && parent.name === "keyframes") return;
    let min = 0;
    if (parent?.type === "atrule" && parent.name === "media") {
      const m = parent.params.match(/^\(min-width:\s*(\d+)px\)$/);
      if (!m) {
        unknownMedia.add(parent.params);
        return;
      }
      min = Number(m[1]);
    }
    const decls: [string, string][] = [];
    rule.walkDecls((d) => {
      decls.push([d.prop, d.value]);
    });
    if (rule.selector.startsWith("*")) {
      for (const [p, v] of decls) defaults.set(p, v);
      return;
    }
    for (const sel of rule.selectors) {
      const parts = splitSelector(sel.trim());
      if (!parts) continue;
      const list = byClass.get(parts.cls) ?? [];
      list.push({ min, state: parts.state, decls, order: order++ });
      byClass.set(parts.cls, list);
    }
  });
  return { byClass, defaults, unknownMedia: [...unknownMedia] };
}
