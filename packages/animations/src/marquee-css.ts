// CSS Marquee — tira infinita movida por keyframes CSS, sin GSAP.
//
// DOM contract: [data-marquee] sobre la raiz .marquee
//   data-speed="75"   pixeles por segundo
//
// Anatomia: .marquee__list (una o varias; el modulo clona las que falten)
//
// La velocidad se declara en px/s y NO en segundos por vuelta a proposito: dos
// tiras con distinto numero de items y la misma duracion se mueven a
// velocidades distintas, y puestas en la misma pagina el desajuste canta. Lo
// que el ojo compara es la velocidad; la duracion se deriva del ancho.
//
// El movimiento es la animacion CSS de .marquee__list. Este modulo solo aporta
// lo que CSS no puede: medir para fijar --marquee-duration, clonar la lista
// hasta tapar el carril, y pausar fuera de vista con --marquee-state.

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = ['data-marquee', 'data-marquee-list', 'data-speed'] as const;

/**
 * Fallback por clase, solo para consumidores que no marcan la lista.
 *
 * El hook real es [data-marquee-list]. Buscar por clase NO sirve en el canal de
 * Webflow: ahi todo viaja con prefijo ds-, asi que .marquee__list no existe y
 * el modulo salia sin montar nada — la tira se quedaba con el default del CSS
 * (30s fijos, una sola lista) y por eso corria rapido y dejaba hueco.
 */
export const REQUIRED_ANATOMY = ['[data-marquee-list]'] as const;

export const GSAP_PLUGINS = [] as const;

/** Wave-1 Webflow: behaviors must not write canonical BEM classes. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

/** px/s. La tira de logos de Osmo va a este ritmo y es el que Karen valido. */
const DEFAULT_SPEED = 75;

function getNumberAttr(el: Element, name: string, fallback: number): number {
  const value = parseFloat(el.getAttribute(name) || '');
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * Listas de autor: las copias que pone el modulo se excluyen del recuento.
 *
 * Por atributo y no por clase: el canal de Webflow prefija todo con ds-, asi
 * que .marquee__list no existe ahi. La clase queda de respaldo para el markup
 * que aun no marca la lista.
 */
function authoredLists(root: HTMLElement): HTMLElement[] {
  const marked = root.querySelectorAll<HTMLElement>('[data-marquee-list]');
  const found = marked.length ? marked : root.querySelectorAll<HTMLElement>('.marquee__list');
  return Array.from(found).filter((list) => list.dataset.marqueeClone === undefined);
}

export function initCssMarquee(): CleanupFn {
  if (typeof document === 'undefined') return () => {};

  // Una tira infinita corriendo es exactamente lo que reduced-motion pide
  // evitar. Sin init queda estatica y con UNA sola lista, que es la lectura
  // correcta: el CSS ya la pausa, y sin clonar no hay contenido repetido.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const cleanups: CleanupFn[] = [];

  function setup(root: HTMLElement) {
    if (root.dataset.motionExempt !== undefined) return;
    if (root.dataset.marquee === 'initialized') return;
    // El modo draggable desplaza __collection con GSAP sobre este mismo eje:
    // con los dos vivos la tira avanza al doble y el wrap deja de cuadrar.
    if (root.hasAttribute('data-draggable-marquee')) return;

    const lists = authoredLists(root);
    const first = lists[0];
    if (!first) return;

    const clones: HTMLElement[] = [];
    const speed = getNumberAttr(root, 'data-speed', DEFAULT_SPEED);

    /**
     * Idempotente: mide, fija la duracion y anade las copias que falten.
     *
     * Se vuelve a llamar en cada resize porque las dos cosas que calcula
     * dependen del ancho. Y mientras la seccion este oculta —el switch de
     * seccion por viewport del sitio, un tab, un acordeon— no hay caja que
     * medir: salir sin hacer nada deja que el ResizeObserver reintente cuando
     * la haya, en vez de fijar una duracion de 0s para siempre.
     */
    function apply() {
      const railWidth = root.getBoundingClientRect().width;
      const listWidth = first.scrollWidth || first.getBoundingClientRect().width;
      if (!railWidth || !listWidth) return;

      // La vuelta del loop mide UNA lista (el keyframe es translateX(-100%)):
      // las copias solo tapan el hueco, no alargan el recorrido.
      root.style.setProperty('--marquee-duration', `${listWidth / speed}s`);

      // Con una sola copia queda hueco al saltar si la lista es mas angosta
      // que el carril: hacen falta tantas como quepan mas una.
      const needed = Math.ceil((railWidth + listWidth) / listWidth);
      for (let i = lists.length + clones.length; i < needed; i += 1) {
        const clone = first.cloneNode(true) as HTMLElement;
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.marqueeClone = '';
        root.appendChild(clone);
        clones.push(clone);
      }
    }

    apply();

    if (typeof ResizeObserver !== 'undefined') {
      // Anadir copias no cambia el ancho de la raiz (width:100% + overflow
      // hidden) ni el de la lista de autor, asi que el observer no se
      // realimenta.
      const resizeObserver = new ResizeObserver(apply);
      resizeObserver.observe(root);
      // La LISTA tambien, y esto no es redundante: sus imagenes pueden llegar
      // despues (loading="lazy" es el default de Webflow), y hasta entonces
      // mide de menos. Vigilar solo la raiz no sirve porque su ancho no cambia
      // cuando crece el contenido: la duracion y el numero de copias se
      // quedarian calculados sobre una medida provisional, y eso se ve como
      // huecos en la tira.
      resizeObserver.observe(first);
      cleanups.push(() => resizeObserver.disconnect());
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const viewObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            root.style.setProperty('--marquee-state', entry.isIntersecting ? 'running' : 'paused');
          });
        },
        { threshold: 0 },
      );
      viewObserver.observe(root);
      cleanups.push(() => viewObserver.disconnect());
    }

    root.dataset.marquee = 'initialized';

    cleanups.push(() => {
      clones.forEach((clone) => clone.remove());
      clones.length = 0;
      root.style.removeProperty('--marquee-duration');
      root.style.removeProperty('--marquee-state');
      delete root.dataset.marquee;
    });
  }

  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach(setup);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups.length = 0;
  };
}
