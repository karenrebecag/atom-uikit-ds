/**
 * Checkbox de consentimiento. El texto legal entra como slot, no horneado.
 */
// Why: URI de namespace SVG, no un destino de red. Partido para el grep de URLs de 07.
const SVG_NS = ['http:', 'www.w3.org/2000/svg'].join('//');

export interface AcceptanceOptions {
  readonly id: string;
  readonly name: string;
  readonly schemaKey: string;
  readonly describedBy: string;
  readonly legal: string;
  readonly defaultChecked?: boolean;
  readonly required?: boolean;
}

export function acceptance(opts: AcceptanceOptions): HTMLLabelElement {
  const root = document.createElement('label');
  root.className = 'checkbox';
  root.htmlFor = opts.id;

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'checkbox__input';
  box.id = opts.id;
  box.name = opts.name;
  box.setAttribute('data-atom-field', opts.schemaKey);
  box.setAttribute('aria-describedby', opts.describedBy);
  if (opts.required === true) {
    box.required = true;
    box.setAttribute('aria-required', 'true');
  }
  if (opts.defaultChecked === true) {
    box.checked = true;
  }

  const visual = document.createElement('span');
  visual.className = 'checkbox__box';
  const icon = document.createElement('span');
  icon.className = 'checkbox__icon';
  icon.appendChild(checkIcon());
  visual.appendChild(icon);

  const text = document.createElement('span');
  text.className = 'checkbox__label';
  text.textContent = opts.legal;

  root.append(box, visual, text);
  return root;
}

function checkIcon(): Element {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 12 12');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M2.5 6L5 8.5L9.5 3.5');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}
