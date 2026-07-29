// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que marquee-draggable/progress-nav/video-player.
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
 * 3 animation types:
 *   lines → split by lines, animate yPercent per line
 *   words → split by lines+words, animate yPercent per word
 *   chars → split by lines+words+chars, animate yPercent per char
 *
 * Requires: gsap, SplitText (registered externally)
 * Respects: prefers-reduced-motion (skips animation, shows content)
 */

type SplitType = 'lines' | 'words' | 'chars';

const splitConfig: Record<SplitType, { duration: number; stagger: number }> = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};

export function initTextReveal(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const SplitText = (globalThis as any).SplitText;

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

  headings.forEach((heading: Element) => {
    if ((heading as HTMLElement).dataset.motionExempt !== undefined) return;

    if (prefersReducedMotion) return;

    const type = ((heading as HTMLElement).dataset.splitReveal || 'lines') as SplitType;
    const typesToSplit =
      type === 'lines' ? 'lines' :
      type === 'words' ? 'lines, words' :
      'lines, words, chars';

    const splitInstance = SplitText.create(heading, {
      type: typesToSplit,
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance: any) {
        const targets = instance[type];
        const cfg = splitConfig[type];

        // Set initial hidden state
        gsap.set(targets, { yPercent: 110 });

        // Observe visibility
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const tween = gsap.to(targets, {
                  yPercent: 0,
                  duration: cfg.duration,
                  stagger: cfg.stagger,
                  ease: 'expo.out',
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
