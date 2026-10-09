// Orbit logos — logos de integraciones en dos anillos inclinados (64 s y 88 s por vuelta).
// Contrato: [data-orbit-logos] > [data-orbit-stage] > [data-orbit-center] +
// [data-orbit-ring="inner"|"outer"] > [data-orbit-item]; [data-orbit-toggle] y
// data-orbit-speed en la raiz. Los chips no rotan, solo se mueven: el logo se lee derecho.
// Hover, foco y boton (WCAG 2.2.2: en tactil no hay hover) frenan con un resorte
// critico para que el logo bajo el puntero no se escape; fuera de vista el rAF se apaga.
// Reduced motion: chips posicionados, sin loop. data-motion-exempt: rejilla del CSS.

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = [
  'data-orbit-logos',
  'data-orbit-stage',
  'data-orbit-ring',
  'data-orbit-item',
  'data-orbit-toggle',
  'data-orbit-speed',
] as const;

export const REQUIRED_ANATOMY = ['[data-orbit-stage]', '[data-orbit-ring]', '[data-orbit-item]'] as const;

export const GSAP_PLUGINS = [] as const;

/** Wave-1 Webflow: behaviors must not write canonical BEM classes. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

/** Segundos por vuelta con data-orbit-speed=1. El exterior mas lento: se lee como mas lejano. */
const PERIOD_SECONDS = { inner: 64, outer: 88 } as const;
/** Radio horizontal de cada anillo como fraccion del ancho del escenario. */
const RADIUS_X = { inner: 0.24, outer: 0.44 } as const;
/** Achatamiento vertical: lo que hace que el circulo se lea inclinado. En angosto
    se abre, o los dos anillos quedan a menos de un chip y los logos se enciman. */
const TILT = 0.62;
const TILT_NARROW = 0.82;
const NARROW_PX = 480;
/** Rigidez del resorte de frenado. Critico (sin rebote): 2*omega de amortiguacion. */
const OMEGA = 6;
/** Los chips de atras: un poco mas chicos y tenues, nunca invisibles. */
const BACK_SCALE = 0.86;
const BACK_OPACITY = 0.72;

type RingName = keyof typeof PERIOD_SECONDS;

interface Ring {
  el: HTMLElement;
  name: RingName;
  items: HTMLElement[];
  angle: number;
}

function speedAttr(root: HTMLElement): number {
  const value = parseFloat(root.getAttribute('data-orbit-speed') || '');
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function ringName(el: HTMLElement): RingName {
  return el.getAttribute('data-orbit-ring') === 'outer' ? 'outer' : 'inner';
}

/** Escribe la posicion de cada chip del anillo para su angulo actual. */
function place(ring: Ring, width: number): void {
  const rx = width * RADIUS_X[ring.name];
  const ry = rx * (width < NARROW_PX ? TILT_NARROW : TILT);
  ring.el.style.setProperty('--orbit-rx', `${rx}px`);
  ring.el.style.setProperty('--orbit-ry', `${ry}px`);
  const n = ring.items.length;
  ring.items.forEach((item, i) => {
    const a = ring.angle + (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    // sin(a) < 0 es la mitad de arriba de la elipse: la que queda "atras".
    const depth = (Math.sin(a) + 1) / 2;
    const scale = BACK_SCALE + (1 - BACK_SCALE) * depth;
    item.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
    item.style.opacity = String(BACK_OPACITY + (1 - BACK_OPACITY) * depth);
    item.style.zIndex = y < 0 ? '0' : '2';
  });
}

export function initOrbitLogos(): CleanupFn {
  if (typeof document === 'undefined') return () => {};

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const cleanups: CleanupFn[] = [];

  function setup(root: HTMLElement) {
    if (root.dataset.motionExempt !== undefined) return;
    if (root.dataset.orbitLogos === 'initialized') return;

    const stage = root.querySelector<HTMLElement>('[data-orbit-stage]');
    if (!stage) return;
    const rings: Ring[] = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-ring]')).map((el) => ({
      el,
      name: ringName(el),
      items: Array.from(el.querySelectorAll<HTMLElement>('[data-orbit-item]')),
      // Desfase: con los dos en 0 los primeros chips salen alineados en una recta.
      angle: ringName(el) === 'outer' ? Math.PI / 8 : 0,
    }));
    if (!rings.some((r) => r.items.length)) return;

    root.dataset.orbitLogos = 'initialized';
    let width = stage.getBoundingClientRect().width;
    const layout = () => rings.forEach((r) => place(r, width));
    layout();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            width = stage.getBoundingClientRect().width;
            layout();
          })
        : null;
    resizeObserver?.observe(stage);

    const restore = () => {
      resizeObserver?.disconnect();
      rings.forEach((r) => {
        r.el.style.removeProperty('--orbit-rx');
        r.el.style.removeProperty('--orbit-ry');
        r.items.forEach((item) => {
          item.style.removeProperty('transform');
          item.style.removeProperty('opacity');
          item.style.removeProperty('z-index');
        });
      });
      delete root.dataset.orbitLogos;
    };

    // El CSS esconde el boton con reduced motion: aqui no hay nada que pausar.
    if (reduced) {
      cleanups.push(restore);
      return;
    }

    const speed = speedAttr(root);
    let hover = false;
    let focus = false;
    let userPaused = false;
    let inView = true;
    // Factor de velocidad 0..1 que sigue al objetivo con el resorte.
    let velocity = 1;
    let rate = 0;
    let frame = 0;
    let last = 0;

    const target = () => (hover || focus || userPaused ? 0 : 1);

    function tick(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const accel = OMEGA * OMEGA * (target() - velocity) - 2 * OMEGA * rate;
      rate += accel * dt;
      velocity += rate * dt;
      rings.forEach((r) => {
        r.angle += ((Math.PI * 2) / PERIOD_SECONDS[r.name]) * speed * velocity * dt;
        place(r, width);
      });
      const settled = target() === 0 && Math.abs(velocity) < 0.001 && Math.abs(rate) < 0.001;
      if (settled) {
        velocity = 0;
        rate = 0;
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function wake() {
      if (!inView || frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }

    const onEnter = () => {
      hover = true;
      wake();
    };
    const onLeave = () => {
      hover = false;
      wake();
    };
    const onFocusIn = () => {
      focus = true;
      wake();
    };
    const onFocusOut = (ev: FocusEvent) => {
      if (root.contains(ev.relatedTarget as Node | null)) return;
      focus = false;
      wake();
    };
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);

    const toggle = root.querySelector<HTMLButtonElement>('[data-orbit-toggle]');
    const onToggle = () => {
      userPaused = toggle?.getAttribute('aria-pressed') !== 'true';
      toggle?.setAttribute('aria-pressed', String(userPaused));
      wake();
    };
    if (toggle) {
      toggle.setAttribute('aria-pressed', 'false');
      toggle.addEventListener('click', onToggle);
    }

    const viewObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                inView = entry.isIntersecting;
                if (inView) wake();
                else stop();
              });
            },
            { threshold: 0 },
          )
        : null;
    viewObserver?.observe(root);

    wake();

    cleanups.push(() => {
      stop();
      viewObserver?.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      toggle?.removeEventListener('click', onToggle);
      toggle?.removeAttribute('aria-pressed');
      restore();
    });
  }

  document.querySelectorAll<HTMLElement>('[data-orbit-logos]').forEach(setup);

  return () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
}
