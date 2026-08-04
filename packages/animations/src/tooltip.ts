// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que marquee-draggable/progress-nav/accordion-morph.

/**
 * Smart tooltip — sigue al trigger, detecta bordes del viewport y VIAJA con
 * Flip entre triggers del mismo grupo en vez de re-entrar.
 *
 * Adaptado de Annnimate (annnimate.com/animations/tooltip) a las convenciones
 * del DS. Convive con el tooltip CSS-only ([data-tooltip], tooltip.css): este
 * usa data-tooltip-content y un popup real en portal, aquel usa pseudo
 * elementos. Casos simples → CSS-only; grupos/edge-detection/Flip → este.
 *
 * MEJORAS deliberadas sobre el original:
 * - FUNCIONAL bajo reduced-motion: el original hacia return TOTAL y el
 *   tooltip moria; aqui aparece/desaparece instantaneo (el contenido es
 *   funcion, el motion es acompanante).
 * - aria-describedby real trigger→popup y Escape para cerrar (WCAG 1.4.13);
 *   el original solo ponia role=tooltip sin vincular nada.
 * - Cleanup real (listeners, timeouts, popup, resize) — nada de window.Anm
 *   ni APIs colgadas del DOM.
 * - El popup se crea en RUNTIME: nace con la clase en AMBAS variantes
 *   (tooltip__popup + ds-tooltip__popup) porque el prefijador del canal
 *   Webflow no puede ver clases generadas por JS.
 *
 * Contract:
 *   [data-tooltip-smart]        → contenedor (config por dataset)
 *   [data-tooltip-trigger]      → cada trigger
 *   [data-tooltip-content]      → texto del tooltip (en el trigger)
 *   [data-tooltip-group]        → triggers del mismo grupo viajan con Flip
 *   [data-tooltip-placement]    → top|bottom|left|right (default top)
 *   [data-tooltip-delay]        → ms antes de mostrar (default 0)
 *   [data-tooltip-hide-delay]   → ms antes de esconder (default 100)
 *
 * Motion desde tokens (fallbacks espejo de los publicados):
 *   entrada/salida → --duration-300 + --easing-out
 *   flip           → --duration-300 + --easing-spring
 *   offset         → --spacing-2 (8px)
 *
 * Requires: gsap (global). Flip para el viaje entre triggers — sin el, el
 * cambio de trigger re-entra con la animacion normal (degradacion honesta).
 */

/**
 * F10b — contrato ESTRUCTURAL (siempre presente en el markup). Config
 * opcional por dataset (placement/delay/hide-delay/group) queda fuera, como
 * en marquee-draggable.
 */
export const REQUIRED_HOOKS = [
  'data-tooltip-smart',
  'data-tooltip-trigger',
  'data-tooltip-content',
] as const;

/** Solo pintura (el popup nace en runtime con estas clases + variante ds-). */
export const REQUIRED_ANATOMY = [] as const;

export const GSAP_PLUGINS = ['Flip'] as const;

export const STATES_WRITTEN_AS_CLASSES = false;

export type CleanupFn = () => void;
export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

const FLIP_THRESHOLD_MS = 1000; // fuera del grupo: viaja solo si el salto es rapido
const HIDE_SCALE = 0.9;

function parseCssTime(raw: string, fallbackSec: number): number {
  if (!raw) return fallbackSec;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallbackSec;
  return raw.endsWith('ms') ? n / 1000 : n;
}

function parseCssPx(raw: string, fallbackPx: number): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallbackPx;
}

interface Motion {
  dur: number;
  ease: string;
  flipEase: string;
  offset: number;
}

function readMotionTokens(el: Element, CustomEase: any): Motion {
  const s = getComputedStyle(el);
  const v = (name: string) => s.getPropertyValue(name).trim();

  const ease = (varName: string, id: string, namedFallback: string): string => {
    const raw = v(varName);
    const bezier = /cubic-bezier\(([^)]+)\)/.exec(raw)?.[1];
    if (bezier && CustomEase) {
      CustomEase.create(id, bezier);
      return id;
    }
    return namedFallback;
  };

  return {
    dur: parseCssTime(v('--duration-300'), 0.3),
    ease: ease('--easing-out', 'tooltip-ease', 'power3.out'),
    flipEase: ease('--easing-spring', 'tooltip-flip', 'back.out(1.3)'),
    offset: parseCssPx(v('--spacing-2'), 8),
  };
}

type Placement = 'top' | 'bottom' | 'left' | 'right';

function calculatePosition(
  trigger: Element,
  tooltip: HTMLElement,
  placement: Placement,
  offset: number,
): { top: number; left: number; placement: Placement } {
  const t = trigger.getBoundingClientRect();
  const p = tooltip.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = 0;
  let left = 0;
  let final: Placement = placement;

  switch (placement) {
    case 'top':
      top = t.top - p.height - offset;
      left = t.left + t.width / 2 - p.width / 2;
      if (top < offset) {
        final = 'bottom';
        top = t.bottom + offset;
      }
      break;
    case 'bottom':
      top = t.bottom + offset;
      left = t.left + t.width / 2 - p.width / 2;
      if (top + p.height > vh - offset) {
        final = 'top';
        top = t.top - p.height - offset;
      }
      break;
    case 'left':
      top = t.top + t.height / 2 - p.height / 2;
      left = t.left - p.width - offset;
      if (left < offset) {
        final = 'right';
        left = t.right + offset;
      }
      break;
    case 'right':
      top = t.top + t.height / 2 - p.height / 2;
      left = t.right + offset;
      if (left + p.width > vw - offset) {
        final = 'left';
        left = t.left - p.width - offset;
      }
      break;
  }

  left = Math.min(Math.max(left, offset), Math.max(vw - p.width - offset, offset));
  top = Math.min(Math.max(top, offset), Math.max(vh - p.height - offset, offset));

  return { top, left, placement: final };
}

let popupCounter = 0;

export function initTooltipSmart(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const CustomEase = (globalThis as any).CustomEase;
  const Flip = (globalThis as any).Flip;

  if (!gsap) {
    console.warn('[atom-uikit] initTooltipSmart: gsap not found');
    return () => {};
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;
  if (!scope) return () => {};

  const containers = Array.from(
    (scope as Element).querySelectorAll<HTMLElement>('[data-tooltip-smart]'),
  );
  if (!containers.length) return () => {};

  const prefersReducedMotion =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const cleanups: CleanupFn[] = [];
  for (const container of containers) {
    const instant = prefersReducedMotion || container.dataset.motionExempt !== undefined;
    cleanups.push(initContainer(container, { gsap, CustomEase, Flip, instant }));
  }
  return () => cleanups.forEach((fn) => fn());
}

function initContainer(
  container: HTMLElement,
  ctx: { gsap: any; CustomEase: any; Flip: any; instant: boolean },
): CleanupFn {
  const { gsap, CustomEase, Flip, instant } = ctx;

  const triggers = Array.from(
    container.querySelectorAll<HTMLElement>('[data-tooltip-trigger]'),
  );
  if (!triggers.length) return () => {};

  const motion = readMotionTokens(container, CustomEase);
  const placement = (container.dataset.tooltipPlacement as Placement) || 'top';
  const delay = parseFloat(container.dataset.tooltipDelay || '0');
  const hideDelay = parseFloat(container.dataset.tooltipHideDelay || '100');

  let popup: HTMLElement | null = null;
  let popupText: HTMLElement | null = null;
  let current: HTMLElement | null = null;
  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let lastShowAt = 0;

  const ensurePopup = () => {
    if (popup) return;
    popup = document.createElement('div');
    // AMBAS variantes de clase: el prefijador ds- del canal Webflow no ve
    // markup creado en runtime.
    popup.className = 'tooltip__popup ds-tooltip__popup';
    popup.id = `tooltip-smart-${++popupCounter}`;
    popup.setAttribute('role', 'tooltip');
    popup.style.position = 'fixed';
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';

    const bg = document.createElement('div');
    bg.className = 'tooltip__popup-bg ds-tooltip__popup-bg';
    popupText = document.createElement('div');
    popupText.className = 'tooltip__popup-text ds-tooltip__popup-text';

    popup.appendChild(bg);
    popup.appendChild(popupText);
    document.body.appendChild(popup);
  };

  const setPlacementClass = (p: Placement) => {
    if (!popup) return;
    for (const dir of ['top', 'bottom', 'left', 'right']) {
      popup.classList.remove(`is-${dir}`, `ds-is-${dir}`);
    }
    popup.classList.add(`is-${p}`, `ds-is-${p}`);
  };

  const link = (trigger: HTMLElement) => {
    if (popup) trigger.setAttribute('aria-describedby', popup.id);
  };
  const unlink = () => {
    current?.removeAttribute('aria-describedby');
  };

  const show = (trigger: HTMLElement) => {
    const content = trigger.dataset.tooltipContent;
    if (!content) return;

    const now = Date.now();
    const sinceLast = now - lastShowAt;
    lastShowAt = now;

    ensurePopup();
    if (!popup || !popupText) return;

    const sameGroup =
      !!current &&
      !!current.dataset.tooltipGroup &&
      current.dataset.tooltipGroup === trigger.dataset.tooltipGroup;
    const shouldFlip =
      !instant &&
      !!Flip &&
      !!current &&
      current !== trigger &&
      (sameGroup || sinceLast < FLIP_THRESHOLD_MS);

    unlink();

    if (instant) {
      popupText.textContent = content;
      const pos = calculatePosition(trigger, popup, placement, motion.offset);
      setPlacementClass(pos.placement);
      popup.style.top = `${pos.top}px`;
      popup.style.left = `${pos.left}px`;
      popup.style.opacity = '1';
      popup.style.transform = 'none';
    } else if (shouldFlip) {
      // Captura el estado ANTES de mover nada: Flip anima desde ahi.
      const state = Flip.getState(popup);
      popupText.textContent = content;
      const pos = calculatePosition(trigger, popup, placement, motion.offset);
      setPlacementClass(pos.placement);
      gsap.set(popup, { top: pos.top, left: pos.left, opacity: 1, scale: 1, y: 0 });
      Flip.from(state, { duration: motion.dur, ease: motion.flipEase, absolute: true });
    } else {
      popupText.textContent = content;
      const pos = calculatePosition(trigger, popup, placement, motion.offset);
      setPlacementClass(pos.placement);
      gsap.set(popup, { top: pos.top, left: pos.left });
      const yOffset = pos.placement === 'top' ? 8 : pos.placement === 'bottom' ? -8 : 0;
      gsap.fromTo(
        popup,
        { opacity: 0, scale: HIDE_SCALE, y: yOffset },
        { opacity: 1, scale: 1, y: 0, duration: motion.dur, ease: motion.ease },
      );
    }

    current = trigger;
    link(trigger);
  };

  const hide = () => {
    if (!popup || !current) return;
    unlink();
    current = null;

    if (instant) {
      popup.style.opacity = '0';
      return;
    }
    const yOffset = popup.classList.contains('is-top')
      ? 8
      : popup.classList.contains('is-bottom')
        ? -8
        : 0;
    gsap.to(popup, {
      opacity: 0,
      scale: HIDE_SCALE,
      y: yOffset,
      duration: motion.dur,
      ease: motion.ease,
    });
  };

  const clearTimers = () => {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    showTimer = null;
    hideTimer = null;
  };

  type Bound = {
    el: HTMLElement;
    enter: () => void;
    leave: () => void;
    focus: () => void;
    blur: () => void;
  };
  const bound: Bound[] = [];

  for (const trigger of triggers) {
    const enter = () => {
      clearTimers();
      if (delay > 0) {
        showTimer = setTimeout(() => show(trigger), delay);
      } else {
        show(trigger);
      }
    };
    const scheduleHide = () => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      if (hideDelay > 0) {
        hideTimer = setTimeout(hide, hideDelay);
      } else {
        hide();
      }
    };
    const b: Bound = { el: trigger, enter, leave: scheduleHide, focus: enter, blur: scheduleHide };
    trigger.addEventListener('mouseenter', b.enter);
    trigger.addEventListener('mouseleave', b.leave);
    trigger.addEventListener('focus', b.focus);
    trigger.addEventListener('blur', b.blur);
    bound.push(b);
  }

  // WCAG 1.4.13: contenido en hover debe poder cerrarse sin mover el puntero.
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && current) {
      clearTimers();
      hide();
    }
  };
  document.addEventListener('keydown', onKeydown);

  // El popup es position:fixed sobre coordenadas medidas: un resize las deja
  // stale — esconder es mas honesto que perseguir el layout.
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(hide, 150);
  };
  window.addEventListener('resize', onResize);

  return () => {
    clearTimers();
    if (resizeTimer) clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onKeydown);
    for (const b of bound) {
      b.el.removeEventListener('mouseenter', b.enter);
      b.el.removeEventListener('mouseleave', b.leave);
      b.el.removeEventListener('focus', b.focus);
      b.el.removeEventListener('blur', b.blur);
    }
    unlink();
    if (popup) gsap.killTweensOf(popup);
    popup?.remove();
    popup = null;
  };
}
