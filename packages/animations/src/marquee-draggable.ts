// Draggable Marquee (Directional)
// DOM contract: [data-draggable-marquee] on container
// Config via data attributes:
//   data-direction="left|right"
//   data-duration="20"       (seconds for one loop)
//   data-multiplier="35"     (max drag speed multiplier)
//   data-sensitivity="0.01"  (velocity to timescale ratio)
//   data-autoplay="false"    (sin avance propio: solo se mueve al arrastrar)
//   data-lag="3"             (arrastre-retardo de los items; 0 = sin retardo)
//   data-snap="auto"         (imanta a limite de item: "true" | "auto" | "false")
//
// Controles opcionales (prev/next), dentro del wrapper:
//   [data-draggable-marquee-control="prev"|"next"]
//
// Cada pulsacion avanza UN item exacto desde el limite mas cercano, no desde la
// posicion cruda: pulsar a mitad de un arrastre no debe acumular medio item de
// desfase. La tira es un loop infinito, asi que los controles nunca se
// deshabilitan — no hay primer ni ultimo item que alcanzar.
//
// El modulo NO inyecta aria-label: este DS sirve un sitio en tres idiomas y una
// etiqueta en español sobre la home inglesa es peor que ninguna. La etiqueta la
// pone el consumidor (el layout la expone como variable).
//
// Sobre data-snap: una card asomando por el borde COMUNICA que hay mas, y en
// pantallas anchas es deseable. Deja de serlo cuando una card ocupa casi todo
// el ancho: ahi el recorte se lee como un fallo de maquetacion, no como una
// pista. Por eso "auto" no mira breakpoints sino cuantas caben — si entran
// menos de dos, imanta. El DS no publica breakpoints como tokens a proposito.
// Solo aplica sin autoplay: imantar una tira que avanza sola es contradictorio.
//
// Sobre data-autoplay: la velocidad de REPOSO del loop es lo unico que cambia.
// Con autoplay la tira descansa a ±1 y avanza sola; sin autoplay descansa a 0,
// asi que arranca quieta y vuelve a quedarse quieta despues de cada arrastre.
// El resto del gesto (impulso, tope por multiplier, inercia) es identico.
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
  'data-autoplay',
  'data-lag',
  'data-snap',
  'data-draggable-marquee-control',
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
    // Velocidad de reposo: ±1 avanza sola, 0 deja la tira quieta hasta que la
    // arrastren. Es el unico valor que separa un marquee de un carrusel a mano.
    const restingScale =
      (wrapper.getAttribute('data-autoplay') || 'true').toLowerCase() === 'false'
        ? 0
        : baseDirection;
    const timeScale = { value: restingScale };

    if (baseDirection < 0) marqueeLoop.progress(1);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
      // En reposo sin autoplay el valor es 0, que no es un sentido: se conserva
      // el ultimo, porque data-direction existe para que el CSS pueda reaccionar
      // a hacia donde va la tira y no debe parpadear a "left" al detenerse.
      if (timeScale.value !== 0) {
        wrapper.setAttribute('data-direction', timeScale.value < 0 ? 'right' : 'left');
      }
    }

    applyTimeScale();

    // Imantado a limite de item. La distancia entre inicios de item (pitch) sale
    // de listWidth/n en vez de medir un item: los clones ya estan en el DOM y
    // medir "el primero" daria el mismo numero con mas trabajo y mas supuestos.
    const snapMode = (wrapper.getAttribute('data-snap') || 'false').toLowerCase();
    const itemCount = list.children.length;
    const pitch = itemCount > 0 ? listWidth / itemCount : 0;
    const itemsThatFit = pitch > 0 ? wrapperWidth / pitch : Infinity;
    const shouldSnap =
      restingScale === 0 &&
      pitch > 0 &&
      (snapMode === 'true' || (snapMode === 'auto' && itemsThatFit < 2));

    // El loop mapea progress 0..1 sobre x 0..-listWidth, asi que cualquier
    // correccion de posicion se hace moviendo progress y no x: la x la escribe
    // el propio tween en cada frame, y escribirla por fuera duraria un frame.
    function glideToX(targetX: number, duration: number, onComplete?: () => void) {
      const current = marqueeLoop.progress();
      let target = (((-targetX / listWidth) % 1) + 1) % 1;
      // Elegir el equivalente mas cercano: sin esto, corregir cerca de la
      // costura 0/1 hace dar la vuelta entera a la tira.
      if (target - current > 0.5) target -= 1;
      else if (current - target > 0.5) target += 1;
      gsap.to(marqueeLoop, {
        progress: target,
        duration,
        ease: 'power2.out',
        overwrite: true,
        onComplete,
      });
    }

    function nearestItemX() {
      const x = gsap.getProperty(collection, 'x') as number;
      return Math.round(x / pitch) * pitch;
    }

    function snapToNearestItem() {
      glideToX(nearestItemX(), 0.45);
    }

    function stepTo(direction: 'prev' | 'next') {
      if (!pitch) return;
      // Un paso es una POSICION, no una velocidad: se congela el avance
      // mientras dura para que el loop no siga sumando por debajo, y se
      // restituye al terminar. Sin esto, con autoplay el paso queda corto.
      gsap.killTweensOf(timeScale);
      timeScale.value = 0;
      applyTimeScale();
      // Desde el limite mas cercano y no desde la x cruda: pulsar a mitad de un
      // arrastre no debe acumular medio item de desfase.
      const base = nearestItemX();
      glideToX(direction === 'next' ? base - pitch : base + pitch, 0.5, () => {
        timeScale.value = restingScale;
        applyTimeScale();
      });
    }

    const controlCleanups: Array<() => void> = [];
    wrapper
      .querySelectorAll<HTMLElement>('[data-draggable-marquee-control]')
      .forEach((btn) => {
        const dir =
          btn.getAttribute('data-draggable-marquee-control') === 'prev' ? 'prev' : 'next';
        const onClick = () => stepTo(dir);
        btn.addEventListener('click', onClick);
        controlCleanups.push(() => btn.removeEventListener('click', onClick));
      });

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

        // Sin autoplay la tira vuelve a quedarse quieta; con autoplay retoma el
        // sentido que le imprimio el ultimo arrastre.
        const restingDir = restingScale === 0 ? 0 : velocityTS < 0 ? -1 : 1;

        // El impulso entra rapido y la deceleracion sale con power3: la cola
        // larga de esa curva es lo que se lee como peso. Con la ease por
        // defecto (power1) la tira se frena de golpe y parece ligera.
        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocityTS, duration: 0.1, overwrite: true })
          .to(timeScale, {
            value: restingDir,
            duration: 1.2,
            ease: 'power3.out',
            onComplete: () => {
              if (shouldSnap) snapToNearestItem();
            },
          });
      },
    });

    // Arrastre-retardo: cada item se queda atras en proporcion a la velocidad
    // del frame y vuelve a su sitio con power3.out. El contenido "pesa" y
    // alcanza al contenedor, en vez de ir clavado a el.
    //
    // El wrap de GSAP devuelve x al origen de golpe, y ese salto vale el ancho
    // entero de la lista: sin descartarlo, cada vuelta dispararia un tiron.
    const lag = getNumberAttr(wrapper, 'data-lag', 0);
    let removeLagTicker: (() => void) | null = null;

    if (lag > 0) {
      // Por estructura y no por clase: el canal de Webflow renombra
      // .marquee__item a .ds-marquee__item, y este modulo tiene que seguir
      // siendo indiferente al prefijo (es lo que documenta REQUIRED_ANATOMY).
      const items = collection.querySelectorAll<HTMLElement>(
        '[data-draggable-marquee-list] > *',
      );
      if (items.length) {
        const setLag = gsap.quickTo(items, 'xPercent', { duration: 0.7, ease: 'power3.out' });
        let lastX = gsap.getProperty(collection, 'x') as number;
        const onTick = () => {
          const x = gsap.getProperty(collection, 'x') as number;
          const delta = x - lastX;
          lastX = x;
          if (Math.abs(delta) > listWidth / 2) return; // salto de wrap, no movimiento
          setLag(gsap.utils.clamp(-24, 24, -delta * lag));
        };
        gsap.ticker.add(onTick);
        removeLagTicker = () => gsap.ticker.remove(onTick);
      }
    }

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
      controlCleanups.forEach((fn) => fn());
      removeLagTicker?.();
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
