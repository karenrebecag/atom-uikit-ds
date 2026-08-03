// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que marquee-draggable/progress-nav/video-player.

/** F10b — Webflow/domContract single source; must cover data-* queried in this module. */
export const REQUIRED_HOOKS = [
  "data-split"
] as const;

export const REQUIRED_ANATOMY = [
  "[data-split=\"heading\"]"
] as const;

export const GSAP_PLUGINS = ['SplitText'] as const;

export const STATES_WRITTEN_AS_CLASSES = false;

export type CleanupFn = () => void;
export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

/**
 * Text reveal — masked split-text animation triggered by IntersectionObserver.
 *
 * Contract:
 *   [data-split="heading"]         → elements to animate
 *   [data-split-reveal="lines"]    → split type: "lines" | "words" | "chars"
 *                                    defaults to "lines" if omitted
 *
 * Motion values from DS tokens (readMotionTokens, same idea as menu-button):
 *   lines → --duration-900 + --stagger-3 + --easing-out
 *   words → --duration-600 + --stagger-2 + --easing-out
 *   chars → --duration-500 + --stagger-1 + --easing-out
 *
 * Requires: gsap, SplitText (registered externally)
 * Respects: prefers-reduced-motion (skips animation, shows content)
 *           data-motion-exempt on the heading
 */

type SplitType = 'lines' | 'words' | 'chars';

/** Token var names per split type — no duration/stagger literals in the tween path. */
const TOKEN_VARS: Record<
  SplitType,
  { duration: string; stagger: string; ease: string; fallbackDuration: number; fallbackStagger: number }
> = {
  lines: {
    duration: '--duration-900',
    stagger: '--stagger-3',
    ease: '--easing-out',
    fallbackDuration: 0.9,
    fallbackStagger: 0.075,
  },
  words: {
    duration: '--duration-600',
    stagger: '--stagger-2',
    ease: '--easing-out',
    fallbackDuration: 0.6,
    fallbackStagger: 0.05,
  },
  chars: {
    duration: '--duration-500',
    stagger: '--stagger-1',
    ease: '--easing-out',
    fallbackDuration: 0.5,
    fallbackStagger: 0.03,
  },
};

/**
 * Motion values come from the DS tokens at runtime so a token change re-tunes
 * every consumer without touching this module. Fallbacks mirror published
 * token values when the stylesheet has not loaded yet.
 */
function readMotionTokens(
  scope: Element,
  type: SplitType,
): { duration: number; stagger: number; ease: string } {
  const vars = TOKEN_VARS[type];
  const styles = getComputedStyle(scope);
  const duration = parseCssTime(
    styles.getPropertyValue(vars.duration).trim(),
    vars.fallbackDuration,
  );
  const stagger = parseCssTime(
    styles.getPropertyValue(vars.stagger).trim(),
    vars.fallbackStagger,
  );
  const easeRaw = styles.getPropertyValue(vars.ease).trim();
  // GSAP accepts cubic-bezier via CustomEase when present; otherwise named fall-back.
  const ease = easeRaw || 'expo.out';
  return { duration, stagger, ease };
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

export function initTextReveal(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const SplitText = (globalThis as any).SplitText;
  const CustomEase = (globalThis as any).CustomEase;

  if (!gsap || !SplitText) {
    console.warn('[atom-uikit] initTextReveal: gsap or SplitText not found');
    return () => {};
  }

  const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) return () => {};

  const selector = '[data-split="heading"]';
  const headings = (scope as Element).querySelectorAll
    ? (scope as Element).querySelectorAll(selector)
    : document.querySelectorAll(selector);

  if (headings.length === 0) return () => {};

  const splits: any[] = [];
  const tweens: any[] = [];
  const observers: IntersectionObserver[] = [];
  let easeName = 'text-reveal-ease';

  headings.forEach((heading: Element) => {
    if ((heading as HTMLElement).dataset.motionExempt !== undefined) return;

    if (prefersReducedMotion) return;

    const type = ((heading as HTMLElement).dataset.splitReveal || 'lines') as SplitType;
    const safeType: SplitType =
      type === 'lines' || type === 'words' || type === 'chars' ? type : 'lines';
    const typesToSplit =
      safeType === 'lines' ? 'lines' :
      safeType === 'words' ? 'lines, words' :
      'lines, words, chars';

    const motion = readMotionTokens(heading, safeType);
    let gsapEase: string = motion.ease;
    if (CustomEase && motion.ease.includes('cubic-bezier')) {
      const bezier = /cubic-bezier\(([^)]+)\)/.exec(motion.ease)?.[1];
      if (bezier) {
        CustomEase.create(easeName, bezier);
        gsapEase = easeName;
      }
    } else if (motion.ease.startsWith('cubic-bezier')) {
      // No CustomEase: named ease that matches easing-out character (expo.out).
      gsapEase = 'expo.out';
    }

    const splitInstance = SplitText.create(heading, {
      type: typesToSplit,
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance: any) {
        const targets = instance[safeType];
        if (!targets?.length) return null;

        gsap.set(targets, { yPercent: 110 });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const tween = gsap.to(targets, {
                  yPercent: 0,
                  duration: motion.duration,
                  stagger: motion.stagger,
                  ease: gsapEase,
                });
                tweens.push(tween);
                observer.disconnect();
              }
            });
          },
          { threshold: 0.1 },
        );

        observer.observe(heading);
        observers.push(observer);
        return null;
      },
    });

    splits.push(splitInstance);
  });

  return () => {
    observers.forEach((o) => o.disconnect());
    tweens.forEach((t) => t.kill?.());
    splits.forEach((s) => s.revert?.());
  };
}
