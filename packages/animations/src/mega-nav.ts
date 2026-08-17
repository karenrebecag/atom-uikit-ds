// Mega nav — dropdown morfico con hover intent direccional (desktop) y
// slide-over por panel (movil <=991px, el limite tablet de scaling.css).
//
// Adaptado del mega-nav de ATOM a las convenciones del DS:
//   - Motion por tokens en runtime (--easing-osmo, --duration-300/--duration-200),
//     cero curvas/duraciones inventadas. Los micro-offsets de coreografia se
//     derivan como fracciones de esos tokens, asi reduced-motion los colapsa
//     a 0 gratis.
//   - El burger NO se anima aqui: el layout usa el atomo burger-icon con
//     data-menu-button, y este modulo solo alterna ese estado — el CSS de
//     menu-button.css hace burger↔X (nivel 0 del contrato de motion). No poner
//     data-menu-button-animate en el burger del mega-nav: initMenuButton
//     duplicaria el manejo del click.
//   - FUNCIONAL, no decorativo: un menu es navegacion. Con prefers-reduced-motion
//     o data-motion-exempt el menu SIGUE abriendo/cerrando, pero al corte
//     (duraciones 0) — mismo criterio que nav-autohide.
//
// DOM contract (todo por data-*, nunca por clase: el canal Webflow prefija
// las clases con `ds-` y un selector de clase encontraria 0 nodos):
//   [data-menu-wrap]          raiz <nav>; estado en data-menu-open="true|false"
//   [data-nav-list]           contenedor de items de barra
//   [data-nav-list-item]      cada item que escalona en movil
//   [data-dropdown-toggle=X]  trigger; abre el panel [data-nav-content=X].
//                             El estado visible viaja en aria-expanded (el
//                             caret de nav-link--dropdown rota por CSS).
//   [data-nav-content=X]      panel de contenido
//   [data-menu-fade]          elementos del panel que escalonan
//   [data-dropdown-wrapper]   area de hover intent
//   [data-dropdown-container] clip overflow:hidden; el morph anima su height
//   [data-dropdown-bg]        fondo absoluto del dropdown
//   [data-menu-backdrop]      OPCIONAL: overlay tras la barra. Un dropdown
//                             auto-contenido no lo lleva; sin el todo funciona.
//   [data-burger-toggle]      burger movil (atomo burger-icon + data-menu-button)
//   [data-mobile-back]        boton volver del slide-over movil
//   [data-menu-logo]          logo; se intercambia por el back en movil
//   [data-panel-state]        helper de Designer (forzar panel visible); el JS
//                             no lo consulta

// Tipos locales: este archivo se distribuye como artefacto del registry y debe
// ser auto-contenido en el consumidor.

/** F10b — Webflow/domContract single source; must cover data-* queried in this module. */
export const REQUIRED_HOOKS = [
  "data-menu-wrap",
  "data-nav-list",
  "data-nav-list-item",
  "data-dropdown-toggle",
  "data-nav-content",
  "data-menu-fade",
  "data-dropdown-wrapper",
  "data-dropdown-container",
  "data-dropdown-bg",
  "data-burger-toggle",
  "data-mobile-back",
  "data-menu-logo"
] as const;

export const REQUIRED_ANATOMY = [] as const;

export const GSAP_PLUGINS = [] as const;

export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

declare const gsap: any;
declare const CustomEase: any;

// Umbrales de intencion (interaccion, no motion): evitan abrir/cerrar por
// rozar el trigger con el cursor. Mismo rol que TOLERANCE en nav-autohide.
const HOVER_ENTER_MS = 120;
const HOVER_LEAVE_MS = 150;

// Limite movil: borde superior del rango tablet de foundation/scaling.css.
const MOBILE_MAX = 991;

/** Patron readMotionTokens de menu-button: fallbacks = valores actuales de los
 *  tokens, para DOMs donde la hoja del DS aun no cargo. */
function readMotionTokens(scope: Element): { ease: string; base: number; quick: number } {
  const styles = getComputedStyle(scope);
  const easeRaw = styles.getPropertyValue('--easing-osmo').trim();
  const bezier = /cubic-bezier\(([^)]+)\)/.exec(easeRaw)?.[1] ?? '0.625, 0.05, 0, 1';
  const parse = (name: string, fallback: number): number => {
    const raw = styles.getPropertyValue(name).trim();
    return raw ? parseFloat(raw) / (raw.endsWith('ms') ? 1000 : 1) : fallback;
  };
  return {
    ease: bezier,
    base: parse('--duration-300', 0.3),
    quick: parse('--duration-200', 0.2),
  };
}

export function initMegaNav(): CleanupFn {
  if (typeof gsap === 'undefined') return () => {};

  const found = document.querySelector<HTMLElement>('[data-menu-wrap]');
  if (!found) return () => {};
  const wrap: HTMLElement = found;

  const q = <T extends HTMLElement = HTMLElement>(sel: string) =>
    wrap.querySelector<T>(sel);
  const qa = <T extends HTMLElement = HTMLElement>(sel: string) =>
    Array.from(wrap.querySelectorAll<T>(sel));

  const navList = q('[data-nav-list]');
  const dropWrapper = q('[data-dropdown-wrapper]');
  const dropContainer = q('[data-dropdown-container]');
  const backdrop = q('[data-menu-backdrop]');
  const toggles = qa('[data-dropdown-toggle]');
  const panels = qa('[data-nav-content]');
  const burger = q('[data-burger-toggle]');
  const backBtn = q('[data-mobile-back]');
  const logo = q('[data-menu-logo]');
  // backdrop OPCIONAL: un dropdown auto-contenido no oscurece la pagina. Si el
  // markup no lo trae, el menu funciona igual (click fuera cierra por
  // handleDocClick).
  if (!navList || !dropWrapper || !dropContainer || !burger || !backBtn) {
    return () => {};
  }

  // Funcional: reduced/exempt NO desactivan el menu, colapsan sus duraciones.
  const reduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    wrap.dataset.motionExempt !== undefined;

  const motion = readMotionTokens(wrap);
  // Coreografia completa desde DOS tokens: entrada/morph = duration-300,
  // salida/backdrop/stagger-spread = duration-200. Reduced → todo 0.
  const IN = reduced ? 0 : motion.base;
  const OUT = reduced ? 0 : motion.quick;

  let easeName = 'power1.out'; // default de gsap si CustomEase no esta cargado
  if (typeof CustomEase !== 'undefined' && !reduced) {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('mega-nav-ease', motion.ease);
    easeName = 'mega-nav-ease';
  }

  const state = {
    isOpen: false,
    activePanel: null as string | null,
    isMobile: window.innerWidth <= MOBILE_MAX,
    mobileMenuOpen: false,
    mobilePanelActive: null as string | null,
    hoverTimer: 0,
    leaveTimer: 0,
    tl: null as any,
    mobileTl: null as any,
    mobilePanelTl: null as any,
  };

  const getPanel = (name: string | null) =>
    name ? wrap.querySelector<HTMLElement>(`[data-nav-content="${name}"]`) : null;
  const getToggle = (name: string | null) =>
    name ? wrap.querySelector<HTMLElement>(`[data-dropdown-toggle="${name}"]`) : null;
  const getFade = (el: HTMLElement) => el.querySelectorAll<HTMLElement>('[data-menu-fade]');
  const getNavItems = () => navList.querySelectorAll<HTMLElement>('[data-nav-list-item]');
  const getIndex = (name: string) => toggles.indexOf(getToggle(name) as HTMLElement);
  const spread = (n: number) => (n <= 1 || OUT === 0 ? 0 : { amount: OUT });

  function clearTimers(): void {
    clearTimeout(state.hoverTimer);
    clearTimeout(state.leaveTimer);
    state.hoverTimer = state.leaveTimer = 0;
  }

  function killTl(key: 'tl' | 'mobileTl' | 'mobilePanelTl'): void {
    if (state[key]) {
      state[key].kill();
      state[key] = null;
    }
  }

  function killDropdown(): void {
    killTl('tl');
    gsap.killTweensOf(dropContainer);
    if (backdrop) gsap.killTweensOf(backdrop);
    panels.forEach((p) => {
      gsap.killTweensOf(p);
      gsap.killTweensOf(getFade(p));
    });
  }

  function killMobile(): void {
    killTl('mobileTl');
    gsap.killTweensOf(navList);
  }

  function killMobilePanel(): void {
    killTl('mobilePanelTl');
    gsap.killTweensOf(getNavItems());
    gsap.killTweensOf([backBtn, logo]);
    panels.forEach((p) => {
      gsap.killTweensOf(p);
      gsap.killTweensOf(getFade(p));
    });
  }

  function resetToggles(): void {
    toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'));
  }

  function setBurger(open: boolean): void {
    // El CSS de menu-button.css anima burger↔X leyendo este atributo.
    burger!.setAttribute('data-menu-button', open ? 'close' : 'burger');
    burger!.setAttribute('aria-expanded', String(open));
  }

  function resetDesktop(): void {
    panels.forEach((p) => {
      gsap.set(p, { visibility: 'hidden', opacity: 0, pointerEvents: 'none', x: 0, y: 0, xPercent: 0 });
      gsap.set(getFade(p), { autoAlpha: 0, x: 0, y: 0, xPercent: 0 });
    });
    // Solo la altura vuelve a 0: width/x los refija la proxima apertura, y
    // animarlos al cerrar daria un colapso lateral que nadie pidio.
    gsap.set(dropContainer, { height: 0 });
    if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });
    wrap.setAttribute('data-menu-open', 'false');
    resetToggles();
  }

  function setupMobile(): void {
    panels.forEach((p) => {
      gsap.set(p, { autoAlpha: 0, xPercent: 0, visibility: 'visible', pointerEvents: 'none' });
      gsap.set(getFade(p), { xPercent: 20, autoAlpha: 0 });
    });
    gsap.set(getNavItems(), { xPercent: 0, y: 0, autoAlpha: 1 });
    gsap.set(navList, { autoAlpha: 0, x: 0 });
    gsap.set(backBtn, { autoAlpha: 0 });
    gsap.set(logo, { autoAlpha: 1 });
    // En movil el drop es full-screen por css: fuera el sizing de desktop.
    gsap.set(dropContainer, { clearProps: 'height,width,x,transform' });
    if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });
  }

  /** Mide el tamano NATURAL del panel. Funciona porque el panel es absolute y
   *  el css le da width:max-content: su caja no depende del ancho del clip,
   *  que es justo lo que estamos animando. */
  function measurePanel(name: string): { width: number; height: number } {
    const el = getPanel(name);
    if (!el) return { width: 0, height: 0 };
    const s = el.style;
    const cs = dropContainer!.style;
    const prev = [s.visibility, s.opacity, s.pointerEvents, s.width];
    const prevClipWidth = cs.width;
    // El clip lleva un width inline puesto por el tween anterior. Si el panel
    // heredara ESE ancho la medida seria circular (mide lo que ya medimos).
    // Se libera el clip y se fuerza max-content inline, que gana a cualquier
    // cascada del host — el canal Webflow reescribe selectores, no inline.
    cs.width = 'auto';
    Object.assign(s, {
      visibility: 'visible',
      opacity: '0',
      pointerEvents: 'none',
      width: 'max-content',
    });
    const r = el.getBoundingClientRect();
    [s.visibility, s.opacity, s.pointerEvents, s.width] = prev as [string, string, string, string];
    cs.width = prevClipWidth;
    return { width: r.width, height: r.height };
  }

  /** Desplazamiento del dropdown para quedar bajo su trigger, alineado por el
   *  borde izquierdo y sin desbordar la barra. */
  function panelX(name: string, width: number): number {
    const toggle = getToggle(name);
    if (!toggle) return 0;
    const t = toggle.getBoundingClientRect();
    const w = dropWrapper!.getBoundingClientRect();
    const raw = Math.max(0, t.left - w.left);
    const max = w.width - width;
    // Sin margen de clamp (panel tan ancho como la barra, o barra sin ancho
    // medible) manda la posicion del trigger: desbordar un poco es mejor que
    // pegar el panel al borde izquierdo, que es justo el sintoma que delata
    // una medida mala.
    return max > 0 ? Math.min(raw, max) : raw;
  }

  // ---- Desktop: abrir (primera apertura) ----
  function openDropdown(panelName: string): void {
    if (state.isOpen && state.activePanel === panelName) return;
    if (state.isOpen) return switchPanel(state.activePanel as string, panelName);

    const size = measurePanel(panelName);
    if (!size.height) return;

    killDropdown();
    resetDesktop();

    const el = getPanel(panelName) as HTMLElement;
    const fade = getFade(el);
    const toggle = getToggle(panelName);

    state.isOpen = true;
    state.activePanel = panelName;
    wrap.setAttribute('data-menu-open', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');

    // Ancho y posicion se fijan al instante: el clip esta a altura 0, o sea
    // invisible. Solo la altura entra animada.
    gsap.set(dropContainer, { height: 0, width: size.width, x: panelX(panelName, size.width) });

    const tl = gsap.timeline({
      defaults: { ease: easeName },
      // En reposo el panel debe quedar en LAYOUT PURO. Un transform residual
      // (de un tween interrumpido por hover rapido) desplaza los items dentro
      // del panel y se lee como aire muerto a un lado del contenido.
      onComplete() {
        if (fade.length) gsap.set(fade, { clearProps: 'transform' });
      },
    });
    state.tl = tl;
    if (backdrop) tl.to(backdrop, { autoAlpha: 1, duration: IN }, 0);
    tl.to(dropContainer, { height: size.height, duration: IN }, 0);
    tl.set(el, { visibility: 'visible', opacity: 1, pointerEvents: 'auto' }, OUT * 0.25);
    if (fade.length) {
      tl.fromTo(
        fade,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: IN, stagger: spread(fade.length) },
        OUT * 0.5,
      );
    }
  }

  // ---- Desktop: cerrar ----
  function closeDropdown(): void {
    if (!state.isOpen) return;
    const el = getPanel(state.activePanel);
    const fade = el ? getFade(el) : ([] as unknown as NodeListOf<HTMLElement>);

    killDropdown();

    const tl = gsap.timeline({
      defaults: { ease: easeName },
      onComplete() {
        state.isOpen = false;
        state.activePanel = null;
        state.tl = null;
        resetDesktop();
      },
    });
    state.tl = tl;
    if (fade.length) tl.to(fade, { autoAlpha: 0, y: -4, duration: OUT * 0.7 }, 0);
    tl.to(dropContainer, { height: 0, duration: OUT }, OUT * 0.25);
    if (backdrop) tl.to(backdrop, { autoAlpha: 0, duration: OUT }, 0);
    if (el) tl.set(el, { visibility: 'hidden', opacity: 0, pointerEvents: 'none' });
  }

  // ---- Desktop: cambio direccional de panel ----
  function switchPanel(fromName: string, toName: string): void {
    const dir = getIndex(toName) > getIndex(fromName) ? 1 : -1;
    const fromEl = getPanel(fromName);
    const toEl = getPanel(toName);
    if (!fromEl || !toEl) return;

    const fromFade = getFade(fromEl);
    const toFade = getFade(toEl);
    const to = measurePanel(toName);
    if (!to.height) return;
    const toX = panelX(toName, to.width);

    killDropdown();

    panels.forEach((p) => {
      gsap.set(p, { visibility: 'hidden', opacity: 0, pointerEvents: 'none', xPercent: 0 });
      gsap.set(getFade(p), { autoAlpha: 0, x: 0, y: 0 });
    });
    gsap.set(fromEl, { visibility: 'visible', opacity: 1, pointerEvents: 'auto', x: 0 });
    if (fromFade.length) gsap.set(fromFade, { autoAlpha: 1, x: 0, y: 0 });
    if (backdrop) gsap.set(backdrop, { autoAlpha: 1 });

    const toToggle = getToggle(toName);
    state.activePanel = toName;
    resetToggles();
    if (toToggle) toToggle.setAttribute('aria-expanded', 'true');

    const xOut = dir * -30;
    const xIn = dir * 30;
    const tl = gsap.timeline({
      defaults: { ease: easeName },
      onComplete() {
        if (toFade.length) gsap.set(toFade, { clearProps: 'transform' });
      },
    });
    state.tl = tl;

    if (fromFade.length) tl.to(fromFade, { autoAlpha: 0, x: xOut, duration: OUT }, 0);
    tl.set(fromEl, { visibility: 'hidden', opacity: 0, pointerEvents: 'none', xPercent: 0 }, OUT);
    if (fromFade.length) tl.set(fromFade, { x: 0 }, OUT);
    // El morph completo: la caja se desliza bajo el nuevo trigger y se
    // redimensiona a su contenido, mientras el contenido cruza en direccion.
    tl.to(dropContainer, { height: to.height, width: to.width, x: toX, duration: IN }, OUT * 0.25);
    tl.set(toEl, { visibility: 'visible', opacity: 1, pointerEvents: 'auto', xPercent: 0 }, OUT * 0.5);
    if (toFade.length) {
      tl.fromTo(
        toFade,
        { autoAlpha: 0, x: xIn },
        { autoAlpha: 1, x: 0, duration: IN, stagger: spread(toFade.length) },
        OUT * 0.6,
      );
    }
  }

  // ---- Desktop: hover intent ----
  function handleToggleEnter(e: Event): void {
    if (state.isMobile) return;
    const name = (e.currentTarget as HTMLElement).getAttribute('data-dropdown-toggle');
    if (!name) return;
    clearTimeout(state.leaveTimer);
    state.leaveTimer = 0;
    clearTimeout(state.hoverTimer);
    state.hoverTimer = window.setTimeout(() => openDropdown(name), state.isOpen ? 0 : HOVER_ENTER_MS);
  }

  function handleToggleLeave(): void {
    if (state.isMobile) return;
    clearTimeout(state.hoverTimer);
    state.hoverTimer = 0;
    state.leaveTimer = window.setTimeout(closeDropdown, HOVER_LEAVE_MS);
  }

  function handleWrapperEnter(): void {
    if (state.isMobile) return;
    clearTimeout(state.leaveTimer);
    state.leaveTimer = 0;
  }

  function handleWrapperLeave(): void {
    if (state.isMobile) return;
    state.leaveTimer = window.setTimeout(closeDropdown, HOVER_LEAVE_MS);
  }

  // ---- Cierres globales ----
  function handleEscape(e: KeyboardEvent): void {
    if (e.key !== 'Escape') return;
    if (state.isMobile) {
      if (state.mobilePanelActive) closeMobilePanel();
      else if (state.mobileMenuOpen) closeMobileMenu();
      return;
    }
    if (state.isOpen) {
      const t = getToggle(state.activePanel);
      closeDropdown();
      if (t) t.focus();
    }
  }

  function handleDocClick(e: MouseEvent): void {
    if (state.isMobile || !state.isOpen) return;
    if (!(e.target as HTMLElement).closest('[data-menu-wrap]')) closeDropdown();
  }

  // ---- Desktop: teclado ----
  function focusFirstLink(panelName: string): void {
    window.setTimeout(() => {
      const el = getPanel(panelName);
      const link = el?.querySelector<HTMLElement>('a');
      if (!link) return;
      gsap.set(link, { visibility: 'visible' });
      link.focus();
    }, 80);
  }

  function handleKeydownOnToggle(e: KeyboardEvent): void {
    if (state.isMobile) return;
    const name = (e.currentTarget as HTMLElement).getAttribute('data-dropdown-toggle');
    if (!name) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (state.isOpen && state.activePanel === name) closeDropdown();
      else {
        openDropdown(name);
        focusFirstLink(name);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!state.isOpen || state.activePanel !== name) openDropdown(name);
      focusFirstLink(name);
    }
    if (e.key === 'Tab' && !e.shiftKey && state.isOpen && state.activePanel === name) {
      e.preventDefault();
      const link = getPanel(name)?.querySelector<HTMLElement>('a');
      if (link) link.focus();
    }
  }

  function handleKeydownInPanel(e: KeyboardEvent): void {
    if (state.isMobile || !state.isOpen) return;
    const el = getPanel(state.activePanel);
    if (!el) return;

    const links = Array.from(el.querySelectorAll<HTMLElement>('a'));
    const idx = links.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      links[(idx + 1) % links.length].focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx <= 0) getToggle(state.activePanel)?.focus();
      else links[idx - 1].focus();
    }
    if (e.key === 'Tab' && !e.shiftKey && idx === links.length - 1) {
      e.preventDefault();
      const curIdx = toggles.indexOf(getToggle(state.activePanel) as HTMLElement);
      const next = curIdx < toggles.length - 1 ? toggles[curIdx + 1] : null;
      closeDropdown();
      if (next) next.focus();
    }
    if (e.key === 'Tab' && e.shiftKey && idx === 0) {
      e.preventDefault();
      getToggle(state.activePanel)?.focus();
    }
  }

  // ---- Movil: abrir/cerrar menu ----
  function openMobileMenu(): void {
    killMobile();
    state.mobileMenuOpen = true;
    wrap.setAttribute('data-menu-open', 'true');
    setBurger(true);
    document.body.style.overflow = 'hidden';

    const items = getNavItems();
    const tl = gsap.timeline({ defaults: { ease: easeName } });
    state.mobileTl = tl;
    tl.to(navList, { autoAlpha: 1, duration: IN }, 0);
    if (items.length) {
      tl.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: IN, stagger: spread(items.length) },
        OUT * 0.5,
      );
    }
  }

  function closeMobileMenu(): void {
    const hadPanel = state.mobilePanelActive;
    const panelEl = getPanel(hadPanel);

    killMobile();
    killMobilePanel();

    wrap.setAttribute('data-menu-open', 'false');
    state.mobileMenuOpen = false;
    state.mobilePanelActive = null;
    setBurger(false);

    const tl = gsap.timeline({
      defaults: { ease: easeName },
      onComplete() {
        document.body.style.overflow = '';
        state.mobileTl = null;
        setupMobile();
      },
    });
    state.mobileTl = tl;

    if (hadPanel && panelEl) {
      tl.to(panelEl, { autoAlpha: 0, duration: IN }, OUT * 0.25);
      tl.to(backBtn, { autoAlpha: 0, duration: OUT }, OUT * 0.25);
    }
    tl.to(navList, { autoAlpha: 0, duration: IN }, OUT * 0.25);
  }

  // ---- Movil: slide-over de panel ----
  function openMobilePanel(panelName: string): void {
    const el = getPanel(panelName);
    if (!el) return;
    killMobilePanel();
    state.mobilePanelActive = panelName;

    const navItems = getNavItems();
    const panelFade = getFade(el);
    const toggle = getToggle(panelName);
    if (toggle) toggle.setAttribute('aria-expanded', 'true');

    const tl = gsap.timeline({ defaults: { ease: easeName } });
    state.mobilePanelTl = tl;

    if (navItems.length) {
      tl.to(navItems, { xPercent: -10, autoAlpha: 0, duration: IN, stagger: spread(navItems.length) }, 0);
    }
    tl.to(logo, { autoAlpha: 0, duration: OUT }, 0);
    tl.to(backBtn, { autoAlpha: 1, duration: OUT }, OUT * 0.75);
    tl.set(el, { autoAlpha: 1, xPercent: 0, pointerEvents: 'auto' }, OUT);
    if (panelFade.length) {
      tl.fromTo(
        panelFade,
        { xPercent: 8, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: IN, stagger: spread(panelFade.length) },
        OUT * 1.25,
      );
    }
  }

  function closeMobilePanel(): void {
    if (!state.mobilePanelActive) return;
    const el = getPanel(state.mobilePanelActive);
    if (!el) return;
    killMobilePanel();

    const navItems = getNavItems();
    const closingToggle = getToggle(state.mobilePanelActive);
    if (closingToggle) closingToggle.setAttribute('aria-expanded', 'false');

    const tl = gsap.timeline({
      defaults: { ease: easeName },
      onComplete() {
        state.mobilePanelActive = null;
        state.mobilePanelTl = null;
      },
    });
    state.mobilePanelTl = tl;

    tl.to(el, { xPercent: 20, autoAlpha: 0, duration: IN }, 0);
    tl.set(el, { autoAlpha: 0, pointerEvents: 'none' }, IN * 0.8);
    tl.to(backBtn, { autoAlpha: 0, duration: OUT }, 0);
    tl.to(logo, { autoAlpha: 1, duration: OUT }, OUT * 0.75);
    if (navItems.length) {
      tl.fromTo(
        navItems,
        { xPercent: -20, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: IN, stagger: spread(navItems.length) },
        OUT * 1.25,
      );
    }
  }

  function handleToggleClick(e: Event): void {
    if (!state.isMobile || !state.mobileMenuOpen) return;
    const name = (e.currentTarget as HTMLElement).getAttribute('data-dropdown-toggle');
    if (name) {
      e.preventDefault();
      openMobilePanel(name);
    }
  }

  function handleBurgerClick(): void {
    if (state.mobileMenuOpen) closeMobileMenu();
    else openMobileMenu();
  }

  // ---- Resize: cambio de modo ----
  let resizeTimer = 0;
  let lastWidth = window.innerWidth;
  function handleResize(): void {
    const w = window.innerWidth;
    if (w === lastWidth) return;
    lastWidth = w;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const was = state.isMobile;
      state.isMobile = window.innerWidth <= MOBILE_MAX;

      if (was && !state.isMobile) {
        killMobile();
        killMobilePanel();
        gsap.set(navList, { clearProps: 'all' });
        gsap.set(getNavItems(), { clearProps: 'all' });
        gsap.set(backBtn, { autoAlpha: 0 });
        gsap.set(logo, { clearProps: 'all' });
        panels.forEach((p) => {
          gsap.set(p, { clearProps: 'all' });
          gsap.set(getFade(p), { clearProps: 'all' });
        });
        setBurger(false);
        state.mobileMenuOpen = false;
        state.mobilePanelActive = null;
        document.body.style.overflow = '';
        resetDesktop();
      }

      if (!was && state.isMobile) {
        killDropdown();
        state.isOpen = false;
        state.activePanel = null;
        clearTimers();
        wrap.setAttribute('data-menu-open', 'false');
        resetToggles();
        setupMobile();
      }

      // Sigue en desktop pero cambio el ancho: el x/width medidos quedaron
      // obsoletos y el panel apuntaria a un trigger que ya se movio.
      if (!was && !state.isMobile && state.isOpen) closeDropdown();
    }, 150);
  }

  // ---- Binding ----
  toggles.forEach((btn) => {
    btn.addEventListener('mouseenter', handleToggleEnter);
    btn.addEventListener('mouseleave', handleToggleLeave);
    btn.addEventListener('keydown', handleKeydownOnToggle);
    btn.addEventListener('click', handleToggleClick);
  });
  dropWrapper.addEventListener('mouseenter', handleWrapperEnter);
  dropWrapper.addEventListener('mouseleave', handleWrapperLeave);
  panels.forEach((p) => p.addEventListener('keydown', handleKeydownInPanel));
  if (backdrop) backdrop.addEventListener('click', closeDropdown);
  document.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleDocClick);
  burger.addEventListener('click', handleBurgerClick);
  backBtn.addEventListener('click', closeMobilePanel);
  window.addEventListener('resize', handleResize);

  state.isMobile ? setupMobile() : resetDesktop();

  return () => {
    clearTimers();
    clearTimeout(resizeTimer);
    killDropdown();
    killMobile();
    killMobilePanel();
    toggles.forEach((btn) => {
      btn.removeEventListener('mouseenter', handleToggleEnter);
      btn.removeEventListener('mouseleave', handleToggleLeave);
      btn.removeEventListener('keydown', handleKeydownOnToggle);
      btn.removeEventListener('click', handleToggleClick);
    });
    dropWrapper.removeEventListener('mouseenter', handleWrapperEnter);
    dropWrapper.removeEventListener('mouseleave', handleWrapperLeave);
    panels.forEach((p) => p.removeEventListener('keydown', handleKeydownInPanel));
    if (backdrop) backdrop.removeEventListener('click', closeDropdown);
    document.removeEventListener('keydown', handleEscape);
    document.removeEventListener('click', handleDocClick);
    burger.removeEventListener('click', handleBurgerClick);
    backBtn.removeEventListener('click', closeMobilePanel);
    window.removeEventListener('resize', handleResize);
    document.body.style.overflow = '';
    wrap.setAttribute('data-menu-open', 'false');
    setBurger(false);
    resetToggles();
    panels.forEach((p) => {
      gsap.set(p, { clearProps: 'all' });
      gsap.set(getFade(p), { clearProps: 'all' });
    });
    gsap.set([navList, dropContainer, backBtn, logo].concat(backdrop ? [backdrop] : []), { clearProps: 'all' });
    gsap.set(getNavItems(), { clearProps: 'all' });
  };
}
