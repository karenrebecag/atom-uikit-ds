import type { CleanupFn, AnimationConfig } from './index';

/**
 * Link button hover animation — arrow SVG draw + text nudge.
 *
 * Contract:
 *   [data-link-button-animate]  → root element
 *   [data-link-button-text]     → text element (nudge)
 *   [data-link-button-icon]     → SVG icon (draw animation)
 *
 * Requires: gsap, DrawSVGPlugin (registered externally)
 */
export function initLinkButtonHover(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const DrawSVGPlugin = (globalThis as any).DrawSVGPlugin;

  if (!gsap || !DrawSVGPlugin) {
    console.warn('[atom-uikit] initLinkButtonHover: gsap or DrawSVGPlugin not found');
    return () => {};
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const buttons = (scope as Element).querySelectorAll
    ? (scope as Element).querySelectorAll('[data-link-button-animate]')
    : document.querySelectorAll('[data-link-button-animate]');

  if (buttons.length === 0) return () => {};

  const mm = gsap.matchMedia();

  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const cleanups: (() => void)[] = [];

    buttons.forEach((button: Element) => {
      if ((button as HTMLElement).dataset.motionExempt !== undefined) return;

      const text = button.querySelector('[data-link-button-text]');
      const icon = button.querySelector('[data-link-button-icon]');
      if (!icon || !text) return;

      const paths = icon.querySelectorAll('path');
      if (paths.length < 2) return;

      const linePath = paths[0];
      const tipPath = paths[1];
      const hoverRoot = (button.closest('[data-hover]') || button) as HTMLElement;

      gsap.set(linePath, { drawSVG: '0% 100%' });
      gsap.set(tipPath, { drawSVG: '0% 100%' });

      let tl: any;

      const playSequence = () => {
        if (tl && tl.isActive()) return;

        tl?.kill();
        tl = gsap.timeline({ overwrite: true });

        tl.addLabel('empty')
          .to(linePath, {
            drawSVG: '100% 100%',
            duration: 0.25,
            ease: 'circ.out',
          }, 'empty')
          .to(tipPath, {
            drawSVG: '50% 50%',
            duration: 0.25,
            ease: 'circ.out',
          }, 'empty+=0.125')
          .set(linePath, {
            drawSVG: '0% 0%',
          }, 'empty+=0.25')
          .addLabel('fill')
          .to(linePath, {
            drawSVG: '0% 100%',
            duration: 0.3,
            ease: 'circ.inOut',
          }, 'fill')
          .to(tipPath, {
            drawSVG: '0% 100%',
            duration: 0.3,
            ease: 'circ.inOut',
          }, 'fill+=0.15');

        tl.to(text, {
          x: '0.375em',
          duration: 0.2,
          ease: 'circ.out',
        }, 'empty').to(text, {
          x: '0em',
          duration: 0.25,
          ease: 'circ.inOut',
        }, 'empty+=0.2');
      };

      const onEnter = () => playSequence();
      const onFocusIn = () => {
        if (hoverRoot.matches(':focus-visible')) playSequence();
      };

      hoverRoot.addEventListener('pointerenter', onEnter);
      hoverRoot.addEventListener('focusin', onFocusIn);

      cleanups.push(() => {
        hoverRoot.removeEventListener('pointerenter', onEnter);
        hoverRoot.removeEventListener('focusin', onFocusIn);
        tl?.kill();
        gsap.set([linePath, tipPath], { clearProps: 'drawSVG' });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  });

  return () => mm.revert();
}
