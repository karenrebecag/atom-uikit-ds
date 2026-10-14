// F3 — Catálogo: liga un SectionModel a un layout NATIVO del DS y lo rellena (modelo Relume).
//
// WHY: los 6 roles de demo ya existen en packages/layouts/src. El converter no inventa un layout:
// elige el del catálogo que corresponde al tipo de sección y rellena sus slots con nombre. El
// HTML/CSS del layout ya es nativo y pasa el contrato del DS — aquí solo entra el contenido.

import { resolve } from 'node:path';
import { DS_PATHS } from './ds-paths';
import type { Action, Item, SectionModel } from './section-model';

/** Un layout del catálogo, tal cual lo exporta packages/layouts/src/<slug>.ts. */
export interface DsLayout {
  slug: string;
  name: string;
  components: string[];
  html: string;
  css: string;
}

/** Tipo de sección → slug del layout del DS que lo realiza. Un tipo sin layout = compón (fallback). */
export const KIND_TO_LAYOUT: Record<SectionModel['kind'], string | null> = {
  hero: 'hero-split',
  cta: 'cta-split-image',
  features: 'feature-grid',
  metrics: 'metrics-grid',
  logos: 'logo-marquee',
  faq: 'faq-accordion',
  unknown: null,
};

export interface Binding {
  values: Record<string, string>;
  unmapped: string[];
}

const act = (a: Action | undefined): { label: string; href: string } => ({
  label: a?.label ?? '',
  href: a?.href ?? '#',
});
const media0 = (m: SectionModel['media'][number] | undefined): string => (m?.alt ?? m?.src ?? '');

/** Reparte el contenido excedente (más items/acciones que slots) a `unmapped`, por nombre. */
function overflow(label: string, items: Item[], capacity: number): string[] {
  return items.length > capacity ? [`${label}: ${items.length - capacity} sin slot (capacidad ${capacity})`] : [];
}

/** Binding por layout: el modelo semántico → el vocabulario de slots PROPIO de ese layout. */
export const BINDINGS: Record<string, (m: SectionModel) => Binding> = {
  'hero-split': (m) => {
    const p = act(m.actions[0]);
    const s = act(m.actions[1]);
    return {
      values: {
        eyebrow: m.eyebrow ?? '',
        heading: m.heading ?? '',
        body: m.body ?? '',
        cta_primary: p.label,
        cta_primary_href: p.href,
        cta_secondary: s.label,
        cta_secondary_href: s.href,
        media: media0(m.media[0]),
      },
      unmapped: overflow('actions', m.actions, 2),
    };
  },
  'cta-split-image': (m) => {
    const p = act(m.actions[0]);
    const s = act(m.actions[1]);
    return {
      values: {
        headline: m.heading ?? '',
        subtitle: m.body ?? '',
        primaryCta: p.label,
        secondaryCta: s.label,
        media: media0(m.media[0]),
      },
      unmapped: overflow('actions', m.actions, 2),
    };
  },
  'feature-grid': (m) => {
    const values: Record<string, string> = { eyebrow: m.eyebrow ?? '', heading: m.heading ?? '', body: m.body ?? '' };
    for (let i = 0; i < 3; i++) {
      values[`feature_${i + 1}_title`] = m.items[i]?.title ?? '';
      values[`feature_${i + 1}_body`] = m.items[i]?.body ?? '';
    }
    return { values, unmapped: overflow('features', m.items, 3) };
  },
  'metrics-grid': (m) => {
    const values: Record<string, string> = { eyebrow: m.eyebrow ?? '', heading: m.heading ?? '' };
    for (let i = 0; i < 4; i++) {
      values[`card${i + 1}_value`] = m.items[i]?.value ?? '';
      values[`card${i + 1}_label`] = m.items[i]?.title ?? '';
      values[`card${i + 1}_text`] = m.items[i]?.body ?? '';
    }
    return { values, unmapped: overflow('cards', m.items, 4) };
  },
  'logo-marquee': (m) => {
    const values: Record<string, string> = { headline: m.heading ?? '' };
    for (let i = 0; i < 8; i++) {
      values[`logo${i + 1}`] = m.items[i]?.src ?? '';
      values[`logo${i + 1}_name`] = m.items[i]?.alt ?? '';
    }
    return { values, unmapped: overflow('logos', m.items, 8) };
  },
  'faq-accordion': (m) => {
    const values: Record<string, string> = { headline: m.heading ?? '' };
    for (let i = 0; i < 5; i++) {
      values[`faq${i + 1}_question`] = m.items[i]?.question ?? '';
      values[`faq${i + 1}_answer`] = m.items[i]?.answer ?? '';
    }
    const contact = m.actions.find((a) => a.intent === 'contact') ?? m.actions[0];
    values.contactCta = contact?.label ?? '';
    return { values, unmapped: overflow('faqs', m.items, 5) };
  },
};

const SLOT_RE = /\{\{([a-zA-Z0-9_]+)\}\}/g;

/** Conjunto de slots que declara el HTML de un layout. */
export function slotsOf(html: string): string[] {
  return [...new Set([...html.matchAll(SLOT_RE)].map((m) => m[1]))];
}

/** Carga un layout del catálogo del DS por slug (su .ts exporta un único objeto con `slug`). */
export async function loadLayout(slug: string): Promise<DsLayout> {
  const mod = (await import(resolve(DS_PATHS.layoutsSrc, `${slug}.ts`))) as Record<string, unknown>;
  const found = Object.values(mod).find(
    (v): v is DsLayout => typeof v === 'object' && v !== null && 'slug' in v && (v as DsLayout).slug === slug,
  );
  if (!found) throw new Error(`layout ${slug} no exporta un objeto con slug "${slug}"`);
  return found;
}

export interface FillResult {
  html: string;
  css: string;
  filled: string[];
  emptySlots: string[];
  /** Claves del binding que el layout no declara: el binding quedó desalineado con el catálogo. */
  staleBindings: string[];
}

/** Sustituye los {{slot}} del layout por sus valores. Un slot sin valor queda vacío y se reporta
 * (emptySlots): es honesto, el origen no aportó ese contenido. El CSS del layout no se toca. */
export function fillLayout(layout: DsLayout, values: Record<string, string>): FillResult {
  const declared = new Set(slotsOf(layout.html));
  const filled: string[] = [];
  const emptySlots: string[] = [];
  const html = layout.html.replace(SLOT_RE, (_, slot: string) => {
    const v = values[slot];
    if (v !== undefined && v !== '') {
      filled.push(slot);
      return v;
    }
    emptySlots.push(slot);
    return '';
  });
  const staleBindings = Object.keys(values).filter((k) => !declared.has(k));
  return { html, css: layout.css, filled, emptySlots, staleBindings };
}
