// Tipos locales: artefacto del registry auto-contenido (mismo patrón que nav-autohide).

/**
 * Scroll reveal — generic enter animation for sections/cards with optional stagger.
 *
 * Contract (W6a):
 *   [data-reveal]                 → root to observe (self or container of items)
 *   [data-reveal-item]            → optional children to stagger (else direct element children, else self)
 *   [data-reveal-stagger="1|2|3"] → maps to --stagger-1/2/3 (default 2)
 *   [data-reveal-delay]           → extra delay in ms before the tween (instance, not a token scale)
 *
 * Motion from tokens (readMotionTokens):
 *   duration → --duration-600 (macro enter)
 *   ease     → --easing-osmo (firma)
 *   stagger  → --stagger-{n}
 *
 * Canal D5 (no-code): paste HTML includes data-reveal when the consumer wants
 * motion; initAll picks it up. CLI/código: the app opts in by placing attributes.
 *
 * Requires: gsap (globalThis)
 * Respects: prefers-reduced-motion (instant visible state), data-motion-exempt
 */

/** F10b — Webflow/domContract single source; must cover data-* queried in this module. */
export const REQUIRED_HOOKS = [
  'data-reveal',
  'data-reveal-item',
  'data-reveal-stagger',
  'data-reveal-delay',
] as const;

export const REQUIRED_ANATOMY = [] as const;

export const GSAP_PLUGINS = [] as const;

export const STATES_WRITTEN_AS_CLASSES = false;

export type CleanupFn = () => void;
export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

function parseCssTime(raw: string, fallbackSec: number): number {
  if (!raw) return fallbackSec;
  if (raw.endsWith('ms')) {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n / 1000 : fallbackSec;
  }
  if (raw.endsWith('s')) {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallbackSec;
  }
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallbackSec;
}

/**
 * Motion values from DS tokens at runtime. Fallbacks mirror published token values.
 */
function readMotionTokens(
  el: Element,
  staggerKey: '1' | '2' | '3',
): { duration: number; stagger: number; ease: string } {
  const styles = getComputedStyle(el);
  const duration = parseCssTime(styles.getPropertyValue('--duration-600').trim(), 0.6);
  const staggerFallbacks = { '1': 0.03, '2': 0.05, '3': 0.075 } as const;
  const stagger = parseCssTime(
    styles.getPropertyValue(`--stagger-${staggerKey}`).trim(),
    staggerFallbacks[staggerKey],
  );
  const easeRaw = styles.getPropertyValue('--easing-osmo').trim();
  const ease = easeRaw || 'cubic-bezier(0.625, 0.05, 0, 1)';
  return { duration, stagger, ease };
}

function resolveStaggerKey(el: HTMLElement): '1' | '2' | '3' {
  const raw = (el.dataset.revealStagger || '2').trim();
  if (raw === '1' || raw === '2' || raw === '3') return raw;
  return '2';
}

function resolveTargets(root: HTMLElement): HTMLElement[] {
  const items = root.querySelectorAll<HTMLElement>(':scope > [data-reveal-item], :scope [data-reveal-item]');
  if (items.length > 0) return Array.from(items);
  const kids = Array.from(root.children).filter((n): n is HTMLElement => n instanceof HTMLElement);
  if (kids.length > 1) return kids;
  return [root];
}

export function initScrollReveal(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const CustomEase = (globalThis as any).CustomEase;

  if (!gsap) {
    console.warn('[atom-uikit] initScrollReveal: gsap not found');
    return () => {};
  }

  const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const roots = Array.from(
    (scope as Element).querySelectorAll
      ? (scope as Element).querySelectorAll<HTMLElement>('[data-reveal]')
      : document.querySelectorAll<HTMLElement>('[data-reveal]'),
  ).filter((el) => el.dataset.motionExempt === undefined);

  if (roots.length === 0) return () => {};

  const tweens: any[] = [];
  const observers: IntersectionObserver[] = [];

  roots.forEach((root) => {
    const targets = resolveTargets(root);
    if (targets.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(targets, { clearProps: 'opacity,transform' });
      return;
    }

    const motion = readMotionTokens(root, resolveStaggerKey(root));
    const delayMs = parseFloat(root.dataset.revealDelay || '0');
    const delay = Number.isFinite(delayMs) ? Math.max(0, delayMs) / 1000 : 0;

    let gsapEase = 'power2.out';
    if (CustomEase && motion.ease.includes('cubic-bezier')) {
      const bezier = /cubic-bezier\(([^)]+)\)/.exec(motion.ease)?.[1];
      if (bezier) {
        CustomEase.create('scroll-reveal-ease', bezier);
        gsapEase = 'scroll-reveal-ease';
      }
    } else if (motion.ease.includes('0.625')) {
      // firma osmo sin CustomEase — expo.out es el vecino GSAP más cercano
      gsapEase = 'expo.out';
    }

    // yPercent (not px) so motion scale stays independent of root font size
    gsap.set(targets, { opacity: 0, yPercent: 12 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const tween = gsap.to(targets, {
            opacity: 1,
            yPercent: 0,
            duration: motion.duration,
            stagger: targets.length > 1 ? motion.stagger : 0,
            delay,
            ease: gsapEase,
            overwrite: 'auto',
          });
          tweens.push(tween);
          observer.disconnect();
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(root);
    observers.push(observer);
  });

  return () => {
    observers.forEach((o) => o.disconnect());
    tweens.forEach((t) => t.kill?.());
  };
}
