// Emisor plano (FALLBACK): IR (TSX evaluado) -> shell `l-<slug>` con CSS de SOLO posicionamiento.
//
// WHY: el camino primario del converter es rellenar un layout nativo del catálogo del DS
// (ver emit/atom-fill.ts). Este emisor solo entra cuando la sección NO tiene layout equivalente
// (kind unknown): compone un shell con clases BEM y CSS mobile-first de posicionamiento, aplicando
// el contrato del DS como gate (sin color/tipografía/borde/motion — eso lo pintarían componentes y
// roles). NO es un port fiel: F1 retira toda decl visual y la reporta; aquí la estructura sobrevive,
// el estilo de Relume no.

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
/** Atributos que este shell de fallback conserva. El resto (href, aria-*, data-*, role, viewBox,
 * placeholder) se descarta y se reporta. En el camino primario (atom-fill) no aplica: el layout
 * nativo del DS ya trae su markup y sus atributos; el converter solo rellena los slots con nombre. */
const SURVIVING_IMG_ATTRS = new Set(['alt', 'src']);
const NO_SURVIVING_ATTRS = new Set<string>();

/** Diagnóstico de lo que el emisor NO pudo trasladar fielmente al DS. Reemplaza el viejo
 * `unsupported` (que solo iba a consola): se escribe como `<slug>.report.json` y permite medir
 * el daño en vez de confiar en el render del demo. Un `blocked` no vacío = la conversión no es fiel. */
export interface EmitReport {
  components: string[];                                   // primitivas de librería encontradas
  blocked: Array<{ name: string; reason: string }>;      // primitiva sin mapa al componente del DS (hoy aplanada)
  droppedAttrs: Array<{ tag: string; attr: string }>;    // atributos descartados (solo `class`/`alt` sobreviven)
  droppedVisual: Array<{ cls: string; prop: string }>;   // props NO de posicionamiento retiradas del CSS (las pinta el componente/rol, no el layout)
  contractViolations: string[];                           // texto que viola conformance/layout-contract.json (color literal, font-family, motion)
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

/** Un layout del DS es PLANO: estructura y rejilla. Solo estas props de POSICIONAMIENTO sobreviven
 * en el CSS del layout; todo lo demás (color, tipografía, borde, sombra, motion) lo pinta el
 * componente o el rol (.h1-.h6), no el layout. Lo descartado se registra en report.droppedVisual. */
const POSITIONING_PROP = /^(display|box-sizing|flex|flex-[\w-]+|order|grid|grid-[\w-]+|gap|row-gap|column-gap|align-[\w-]+|justify-[\w-]+|place-[\w-]+|margin|margin-[\w-]+|padding|padding-[\w-]+|width|min-width|max-width|height|min-height|max-height|position|top|right|bottom|left|inset|inset-[\w-]+|aspect-ratio|overflow|overflow-[\w-]+|z-index)$/;

/** Reglas ejecutables del contrato (conformance/layout-contract.json → structureOnly.forbidInCss).
 * Se corren sobre el CSS final como gate duro: un match = el layout no es plano. */
const CONTRACT_FORBIDDEN: Array<[string, RegExp]> = [
  ['color-literal', /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/],
  ['font-family', /font-family\s*:/],
  ['motion', /\b(?:transition|animation)[\w-]*\s*:|@keyframes|cubic-bezier\(/],
];

function collectClasses(tree: IRNode[], set: Set<string>): string[] {
  for (const n of tree) {
    if (n.kind === 'text') continue;
    for (const c of n.classes) set.add(c);
    collectClasses(n.children, set);
  }
  return [...set];
}

/** Serializa un bloque de declaraciones de posicionamiento, mapeando los valores a tokens de
 * spacing del DS. Un layout no pinta ni bordea (eso se filtró antes), así que aquí no hay bordes. */
function declsToCss(decls: Decls, indent: string): string {
  return Object.entries(decls)
    .map(([p, v]) => `${indent}${p}: ${mapValue(p, v)};`)
    .join('\n');
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
    `<!-- Layout: ${slug} (shell plano de fallback; sin layout nativo equivalente) -->\n` +
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
  const droppedVisual: Array<{ cls: string; prop: string }> = [];
  // Parte las decls: posicionamiento se queda; lo demás (pintura, tipografía, borde, motion) se
  // retira y se reporta. Es lo que hace que los roles .h1-.h6 pasen a mandar y que el layout sea plano.
  const keepPositioning = (cls: string, decls: Decls): Decls => {
    const kept: Decls = {};
    for (const [prop, val] of Object.entries(decls)) {
      if (POSITIONING_PROP.test(prop)) kept[prop] = val;
      else droppedVisual.push({ cls, prop });
    }
    return kept;
  };
  for (const [cls, css] of cssByClass) {
    const ranges = BREAKPOINTS.map(([n]) => n as keyof typeof css.base);
    const baseDecls = keepPositioning(cls, strip(cls, css.base[ranges[0]]));
    if (Object.keys(baseDecls).length) {
      cssBlocks.push(`.${cls} {\n${declsToCss(baseDecls, '  ')}\n}`);
    }
    for (let i = 1; i < ranges.length; i++) {
      const [, px] = BREAKPOINTS[i];
      const d = keepPositioning(cls, strip(cls, diff(css.base[ranges[i - 1]], css.base[ranges[i]])));
      if (Object.keys(d).length) {
        cssBlocks.push(`@media (min-width: ${px}px) {\n  .${cls} {\n${declsToCss(d, '    ')}\n  }\n}`);
      }
    }
  }
  const css = `/* Layout: ${slug} — estructura y rejilla (solo posicionamiento).\n   Ancho y gutter: .container. Ritmo: .section. La pintura la ponen componentes y roles. */\n${cssBlocks.join('\n')}`;

  // Gate duro del contrato del DS: el CSS de un layout no puede traer color literal, font-family ni
  // motion. Si algo se coló (p.ej. un valor de posicionamiento con color), se reporta y el runner falla.
  const contractViolations: string[] = [];
  for (const [name, re] of CONTRACT_FORBIDDEN) {
    const m = css.match(re);
    if (m) contractViolations.push(`${name}: "${m[0]}"`);
  }

  const report: EmitReport = {
    components: [...components],
    blocked: [...blocked].map(([name, reason]) => ({ name, reason })),
    droppedAttrs,
    droppedVisual,
    contractViolations,
    notes: [...notes],
  };
  return { slug, html, css, slots, components: [...components], report };
}
