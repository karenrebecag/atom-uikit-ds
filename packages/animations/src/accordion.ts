// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que accordion-morph/marquee-draggable/progress-nav.

/**
 * Accordion — disclosure de altura por CSS grid, sin dependencias.
 *
 * Hermano de bajo coste de accordion-morph: mismo gesto, cero gsap. La altura
 * la anima el CSS ya publicado (grid-template-rows 0fr -> 1fr sobre
 * .ds-accordion__content-wrapper); este modulo solo decide QUIEN esta abierto.
 *
 * EL ESTADO VIVE EN aria-expanded, y no en una clase de estado. Un accordion
 * necesita aria-expanded de todas formas para ser accesible, asi que una clase
 * paralela solo anadiria una segunda fuente de verdad que se puede
 * desincronizar. El CSS lee ese mismo atributo. Ademas los behaviors del DS
 * tienen prohibido escribir clases BEM canonicas — son del canal de pintura,
 * ver STATES_WRITTEN_AS_CLASSES.
 *
 * UN listener por raiz, delegado. Con un listener por trigger, los items que
 * el CMS de Webflow inyecta despues de initAccordion nacen muertos.
 *
 * Contract:
 *   [data-accordion]                 raiz
 *   [data-accordion-single="true"]   abrir uno cierra a sus hermanos
 *   [data-accordion-item]            cada fila
 *   [data-accordion-trigger]         el disparador de la pregunta
 *   [data-accordion-panel]           el wrapper que colapsa
 *   [data-accordion-open]            en un item, nace abierto
 *
 * FUNCIONAL, no decorativo: reduced-motion quita la transicion (ya lo hace el
 * CSS) pero NUNCA el toggle.
 *
 * Requires: nada
 * Respects: prefers-reduced-motion (via CSS)
 */

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = [
  'data-accordion',
  'data-accordion-single',
  'data-accordion-item',
  'data-accordion-trigger',
  'data-accordion-panel',
  'data-accordion-open',
  'data-accordion-init',
] as const;

export const REQUIRED_ANATOMY = [] as const;

export const GSAP_PLUGINS = [] as const;

/** Wave-1 Webflow: behaviors must not write canonical BEM classes. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

let uid = 0;

/**
 * El disparador se busca por HOOK y no por etiqueta.
 *
 * El constructor de Webflow convierte <button> en <a> al pegar markup, y el
 * panel del Designer no siempre deja elegir la etiqueta. Con una busqueda por
 * 'button' el modulo no encuentra nada y falla EN SILENCIO. Mismo motivo que
 * en tabs-steps.
 */
function triggerOf(item: HTMLElement): HTMLElement | null {
  return item.querySelector<HTMLElement>('[data-accordion-trigger]');
}

function panelOf(item: HTMLElement): HTMLElement | null {
  return item.querySelector<HTMLElement>('[data-accordion-panel]');
}

/**
 * Un <button> y un <a href> ya reciben foco y disparan clic con Enter/Espacio.
 * Un <div> no: sin esto, el accordion solo existe para quien usa raton.
 */
function ensureFocusable(trigger: HTMLElement): boolean {
  const tag = trigger.tagName.toLowerCase();
  if (tag === 'button') return false;
  if (tag === 'a' && trigger.hasAttribute('href')) return false;

  if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0');
  if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'button');
  return true;
}

function setOpen(item: HTMLElement, open: boolean): void {
  const trigger = triggerOf(item);
  const panel = panelOf(item);
  if (!trigger) return;

  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  // aria-hidden y no `inert`: el panel colapsado sigue en el flujo con altura
  // 0fr, y `inert` sobre un contenedor que la transicion vuelve a abrir deja
  // el foco atrapado fuera durante los 300ms del grid.
  if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function isOpen(item: HTMLElement): boolean {
  return triggerOf(item)?.getAttribute('aria-expanded') === 'true';
}

/**
 * Marca de raiz ya enganchada.
 *
 * Existe porque llamar dos veces a initAccordion deja DOS listeners sobre la
 * misma raiz: el primero abre, el segundo vuelve a cerrar, y el accordion
 * parece muerto. Y pasa con facilidad — el host puede inicializar a nivel sitio
 * Y a nivel pagina sin darse cuenta. Un behavior del DS tiene que aguantar que
 * lo llamen de mas.
 *
 * Va como atributo y no como WeakSet de modulo para que aguante tambien dos
 * cargas del bundle, que es un caso real: una pagina puede traer el <script>
 * en su footer y ademas heredarlo de un embed global.
 */
const BOUND = 'data-accordion-init';

export function initAccordion(): CleanupFn {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-accordion]')).filter(
    (root) => !root.hasAttribute(BOUND),
  );
  const cleanups: CleanupFn[] = [];

  roots.forEach((root) => {
    root.setAttribute(BOUND, '');
    const single = root.getAttribute('data-accordion-single') === 'true';
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-accordion-item]'));
    const patched: HTMLElement[] = [];

    items.forEach((item) => {
      const trigger = triggerOf(item);
      const panel = panelOf(item);
      if (!trigger) return;

      if (ensureFocusable(trigger)) patched.push(trigger);

      // Enlaza trigger y panel por id para que un lector de pantalla anuncie
      // que la region pertenece a esa pregunta. Se generan solo si faltan:
      // un id escrito a mano en el Designer manda sobre el nuestro.
      if (panel) {
        uid += 1;
        if (!panel.id) panel.id = `ds-accordion-panel-${uid}`;
        if (!trigger.id) trigger.id = `ds-accordion-trigger-${uid}`;
        trigger.setAttribute('aria-controls', panel.id);
        if (!panel.hasAttribute('role')) panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', trigger.id);
      }

      setOpen(item, item.hasAttribute('data-accordion-open'));
    });

    const onClick = (event: Event) => {
      const target = event.target as Element | null;
      const trigger = target?.closest<HTMLElement>('[data-accordion-trigger]');
      if (!trigger || !root.contains(trigger)) return;

      const item = trigger.closest<HTMLElement>('[data-accordion-item]');
      if (!item) return;

      // Un <a> convertido por Webflow navegaria a "#" y saltaria el scroll.
      event.preventDefault();

      const willOpen = !isOpen(item);
      setOpen(item, willOpen);

      if (single && willOpen) {
        root.querySelectorAll<HTMLElement>('[data-accordion-item]').forEach((sibling) => {
          if (sibling !== item && isOpen(sibling)) setOpen(sibling, false);
        });
      }
    };

    // Espacio no dispara clic en un <div role="button">; Enter tampoco.
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const target = event.target as Element | null;
      const trigger = target?.closest<HTMLElement>('[data-accordion-trigger]');
      if (!trigger || !patched.includes(trigger)) return;

      event.preventDefault();
      trigger.click();
    };

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeydown);

    cleanups.push(() => {
      root.removeAttribute(BOUND);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeydown);
      patched.forEach((trigger) => {
        trigger.removeAttribute('tabindex');
        trigger.removeAttribute('role');
      });
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
