// Nav auto-hide — la barra se esconde al bajar y reaparece al subir o en top.
//
// DOM contract: [data-nav-autohide] en el nav (sticky/fixed, el layout pone el
// position; este modulo solo mueve). Estado expuesto en data-nav-hidden
// ("true"/"false") por si un consumidor quiere reaccionar.
//
// Vanilla a proposito (sin GSAP): un translateY con transicion tomada de los
// MOTION TOKENS del propio elemento (patron readMotionTokens de menu-button) —
// cero cubic-bezier/ms hardcodeados, y cambiar los tokens re-tematiza el
// comportamiento en todos los consumidores sin tocar este modulo.
//
// prefers-reduced-motion: el ocultarse SI ocurre (es funcion: devolver espacio
// de lectura), pero SIN transicion — la barra aparece/desaparece al corte.
// data-motion-exempt en el nav: el modulo lo ignora por completo.

// Tipos locales: este archivo se distribuye como artefacto del registry y debe
// ser auto-contenido en el consumidor.
export type CleanupFn = () => void;

const TOLERANCE = 8; // px de scroll antes de reaccionar: evita jitter en trackpads

/** OSMO --animation-default: duration-default (0.6s) + cubic-default (la
 *  firma). Citado de su export; los tokens ya viven en el DS. */
function readMotionTokens(el: Element): { ease: string; duration: string } {
  const styles = getComputedStyle(el);
  const ease = styles.getPropertyValue('--easing-osmo').trim() || 'cubic-bezier(0.625, 0.05, 0, 1)';
  const duration = styles.getPropertyValue('--duration-600').trim() || '0.6s';
  return { ease, duration };
}

export function initNavAutohide(): CleanupFn {
  const navs = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-autohide]')).filter(
    (nav) => nav.dataset.motionExempt === undefined,
  );
  if (navs.length === 0) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Un nav flotante (sticky con top > 0, ej. la pildora OSMO) necesita
  // desplazarse su altura MAS ese offset para despejar el viewport.
  const hideOffset = new Map<HTMLElement, string>();
  for (const nav of navs) {
    if (!reduced) {
      const motion = readMotionTokens(nav);
      nav.style.transition = `translate ${motion.duration} ${motion.ease}`;
    }
    const top = getComputedStyle(nav).top;
    hideOffset.set(nav, /^\d/.test(top) ? `0 calc(-100% - ${top})` : '0 -110%');
    nav.setAttribute('data-nav-hidden', 'false');
  }

  let lastY = window.scrollY;
  let ticking = false;

  function update(): void {
    ticking = false;
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) < TOLERANCE) return;

    // Regla de Karen: oculta en scroll-down fuera del top; muestra en
    // scroll-up y siempre en top 0.
    const hide = delta > 0 && y > 0;
    for (const nav of navs) {
      nav.style.translate = hide ? hideOffset.get(nav) ?? '0 -110%' : '0 0';
      nav.setAttribute('data-nav-hidden', String(hide));
    }
    lastY = y;
  }

  function onScroll(): void {
    if (window.scrollY <= 0) {
      // top 0: mostrar sin esperar el umbral
      for (const nav of navs) {
        nav.style.translate = '0 0';
        nav.setAttribute('data-nav-hidden', 'false');
      }
      lastY = 0;
      return;
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
    for (const nav of navs) {
      nav.style.removeProperty('translate');
      nav.style.removeProperty('transition');
      nav.removeAttribute('data-nav-hidden');
    }
  };
}
