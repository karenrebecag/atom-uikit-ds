// IR + estilos sintetizados -> paquete @webflow/XscpData.
// La forma de cada nodo (Link boton, Image, List, HtmlEmbed, DOM) sale de payloads reales copiados del Designer;
// las listas de seguridad son configuracion porque las decide la prueba de pegado (docs/webflow-paste-behavior.md).
import { createHash } from "node:crypto";
import type { IREl, IRNode } from "../eval/ir";
import type { Decls, WebflowStyle } from "../cascade/invert";

export interface EmitConfig {
  unsafeProps: Set<string>; // reportadas como causa de crash del panel de estilos; la prueba P4 no lo reprodujo
  stateVariants: Record<string, string>; // estado CSS -> variante de Webflow considerada segura
}

export const DEFAULT_CONFIG: EmitConfig = {
  unsafeProps: new Set(["aspect-ratio"]),
  stateVariants: { ":hover": "main_hover", ":active": "main_active" },
};

export interface ClassStyle extends WebflowStyle {
  states: Record<string, Decls>;
}

export interface EmitInput {
  slug: string;
  tree: IRNode[];
  classesOf: (el: IREl) => string[]; // nombres de clase Webflow por nodo, en orden (base, combos)
  styles: Map<string, ClassStyle>;
  combos?: Set<string>; // nombres que se emiten como combo (comb "&")
}

export interface Unsupported {
  where: string;
  reason: string;
}

export interface WebflowPackage {
  clipboard: { type: "@webflow/XscpData"; payload: object; meta: object };
  headCss: string;
  unsupported: Unsupported[];
}

const NATIVE_TYPE: Record<string, string> = {
  div: "Block", section: "Block", article: "Block", header: "Block", footer: "Block", main: "Block",
  aside: "Block", nav: "Block", figure: "Block",
  // Span nativo: como Block salia <div> dentro de <p> (testimonial-1 en la prueba de pegado).
  span: "Span",
  a: "Link", button: "Link", img: "Image",
  h1: "Heading", h2: "Heading", h3: "Heading", h4: "Heading", h5: "Heading", h6: "Heading",
  p: "Paragraph", blockquote: "Blockquote", ul: "List", ol: "List", li: "ListItem",
};

const MEDIA: Record<string, string> = {
  medium: "(max-width: 991px)", small: "(max-width: 767px)", tiny: "(max-width: 479px)",
  large: "(min-width: 1280px)", xl: "(min-width: 1440px)",
};

// Ids deterministas (misma entrada, mismo payload) con forma de UUID v4; el Designer los reasigna al pegar.
function idGen(slug: string): () => string {
  let n = 0;
  return () => {
    n += 1;
    const h = createHash("sha256").update(`${slug}\u0000${n}`).digest("hex");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
  };
}

const COMMON = () => ({
  devlink: { runtimeProps: {}, slot: "" }, displayName: "",
  search: { exclude: false }, visibility: { conditions: [] },
});

// Dialecto de pistas de Webflow: los payloads que genera el Designer escriben columnas explicitas ("1fr 1fr") y
// ninguno usa repeat()/minmax(); con repeat(2, minmax(0, 1fr)) la cta convertida se renderizo angosta.
export function webflowTracks(v: string): string {
  const expanded = v.replace(/repeat\(\s*(\d+)\s*,\s*(minmax\([^)]*\)|[^,()]+)\s*\)/g, (_m, n: string, t: string) =>
    Array(Number(n)).fill(t.trim()).join(" "));
  return expanded.replace(/minmax\(\s*0(?:px)?\s*,\s*([\d.]+fr)\s*\)/g, "$1");
}

const TRACK_PROPS = new Set(["grid-template-columns", "grid-template-rows"]);

function styleLess(d: Decls): string {
  const parts = Object.entries(d).map(([p, v]) => `${p}: ${TRACK_PROPS.has(p) ? webflowTracks(v) : v};`);
  return parts.join(" ");
}

function cssBlock(selector: string, d: Decls): string {
  return `${selector} {\n${Object.entries(d).map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`;
}

function iconSvg(name: string): string {
  // Marcador del icono: el SVG real exige el paquete de iconos (no instalado)
  return `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-icon="${name}"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/></svg>`;
}

const ATTR_SKIP = new Set(["src", "alt", "href", "id", "style", "variant", "size", "iconLeft", "iconRight", "title", "value"]);

function xattrOf(attrs: Record<string, unknown>): { name: string; value: string }[] {
  return Object.entries(attrs)
    .filter(([k, v]) => (k.startsWith("data-") || k.startsWith("aria-") || k === "role") && v !== undefined && v !== null)
    .map(([name, v]) => ({ name, value: String(v) }));
}

export function emit(input: EmitInput, config: EmitConfig = DEFAULT_CONFIG): WebflowPackage {
  const nextId = idGen(input.slug);
  const unsupported: Unsupported[] = [];
  const nodes: object[] = [];
  const styleIds = new Map<string, string>();
  const used = new Set<string>();
  const ensure = (name: string) => {
    if (!styleIds.has(name)) styleIds.set(name, nextId());
    used.add(name);
    return styleIds.get(name)!;
  };

  function walk(n: IRNode): string {
    const id = nextId();
    if (n.kind === "text") {
      nodes.push({ _id: id, text: true, v: n.value });
      return id;
    }
    const classes = input.classesOf(n).map(ensure);
    if (n.tag === "svg") {
      const html = iconSvg(String(n.attrs["data-icon"] ?? n.component?.props.icon ?? "icon"));
      nodes.push({
        _id: id, type: "HtmlEmbed", tag: "div", classes, children: [], v: html,
        data: {
          attr: { id: "" }, xattr: [], search: { exclude: true }, insideRTE: false,
          embed: { type: "html", meta: { html, div: false, script: false, compilable: false, iframe: false } },
          displayName: "", visibility: { conditions: [] }, devlink: { runtimeProps: {}, slot: "" },
        },
      });
      return id;
    }
    // Pre-orden, como los payloads reales: el primer nodo es la raiz que el Designer inserta.
    const slot = nodes.push({}) - 1;
    const children = n.children.map(walk);
    const type = NATIVE_TYPE[n.tag];
    if (!type) {
      // Fuera del nucleo nativo (input, label, iframe, table...): nodo DOM como en payloads reales.
      // Un control de formulario como Block se reporta que crashea al pegar; DOM queda pendiente de F7.
      const attributes = Object.entries(n.attrs)
        .filter(([k, v]) => !ATTR_SKIP.has(k) && v !== undefined && v !== null && typeof v !== "object" && typeof v !== "function")
        .map(([name, value]) => ({ name, value: String(value) }));
      nodes[slot] = { _id: id, type: "DOM", tag: "div", classes, children, data: { tag: n.tag, attributes } };
      unsupported.push({ where: `<${n.tag}>`, reason: "emitido como nodo DOM: sin equivalente nativo en la fase 1 (P7 pendiente)" });
      return id;
    }
    const isButton = n.tag === "button" || n.component?.name === "Button";
    const tag = n.tag === "button" ? "a" : n.tag;
    const xattr = xattrOf(n.attrs);
    if (n.tag === "button" && !xattr.some((x) => x.name === "role")) xattr.push({ name: "role", value: "button" });
    const data: Record<string, unknown> = { attr: { id: "" }, xattr, ...COMMON() };
    if (type === "Link") {
      Object.assign(data, {
        button: isButton, block: "", eventIds: [],
        link: { mode: "external", url: typeof n.attrs.href === "string" ? n.attrs.href : "#" },
      });
    } else if (type === "Image") {
      data.attr = {
        src: String(n.attrs.src ?? ""), alt: String(n.attrs.alt ?? ""), loading: "lazy", width: "auto", height: "auto", id: "",
      };
      Object.assign(data, { srcsetDisabled: false, sizes: [] });
    } else if (type === "List") {
      Object.assign(data, { tag, list: { type: "list", unstyled: false } });
    } else if (type === "ListItem") {
      Object.assign(data, { list: { type: "item" }, text: false });
    } else if (type === "Block") {
      Object.assign(data, { text: false, tag });
    } else if (type === "Heading") {
      data.tag = tag;
    }
    nodes[slot] = { _id: id, type, tag, classes, children, data };
    return id;
  }

  for (const root of input.tree) walk(root);

  const head: string[] = [];
  const styles: object[] = [];
  for (const name of used) {
    const s = input.styles.get(name);
    const sel = `.${name}`;
    const split = (d: Decls) => {
      const safe: Decls = {};
      const risky: Decls = {};
      for (const [p, v] of Object.entries(d)) (config.unsafeProps.has(p) ? risky : safe)[p] = v;
      return { safe, risky };
    };
    const main = split(s?.main ?? {});
    if (Object.keys(main.risky).length) head.push(cssBlock(sel, main.risky));
    const variants: Record<string, { styleLess: string }> = {};
    for (const [bp, d] of Object.entries(s?.variants ?? {})) {
      const { safe, risky } = split(d ?? {});
      if (Object.keys(safe).length) variants[bp] = { styleLess: styleLess(safe) };
      if (Object.keys(risky).length) head.push(`@media ${MEDIA[bp]} {\n${cssBlock(sel, risky)}\n}`);
    }
    for (const [state, d] of Object.entries(s?.states ?? {})) {
      const variant = config.stateVariants[state];
      if (variant) {
        variants[variant] = { styleLess: styleLess(d) };
      } else {
        head.push(cssBlock(`${sel}${state}`, d));
        unsupported.push({ where: `${sel}${state}`, reason: "estado sin variante segura en el Designer: va al head" });
      }
    }
    for (const p of Object.keys(main.risky)) unsupported.push({ where: `${sel} ${p}`, reason: "propiedad marcada insegura para el panel: va al head" });
    styles.push({
      _id: styleIds.get(name), fake: false, type: "class", name, namespace: "",
      comb: input.combos?.has(name) ? "&" : "", styleLess: styleLess(main.safe), variants, children: [],
      origin: null, selector: null,
    });
  }

  return {
    clipboard: {
      type: "@webflow/XscpData",
      payload: { nodes, styles, assets: [], ix1: [], ix2: { interactions: [], events: [], actionLists: [] } },
      meta: { unlinkedSymbolCount: 0, droppedLinks: 0, dynBindRemovedCount: 0, dynListBindRemovedCount: 0, paginationRemovedCount: 0 },
    },
    headCss: head.join("\n\n"),
    unsupported,
  };
}
