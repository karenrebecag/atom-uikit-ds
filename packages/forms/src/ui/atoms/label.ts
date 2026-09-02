/**
 * Label ligado por for/id. El id lo genera el field-group, no el átomo.
 */
export interface LabelOptions {
  readonly htmlFor: string;
  readonly text: string;
  readonly required?: boolean;
}

export function label(opts: LabelOptions): HTMLLabelElement {
  const el = document.createElement('label');
  el.className = opts.required === true ? 'field__label field__label--required' : 'field__label';
  el.htmlFor = opts.htmlFor;
  el.textContent = opts.text;
  return el;
}
