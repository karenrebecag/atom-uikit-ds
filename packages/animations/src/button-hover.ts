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
    if ((element as HTMLElement).dataset.motionExempt !== undefined) return;

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
