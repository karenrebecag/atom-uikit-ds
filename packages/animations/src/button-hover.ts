import type { CleanupFn, AnimationConfig } from './index';

/**
 * Button hover animation — staggered character bounce on hover.
 *
 * Contract:
 *   [data-button-animate]  → root element (hover target)
 *   [data-button-text]     → text element (split into chars)
 *
 * Requires: gsap, SplitText, CustomEase (registered externally)
 * Respects: prefers-reduced-motion, (hover: hover) and (pointer: fine)
 */
export function initButtonHover(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const SplitText = (globalThis as any).SplitText;
  const CustomEase = (globalThis as any).CustomEase;
  const ScrollTrigger = (globalThis as any).ScrollTrigger;

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

  const buttons = (scope as Element).querySelectorAll
    ? (scope as Element).querySelectorAll('[data-button-animate]')
    : document.querySelectorAll('[data-button-animate]');

  if (buttons.length === 0) return () => {};

  if (CustomEase) {
    CustomEase.create('button-ease', '0.2, 0.5, 0.5, 1');
  }

  const cleanups: (() => void)[] = [];
  const mm = gsap.matchMedia();

  buttons.forEach((element: Element) => {
    if ((element as HTMLElement).dataset.motionExempt !== undefined) return;

    // Inview detection via ScrollTrigger
    if (ScrollTrigger) {
      const st = ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => element.classList.add('is--inview'),
        onEnterBack: () => element.classList.add('is--inview'),
        onLeave: () => element.classList.remove('is--inview'),
        onLeaveBack: () => element.classList.remove('is--inview'),
      });
      cleanups.push(() => st.kill());
    }

    const text = element.querySelector('[data-button-text]');
    if (!text) return;

    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const textSplit = new SplitText(text, {
        type: 'chars',
        tag: 'span',
        charsClass: 'split-char',
      });

      const icon = element.querySelector('[data-button-icon]');
      const iconIsBeforeText = !!icon && !!(icon.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING);
      const targets = icon
        ? iconIsBeforeText
          ? [icon, ...textSplit.chars]
          : [...textSplit.chars, icon]
        : [...textSplit.chars];

      gsap.set(targets, {
        display: 'inline-block',
        transformOrigin: 'center center',
        willChange: 'transform',
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(targets, {
        willChange: 'transform',
        keyframes: {
          '0%': { y: '0em', rotate: 0 },
          '55%': { y: '-0.375em', rotate: -8 },
          '90%': { y: '0.125em', rotate: 0 },
          '100%': { y: '0em', rotate: 0 },
        },
        duration: 0.45,
        ease: CustomEase ? 'button-ease' : 'power2.out',
        stagger: { amount: 0.225 },
      });

      const hoverRoot = (element.closest('[data-hover]') || element) as HTMLElement;

      const pause = () => {
        tl.pause();
        gsap.to(targets, {
          y: '0em',
          rotate: 0,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const onEnter = () => tl.restart();
      const onLeave = () => pause();
      const onFocusIn = () => {
        if (hoverRoot.matches(':focus-visible')) tl.restart();
      };
      const onFocusOut = () => {
        if (hoverRoot.matches(':hover')) return;
        pause();
      };

      hoverRoot.addEventListener('pointerenter', onEnter);
      hoverRoot.addEventListener('pointerleave', onLeave);
      hoverRoot.addEventListener('focusin', onFocusIn);
      hoverRoot.addEventListener('focusout', onFocusOut);

      return () => {
        hoverRoot.removeEventListener('pointerenter', onEnter);
        hoverRoot.removeEventListener('pointerleave', onLeave);
        hoverRoot.removeEventListener('focusin', onFocusIn);
        hoverRoot.removeEventListener('focusout', onFocusOut);
        tl.kill();
        textSplit.revert();
      };
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
    mm.revert();
  };
}
