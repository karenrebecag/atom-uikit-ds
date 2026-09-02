/**
 * <select> nativo accesible por teclado. Sin librería.
 * El DS `.select` es un composite trigger/list: no se reimplementa ni se pinta
 * sobre el nativo. Sin clase DS para native select; no se inventa.
 * FieldDef.searchable se ignora: combobox es otra anatomía, no este átomo.
 */
import type { SelectOption } from '../../core/types';

export interface SelectOptions {
  readonly id: string;
  readonly name: string;
  readonly schemaKey: string;
  readonly describedBy: string;
  readonly options?: readonly SelectOption[];
  readonly required?: boolean;
  readonly placeholder?: string;
}

export function select(opts: SelectOptions): HTMLSelectElement {
  const el = document.createElement('select');
  el.id = opts.id;
  el.name = opts.name;
  el.setAttribute('data-atom-field', opts.schemaKey);
  el.setAttribute('aria-describedby', opts.describedBy);
  if (opts.required === true) {
    el.required = true;
    el.setAttribute('aria-required', 'true');
  }

  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = opts.placeholder ?? '';
  el.appendChild(blank);

  const options = opts.options ?? [];
  for (const item of options) {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    el.appendChild(option);
  }
  return el;
}
