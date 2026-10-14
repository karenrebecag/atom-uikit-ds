// F2+F3 — orquestador Relume-like: IR de sección -> layout NATIVO del DS relleno.
//
// WHY: es el camino primario del converter. Recupera el modelo semántico (section-model), lo liga
// al layout del catálogo que corresponde (catalog) y rellena sus slots. Si el tipo no tiene layout
// (unknown), deja que el llamador componga con el emisor plano (fallback). No escribe CSS: el del
// layout del DS ya es nativo y pasa el contrato.

import { BINDINGS, fillLayout, KIND_TO_LAYOUT, loadLayout } from '../atom/catalog';
import { toSectionModel, type SectionModel } from '../atom/section-model';
import type { IRNode } from '../eval/ir';

export interface FillReport {
  kind: SectionModel['kind'];
  matched: boolean;
  layoutSlug: string | null;
  filledSlots: string[];
  emptySlots: string[];
  staleBindings: string[];
  overflow: string[];
  notes: string[];
}

export interface AtomFill {
  slug: string;
  html: string;
  css: string;
  model: SectionModel;
  report: FillReport;
}

/**
 * Convierte un IR de sección en el layout nativo del DS relleno.
 * Devuelve `matched:false` (sin html/css) cuando el tipo no tiene layout en el catálogo:
 * el llamador decide componer con el emisor plano.
 */
export async function emitFill(slug: string, tree: IRNode[]): Promise<AtomFill> {
  const model = toSectionModel(tree);
  const layoutSlug = KIND_TO_LAYOUT[model.kind];
  const notes: string[] = [...model.unmapped];
  if (model.actions.some((a) => a.intent === 'contact')) {
    notes.push('CTA de contacto -> el layout del DS lo realiza con whatsapp-button (canal único de Atom).');
  }

  if (!layoutSlug) {
    return {
      slug,
      html: '',
      css: '',
      model,
      report: { kind: model.kind, matched: false, layoutSlug: null, filledSlots: [], emptySlots: [], staleBindings: [], overflow: [], notes },
    };
  }

  const layout = await loadLayout(layoutSlug);
  const binding = BINDINGS[layoutSlug](model);
  const fill = fillLayout(layout, binding.values);

  return {
    slug,
    html: fill.html,
    css: fill.css,
    model,
    report: {
      kind: model.kind,
      matched: true,
      layoutSlug,
      filledSlots: fill.filled,
      emptySlots: fill.emptySlots,
      staleBindings: fill.staleBindings,
      overflow: binding.unmapped,
      notes,
    },
  };
}
