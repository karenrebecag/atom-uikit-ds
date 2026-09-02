/**
 * <input> con label, aria-describedby y estado. Clases del DS.
 * Recibe id y aria-describedby ya decididos; no los genera.
 */
export interface InputOptions {
  readonly id: string;
  readonly name: string;
  readonly schemaKey: string;
  readonly type: 'text' | 'email' | 'tel';
  readonly describedBy: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly pattern?: string;
  readonly autocomplete?: string;
}

export function input(opts: InputOptions): HTMLInputElement {
  const el = document.createElement('input');
  el.className = 'input';
  el.id = opts.id;
  el.name = opts.name;
  el.type = opts.type;
  el.setAttribute('data-atom-field', opts.schemaKey);
  el.setAttribute('aria-describedby', opts.describedBy);
  if (opts.required === true) {
    el.required = true;
    el.setAttribute('aria-required', 'true');
  }
  if (opts.placeholder !== undefined) {
    el.placeholder = opts.placeholder;
  }
  if (opts.pattern !== undefined) {
    el.pattern = opts.pattern;
  }
  if (opts.autocomplete !== undefined) {
    el.setAttribute('autocomplete', opts.autocomplete);
  }
  if (opts.type === 'tel') {
    el.inputMode = 'tel';
  }
  return el;
}
