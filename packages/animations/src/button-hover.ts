// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que marquee-draggable/progress-nav/video-player.
export type CleanupFn = () => void;
export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

/**
 * Button hover animation — text swap with per-character blur/slide.
 *
 * Contract:
 *   [data-button-animate]  → root element
 *   [data-button-text]     → text elements (expects 2: default + hover clone)
 *
 * GSAP only used for SplitText. Animation is CSS-driven via --char index.
 * Requires: gsap, SplitText (registered externally)
 * Respects: prefers-reduced-motion, (hover: hover) and (pointer: fine)
 */
/**
 * `undefined` (atributo ausente) y `''` (presente sin valor) significan ACTIVO:
 * el contrato historico es la presencia del atributo y no debe romperse.
 * Solo apagan los valores explicitamente falsos.
 */
function isFalsy(value: string | undefined): boolean {
  if (value === undefined || value === '') return false;
  return ['false', '0', 'off', 'no'].includes(value.trim().toLowerCase());
}

export function initButtonHover(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const SplitText = (globalThis as any).SplitText;

  if (!gsap || !SplitText) {
    console.warn('[atom-uikit] initButtonHover: gsap or SplitText not found');
    return () => {};
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const selector = '[data-button-animate], [data-link-button-animate], [data-toggle-group-animate]';
  const buttons = (scope as Element).querySelectorAll
    ? (scope as Element).querySelectorAll(selector)
    : document.querySelectorAll(selector);

  if (buttons.length === 0) return () => {};

  const splits: any[] = [];

  buttons.forEach((element: Element) => {
    const el = element as HTMLElement;
    if (el.dataset.motionExempt !== undefined) return;
    // Opt-out por VALOR, no solo por ausencia del atributo: un host declarativo
    // (Webflow, un CMS, una plantilla) suele poder escribir el valor de un
    // atributo pero no decidir si el atributo existe. Con esto el mismo booleano
    // del autor apaga la animacion en cualquier tecnologia.
    if (isFalsy(el.dataset.buttonAnimate) || isFalsy(el.dataset.linkButtonAnimate)) return;

    const textElements = element.querySelectorAll('[data-button-text]');
    if (textElements.length === 0) return;

    textElements.forEach((textEl) => {
      const isAriaHidden = textEl.getAttribute('aria-hidden') === 'true';
      const splitText = new SplitText(textEl, {
        type: 'chars',
        tag: 'span',
        charsClass: 'button__split-char',
        propIndex: true,
        aria: isAriaHidden ? 'none' : 'auto',
      });

      gsap.set(splitText.chars, { display: 'inline-block' });
      splits.push(splitText);
    });
  });

  return () => {
    splits.forEach((s) => s.revert());
  };
}
