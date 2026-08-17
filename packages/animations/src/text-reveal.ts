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
 *
 * Does NOT animate gradient headings (decision Karen 2026-08-17): a headline
 * painted with background-clip:text is a different component with its own
 * motion story, not a split-text case. See the guard below for the mechanics.
 *
 * Owns its own FOUC window: the headings it will animate are hidden from JS at
 * init and restored once split. No stylesheet does this — a CSS-side hide keeps
 * the text invisible on any page where the module fails to run.
 *
 * Above the fold that JS hide is not enough: init runs on `load` (GSAP and
 * SplitText arrive deferred), so a heading the reader can already see would
 * paint, vanish and animate back in. For those, the page hides before first
 * paint with a class this module then drops — on EVERY exit path, so a page
 * that opts in never keeps its text hidden:
 *
 *   <script>
 *     var root = document.documentElement;
 *     root.classList.add('atom-split-pending');
 *     setTimeout(function drop() { root.classList.remove('atom-split-pending'); }, 2000);
 *   </script>
 *   <style>.atom-split-pending [data-split="heading"]{visibility:hidden}</style>
 *
 * (the snippet names that callback on purpose: the bundle-contract test counts
 * anonymous function-expression wrappers to prove every module got its own IIFE,
 * and it scans the built file, comments included — an unnamed one here would
 * read as a fourteenth module.)
 *
 * The timeout is the failsafe: if this bundle never loads, the text still shows.
 * Below the fold the class is unnecessary — the reader is not looking there yet.
 */

/** Root class a page may set pre-paint; cleared once this module has run. */
const PENDING_CLASS = 'atom-split-pending';

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

  // Every early return below has to drop it too: the page hid its headings on
  // our promise to run, so bailing without clearing leaves them invisible.
  const clearPending = () => {
    document.documentElement?.classList.remove(PENDING_CLASS);
  };

  if (!gsap || !SplitText) {
    console.warn('[atom-uikit] initTextReveal: gsap or SplitText not found');
    clearPending();
    return () => {};
  }

  const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;

  if (!scope) {
    clearPending();
    return () => {};
  }

  const selector = '[data-split="heading"]';
  const headings = (scope as Element).querySelectorAll
    ? (scope as Element).querySelectorAll(selector)
    : document.querySelectorAll(selector);

  if (headings.length === 0) {
    clearPending();
    return () => {};
  }

  const splits: any[] = [];
  const tweens: any[] = [];
  const observers: IntersectionObserver[] = [];
  let easeName = 'text-reveal-ease';
  let disposed = false;

  // Resolved synchronously so the FOUC hide below covers exactly the headings
  // this module will animate, and nothing else.
  const eligible = Array.from(headings as ArrayLike<Element>).filter((heading) => {
    if ((heading as HTMLElement).dataset.motionExempt !== undefined) return false;

    if (prefersReducedMotion) return false;

    // A gradient headline paints background-clip:text against its own box.
    // SplitText gives every line its own box, so the sweep restarts per piece
    // and the gradient breaks into steps. Left intact on purpose.
    return !(
      heading.matches('[class*="gradient"]') || heading.querySelector('[class*="gradient"]')
    );
  });

  if (eligible.length === 0) {
    clearPending();
    return () => {};
  }

  // The split lands after paint because it waits for the webfont, so without
  // this the heading shows at rest and then jumps down to animate in. Hidden
  // from JS rather than CSS: if this module never runs — no gsap, no call —
  // there is no stylesheet left holding the text invisible.
  eligible.forEach((heading) => {
    (heading as HTMLElement).style.visibility = 'hidden';
  });

  const restore = (heading: Element) => {
    (heading as HTMLElement).style.visibility = '';
  };

  const splitOne = (heading: Element) => {
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

    // autoSplit re-runs onSplit on font load and on resize. Re-hiding a heading
    // the reader has already seen would drop it back below the mask mid-scroll,
    // so once revealed the fresh lines are left at rest.
    let revealed = false;

    let splitInstance: any;
    try {
      splitInstance = SplitText.create(heading, {
        type: typesToSplit,
        mask: 'lines',
        autoSplit: true,
        linesClass: 'line',
        wordsClass: 'word',
        charsClass: 'letter',
        onSplit(instance: any) {
          const targets = instance[safeType];
          if (!targets?.length) return null;
          if (revealed) return null;

          gsap.set(targets, { yPercent: 110 });

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  revealed = true;
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
    } finally {
      // The lines are inside overflow-clip masks and translated down by now, so
      // the heading is still visually empty. Restoring here — and in finally —
      // means a SplitText that throws leaves readable text, never a blank block.
      restore(heading);
    }

    splits.push(splitInstance);
  };

  const splitAll = () => {
    if (disposed) return;
    eligible.forEach(splitOne);
    // The lines are split and parked under their masks, so the pre-paint hide
    // has nothing left to protect against.
    clearPending();
  };

  // Splitting before the webfont lands measures line breaks against the
  // fallback face, so the masked lines get cut in the wrong places. Deferred
  // rather than awaited: init*(): CleanupFn has to stay synchronous.
  const fonts = (document as any).fonts;
  if (fonts?.status !== 'loaded' && typeof fonts?.ready?.then === 'function') {
    fonts.ready.then(splitAll);
  } else {
    splitAll();
  }

  return () => {
    disposed = true;
    clearPending();
    observers.forEach((o) => o.disconnect());
    tweens.forEach((t) => t.kill?.());
    splits.forEach((s) => s.revert?.());
    // Covers teardown before the fonts resolved, when nothing was split yet.
    eligible.forEach(restore);
  };
}
