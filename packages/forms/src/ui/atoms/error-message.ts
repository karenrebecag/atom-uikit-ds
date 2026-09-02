/**
 * Mensaje con role="alert" y aria-live. Vacío no ocupa espacio. Clase .field__error.
 * El slot existe vacío para aria-describedby; colapsar :empty es pintura del DS.
 */
export interface ErrorMessageOptions {
  readonly id: string;
}

export function errorMessage(opts: ErrorMessageOptions): HTMLParagraphElement {
  const el = document.createElement('p');
  el.className = 'field__error';
  el.id = opts.id;
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'polite');
  return el;
}
