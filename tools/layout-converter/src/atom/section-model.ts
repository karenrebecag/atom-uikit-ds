// F2 — SectionModel: recuperación SEMÁNTICA del IR (no estilo, no estructura literal).
//
// WHY: un layout nativo del DS no se transcribe, se RELLENA (modelo Relume). Para rellenarlo hay
// que recuperar del TSX qué ES la sección — titular, cuerpo, acciones, media y las unidades que se
// repiten (FAQs, métricas, logos, features) — con independencia de las clases de Relume. Ese
// significado es lo único que viaja al catálogo del DS; el estilo se queda en el origen.

import type { IREl, IRNode } from '../eval/ir';

export type SectionKind = 'hero' | 'cta' | 'features' | 'metrics' | 'logos' | 'faq' | 'unknown';
export type ActionIntent = 'contact' | 'navigate';

export interface Action {
  label: string;
  href?: string;
  variant?: string;
  intent: ActionIntent;
}
export interface Media {
  kind: 'image' | 'video';
  src?: string;
  alt?: string;
}
/** Unidad repetida. Los campos se llenan según el tipo de sección: faq usa question/answer,
 * metrics value/title, features title/body, logos src/alt. Lo no usado queda indefinido. */
export interface Item {
  title?: string;
  body?: string;
  value?: string;
  question?: string;
  answer?: string;
  src?: string;
  alt?: string;
}
export interface SectionModel {
  kind: SectionKind;
  eyebrow?: string;
  heading?: string;
  headingLevel?: number;
  body?: string;
  footerHeading?: string;
  footerBody?: string;
  actions: Action[];
  media: Media[];
  items: Item[];
  /** Nada se pierde en silencio: lo que no encaja en el modelo se nombra aquí. */
  unmapped: string[];
}

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const CONTACT_RE = /contact|contacto|demo|talk|sales|ventas|soporte|support|whats\s*app|escr[ií]benos|ag[eé]nda/i;
/** Un valor de métrica: número con sufijo (%, +, x, k, M) o moneda. Distingue una tarjeta de
 * estadística (número grande) de una tarjeta de feature (título de texto). */
const METRIC_VALUE_RE = /^\s*[$€]?\s*[\d][\d.,]*\s*(?:%|\+|x|k|m|mn|bn|hrs?|min|s)?\s*$/i;

const isEl = (n: IRNode): n is IREl => n.kind === 'el';

/** Texto plano de un nodo: concatena descendientes de texto, colapsa espacios. */
function textOf(node: IRNode): string {
  if (node.kind === 'text') return node.value;
  return node.children.map(textOf).join(' ');
}
const clean = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Todos los elementos del árbol cuyo tag cumple el predicado, en orden de documento,
 * saltando los subárboles ya consumidos por un grupo de items. */
function collect(tree: IRNode[], pred: (el: IREl) => boolean, skip: Set<IREl>, out: IREl[]): IREl[] {
  for (const n of tree) {
    if (!isEl(n) || skip.has(n)) continue;
    if (pred(n)) out.push(n);
    collect(n.children, pred, skip, out);
  }
  return out;
}

/** Marca todo el subárbol de `el` como consumido (sus textos no alimentan campos escalares). */
function markSubtree(el: IREl, set: Set<IREl>): void {
  set.add(el);
  for (const c of el.children) if (isEl(c)) markSubtree(c, set);
}

function findComponent(tree: IRNode[], name: string): IREl | undefined {
  for (const n of tree) {
    if (!isEl(n)) continue;
    if (n.component?.name === name) return n;
    const inner = findComponent(n.children, name);
    if (inner) return inner;
  }
  return undefined;
}

/** Hijos elemento directos. */
const elChildren = (el: IREl): IREl[] => el.children.filter(isEl);

/** Acciones: cada Button del IR. variant/href de props; intent por el texto o el número de WhatsApp.
 * Excluye botones que ya son otra primitiva (p.ej. el <button> de un AccordionTrigger) y los
 * subárboles consumidos por un grupo de items. */
function extractActions(tree: IRNode[], skip: Set<IREl>): Action[] {
  const isAction = (el: IREl): boolean =>
    el.component?.name === 'Button' || ((el.tag === 'button' || el.tag === 'a') && !el.component);
  const btns = collect(tree, isAction, skip, []);
  return btns.map((el) => {
    const props = el.component?.props ?? {};
    const label = clean(textOf(el)) || (typeof props.title === 'string' ? props.title : '');
    const href = typeof props.href === 'string' ? props.href : undefined;
    const variant = typeof props.variant === 'string' ? props.variant : undefined;
    const intent: ActionIntent = CONTACT_RE.test(label) || CONTACT_RE.test(href ?? '') ? 'contact' : 'navigate';
    return { label, href, variant, intent };
  });
}

interface ItemGroup {
  kind: 'faq' | 'metrics' | 'features' | 'logos';
  items: Item[];
  consumed: Set<IREl>;
}

/** Localiza el grupo de unidades repetidas y lo clasifica. Prioriza Accordion (faq);
 * si no, el mayor conjunto de hermanos estructuralmente homogéneos. */
function findItemGroup(tree: IRNode[]): ItemGroup | undefined {
  const acc = findComponent(tree, 'Accordion');
  if (acc) {
    const consumed = new Set<IREl>();
    markSubtree(acc, consumed);
    const items: Item[] = elChildren(acc)
      .filter((it) => it.component?.name === 'AccordionItem')
      .map((it) => {
        const trigger = findComponent([it], 'AccordionTrigger');
        const content = findComponent([it], 'AccordionContent');
        return { question: clean(textOf(trigger ?? it)), answer: clean(content ? textOf(content) : '') };
      });
    if (items.length) return { kind: 'faq', items, consumed };
  }

  // Candidatos: cualquier elemento con ≥2 hijos-elemento del mismo tag.
  let best: ItemGroup | undefined;
  const visit = (el: IREl): void => {
    const kids = elChildren(el);
    if (kids.length >= 2) {
      const tags = new Set(kids.map((k) => k.tag));
      if (tags.size === 1) {
        const group = classifyGroup(kids);
        if (group && (!best || group.items.length > best.items.length)) {
          const consumed = new Set<IREl>();
          kids.forEach((k) => markSubtree(k, consumed));
          best = { ...group, consumed };
        }
      }
    }
    for (const k of kids) visit(k);
  };
  tree.filter(isEl).forEach(visit);
  return best;
}

/** Clasifica un conjunto de hermanos homogéneos: imágenes → logos; (número + heading) → metrics;
 * (heading + párrafo) → features. */
function classifyGroup(kids: IREl[]): { kind: ItemGroup['kind']; items: Item[] } | undefined {
  if (kids.every((k) => k.tag === 'img')) {
    return {
      kind: 'logos',
      items: kids.map((k) => ({
        src: typeof k.attrs.src === 'string' ? k.attrs.src : undefined,
        alt: typeof k.attrs.alt === 'string' ? k.attrs.alt : undefined,
      })),
    };
  }
  const heading = (el: IREl): IREl | undefined => collect([el], (e) => HEADINGS.has(e.tag), new Set(), [])[0];
  const para = (el: IREl): IREl | undefined => collect([el], (e) => e.tag === 'p', new Set(), [])[0];

  // métrica: un <p> con valor numérico + un heading (el número va primero en Relume stats).
  const asMetrics = kids.map((k) => {
    const p = para(k);
    const h = heading(k);
    const value = p ? clean(textOf(p)) : '';
    return { ok: !!p && !!h && METRIC_VALUE_RE.test(value), value, title: h ? clean(textOf(h)) : '' };
  });
  if (asMetrics.every((m) => m.ok)) {
    return { kind: 'metrics', items: asMetrics.map((m) => ({ value: m.value, title: m.title })) };
  }

  // feature: un heading + un párrafo de cuerpo.
  const asFeatures = kids.map((k) => {
    const h = heading(k);
    const p = para(k);
    return { ok: !!h, title: h ? clean(textOf(h)) : '', body: p ? clean(textOf(p)) : '' };
  });
  if (asFeatures.every((f) => f.ok)) {
    return { kind: 'features', items: asFeatures.map((f) => ({ title: f.title, body: f.body })) };
  }
  return undefined;
}

/** Recupera el modelo semántico de un IR de sección (un único <section> de Relume). */
export function toSectionModel(tree: IRNode[]): SectionModel {
  const unmapped: string[] = [];
  const group = findItemGroup(tree);
  const consumed = group?.consumed ?? new Set<IREl>();

  const headings = collect(tree, (el) => HEADINGS.has(el.tag), consumed, []);
  const paras = collect(tree, (el) => el.tag === 'p', consumed, []);
  const imgs = collect(tree, (el) => el.tag === 'img', consumed, []);
  const actions = extractActions(tree, consumed);

  const mainH = headings[0];
  const heading = mainH ? clean(textOf(mainH)) : undefined;
  const headingLevel = mainH ? Number(mainH.tag.slice(1)) : undefined;
  const footerH = headings[1];

  // eyebrow = párrafo breve antes del titular (tagline). body = primer párrafo tras el titular.
  // Se ordena por aparición: comparamos la posición del párrafo con la del titular en el flujo.
  const flow = collect(tree, () => true, consumed, []);
  const posOf = (el: IREl | undefined): number => (el ? flow.indexOf(el) : -1);
  const hPos = posOf(mainH);
  const before = paras.filter((p) => posOf(p) < hPos);
  const between = paras.filter((p) => posOf(p) > hPos && (!footerH || posOf(p) < posOf(footerH)));
  const afterFooter = paras.filter((p) => footerH && posOf(p) > posOf(footerH));

  const eyebrow = before.length ? clean(textOf(before[0])) : undefined;
  const body = between.length ? clean(textOf(between[0])) : undefined;
  const footerBody = afterFooter.length ? clean(textOf(afterFooter[0])) : undefined;

  const media: Media[] = group?.kind === 'logos' ? [] : imgs.map((el) => ({
    kind: 'image',
    src: typeof el.attrs.src === 'string' ? el.attrs.src : undefined,
    alt: typeof el.attrs.alt === 'string' ? el.attrs.alt : undefined,
  }));

  const kind = decideKind(group, headingLevel, media.length, actions.length);

  return {
    kind,
    eyebrow,
    heading,
    headingLevel,
    body,
    footerHeading: footerH ? clean(textOf(footerH)) : undefined,
    footerBody,
    actions,
    media,
    items: group?.items ?? [],
    unmapped,
  };
}

function decideKind(group: ItemGroup | undefined, headingLevel: number | undefined, mediaCount: number, actionCount: number): SectionKind {
  if (group) return group.kind;
  if (headingLevel === 1 && (mediaCount > 0 || actionCount > 0)) return 'hero';
  if (headingLevel && headingLevel >= 2 && mediaCount > 0) return 'cta';
  return 'unknown';
}
