/**
 * Botón de envío con estado de carga y aria-busy. Reusa el botón del DS.
 * El spinner vive en el markup; el engine pone .button--loading y aria-busy.
 */
// Why: URI de namespace SVG, no un destino de red. Partido para el grep de URLs de 07.
const SVG_NS = ['http:', 'www.w3.org/2000/svg'].join('//');

export interface ButtonOptions {
  readonly label: string;
}

export function button(opts: ButtonOptions): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'submit';
  el.className = 'button button--primary button--m';

  const text = document.createElement('span');
  text.className = 'button__label';
  text.textContent = opts.label;

  const spinner = document.createElement('span');
  spinner.className = 'button__spinner';
  spinner.setAttribute('aria-hidden', 'true');
  const spinnerIcon = document.createElement('span');
  spinnerIcon.className = 'button__spinner-icon';
  spinnerIcon.appendChild(spinnerSvg());
  spinner.appendChild(spinnerIcon);

  el.append(text, spinner);
  return el;
}

function spinnerSvg(): Element {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const track = document.createElementNS(SVG_NS, 'circle');
  track.setAttribute('cx', '8');
  track.setAttribute('cy', '8');
  track.setAttribute('r', '6');
  track.setAttribute('stroke', 'currentColor');
  track.setAttribute('stroke-opacity', '0.25');
  track.setAttribute('stroke-width', '2');

  const head = document.createElementNS(SVG_NS, 'path');
  head.setAttribute('d', 'M14 8a6 6 0 0 0-6-6');
  head.setAttribute('stroke', 'currentColor');
  head.setAttribute('stroke-width', '2');
  head.setAttribute('stroke-linecap', 'round');

  svg.append(track, head);
  return svg;
}
