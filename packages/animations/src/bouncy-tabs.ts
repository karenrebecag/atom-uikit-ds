// Bouncy Content Tabs
// DOM contract: [data-bouncy-tabs] on the wrapper that holds nav + card.
//
// Structure expected:
//   [data-bouncy-tabs]
//     [data-bouncy-tabs-nav]            (role="tablist")
//       [data-bouncy-tabs-ghost]        (opcional: pastilla que sigue al cursor)
//       [data-bouncy-tabs-indicator]    (pastilla del tab activo)
//       [data-bouncy-tabs-button] xN    (uno lleva data-active al cargar)
//     [data-bouncy-tabs-card]
//       [data-bouncy-tabs-panels]
//         [data-bouncy-tabs-panel] xN   (mismo orden que los botones)
//
// Requires: gsap (global o registrado)
// Respects: prefers-reduced-motion (conmuta sin animar) y data-motion-exempt

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = [
  'data-bouncy-tabs',
  'data-bouncy-tabs-nav',
  'data-bouncy-tabs-indicator',
  'data-bouncy-tabs-ghost',
  'data-bouncy-tabs-button',
  'data-bouncy-tabs-card',
  'data-bouncy-tabs-panels',
  'data-bouncy-tabs-panel',
] as const;

export const REQUIRED_ANATOMY = [
  '[data-bouncy-tabs-nav]',
  '[data-bouncy-tabs-indicator]',
  '[data-bouncy-tabs-button]',
  '[data-bouncy-tabs-panels]',
  '[data-bouncy-tabs-panel]',
] as const;

export const GSAP_PLUGINS = [] as const;

/** El estado activo viaja como data-active, no como clase BEM. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

declare const gsap: any;

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
 * Los tiempos salen de los tokens del DS, no de constantes sueltas: un cambio
 * de escala de motion re-afina este componente sin tocarlo. Los fallbacks
 * reflejan el token publicado por si la hoja aun no cargo.
 */
function readMotion(scope: Element) {
  const s = getComputedStyle(scope);
  const t = (name: string, fb: number) => parseCssTime(s.getPropertyValue(name).trim(), fb);
  return {
    travel: t('--duration-300', 0.3),
    settle: t('--duration-200', 0.2),
    squashDown: t('--duration-150', 0.15),
    squashBack: t('--duration-500', 0.5),
    cardSquash: t('--duration-200', 0.2),
    cardInflate: t('--duration-500', 0.5),
    // El rebote es de marca: easing-spring, no un back.out inventado.
    spring: s.getPropertyValue('--easing-spring').trim() || 'back.out(2)',
  };
}

export function initBouncyTabs(): CleanupFn {
  if (typeof gsap === 'undefined') {
    console.warn('[atom-uikit] initBouncyTabs: gsap not found');
    return () => {};
  }

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>('[data-bouncy-tabs]'),
  ).filter((el) => el.dataset.motionExempt === undefined);

  const cleanups: CleanupFn[] = [];
  let instance = 0;

  roots.forEach((root) => {
    const nav = root.querySelector<HTMLElement>('[data-bouncy-tabs-nav]');
    const indicator = root.querySelector<HTMLElement>('[data-bouncy-tabs-indicator]');
    const ghost = root.querySelector<HTMLElement>('[data-bouncy-tabs-ghost]');
    const buttons = nav
      ? Array.from(nav.querySelectorAll<HTMLElement>('[data-bouncy-tabs-button]'))
      : [];
    if (!nav || !indicator || buttons.length < 2) return;

    const card = root.querySelector<HTMLElement>('[data-bouncy-tabs-card]');
    const panelsWrap = root.querySelector<HTMLElement>('[data-bouncy-tabs-panels]');
    const panels = panelsWrap
      ? Array.from(panelsWrap.querySelectorAll<HTMLElement>('[data-bouncy-tabs-panel]'))
      : [];
    const hasCard = Boolean(card && panelsWrap && panels.length);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = readMotion(root);

    // Cablear tab <-> panel. Los ids se generan solo si faltan: un id puesto a
    // mano puede estar referenciado desde fuera.
    instance += 1;
    buttons.forEach((button, i) => {
      const panel = panels[i];
      if (!panel) return;
      if (!button.id) button.id = `bouncy-tabs-${instance}-tab-${i + 1}`;
      if (!panel.id) panel.id = `bouncy-tabs-${instance}-panel-${i + 1}`;
      button.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', button.id);
    });

    let activeIndex = Math.max(
      0,
      buttons.findIndex((b) => b.hasAttribute('data-active')),
    );
    const pos = { left: 0, right: 0 };
    let ghostVisible = false;

    function syncButtons() {
      buttons.forEach((b, i) => {
        b.toggleAttribute('data-active', i === activeIndex);
        b.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        // Un solo tab en el orden de tabulacion: dentro del tablist se navega
        // con flechas, que es lo que espera un lector de pantalla.
        b.tabIndex = i === activeIndex ? 0 : -1;
      });
    }

    function boxOf(el: HTMLElement) {
      return {
        left: el.offsetLeft,
        right: el.offsetLeft + el.offsetWidth,
        top: el.offsetTop,
        height: el.offsetHeight,
      };
    }

    function renderIndicator() {
      gsap.set(indicator, { x: pos.left, width: pos.right - pos.left });
    }

    function placeIndicator(index: number) {
      const target = boxOf(buttons[index]);
      pos.left = target.left;
      pos.right = target.right;
      gsap.killTweensOf(pos);
      gsap.killTweensOf(indicator);
      gsap.set(indicator, { scaleY: 1, y: target.top, height: target.height });
      renderIndicator();
    }

    function syncPanelsHeight() {
      if (hasCard) gsap.set(panelsWrap, { height: panels[activeIndex].offsetHeight });
    }

    function swapInstant() {
      if (!hasCard) return;
      panels.forEach((p, i) => {
        gsap.killTweensOf(p);
        gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0, x: 0 });
        p.toggleAttribute('data-active', i === activeIndex);
      });
      gsap.set(card, { scaleX: 1, scaleY: 1, x: 0 });
      syncPanelsHeight();
    }

    function transitionCard(prevIndex: number, movingRight: boolean) {
      if (!hasCard) return;
      const dir = movingRight ? 1 : -1;
      const incoming = panels[activeIndex];
      const outgoing = panels[prevIndex];
      if (!incoming || !outgoing) return;

      // Cualquier panel que quedara a medias de una conmutacion anterior vuelve
      // a su sitio: sin esto, pulsar rapido deja paneles flotando a media opacidad.
      panels.forEach((p) => {
        if (p !== incoming && p !== outgoing) {
          gsap.killTweensOf(p);
          gsap.set(p, { autoAlpha: 0, x: 0 });
          p.removeAttribute('data-active');
        }
      });
      incoming.setAttribute('data-active', '');
      outgoing.removeAttribute('data-active');

      gsap.killTweensOf([card, panelsWrap, incoming, outgoing]);
      gsap.set(card, { transformOrigin: '50% 50%' });
      const targetHeight = incoming.offsetHeight;

      gsap
        .timeline()
        .to(card, { scaleX: 0.96, scaleY: 1.02, x: dir * 10, duration: motion.cardSquash, ease: 'power2.out' }, 0)
        .to(outgoing, { x: dir * -35, autoAlpha: 0, duration: motion.settle, ease: 'power2.out' }, 0)
        .to(panelsWrap, { height: targetHeight, duration: motion.travel, ease: 'power2.inOut' }, 0.1)
        .fromTo(
          incoming,
          { x: dir * 35, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: motion.travel, ease: 'power2.out' },
          motion.cardSquash,
        )
        .to(card, { scaleX: 1, scaleY: 1, x: 0, duration: motion.cardInflate, ease: motion.spring }, motion.cardSquash)
        .set(outgoing, { x: 0 });
    }

    function goTo(index: number) {
      if (index === activeIndex) return;
      const prevIndex = activeIndex;
      const movingRight = index > activeIndex;
      activeIndex = index;
      syncButtons();

      if (reduced.matches) {
        placeIndicator(index);
        swapInstant();
        return;
      }

      transitionCard(prevIndex, movingRight);

      const target = boxOf(buttons[index]);
      gsap.killTweensOf(pos);
      gsap.killTweensOf(indicator);

      // El sobrepaso se recorta contra el propio nav: puede invadir su padding
      // pero nunca salirse, que es lo que delataria el truco.
      const hDir = target.left === pos.left ? (movingRight ? 1 : -1) : target.left > pos.left ? 1 : -1;
      const distance = Math.abs(target.left - pos.left);
      let overshoot = gsap.utils.clamp(6, 16, distance * 0.08) * hDir;
      overshoot =
        hDir > 0
          ? Math.min(overshoot, nav!.clientWidth - target.right)
          : Math.max(overshoot, -target.left);

      gsap.set(indicator, { transformOrigin: '50% 50%' });
      gsap.to(indicator, { y: target.top, height: target.height, duration: motion.travel, ease: 'power3.out' });
      gsap
        .timeline()
        .to(pos, {
          left: target.left + overshoot,
          right: target.right + overshoot,
          duration: motion.travel,
          ease: 'power3.out',
          onUpdate: renderIndicator,
        })
        .to(pos, {
          left: target.left,
          right: target.right,
          duration: motion.settle,
          ease: 'power2.inOut',
          onUpdate: renderIndicator,
        });
      gsap
        .timeline()
        .to(indicator, { scaleY: 0.78, duration: motion.squashDown, ease: 'power2.out' })
        .to(indicator, { scaleY: 1, duration: motion.squashBack, ease: motion.spring });
    }

    function moveGhost(button: HTMLElement) {
      if (!ghost || reduced.matches) return;
      const target = boxOf(button);
      const box = {
        x: target.left,
        y: target.top,
        width: target.right - target.left,
        height: target.height,
      };
      if (!ghostVisible) {
        // Aparece EN SITIO la primera vez: deslizarlo desde una posicion vieja
        // se lee como un fantasma que venia de otro sitio.
        ghostVisible = true;
        gsap.killTweensOf(ghost);
        gsap.set(ghost, box);
        gsap.to(ghost, { autoAlpha: 1, duration: motion.settle, ease: 'power2.out' });
      } else {
        gsap.to(ghost, { ...box, autoAlpha: 1, duration: motion.travel, ease: 'power3.out' });
      }
    }

    function hideGhost() {
      if (!ghost) return;
      ghostVisible = false;
      gsap.to(ghost, { autoAlpha: 0, duration: motion.squashDown, ease: 'power1.out' });
    }

    function refreshLayout() {
      const rows = new Set(buttons.map((b) => b.offsetTop));
      nav!.toggleAttribute('data-wrapped', rows.size > 1);
      placeIndicator(activeIndex);
      syncPanelsHeight();
    }

    const listeners: Array<() => void> = [];
    buttons.forEach((button, index) => {
      const onClick = () => goTo(index);
      const onEnter = () => moveGhost(button);
      button.addEventListener('click', onClick);
      button.addEventListener('mouseenter', onEnter);
      listeners.push(() => {
        button.removeEventListener('click', onClick);
        button.removeEventListener('mouseenter', onEnter);
      });
    });

    const onLeave = () => hideGhost();
    nav.addEventListener('mouseleave', onLeave);
    listeners.push(() => nav.removeEventListener('mouseleave', onLeave));

    const onKeydown = (event: KeyboardEvent) => {
      let next: number | null = null;
      if (event.key === 'ArrowRight') next = Math.min(buttons.length - 1, activeIndex + 1);
      if (event.key === 'ArrowLeft') next = Math.max(0, activeIndex - 1);
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === null) return;
      event.preventDefault();
      if (next !== activeIndex) {
        goTo(next);
        buttons[next].focus();
      }
    };
    nav.addEventListener('keydown', onKeydown);
    listeners.push(() => nav.removeEventListener('keydown', onKeydown));

    const onResize = () => refreshLayout();
    window.addEventListener('resize', onResize);
    listeners.push(() => window.removeEventListener('resize', onResize));

    // La medida del indicador depende de la fuente real: medirla antes de que
    // cargue Grift deja la pastilla del ancho equivocado.
    const fonts = (document as any).fonts;
    if (fonts?.ready?.then) fonts.ready.then(refreshLayout);

    if (ghost) gsap.set(ghost, { autoAlpha: 0 });
    panels.forEach((p, i) => gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0 }));

    syncButtons();
    refreshLayout();

    cleanups.push(() => listeners.forEach((fn) => fn()));
  });

  return () => cleanups.forEach((fn) => fn());
}
