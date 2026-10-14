// Emisor Atom: IR (TSX evaluado) -> layout Atom-nativo del DS (HTML BEM + CSS con tokens).
//
// WHY: el mismo IR que alimenta el emisor de Webflow se reexpresa aquí como un layout `l-<slug>`:
// clases BEM, CSS mobile-first con tokens del DS (via atom/tokens), y la sección envuelta en
// .section + .container (el ancho único del DS). Emitir DESDE el IR garantiza fidelidad: cada
// elemento del bloque Relume original sobrevive — calca, no recrea.

import { elementCss, RANGES, type Decls } from '../cascade/invert';
import { resolveClasses, DEFAULT_TAILWIND_CONFIG, type Resolved } from '../tailwind/resolve';
import { mapValue } from '../atom/tokens';
import type { IREl, IRNode } from '../eval/ir';

const ROLE: Record<string, string> = {
  h1: 'heading', h2: 'heading', h3: 'heading', h4: 'heading', h5: 'heading', h6: 'heading',
  p: 'text', a: 'link', button: 'button', img: 'image', ul: 'list', ol: 'list', li: 'item',
  svg: 'icon', nav: 'nav', span: 'label', section: 'section',
};
/** clase de tipografía del DS por tag de encabezado (jerarquía por rol, no por tamaño). */
const HEADING_CLASS: Record<string, string> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6' };
const BREAKPOINTS: Array<readonly [string, number]> = RANGES.map(([n, px]) => [n, px] as const);
/** Atributos que el emisor conserva hoy. El resto (href, aria-*, data-*, role, viewBox, placeholder)
 * se descarta y se reporta — su preservación real llega en F2 con el nuevo render. */
const SURVIVING_IMG_ATTRS = new Set(['alt', 'src']);
const NO_SURVIVING_ATTRS = new Set<string>();

/** Diagnóstico de lo que el emisor NO pudo trasladar fielmente al DS. Reemplaza el viejo
 * `unsupported` (que solo iba a consola): se escribe como `<slug>.report.json` y permite medir
 * el daño en vez de confiar en el render del demo. Un `blocked` no vacío = la conversión no es fiel. */
export interface EmitReport {
  components: string[];                                   // primitivas de librería encontradas
  blocked: Array<{ name: string; reason: string }>;      // primitiva sin mapa al componente del DS (hoy aplanada)
  droppedAttrs: Array<{ tag: string; attr: string }>;    // atributos descartados (solo `class`/`alt` sobreviven)
  visualDecls: Array<{ cls: string; prop: string }>;     // props visuales emitidas (el contrato del DS las prohíbe en una layout)
  notes: string[];                                        // avisos de marca (p.ej. CTA → whatsapp-button)
}

export interface AtomLayout {
  slug: string;
  html: string;
  css: string;
  slots: string[];
  components: string[];
  report: EmitReport;
}

/** Una declaración es "visual" si pinta (color/tipografía/borde/motion/sombra), por oposición a
 * posicionar. El contrato del DS (layout-contract.json → structureOnly) prohíbe estas en una layout:
 * aquí solo se CUENTAN (F0); el filtrado real llega en F1. */
const VISUAL_PROP = /^(color|background|font-(family|size|weight|style)|border|box-shadow|text-(transform|decoration|shadow)|letter-spacing|line-height|text-align|object-fit|fill|stroke|opacity|transition|animation|filter)/;

function collectClasses(tree: IRNode[], set: Set<string>): string[] {
  for (const n of tree) {
    if (n.kind === 'text') continue;
    for (const c of n.classes) set.add(c);
    collectClasses(n.children, set);
  }
  return [...set];
}

/** Serializa un bloque de declaraciones ya mapeadas a tokens.
 * Relume hereda `border-style: solid` del preflight de Tailwind; el converter no lo incluye, así
 * que un `border-*-width` sin estilo no se vería. Se añade el estilo cuando hay ancho y no estilo. */
function declsToCss(decls: Decls, indent: string): string {
  const keys = Object.keys(decls);
  const lines = Object.entries(decls).map(([p, v]) => `${indent}${p}: ${mapValue(p, v)};`);
  // El estilo se añade SOLO en el lado que trae ancho: sin el preflight de Tailwind
  // (`*{border-width:0}`), un `border-style: solid` global encendería los otros tres lados con
  // su ancho `medium` por defecto. Side-specific evita el recuadro completo.
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    if (keys.includes(`border-${side}-width`) && !keys.includes(`border-${side}-style`)) {
      lines.push(`${indent}border-${side}-style: solid;`);
    }
  }
  if ((keys.includes('border-width') || keys.includes('border-color')) &&
      !keys.some((p) => /^border(-(top|right|bottom|left))?-width$/.test(p)) &&
      !keys.includes('border-style')) {
    lines.push(`${indent}border-style: solid;`);
  }
  return lines.join('\n');
}

/** Diff de dos sets de decls: lo que cambia en `b` respecto de `a`. */
function diff(a: Decls, b: Decls): Decls {
  const out: Decls = {};
  for (const [k, v] of Object.entries(b)) if (a[k] !== v) out[k] = v;
  return out;
}

export async function emitAtomLayout(
  slug: string,
  tree: IRNode[],
  resolvedIn?: Resolved,
): Promise<AtomLayout> {
  const resolved = resolvedIn ?? (await resolveClasses(collectClasses(tree, new Set()), DEFAULT_TAILWIND_CONFIG));
  const block = `l-${slug}`;
  const byKey = new Map<string, string>();
  const taken = new Set<string>();
  const of = new Map<IREl, string>();
  const cssByClass = new Map<string, ReturnType<typeof elementCss>>();
  const slots: string[] = [];
  const components = new Set<string>();
  const blocked = new Map<string, string>();
  const droppedAttrs: Array<{ tag: string; attr: string }> = [];
  const notes = new Set<string>();
  const slotCount: Record<string, number> = {};
  // Props que posee la clase .container del DS (ancho único + gutter + centrado): no se re-emiten
  // en una clase que ya lleva .container, ni el gutter horizontal en la sección raíz.
  const CONTAINER_OWNED = new Set(['width', 'max-width', 'margin-left', 'margin-right', 'margin-inline', 'padding-left', 'padding-right', 'padding-inline']);
  const isContainer = (el: IREl): boolean => el.classes.includes('container');
  const containerClasses = new Set<string>();
  let rootClass: string | undefined;

  const nameFor = (role: string): string => {
    let n = role === 'component' ? block : `${block}__${role}`;
    for (let i = 2; taken.has(n); i++) n = `${block}__${role}-${i}`;
    taken.add(n);
    return n;
  };

  // 1) asignar clase BEM por combinación única de utilidades + guardar su CSS por breakpoint
  const assign = (node: IRNode, depth: number): void => {
    if (node.kind === 'text') return;
    const utils = node.classes.filter((c) => resolved.byClass.has(c));
    if (utils.length) {
      const key = `${node.tag}|${[...utils].sort().join(' ')}`;
      let cls = byKey.get(key);
      if (!cls) {
        const role = depth === 0 ? 'component' : (ROLE[node.tag] ?? (node.component ? node.component.name.toLowerCase() : 'wrapper'));
        cls = nameFor(role);
        byKey.set(key, cls);
        cssByClass.set(cls, elementCss(utils, resolved));
      }
      of.set(node, cls);
      if (depth === 0) rootClass = cls;
      if (isContainer(node)) containerClasses.add(cls);
    }
    for (const c of node.children) assign(c, depth + 1);
  };
  tree.forEach((n) => assign(n, 0));

  // 2) slot por nodo de texto, nombrado por el rol de su contenedor
  const slotName = (role: string): string => {
    slotCount[role] = (slotCount[role] ?? 0) + 1;
    const n = `${role}_${slotCount[role]}`;
    slots.push(n);
    return `{{${n}}}`;
  };

  // 3) emitir HTML
  const classAttr = (el: IREl): string => {
    const parts: string[] = [];
    if (HEADING_CLASS[el.tag]) parts.push(HEADING_CLASS[el.tag]); // .h1-.h6 del DS
    if (isContainer(el)) parts.push('container'); // ancho único del DS
    const bem = of.get(el);
    if (bem) parts.push(bem);
    return parts.length ? ` class="${parts.join(' ')}"` : '';
  };

  // Un Button de @kit/ui -> markup del botón del DS. El CTA de contacto es decisión de marca
  // (whatsapp-button) y se marca como manual; aquí se emite el botón secundario del DS.
  const renderButton = (node: IREl, ind: string): string => {
    const label = slotName('button');
    slots.push(`${label.slice(2, -2)}_href`); // el href es un slot del manifiesto, no solo del HTML
    return (
      `${ind}<a href="{{${label.slice(2, -2)}_href}}" class="button button--secondary button--m">\n` +
      `${ind}  <span class="button__label">${label}</span>\n` +
      `${ind}</a>`
    );
  };

  const renderChildren = (children: IRNode[], parentRole: string, ind: string): string =>
    children.map((c) => render(c, parentRole, ind)).filter(Boolean).join('\n');

  function render(node: IRNode, parentRole: string, ind: string): string {
    if (node.kind === 'text') {
      const t = node.value.trim();
      return t ? `${ind}${slotName(parentRole)}` : '';
    }
    // atributos que NO sobreviven (solo `class`, y `alt`/`src` en img): se registran, no se tiran en silencio.
    const survives = node.tag === 'img' ? SURVIVING_IMG_ATTRS : NO_SURVIVING_ATTRS;
    for (const attr of Object.keys(node.attrs)) {
      if (!survives.has(attr)) droppedAttrs.push({ tag: node.tag, attr });
    }
    // componente de librería -> marcar para la pasada de marca (Button, Tabs, ...)
    if (node.component) components.add(node.component.name);
    if (node.component?.name === 'Button') {
      notes.add('Button -> botón secundario del DS; si es CTA de contacto, cámbialo a whatsapp-button (decisión de marca).');
      return renderButton(node, ind);
    }
    // cualquier otra primitiva identificada en el IR no tiene mapa al componente del DS: se aplana
    // (hoy), pero se BLOQUEA en el reporte — el runner falla si hay bloqueos. No es una conversión fiel.
    if (node.component) {
      blocked.set(node.component.name, 'sin mapa al componente del DS; se aplanó a tag crudo (sin clase BEM del DS, sin comportamiento ni a11y)');
    }
    const role = ROLE[node.tag] ?? 'wrapper';
    const tag = node.tag;
    // imagen: slot de imagen del DS
    if (tag === 'img') {
      const alt = typeof node.attrs.alt === 'string' ? node.attrs.alt : '';
      slots.push('image_' + ((slotCount.image = (slotCount.image ?? 0) + 1)));
      return `${ind}<img${classAttr(node)} src="{{image_${slotCount.image}}}" alt="${alt}" />`;
    }
    const kids = renderChildren(node.children, role, ind + '  ');
    const open = `${ind}<${tag}${classAttr(node)}>`;
    const close = `</${tag}>`;
    return kids ? `${open}\n${kids}\n${ind}${close}` : `${open}${close}`;
  }

  // la raíz: .section (ritmo) + .container (ancho). Si el bloque ya traía un `container` de Relume,
  // ese es el .container del DS (no se anida otro); si no, se añade uno.
  const rootEl = tree.find((n): n is IREl => n.kind === 'el');
  const rootBem = rootEl ? of.get(rootEl) : undefined;
  const hasContainer = containerClasses.size > 0;
  const inner = rootEl ? renderChildren(rootEl.children, 'section', hasContainer ? '  ' : '    ') : '';
  const sectionOpen = `<section class="section ${rootBem ?? block}">`;
  const html =
    `<!-- Layout: ${slug} (port fiel desde Relume) -->\n` +
    (hasContainer
      ? `${sectionOpen}\n${inner}\n</section>`
      : `${sectionOpen}\n  <div class="container ${block}__container">\n${inner}\n  </div>\n</section>`);

  // 4) emitir CSS mobile-first por clase (tiny = base, luego min-width por breakpoint).
  // Se retiran las props que posee .container en una clase-contenedor, y el gutter horizontal en la raíz.
  // El ritmo vertical lo da .section; el ancho y el gutter, .container. La raíz no declara
  // padding propio (ni block ni inline), o se duplica el espaciado de sección.
  const ROOT_OWNED = new Set([
    'padding', 'padding-left', 'padding-right', 'padding-inline',
    'padding-top', 'padding-bottom', 'padding-block',
  ]);
  const strip = (cls: string, decls: Decls): Decls => {
    const drop = new Set<string>();
    if (containerClasses.has(cls)) for (const p of CONTAINER_OWNED) drop.add(p);
    if (cls === rootClass) for (const p of ROOT_OWNED) drop.add(p);
    if (!drop.size) return decls;
    return Object.fromEntries(Object.entries(decls).filter(([p]) => !drop.has(p)));
  };
  const cssBlocks: string[] = [];
  const visualDecls: Array<{ cls: string; prop: string }> = [];
  const recordVisual = (cls: string, decls: Decls): void => {
    for (const prop of Object.keys(decls)) if (VISUAL_PROP.test(prop)) visualDecls.push({ cls, prop });
  };
  for (const [cls, css] of cssByClass) {
    const ranges = BREAKPOINTS.map(([n]) => n as keyof typeof css.base);
    const baseDecls = strip(cls, css.base[ranges[0]]);
    if (Object.keys(baseDecls).length) {
      recordVisual(cls, baseDecls);
      cssBlocks.push(`.${cls} {\n${declsToCss(baseDecls, '  ')}\n}`);
    }
    for (let i = 1; i < ranges.length; i++) {
      const [, px] = BREAKPOINTS[i];
      const d = strip(cls, diff(css.base[ranges[i - 1]], css.base[ranges[i]]));
      if (Object.keys(d).length) {
        recordVisual(cls, d);
        cssBlocks.push(`@media (min-width: ${px}px) {\n  .${cls} {\n${declsToCss(d, '    ')}\n  }\n}`);
      }
    }
  }
  const css = `/* Layout: ${slug} — port fiel desde Relume, CSS con tokens del DS.\n   Ancho y gutter: .container. Ritmo: .section. */\n${cssBlocks.join('\n')}`;

  const report: EmitReport = {
    components: [...components],
    blocked: [...blocked].map(([name, reason]) => ({ name, reason })),
    droppedAttrs,
    visualDecls,
    notes: [...notes],
  };
  return { slug, html, css, slots, components: [...components], report };
}
