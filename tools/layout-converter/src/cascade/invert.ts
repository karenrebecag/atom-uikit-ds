// Cascada mobile-first (min-width) -> variantes desktop-first de Webflow.
import type { Entry, Resolved } from "../tailwind/resolve";

// Rangos de Webflow con su px inicial. main (992-1279) es la base del Designer.
export const RANGES = [
  ["tiny", 0], ["small", 480], ["medium", 768], ["main", 992], ["large", 1280], ["xl", 1440],
] as const;
export type Range = (typeof RANGES)[number][0];
export type Decls = Record<string, string>;

export interface ElementCss {
  base: Record<Range, Decls>; // valor efectivo por rango
  states: Record<string, Decls>; // estado -> declaraciones (en main)
}

// Valor inicial explicito cuando una propiedad existe en main pero no en un rango inferior:
// en desktop-first, sin el, el rango inferior heredaria el valor de main.
const INITIAL: Decls = {
  display: "block", "grid-template-columns": "none", "grid-template-rows": "none", "flex-direction": "row",
  "flex-wrap": "nowrap", "align-items": "normal", "justify-content": "normal", "column-gap": "normal",
  "row-gap": "normal", gap: "normal", "grid-column": "auto", "grid-row": "auto", position: "static",
  top: "auto", right: "auto", bottom: "auto", left: "auto", width: "auto", height: "auto",
  "max-width": "none", "min-height": "auto", order: "0", "flex-basis": "auto",
  "flex-grow": "0", "flex-shrink": "1", "flex": "0 1 auto", overflow: "visible",
};
// Heredadas: sin la utilidad, el rango inferior toma el valor del padre, no el inicial de CSS.
for (const p of ["font-size", "line-height", "font-weight", "color", "text-align", "letter-spacing"]) INITIAL[p] = "inherit";
for (const side of ["top", "right", "bottom", "left"]) {
  INITIAL[`margin-${side}`] = "0px";
  INITIAL[`padding-${side}`] = "0px";
}

const VAR = /var\((--[\w-]+)(?:,\s*([^()]*(?:\([^()]*\))*[^()]*))?\)/;

function substitute(value: string, vars: Map<string, string>, depth = 0): string {
  let v = value;
  for (let i = 0; i < 20 && VAR.test(v); i++) {
    v = v.replace(VAR, (_m, name: string, fallback?: string) => {
      const got = vars.get(name);
      const raw = got !== undefined && got.trim() !== "" ? got : (fallback ?? "");
      return depth < 5 ? substitute(raw, vars, depth + 1) : raw;
    });
  }
  return v.replace(/\s{2,}/g, " ").trim();
}

function collect(entries: Entry[], maxMin: number, state: string, vars: Map<string, string>): Decls {
  const out: Decls = {};
  for (const e of entries) {
    if (e.min > maxMin || e.state !== state) continue;
    for (const [p, v] of e.decls) {
      if (p.startsWith("--")) vars.set(p, v);
      else out[p] = v;
    }
  }
  for (const p of Object.keys(out)) out[p] = substitute(out[p], vars);
  return out;
}

/** CSS efectivo de un elemento por rango, a partir de sus clases. Las clases sin CSS se ignoran. */
export function elementCss(classes: string[], r: Resolved): ElementCss {
  const entries = classes.flatMap((c) => r.byClass.get(c) ?? []).sort((a, b) => a.order - b.order);
  const base = {} as Record<Range, Decls>;
  for (const [name, px] of RANGES) base[name] = collect(entries, px, "", new Map(r.defaults));
  const states: Record<string, Decls> = {};
  for (const st of new Set(entries.map((e) => e.state).filter(Boolean))) {
    const vars = new Map(r.defaults);
    collect(entries, 992, "", vars); // las custom props del estado base alimentan las del estado
    states[st] = collect(entries, 992, st, vars);
  }
  return { base, states };
}

function diff(lower: Decls, upper: Decls, unsupported: string[]): Decls {
  const out: Decls = {};
  for (const [p, v] of Object.entries(lower)) if (upper[p] !== v) out[p] = v;
  for (const p of Object.keys(upper)) {
    if (p in lower) continue;
    if (p in INITIAL) out[p] = INITIAL[p];
    else unsupported.push(`sin valor inicial para "${p}" al bajar de rango`);
  }
  return out;
}

export interface WebflowStyle {
  main: Decls;
  variants: Partial<Record<Exclude<Range, "main">, Decls>>;
}

/**
 * Desktop-first: main es la base; cada rango solo lleva lo que cambia frente al rango adyacente.
 * wide=false pliega large/xl en main: pegar una variante large agrega el breakpoint de 1280 a TODO el
 * sitio (aviso del Designer en la prueba de pegado), asi que solo se emiten si se piden.
 */
export function invert(css: ElementCss, unsupported: string[] = [], wide = false): WebflowStyle {
  const b = wide ? css.base : { ...css.base, main: { ...css.base.main, ...css.base.large, ...css.base.xl } };
  const variants: WebflowStyle["variants"] = {
    medium: diff(b.medium, b.main, unsupported),
    small: diff(b.small, b.medium, unsupported),
    tiny: diff(b.tiny, b.small, unsupported),
    // los rangos superiores son min-width en Webflow: cascada hacia arriba desde main
    ...(wide ? { large: diff(b.large, b.main, unsupported), xl: diff(b.xl, b.large, unsupported) } : {}),
  };
  for (const k of Object.keys(variants) as (keyof typeof variants)[]) {
    if (!Object.keys(variants[k] ?? {}).length) delete variants[k];
  }
  return { main: b.main, variants };
}
