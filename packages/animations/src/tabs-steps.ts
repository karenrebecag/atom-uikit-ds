// Tabs Steps — pasos numerados con visual por paso, avance automatico y barra
// de progreso.
//
// DOM contract:
//   [data-tabs-steps]                    raiz
//   [data-tabs-steps-item]               un paso
//   [data-tabs-steps-trigger]            el <button> que lo abre
//   [data-tabs-steps-panel]              lo que colapsa dentro del paso
//   [data-tabs-steps-progress]           la barra que se rellena
//   [data-tabs-steps-visual]             el visual del paso, HERMANO del item
//   [data-tabs-steps-autoplay="false"]   apaga el avance solo
//   [data-tabs-steps-duration="5000"]    ms por paso
//
// El emparejado es POR ORDEN: el n-esimo item con el n-esimo visual. No hay
// atributo de indice que mantener sincronizado, y como la estructura es plana
// el orden del DOM ya es el orden visual en movil.
//
// Es un ACORDEON, no un tablist: el disparador es un <button> con
// aria-expanded, porque en movil el visual cae dentro del paso y lo que hay es
// un desplegable. El estado va en aria-expanded y data-active, nunca en clases
// BEM — esas son del canal de pintura.
//
// Requires: gsap
// Respects: prefers-reduced-motion, data-motion-exempt

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = [
  'data-tabs-steps',
  'data-tabs-steps-item',
  'data-tabs-steps-trigger',
  'data-tabs-steps-panel',
  'data-tabs-steps-progress',
  'data-tabs-steps-visual',
  'data-tabs-steps-autoplay',
  'data-tabs-steps-duration',
] as const;

export const REQUIRED_ANATOMY = [] as const;

export const GSAP_PLUGINS = [] as const;

/** Wave-1 Webflow: behaviors must not write canonical BEM classes. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

declare const gsap: any;

const DEFAULT_DURATION = 5000;

/**
 * El disparador se busca por HOOK y no por etiqueta.
 *
 * El constructor de Webflow convierte <button> en <a> al pegar markup. Con una
 * busqueda por 'button' el modulo no encontraba nada y fallaba EN SILENCIO: los
 * paneles animaban y la barra corria, pero no habia listener de clic ni estado
 * aria. Por hook da igual en que acabe convertido.
 */
function triggerOf(item: HTMLElement): HTMLElement | null {
  return (
    item.querySelector<HTMLElement>('[data-tabs-steps-trigger]') ??
    item.querySelector<HTMLElement>('button')
  );
}

function activate(item: HTMLElement, visual: HTMLElement | undefined, on: boolean) {
  const trigger = triggerOf(item);
  trigger?.setAttribute('aria-expanded', on ? 'true' : 'false');
  if (on) {
    item.dataset.active = '';
    if (visual) visual.dataset.active = '';
  } else {
    delete item.dataset.active;
    if (visual) delete visual.dataset.active;
  }
}

export function initTabsSteps(): CleanupFn {
  if (typeof document === 'undefined') return () => {};

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-tabs-steps]')).filter(
    (root) => root.dataset.motionExempt === undefined,
  );
  if (!roots.length) return () => {};

  const reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  const cleanups: CleanupFn[] = [];

  roots.forEach((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-tabs-steps-item]'));
    const visuals = Array.from(root.querySelectorAll<HTMLElement>('[data-tabs-steps-visual]'));
    if (!items.length) return;

    const autoplay = !reduced && root.getAttribute('data-tabs-steps-autoplay') !== 'false';
    const duration =
      parseInt(root.getAttribute('data-tabs-steps-duration') || '', 10) || DEFAULT_DURATION;

    let current = -1;
    let progressTween: any = null;
    let switching = false;

    function panelOf(index: number) {
      return items[index]?.querySelector<HTMLElement>('[data-tabs-steps-panel]') ?? null;
    }

    function startProgress(index: number) {
      if (!autoplay || !hasGsap) return;
      const bar = items[index].querySelector<HTMLElement>('[data-tabs-steps-progress]');
      if (!bar) return;
      progressTween?.kill();
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
      progressTween = gsap.to(bar, {
        scaleX: 1,
        duration: duration / 1000,
        ease: 'none',
        onComplete() {
          // Solo encadena si nadie interrumpio: un clic durante el ultimo frame
          // llevaria a dos cambios seguidos.
          if (!switching) go((index + 1) % items.length);
        },
      });
    }

    function go(index: number) {
      if (index === current) return;
      switching = true;
      progressTween?.kill();

      const outgoing = current;
      const outgoingPanel = outgoing >= 0 ? panelOf(outgoing) : null;
      const incomingPanel = panelOf(index);

      if (outgoing >= 0) activate(items[outgoing], visuals[outgoing], false);
      activate(items[index], visuals[index], true);
      // El indice activo se actualiza AQUI, no al terminar la animacion. El
      // estado en el DOM (aria-expanded, data-active) ya cambio de forma
      // sincrona; si el indice esperase al onComplete, un clic durante la
      // transicion veria current todavia en el paso anterior y no lo cerraria
      // — quedarian dos pasos abiertos a la vez.
      current = index;

      const outgoingBar =
        outgoing >= 0
          ? items[outgoing].querySelector<HTMLElement>('[data-tabs-steps-progress]')
          : null;

      if (reduced || !hasGsap) {
        if (outgoingPanel) outgoingPanel.style.height = '0px';
        if (incomingPanel) incomingPanel.style.height = 'auto';
        if (outgoingBar) outgoingBar.style.transform = 'scaleX(0)';
        switching = false;
        return;
      }

      const timeline = gsap.timeline({
        defaults: { duration: 0.45, ease: 'power3.out' },
        onComplete() {
          switching = false;
          startProgress(index);
        },
      });

      if (outgoingPanel) timeline.to(outgoingPanel, { height: 0 }, 0);
      // La barra saliente se vacia desde el lado contrario: retrocede en vez de
      // desaparecer, que es lo que la lee como "este paso se cerro".
      if (outgoingBar) {
        timeline.set(outgoingBar, { transformOrigin: 'right center' }, 0);
        timeline.to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0);
      }
      if (incomingPanel) timeline.fromTo(incomingPanel, { height: 0 }, { height: 'auto' }, 0);
    }

    items.forEach((item, index) => {
      const trigger = triggerOf(item);
      const panel = item.querySelector<HTMLElement>('[data-tabs-steps-panel]');
      if (panel) panel.style.height = '0px';
      activate(item, visuals[index], false);

      if (!trigger) {
        // Sin disparador el paso queda inerte y la seccion PARECE funcionar,
        // porque el autoplay sigue pasando. Avisar es la diferencia entre un
        // fallo de dos minutos y uno de una tarde.
        window.console?.warn('[atom] tabs-steps: paso sin [data-tabs-steps-trigger]', item);
        return;
      }

      const onClick = (event: Event) => {
        // Si el constructor lo convirtio en <a href="#">, sin esto la pagina
        // salta al inicio antes de que se vea el cambio.
        event.preventDefault();
        if (index === current) return;
        go(index);
      };
      trigger.addEventListener('click', onClick);
      cleanups.push(() => trigger.removeEventListener('click', onClick));
    });

    go(0);

    cleanups.push(() => {
      progressTween?.kill();
      items.forEach((item, index) => {
        const panel = panelOf(index);
        if (panel) panel.style.removeProperty('height');
        activate(item, visuals[index], false);
      });
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups.length = 0;
  };
}
