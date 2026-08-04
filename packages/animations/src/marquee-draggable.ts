// Draggable Marquee (Directional)
// DOM contract: [data-draggable-marquee] on container
// Config via data attributes:
//   data-direction="left|right"
//   data-duration="20"       (seconds for one loop)
//   data-multiplier="35"     (max drag speed multiplier)
//   data-sensitivity="0.01"  (velocity to timescale ratio)
//
// Structure expected:
//   [data-draggable-marquee]
//     [data-draggable-marquee-collection]
//       [data-draggable-marquee-list]
//         .marquee__item (children)
//
// Requires: gsap, Observer, ScrollTrigger (global or registered)

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = [
  'data-draggable-marquee',
  'data-draggable-marquee-collection',
  'data-draggable-marquee-list',
] as const;

/**
 * Solo pintura. El modulo NO consulta estas clases: clona la lista entera con
 * cloneNode, asi que el prefijo ds- del canal Webflow le es indiferente
 * (auditado 2026-08-04 al migrar menu-button).
 */
export const REQUIRED_ANATOMY = [
  '[data-draggable-marquee-collection]',
  '[data-draggable-marquee-list]',
  '.marquee__item',
] as const;

export const GSAP_PLUGINS = ['Observer', 'ScrollTrigger'] as const;

/** Wave-1 Webflow: behaviors must not write canonical BEM classes. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

declare const gsap: any;
declare const Observer: any;
declare const ScrollTrigger: any;

function getNumberAttr(el: Element, name: string, fallback: number): number {
  const value = parseFloat(el.getAttribute(name) || '');
  return Number.isFinite(value) ? value : fallback;
}

export function initDraggableMarquee(): CleanupFn {
  if (typeof gsap === 'undefined' || typeof Observer === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return () => {};
  }

  gsap.registerPlugin(Observer, ScrollTrigger);

  // Contrato de motion del DS: un marquee infinito corriendo es exactamente lo
  // que reduced-motion pide evitar. Sin init, el marquee queda estatico (CSS).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const wrappers = document.querySelectorAll<HTMLElement>('[data-draggable-marquee]');
  const cleanups: CleanupFn[] = [];

  wrappers.forEach((wrapper) => {
    if (wrapper.dataset.motionExempt !== undefined) return;
    if (wrapper.dataset.draggableMarquee === 'initialized') return;

    const collection = wrapper.querySelector<HTMLElement>('[data-draggable-marquee-collection]');
    const list = wrapper.querySelector<HTMLElement>('[data-draggable-marquee-list]');
    if (!collection || !list) return;

    const duration = getNumberAttr(wrapper, 'data-duration', 20);
    const multiplier = getNumberAttr(wrapper, 'data-multiplier', 35);
    const sensitivity = getNumberAttr(wrapper, 'data-sensitivity', 0.01);

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
    if (!wrapperWidth || !listWidth) return;

    // Duplicate lists to fill container
    const minRequired = wrapperWidth + listWidth + 2;
    while (collection.scrollWidth < minRequired) {
      const clone = list.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      collection.appendChild(clone);
    }

    const wrapX = gsap.utils.wrap(-listWidth, 0);

    gsap.set(collection, { x: 0 });

    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: 'none',
      repeat: -1,
      onReverseComplete() { marqueeLoop.progress(1); },
      modifiers: {
        x: (x: string) => wrapX(parseFloat(x)) + 'px',
      },
    });

    // Direction
    const initialDir = (wrapper.getAttribute('data-direction') || 'left').toLowerCase();
    const baseDirection = initialDir === 'right' ? -1 : 1;
    const timeScale = { value: baseDirection };

    if (baseDirection < 0) marqueeLoop.progress(1);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
      wrapper.setAttribute('data-direction', timeScale.value < 0 ? 'right' : 'left');
    }

    applyTimeScale();

    // Drag observer
    const marqueeObserver = Observer.create({
      target: wrapper,
      type: 'pointer,touch',
      preventDefault: true,
      debounce: false,
      onChangeX: (ev: any) => {
        let velocityTS = ev.velocityX * -sensitivity;
        velocityTS = gsap.utils.clamp(-multiplier, multiplier, velocityTS);

        gsap.killTweensOf(timeScale);

        const restingDir = velocityTS < 0 ? -1 : 1;

        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocityTS, duration: 0.1, overwrite: true })
          .to(timeScale, { value: restingDir, duration: 1.0 });
      },
    });

    // Viewport observer
    const scrollTrigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onEnterBack: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onLeave: () => { marqueeLoop.pause(); marqueeObserver.disable(); },
      onLeaveBack: () => { marqueeLoop.pause(); marqueeObserver.disable(); },
    });

    wrapper.dataset.draggableMarquee = 'initialized';

    cleanups.push(() => {
      marqueeLoop.kill();
      marqueeObserver.kill();
      scrollTrigger.kill();
      // Remove cloned lists
      collection.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
      delete wrapper.dataset.draggableMarquee;
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
