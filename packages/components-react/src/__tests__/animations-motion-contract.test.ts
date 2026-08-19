/**
 * Contrato de motion de packages/animations (CLAUDE.md regla 5):
 *   - init*() devuelve cleanup y desmonta sin error
 *   - prefers-reduced-motion salta la animacion DECORATIVA (no la funcional)
 *   - data-motion-exempt se respeta por elemento
 *
 * Viven aqui (y no en packages/animations) porque este package ya tiene la
 * infra vitest+jsdom; animations no tiene runner propio y agregar la dep esta
 * fuera de alcance. Los imports relativos cross-package son estilo de la casa.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initButtonHover } from '../../../animations/src/button-hover';
import { initSidebarAnimation } from '../../../animations/src/sidebar';
import { initDraggableMarquee } from '../../../animations/src/marquee-draggable';
import { initCssMarquee } from '../../../animations/src/marquee-css';
import { initVideoPlayer } from '../../../animations/src/video-player';

const g = globalThis as any;

function setReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function gsapMock() {
  const tween = { kill: vi.fn(), progress: vi.fn(() => 0), timeScale: vi.fn(), pause: vi.fn(), resume: vi.fn() };
  const timeline: any = { to: vi.fn() };
  timeline.to.mockReturnValue(timeline);
  return {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => tween),
    fromTo: vi.fn(),
    timeline: vi.fn(() => timeline),
    killTweensOf: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn() },
    quickTo: vi.fn(() => vi.fn()),
    getProperty: vi.fn(() => 0),
    utils: {
      wrap: () => (x: number) => x,
      clamp: (_min: number, _max: number, v: number) => v,
      toArray: (sel: string) => Array.from(document.querySelectorAll(sel)),
    },
    _tween: tween,
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
  setReducedMotion(false);
});

afterEach(() => {
  delete g.gsap;
  delete g.SplitText;
  delete g.Observer;
  delete g.ScrollTrigger;
  delete g.Stream;
});

describe('button-hover', () => {
  function mountButton(exempt = false) {
    document.body.innerHTML = `
      <button data-button-animate ${exempt ? 'data-motion-exempt' : ''}>
        <span data-button-text>Hola</span>
        <span data-button-text aria-hidden="true">Hola</span>
      </button>`;
  }

  it('sin gsap/SplitText: avisa y devuelve cleanup inerte', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mountButton();
    const cleanup = initButtonHover();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('gsap or SplitText not found'));
    expect(() => cleanup()).not.toThrow();
    warn.mockRestore();
  });

  it('divide cada data-button-text y el cleanup revierte todos', () => {
    const revert = vi.fn();
    const SplitText = vi.fn(() => ({ chars: [], revert }));
    g.gsap = gsapMock();
    g.SplitText = SplitText;
    mountButton();

    const cleanup = initButtonHover();
    expect(SplitText).toHaveBeenCalledTimes(2);
    cleanup();
    expect(revert).toHaveBeenCalledTimes(2);
  });

  it('data-motion-exempt: no divide nada', () => {
    const SplitText = vi.fn(() => ({ chars: [], revert: vi.fn() }));
    g.gsap = gsapMock();
    g.SplitText = SplitText;
    mountButton(true);

    initButtonHover();
    expect(SplitText).not.toHaveBeenCalled();
  });
});

describe('sidebar (decorativo: coreografia de entrada)', () => {
  function mountSidebar(exempt = false) {
    document.body.innerHTML = `
      <aside data-sidebar ${exempt ? 'data-motion-exempt' : ''} class="sidebar sidebar--collapsed">
        <span data-sidebar-label>Inbox</span>
      </aside>`;
    return document.querySelector('[data-sidebar]')!;
  }

  async function expand(sidebar: Element) {
    sidebar.classList.remove('sidebar--collapsed');
    // MutationObserver entrega en microtask
    await new Promise((r) => setTimeout(r, 0));
  }

  it('expandir coreografia la entrada (gsap.fromTo)', async () => {
    g.gsap = gsapMock();
    const sidebar = mountSidebar();
    const cleanup = initSidebarAnimation();
    await expand(sidebar);
    expect(g.gsap.fromTo).toHaveBeenCalled();
    cleanup();
  });

  it('reduced-motion: el contenido aparece sin coreografia', async () => {
    setReducedMotion(true);
    g.gsap = gsapMock();
    const sidebar = mountSidebar();
    const cleanup = initSidebarAnimation();
    await expand(sidebar);
    expect(g.gsap.fromTo).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });

  it('data-motion-exempt en el root: sin coreografia', async () => {
    g.gsap = gsapMock();
    const sidebar = mountSidebar(true);
    initSidebarAnimation();
    await expand(sidebar);
    expect(g.gsap.fromTo).not.toHaveBeenCalled();
  });
});

describe('marquee-draggable (decorativo: loop infinito)', () => {
  function mountMarquee(exempt = false) {
    document.body.innerHTML = `
      <div data-draggable-marquee ${exempt ? 'data-motion-exempt' : ''}>
        <div data-draggable-marquee-collection>
          <div data-draggable-marquee-list><span class="marquee__item">A</span></div>
        </div>
      </div>`;
    // jsdom no mide layout: simular anchos para pasar el guard de dimensiones
    const wrapper = document.querySelector<HTMLElement>('[data-draggable-marquee]')!;
    const list = document.querySelector<HTMLElement>('[data-draggable-marquee-list]')!;
    const collection = document.querySelector<HTMLElement>('[data-draggable-marquee-collection]')!;
    wrapper.getBoundingClientRect = () => ({ width: 100 } as DOMRect);
    list.getBoundingClientRect = () => ({ width: 300 } as DOMRect);
    Object.defineProperty(list, 'scrollWidth', { value: 300 });
    Object.defineProperty(collection, 'scrollWidth', { value: 500, configurable: true });
    return wrapper;
  }

  function mountGlobals() {
    g.gsap = gsapMock();
    g.Observer = { create: vi.fn(() => ({ kill: vi.fn(), enable: vi.fn(), disable: vi.fn() })) };
    g.ScrollTrigger = { create: vi.fn(() => ({ kill: vi.fn() })) };
  }

  it('inicializa el loop y el cleanup lo mata', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    const cleanup = initDraggableMarquee();
    expect(wrapper.dataset.draggableMarquee).toBe('initialized');
    expect(g.gsap.to).toHaveBeenCalled();
    cleanup();
    expect(g.gsap._tween.kill).toHaveBeenCalled();
    expect(wrapper.dataset.draggableMarquee).toBeUndefined();
  });

  it('reduced-motion: el marquee queda estatico (cero GSAP)', () => {
    setReducedMotion(true);
    mountGlobals();
    mountMarquee();
    const cleanup = initDraggableMarquee();
    expect(g.gsap.to).not.toHaveBeenCalled();
    expect(g.Observer.create).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });

  it('data-motion-exempt: ese marquee no se inicializa', () => {
    mountGlobals();
    const wrapper = mountMarquee(true);
    initDraggableMarquee();
    expect(wrapper.dataset.draggableMarquee).not.toBe('initialized');
    expect(g.gsap.to).not.toHaveBeenCalled();
  });

  it('por defecto la tira avanza sola: reposo a velocidad ±1', () => {
    mountGlobals();
    mountMarquee();
    initDraggableMarquee();
    expect(g.gsap._tween.timeScale).toHaveBeenCalledWith(1);
  });

  it('data-autoplay="false": arranca quieta, reposo a 0', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-autoplay', 'false');
    initDraggableMarquee();
    expect(g.gsap._tween.timeScale).toHaveBeenCalledWith(0);
    expect(g.gsap._tween.timeScale).not.toHaveBeenCalledWith(1);
  });

  it('data-lag: engancha el ticker del retardo y el cleanup lo suelta', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-lag', '3');
    const cleanup = initDraggableMarquee();
    expect(g.gsap.quickTo).toHaveBeenCalled();
    expect(g.gsap.ticker.add).toHaveBeenCalled();
    cleanup();
    expect(g.gsap.ticker.remove).toHaveBeenCalled();
  });

  it('sin data-lag no se engancha ningun ticker', () => {
    mountGlobals();
    mountMarquee();
    initDraggableMarquee();
    expect(g.gsap.ticker.add).not.toHaveBeenCalled();
  });

  // Simula soltar tras un arrastre: dispara el observer y ejecuta el onComplete
  // del tramo de deceleracion, que es donde vive el imantado.
  function dragAndSettle() {
    const cfg = g.Observer.create.mock.calls[0][0];
    cfg.onChangeX({ velocityX: 100 });
    const tl = g.gsap.timeline.mock.results[0].value;
    const settleVars = tl.to.mock.calls[1][1];
    g.gsap.to.mockClear();
    settleVars.onComplete?.();
    return g.gsap.to.mock.calls.find((c: unknown[]) => 'progress' in ((c[1] ?? {}) as object));
  }

  it('data-snap="auto" con una card mas ancha que el viewport: imanta al soltar', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-autoplay', 'false');
    wrapper.setAttribute('data-snap', 'auto');
    initDraggableMarquee();
    expect(dragAndSettle()).toBeTruthy();
  });

  it('sin data-snap la tira queda donde la soltaron', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-autoplay', 'false');
    initDraggableMarquee();
    expect(dragAndSettle()).toBeUndefined();
  });

  it('imantar con autoplay seria contradictorio: no se aplica', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-snap', 'true');
    initDraggableMarquee();
    expect(dragAndSettle()).toBeUndefined();
  });

  function mountWithControl(dir: 'prev' | 'next') {
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-autoplay', 'false');
    wrapper.insertAdjacentHTML(
      'beforeend',
      `<button data-draggable-marquee-control="${dir}"></button>`,
    );
    return wrapper;
  }

  function clickControl(wrapper: HTMLElement) {
    g.gsap.to.mockClear();
    wrapper
      .querySelector('[data-draggable-marquee-control]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return g.gsap.to.mock.calls.find(
      (c: unknown[]) => 'progress' in ((c[1] ?? {}) as object),
    );
  }

  it('flecha next: mueve la tira corrigiendo progress', () => {
    mountGlobals();
    const wrapper = mountWithControl('next');
    initDraggableMarquee();
    expect(clickControl(wrapper)).toBeTruthy();
  });

  it('flecha prev: tambien mueve, en el sentido contrario', () => {
    mountGlobals();
    const wrapper = mountWithControl('prev');
    initDraggableMarquee();
    const next = clickControl(wrapper);
    expect(next).toBeTruthy();
  });

  it('controles fuera del carril: los encuentra como fila hermana', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-autoplay', 'false');
    wrapper.insertAdjacentHTML(
      'afterend',
      '<div class="marquee__controls"><button data-draggable-marquee-control="next"></button></div>',
    );
    initDraggableMarquee();
    g.gsap.to.mockClear();
    document
      .querySelector('[data-draggable-marquee-control]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(
      g.gsap.to.mock.calls.find((c: unknown[]) => 'progress' in ((c[1] ?? {}) as object)),
    ).toBeTruthy();
  });

  it('cleanup: la flecha deja de responder', () => {
    mountGlobals();
    const wrapper = mountWithControl('next');
    const cleanup = initDraggableMarquee();
    cleanup();
    expect(clickControl(wrapper)).toBeUndefined();
  });

  it('quieta no tiene sentido: data-direction no parpadea a left al detenerse', () => {
    mountGlobals();
    const wrapper = mountMarquee();
    wrapper.setAttribute('data-direction', 'right');
    wrapper.setAttribute('data-autoplay', 'false');
    initDraggableMarquee();
    expect(wrapper.getAttribute('data-direction')).toBe('right');
  });
});

describe('video-player (funcional: reduced-motion solo anula autoplay)', () => {
  function mountPlayer() {
    document.body.innerHTML = `
      <div data-video-player-init data-video-id="abc123"
           data-video-autoplay="true" data-video-paused-by-user="false">
        <iframe></iframe>
      </div>`;
    const player = {
      addEventListener: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      muted: false,
      currentTime: 0,
      duration: 10,
    };
    g.Stream = vi.fn(() => player);
    return player;
  }

  it('autoplay activo cuando no hay reduced-motion', () => {
    const player = mountPlayer();
    const el = document.querySelector<HTMLElement>('[data-video-player-init]')!;
    el.getBoundingClientRect = () => ({ top: 0, bottom: 100 } as DOMRect);
    const cleanup = initVideoPlayer();
    expect(player.play).toHaveBeenCalled();
    cleanup();
  });

  it('reduced-motion: NO autoplay, pero el player sigue operativo', () => {
    setReducedMotion(true);
    const player = mountPlayer();
    const cleanup = initVideoPlayer();
    expect(player.play).not.toHaveBeenCalled();
    expect(player.pause).toHaveBeenCalled(); // rama !isAutoplay
    expect(g.Stream).toHaveBeenCalled(); // la FUNCION no se salta
    cleanup();
  });
});

describe('table-of-contents (funcional: genera el indice, el motion es solo el scroll)', () => {
  function mountArticle(extra = '') {
    document.body.innerHTML = `
      <section data-toc-wrap data-toc-levels="h2,h3" data-toc-offset="80">
        <nav>
          <div data-toc-list>
            <a class="toc__link" data-toc-link href="#"><span data-toc-text></span></a>
          </div>
        </nav>
        <div data-toc-content>
          <h2>Identidad del responsable</h2>
          <h3>Información de contacto</h3>
          <h2 data-toc-ignore>Fuera del indice</h2>
          <h2>Colofón {skip}</h2>
          ${extra}
        </div>
      </section>`;
    return document.querySelector<HTMLElement>('[data-toc-list]')!;
  }

  function mountGlobals() {
    g.gsap = gsapMock();
    g.ScrollTrigger = { create: vi.fn(() => ({ kill: vi.fn() })) };
  }

  it('sin gsap/ScrollTrigger: cleanup inerte y cero links', async () => {
    const { initTableOfContents } = await import('../../../animations/src/table-of-contents');
    const list = mountArticle();
    const cleanup = initTableOfContents();
    expect(list.querySelectorAll('[data-toc-item]')).toHaveLength(0);
    expect(() => cleanup()).not.toThrow();
  });

  it('un link por heading incluido, con id slugificado y profundidad', async () => {
    mountGlobals();
    const { initTableOfContents } = await import('../../../animations/src/table-of-contents');
    const list = mountArticle();
    const cleanup = initTableOfContents();

    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('[data-toc-item]'));
    // data-toc-ignore y {skip} quedan fuera: 4 headings -> 2 links
    expect(links).toHaveLength(2);
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '#identidad-del-responsable',
      '#informacion-de-contacto', // el acento no parte el slug
    ]);
    expect(links.map((l) => l.getAttribute('data-toc-depth'))).toEqual(['2', '3']);
    // el template sale del DOM: es un plano, no un item
    expect(list.querySelector('[data-toc-link]')).toBeNull();
    // {skip} desaparece del heading visible
    expect(document.body.textContent).not.toContain('{skip}');

    cleanup();
  });

  it('cleanup: quita los links, devuelve el template y borra los ids inyectados', async () => {
    mountGlobals();
    const { initTableOfContents } = await import('../../../animations/src/table-of-contents');
    const list = mountArticle();
    const cleanup = initTableOfContents();
    cleanup();

    expect(list.querySelectorAll('[data-toc-item]')).toHaveLength(0);
    expect(list.querySelector('[data-toc-link]')).not.toBeNull();
    expect(document.querySelector('[data-toc-content] h2')?.id).toBe('');
  });

  it('id ya presente en el heading: se respeta y el cleanup no lo borra', async () => {
    mountGlobals();
    const { initTableOfContents } = await import('../../../animations/src/table-of-contents');
    const list = mountArticle('<h2 id="clausula-legal">Cláusula</h2>');
    const cleanup = initTableOfContents();

    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('[data-toc-item]'));
    expect(links.at(-1)?.getAttribute('href')).toBe('#clausula-legal');

    cleanup();
    expect(document.getElementById('clausula-legal')).not.toBeNull();
  });

  it('reduced-motion: el indice se genera igual (es funcion, no adorno)', async () => {
    setReducedMotion(true);
    mountGlobals();
    const { initTableOfContents } = await import('../../../animations/src/table-of-contents');
    const list = mountArticle();
    const cleanup = initTableOfContents();

    expect(list.querySelectorAll('[data-toc-item]')).toHaveLength(2);
    expect(g.ScrollTrigger.create).toHaveBeenCalledTimes(2);
    cleanup();
  });
});

describe('nav-autohide (funcional con motion opcional)', () => {
  async function scrollTo(y: number) {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  }

  function mountNav(exempt = false) {
    document.body.innerHTML = `<nav data-nav-autohide ${exempt ? 'data-motion-exempt' : ''}></nav>`;
    return document.querySelector<HTMLElement>('[data-nav-autohide]')!;
  }

  it('oculta al bajar, muestra al subir y siempre en top 0', async () => {
    const { initNavAutohide } = await import('../../../animations/src/nav-autohide');
    const nav = mountNav();
    await scrollTo(0);
    const cleanup = initNavAutohide();

    await scrollTo(300); // bajar
    expect(nav.getAttribute('data-nav-hidden')).toBe('true');

    await scrollTo(150); // subir
    expect(nav.getAttribute('data-nav-hidden')).toBe('false');

    await scrollTo(400); // bajar de nuevo
    expect(nav.getAttribute('data-nav-hidden')).toBe('true');

    await scrollTo(0); // top 0: visible sin umbral
    expect(nav.getAttribute('data-nav-hidden')).toBe('false');

    cleanup();
    expect(nav.hasAttribute('data-nav-hidden')).toBe(false);
    expect(nav.style.translate).toBe('');
  });

  it('reduced-motion: sigue ocultando (funcion) pero sin transicion (motion)', async () => {
    setReducedMotion(true);
    const { initNavAutohide } = await import('../../../animations/src/nav-autohide');
    const nav = mountNav();
    await scrollTo(0);
    const cleanup = initNavAutohide();
    expect(nav.style.transition).toBe('');

    await scrollTo(300);
    expect(nav.getAttribute('data-nav-hidden')).toBe('true');
    cleanup();
  });

  it('data-motion-exempt: el nav no se toca', async () => {
    const { initNavAutohide } = await import('../../../animations/src/nav-autohide');
    const nav = mountNav(true);
    await scrollTo(0);
    initNavAutohide();
    await scrollTo(300);
    expect(nav.hasAttribute('data-nav-hidden')).toBe(false);
  });
});

describe('scroll-reveal (W6a, decorativo: entrada de secciones/cards)', () => {
  // jsdom no trae IntersectionObserver: doble sincrono, mismo espiritu que la
  // story (dispara isIntersecting en observe y registra el disconnect).
  function installIO() {
    const disconnect = vi.fn();
    g.IntersectionObserver = class {
      cb: (entries: Array<{ isIntersecting: boolean }>) => void;
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        this.cb = cb;
      }
      observe() {
        this.cb([{ isIntersecting: true }]);
      }
      disconnect = disconnect;
    };
    return { disconnect };
  }

  function mountSection(attrs = '') {
    document.body.innerHTML = `
      <section data-reveal ${attrs}>
        <div data-reveal-item>uno</div>
        <div data-reveal-item>dos</div>
        <div data-reveal-item>tres</div>
      </section>`;
    return document.querySelector<HTMLElement>('[data-reveal]')!;
  }

  afterEach(() => {
    delete g.IntersectionObserver;
  });

  it('sin gsap: avisa y devuelve cleanup inerte', async () => {
    const { initScrollReveal } = await import('../../../animations/src/scroll-reveal');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mountSection();
    const cleanup = initScrollReveal();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('gsap not found'));
    expect(() => cleanup()).not.toThrow();
    warn.mockRestore();
  });

  it('entrada: oculta los items, revela al intersectar y el cleanup mata todo', async () => {
    const { initScrollReveal } = await import('../../../animations/src/scroll-reveal');
    g.gsap = gsapMock();
    const { disconnect } = installIO();
    mountSection('data-reveal-stagger="2"');

    const cleanup = initScrollReveal();
    // estado inicial oculto…
    expect(g.gsap.set).toHaveBeenCalledWith(expect.any(Array), { opacity: 0, yPercent: 12 });
    // …y el tween usa fallbacks espejo de los tokens (jsdom no resuelve CSS vars)
    const vars = g.gsap.to.mock.calls[0][1];
    expect(vars.duration).toBe(0.6); // --duration-600
    expect(vars.stagger).toBe(0.05); // --stagger-2
    cleanup();
    expect(disconnect).toHaveBeenCalled();
    expect(g.gsap._tween.kill).toHaveBeenCalled();
  });

  it('reduced-motion: contenido visible al instante, cero observer y cero tween', async () => {
    const { initScrollReveal } = await import('../../../animations/src/scroll-reveal');
    setReducedMotion(true);
    g.gsap = gsapMock();
    installIO();
    mountSection();

    const cleanup = initScrollReveal();
    expect(g.gsap.set).toHaveBeenCalledWith(expect.any(Array), { clearProps: 'opacity,transform' });
    expect(g.gsap.to).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });

  it('data-motion-exempt en el root: esa seccion no se toca', async () => {
    const { initScrollReveal } = await import('../../../animations/src/scroll-reveal');
    g.gsap = gsapMock();
    installIO();
    mountSection('data-motion-exempt');

    initScrollReveal();
    expect(g.gsap.set).not.toHaveBeenCalled();
    expect(g.gsap.to).not.toHaveBeenCalled();
  });
});

describe('text-reveal (W6a: tokenizado, decorativo)', () => {
  function installIO() {
    g.IntersectionObserver = class {
      cb: (entries: Array<{ isIntersecting: boolean }>) => void;
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        this.cb = cb;
      }
      observe() {
        this.cb([{ isIntersecting: true }]);
      }
      disconnect = vi.fn();
    };
  }

  /** Doble de SplitText.create: entrega lineas fake via onSplit, como el real. */
  function splitTextDouble() {
    const revert = vi.fn();
    const create = vi.fn((_el: Element, cfg: { onSplit?: (i: unknown) => void }) => {
      cfg.onSplit?.({ lines: [document.createElement('div')], words: [], chars: [] });
      return { revert };
    });
    return { create, revert };
  }

  function mountHeading(attrs = '') {
    document.body.innerHTML = `<h2 data-split="heading" ${attrs}>Titular de prueba</h2>`;
  }

  afterEach(() => {
    delete g.IntersectionObserver;
  });

  it('tween con fallbacks espejo de los tokens (lines: 0.9s / 0.075s)', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    mountHeading();

    const cleanup = initTextReveal();
    const vars = g.gsap.to.mock.calls[0][1];
    expect(vars.duration).toBe(0.9); // --duration-900
    expect(vars.stagger).toBe(0.075); // --stagger-3
    cleanup();
  });

  it('reduced-motion: no divide y el titular queda intacto', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    setReducedMotion(true);
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    mountHeading();

    const cleanup = initTextReveal();
    expect(g.SplitText.create).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });

  it('data-motion-exempt: ese titular no se divide', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    mountHeading('data-motion-exempt');

    initTextReveal();
    expect(g.SplitText.create).not.toHaveBeenCalled();
  });

  it('gradiente descendiente: es otro componente, no se divide', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    document.body.innerHTML =
      '<h2 data-split="heading">Un motor <span class="text-gradient">de IA</span></h2>';

    initTextReveal();
    expect(g.SplitText.create).not.toHaveBeenCalled();
  });

  it('gradiente en el propio titular: tampoco se divide', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    document.body.innerHTML = '<h2 data-split="heading" class="text-gradient-relume">Titular</h2>';

    initTextReveal();
    expect(g.SplitText.create).not.toHaveBeenCalled();
  });

  it('espera a document.fonts.ready para medir las lineas con la fuente real', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    mountHeading();

    let loadFonts: () => void = () => {};
    const ready = new Promise<void>((resolve) => {
      loadFonts = resolve;
    });
    Object.defineProperty(document, 'fonts', {
      value: { status: 'loading', ready },
      configurable: true,
    });

    const cleanup = initTextReveal();
    expect(g.SplitText.create).not.toHaveBeenCalled();

    loadFonts();
    await ready;
    await Promise.resolve();
    expect(g.SplitText.create).toHaveBeenCalled();

    cleanup();
    delete (document as unknown as { fonts?: unknown }).fonts;
  });

  it('cleanup antes de que carguen las fuentes: ya no divide', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    mountHeading();

    let loadFonts: () => void = () => {};
    const ready = new Promise<void>((resolve) => {
      loadFonts = resolve;
    });
    Object.defineProperty(document, 'fonts', {
      value: { status: 'loading', ready },
      configurable: true,
    });

    initTextReveal()();
    loadFonts();
    await ready;
    await Promise.resolve();
    expect(g.SplitText.create).not.toHaveBeenCalled();
    // Un cleanup temprano no puede dejar el titular escondido para siempre.
    expect((document.querySelector('h2') as HTMLElement).style.visibility).toBe('');

    delete (document as unknown as { fonts?: unknown }).fonts;
  });

  it('esconde el titular mientras espera las fuentes y lo devuelve al dividir', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    mountHeading();

    let loadFonts: () => void = () => {};
    const ready = new Promise<void>((resolve) => {
      loadFonts = resolve;
    });
    Object.defineProperty(document, 'fonts', {
      value: { status: 'loading', ready },
      configurable: true,
    });

    const cleanup = initTextReveal();
    const heading = document.querySelector('h2') as HTMLElement;
    expect(heading.style.visibility).toBe('hidden');

    loadFonts();
    await ready;
    await Promise.resolve();
    expect(heading.style.visibility).toBe('');

    cleanup();
    delete (document as unknown as { fonts?: unknown }).fonts;
  });

  it('un titular que no se anima nunca se esconde', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    document.body.innerHTML =
      '<h2 id="grad" data-split="heading" class="text-gradient-relume">Gradiente</h2>' +
      '<h2 id="exempt" data-split="heading" data-motion-exempt>Exento</h2>';

    initTextReveal();
    expect((document.getElementById('grad') as HTMLElement).style.visibility).toBe('');
    expect((document.getElementById('exempt') as HTMLElement).style.visibility).toBe('');
  });

  it('atom-split-pending: se retira cuando el modulo ya dividio', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    installIO();
    mountHeading();
    document.documentElement.classList.add('atom-split-pending');

    initTextReveal();
    expect(document.documentElement.classList.contains('atom-split-pending')).toBe(false);
  });

  it('sin gsap: retira atom-split-pending en vez de dejar el texto escondido', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    delete g.gsap;
    delete g.SplitText;
    mountHeading();
    document.documentElement.classList.add('atom-split-pending');

    initTextReveal();
    expect(document.documentElement.classList.contains('atom-split-pending')).toBe(false);
  });

  it('sin titulares que animar: tampoco deja la pagina escondida', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    g.SplitText = splitTextDouble();
    document.body.innerHTML = '<h2 data-split="heading" class="text-gradient-relume">Solo gradiente</h2>';
    document.documentElement.classList.add('atom-split-pending');

    initTextReveal();
    expect(document.documentElement.classList.contains('atom-split-pending')).toBe(false);
  });

  it('re-split de autoSplit tras revelar: no vuelve a esconder el titular', async () => {
    const { initTextReveal } = await import('../../../animations/src/text-reveal');
    g.gsap = gsapMock();
    let captured: { onSplit?: (i: unknown) => void } = {};
    g.SplitText = {
      create: vi.fn((_el: Element, cfg: { onSplit?: (i: unknown) => void }) => {
        captured = cfg;
        cfg.onSplit?.({ lines: [document.createElement('div')], words: [], chars: [] });
        return { revert: vi.fn() };
      }),
    };
    installIO();
    mountHeading();

    const hides = () =>
      g.gsap.set.mock.calls.filter(
        (call: unknown[]) => (call[1] as { yPercent?: number })?.yPercent === 110,
      ).length;

    initTextReveal();
    expect(hides()).toBe(1);

    captured.onSplit?.({ lines: [document.createElement('div')], words: [], chars: [] });
    expect(hides()).toBe(1);
  });
});

describe('menu-button (burger↔X; el canal Webflow prefija clases)', () => {
  // Mock propio: menu-button encadena tl.clear()/kill(), que el gsapMock
  // compartido no expone (lo usan modulos con timelines mas simples).
  function menuGsap() {
    const tl: any = {};
    for (const m of ['to', 'clear', 'set', 'fromTo']) tl[m] = vi.fn(() => tl);
    tl.kill = vi.fn();
    return {
      registerPlugin: vi.fn(),
      set: vi.fn(),
      to: vi.fn(() => tl),
      timeline: vi.fn(() => tl),
      killTweensOf: vi.fn(),
    };
  }

  function mountBurger(opts: { prefixed?: boolean; exempt?: boolean } = {}) {
    // `prefixed` simula el paste de Webflow: las clases llegan como ds-*, los
    // data-* intactos. Un modulo que consulte por clase encuentra NADA ahi.
    const cls = opts.prefixed ? 'ds-burger-icon__line' : 'burger-icon__line';
    document.body.innerHTML = `
      <button data-menu-button-animate ${opts.exempt ? 'data-motion-exempt' : ''}>
        <span class="${opts.prefixed ? 'ds-burger-icon' : 'burger-icon'}">
          <span class="${cls}" data-menu-button-line></span>
          <span class="${cls}" data-menu-button-line></span>
          <span class="${cls}" data-menu-button-line></span>
        </span>
      </button>`;
    return document.querySelector<HTMLElement>('[data-menu-button-animate]')!;
  }

  it('sin gsap: cleanup inerte', async () => {
    const { initMenuButton } = await import('../../../animations/src/menu-button');
    mountBurger();
    expect(() => initMenuButton()()).not.toThrow();
  });

  it('engancha el burger y arma el timeline', async () => {
    const { initMenuButton } = await import('../../../animations/src/menu-button');
    g.gsap = menuGsap();
    g.CustomEase = { create: vi.fn() };
    mountBurger();
    const cleanup = initMenuButton();
    expect(g.gsap.timeline).toHaveBeenCalled();
    cleanup();
  });

  it('CANAL WEBFLOW: con las clases prefijadas ds- sigue enganchando', async () => {
    const { initMenuButton } = await import('../../../animations/src/menu-button');
    g.gsap = menuGsap();
    g.CustomEase = { create: vi.fn() };
    mountBurger({ prefixed: true });
    const cleanup = initMenuButton();
    // Consultar por clase daria 0 lineas aqui y el burger quedaria muerto en el
    // paste — estilos perfectos, clicks sin efecto (bug real de accordion-morph
    // el 2026-08-04). La estructura debe viajar por data-*.
    expect(g.gsap.timeline).toHaveBeenCalled();
    cleanup();
  });

  it('reduced-motion: el CSS ya transiciona, GSAP no re-anima', async () => {
    const { initMenuButton } = await import('../../../animations/src/menu-button');
    setReducedMotion(true);
    g.gsap = menuGsap();
    g.CustomEase = { create: vi.fn() };
    mountBurger();
    const cleanup = initMenuButton();
    expect(g.gsap.timeline).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });
});

describe('accordion-morph (FUNCIONAL: disclosure; el goo es decoracion encima)', () => {
  // Doble de gsap con timeline encadenable que CAPTURA vars: el contrato de
  // tokens se verifica sobre lo que el modulo le pasa a gsap, no sobre pixeles.
  function morphGsap() {
    const captured: Array<{ vars: Record<string, unknown> }> = [];
    let timelines = 0;
    const tl: any = {
      to: (_t: unknown, vars: Record<string, unknown>) => {
        captured.push({ vars });
        return tl;
      },
      call: (fn?: () => void) => {
        fn?.();
        return tl;
      },
      kill: vi.fn(),
    };
    const mock = {
      set: vi.fn(),
      to: vi.fn(() => ({ kill: vi.fn() })),
      timeline: vi.fn(() => {
        timelines++;
        return tl;
      }),
      killTweensOf: vi.fn(),
    };
    return { mock, captured, count: () => timelines };
  }

  function row(i: number) {
    return `
      <div class="accordion-morph__row" data-accordion-morph-row>
        <div class="accordion-morph__goo" data-accordion-morph-goo aria-hidden="true">
          <div class="accordion-morph__goo-pill" data-accordion-morph-goo-pill></div>
          <div class="accordion-morph__goo-panel" data-accordion-morph-goo-panel></div>
        </div>
        <button class="accordion-morph__trigger" data-accordion-morph-trigger
                id="am-t-${i}" aria-controls="am-p-${i}" aria-expanded="false">
          <span class="accordion-morph__index">0${i + 1}</span>
          <span class="accordion-morph__question">Pregunta ${i + 1}</span>
        </button>
        <div class="accordion-morph__panel" data-accordion-morph-panel id="am-p-${i}"
             role="region" aria-labelledby="am-t-${i}" aria-hidden="true">
          <div class="accordion-morph__panel-inner" data-accordion-morph-inner>
            <p class="accordion-morph__answer" data-accordion-morph-answer>Respuesta ${i + 1}</p>
          </div>
        </div>
      </div>`;
  }

  function mountMorph(attrs = '', rowCount = 2) {
    document.body.innerHTML = `
      <div class="accordion-morph" data-accordion-morph ${attrs}>
        <svg class="accordion-morph__filter-svg" data-accordion-morph-filter width="0" height="0" aria-hidden="true">
          <defs>
            <filter id="am-goo-template">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
            </filter>
          </defs>
        </svg>
        <div class="accordion-morph__list">
          ${Array.from({ length: rowCount }, (_, i) => row(i)).join('')}
        </div>
      </div>`;
    return {
      triggers: Array.from(document.querySelectorAll<HTMLButtonElement>('[data-accordion-morph-trigger]')),
      panels: Array.from(document.querySelectorAll<HTMLElement>('[data-accordion-morph-panel]')),
      defs: document.querySelector('defs')!,
    };
  }

  it('sin gsap: avisa y devuelve cleanup inerte', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mountMorph();
    const cleanup = initAccordionMorph();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('gsap not found'));
    expect(() => cleanup()).not.toThrow();
    warn.mockRestore();
  });

  it('click abre: aria completo y tween con tokens (0.7s, spring)', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    const { mock, captured } = morphGsap();
    g.gsap = mock;
    const { triggers, panels } = mountMorph();

    const cleanup = initAccordionMorph();
    triggers[0].click();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(panels[0].getAttribute('aria-hidden')).toBe('false');
    expect(panels[0].hasAttribute('inert')).toBe(false);
    // jsdom no resuelve CSS vars: el tween usa los fallbacks espejo de tokens
    const open = captured.find((c) => c.vars.duration === 0.7);
    expect(open, 'tween de apertura con --duration-700 (fallback 0.7)').toBeTruthy();
    expect(open!.vars.ease).toBe('back.out(1.7)'); // vecino nombrado de --easing-spring sin CustomEase
    cleanup();
  });

  it('single-open por default: abrir la fila 2 cierra la 1', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    g.gsap = morphGsap().mock;
    const { triggers } = mountMorph();

    const cleanup = initAccordionMorph();
    triggers[0].click();
    triggers[1].click();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    cleanup();
  });

  it('data-accordion-morph-multiple="true": conviven abiertas', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    g.gsap = morphGsap().mock;
    const { triggers } = mountMorph('data-accordion-morph-multiple="true"');

    const cleanup = initAccordionMorph();
    triggers[0].click();
    triggers[1].click();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    cleanup();
  });

  it('reduced-motion: FUNCIONAL — abre instantaneo, cero timelines', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    setReducedMotion(true);
    const { mock, count } = morphGsap();
    g.gsap = mock;
    const { triggers, panels } = mountMorph();

    const cleanup = initAccordionMorph();
    triggers[0].click();
    // un accordion es disclosure: reduced-motion quita el motion, NUNCA la funcion
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(panels[0].getAttribute('aria-hidden')).toBe('false');
    expect(count()).toBe(0);
    cleanup();
  });

  it('data-motion-exempt: mismo camino instantaneo, funcion intacta', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    const { mock, count } = morphGsap();
    g.gsap = mock;
    const { triggers } = mountMorph('data-motion-exempt');

    const cleanup = initAccordionMorph();
    triggers[0].click();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(count()).toBe(0);
    cleanup();
  });

  it('flechas mueven el foco entre triggers (con wrap)', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    g.gsap = morphGsap().mock;
    const { triggers } = mountMorph();

    const cleanup = initAccordionMorph();
    triggers[0].focus();
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(triggers[1]);
    triggers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(triggers[0]); // wrap
    cleanup();
  });

  it('cleanup: desengancha listeners y retira los clones del filtro', async () => {
    const { initAccordionMorph } = await import('../../../animations/src/accordion-morph');
    g.gsap = morphGsap().mock;
    const { triggers, defs } = mountMorph();

    const before = defs.querySelectorAll('filter').length;
    const cleanup = initAccordionMorph();
    expect(defs.querySelectorAll('filter').length).toBeGreaterThan(before); // un clon por fila
    cleanup();
    expect(defs.querySelectorAll('filter').length).toBe(before);
    triggers[0].click();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false'); // listener fuera
  });
});

describe('tooltip-smart (FUNCIONAL: contenido bajo hover/focus; el motion es acompanante)', () => {
  function tooltipGsap() {
    const fromToCalls: Array<Record<string, unknown>> = [];
    const mock = {
      set: vi.fn(),
      to: vi.fn((_t: unknown, vars: Record<string, unknown>) => {
        (vars.onComplete as (() => void) | undefined)?.();
        return { kill: vi.fn() };
      }),
      fromTo: vi.fn((_t: unknown, _from: unknown, to: Record<string, unknown>) => {
        fromToCalls.push(to);
        return { kill: vi.fn() };
      }),
      killTweensOf: vi.fn(),
    };
    return { mock, fromToCalls };
  }

  function flipDouble() {
    return {
      getState: vi.fn(() => ({})),
      from: vi.fn(),
    };
  }

  function mountTriggers(containerAttrs = '') {
    document.body.innerHTML = `
      <div data-tooltip-smart ${containerAttrs}>
        <button data-tooltip-trigger data-tooltip-content="Filtra por color"
                data-tooltip-group="filters">Color</button>
        <button data-tooltip-trigger data-tooltip-content="Solo ofertas"
                data-tooltip-group="filters">Sale</button>
      </div>`;
    return Array.from(document.querySelectorAll<HTMLElement>('[data-tooltip-trigger]'));
  }

  const popup = () => document.querySelector<HTMLElement>('[role="tooltip"]');

  afterEach(() => {
    delete g.Flip;
    vi.useRealTimers();
  });

  it('sin gsap: avisa y devuelve cleanup inerte', async () => {
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mountTriggers();
    const cleanup = initTooltipSmart();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('gsap not found'));
    expect(() => cleanup()).not.toThrow();
    warn.mockRestore();
  });

  it('hover: crea el popup con role, texto, aria-describedby y anima con tokens', async () => {
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    const { mock, fromToCalls } = tooltipGsap();
    g.gsap = mock;
    const [color] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new MouseEvent('mouseenter'));

    const p = popup()!;
    expect(p).toBeTruthy();
    expect(p.textContent).toContain('Filtra por color');
    // el trigger queda vinculado al popup para lectores de pantalla
    expect(color.getAttribute('aria-describedby')).toBe(p.id);
    // clase runtime con AMBAS variantes: el canal Webflow prefija ds- y el
    // popup se crea en runtime, donde el prefijador no llega
    expect(p.className).toContain('tooltip__popup');
    expect(p.className).toContain('ds-tooltip__popup');
    // fallbacks espejo de tokens (jsdom no resuelve vars): 0.3s
    expect(fromToCalls[0]?.duration).toBe(0.3);
    cleanup();
  });

  it('mouseleave: esconde tras hideDelay y suelta aria-describedby', async () => {
    vi.useFakeTimers();
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    g.gsap = tooltipGsap().mock;
    const [color] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new MouseEvent('mouseenter'));
    color.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(200);
    expect(color.hasAttribute('aria-describedby')).toBe(false);
    cleanup();
  });

  it('mismo grupo: viaja con Flip en vez de re-entrar', async () => {
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    const { mock, fromToCalls } = tooltipGsap();
    g.gsap = mock;
    const flip = flipDouble();
    g.Flip = flip;
    const [color, sale] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new MouseEvent('mouseenter'));
    const entradas = fromToCalls.length;
    sale.dispatchEvent(new MouseEvent('mouseenter'));

    expect(flip.getState).toHaveBeenCalled();
    expect(flip.from).toHaveBeenCalled();
    expect(fromToCalls.length).toBe(entradas); // sin segunda entrada
    expect(popup()!.textContent).toContain('Solo ofertas');
    cleanup();
  });

  it('Escape cierra el tooltip (WCAG 1.4.13)', async () => {
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    g.gsap = tooltipGsap().mock;
    const [color] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new MouseEvent('mouseenter'));
    expect(color.hasAttribute('aria-describedby')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(color.hasAttribute('aria-describedby')).toBe(false);
    cleanup();
  });

  it('reduced-motion: FUNCIONAL — el tooltip aparece instantaneo, cero tweens', async () => {
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    setReducedMotion(true);
    const { mock, fromToCalls } = tooltipGsap();
    g.gsap = mock;
    const [color] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new MouseEvent('mouseenter'));
    // el original de Annnimate hacia return total con reduced-motion: tooltip
    // MUERTO. Aqui el contenido es funcion, el motion es acompanante.
    const p = popup()!;
    expect(p).toBeTruthy();
    expect(p.textContent).toContain('Filtra por color');
    expect(fromToCalls.length).toBe(0);
    cleanup();
  });

  it('focus/blur: teclado equivale a hover', async () => {
    vi.useFakeTimers();
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    g.gsap = tooltipGsap().mock;
    const [color] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new FocusEvent('focus'));
    expect(popup()!.textContent).toContain('Filtra por color');
    color.dispatchEvent(new FocusEvent('blur'));
    vi.advanceTimersByTime(200);
    expect(color.hasAttribute('aria-describedby')).toBe(false);
    cleanup();
  });

  it('cleanup: retira popup, listeners y timeouts', async () => {
    vi.useFakeTimers();
    const { initTooltipSmart } = await import('../../../animations/src/tooltip');
    g.gsap = tooltipGsap().mock;
    const [color] = mountTriggers();

    const cleanup = initTooltipSmart();
    color.dispatchEvent(new MouseEvent('mouseenter'));
    expect(popup()).toBeTruthy();
    cleanup();
    expect(popup()).toBeNull();
    color.dispatchEvent(new MouseEvent('mouseenter'));
    expect(popup()).toBeNull(); // listener fuera
  });
});


describe('marquee-css (decorativo: loop infinito por CSS)', () => {
  /** Callbacks de los ResizeObserver vivos, para poder dispararlos a mano. */
  let resizeCallbacks: Array<() => void> = [];
  const RealResizeObserver = (globalThis as any).ResizeObserver;

  beforeEach(() => {
    resizeCallbacks = [];
    class ResizeObserverSpy {
      constructor(cb: () => void) {
        resizeCallbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (globalThis as any).ResizeObserver = ResizeObserverSpy;
  });

  afterEach(() => {
    (globalThis as any).ResizeObserver = RealResizeObserver;
  });

  /**
   * jsdom no mide layout. `hidden` simula una seccion en display:none — el
   * switch de seccion por viewport del sitio — que no tiene caja al cargar.
   */
  function mountMarquee({ exempt = false, hidden = false, speed = '' } = {}) {
    document.body.innerHTML = `
      <div class="marquee" data-marquee ${speed ? `data-speed="${speed}"` : ''} ${exempt ? 'data-motion-exempt' : ''}>
        <div class="marquee__list" data-marquee-list><span class="marquee__item">A</span></div>
      </div>`;
    const root = document.querySelector<HTMLElement>('[data-marquee]')!;
    const list = document.querySelector<HTMLElement>('.marquee__list')!;
    root.getBoundingClientRect = () => ({ width: hidden ? 0 : 500 }) as DOMRect;
    list.getBoundingClientRect = () => ({ width: hidden ? 0 : 300 }) as DOMRect;
    Object.defineProperty(list, 'scrollWidth', { value: hidden ? 0 : 300, configurable: true });
    return root;
  }

  function clones() {
    return document.querySelectorAll('[data-marquee-clone]');
  }

  it('deriva la duracion del ancho y clona hasta tapar el carril', () => {
    const root = mountMarquee();
    const cleanup = initCssMarquee();

    // 300px a 75px/s = 4s por vuelta. La vuelta mide UNA lista, no el total.
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('4s');
    // carril 500 + lista 300 => 3 listas; la de autor ya cuenta.
    expect(clones()).toHaveLength(2);
    expect(clones()[0].getAttribute('aria-hidden')).toBe('true');
    expect(root.dataset.marquee).toBe('initialized');

    cleanup();
    expect(clones()).toHaveLength(0);
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('');
    expect(root.dataset.marquee).toBeUndefined();
  });

  it('data-speed cambia la velocidad, no la duracion declarada', () => {
    const root = mountMarquee({ speed: '150' });
    initCssMarquee();
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('2s');
  });

  it('oculto al cargar: ni duracion cero ni clones, y se monta al aparecer', () => {
    // La regresion de PR #48 en su forma CSS: rendirse cuando la seccion mide 0
    // dejaria --marquee-duration en 0s y la tira congelada PARA SIEMPRE, porque
    // initCssMarquee corre una sola vez.
    const root = mountMarquee({ hidden: true });
    initCssMarquee();
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('');
    expect(clones()).toHaveLength(0);

    const list = document.querySelector<HTMLElement>('.marquee__list')!;
    root.getBoundingClientRect = () => ({ width: 500 }) as DOMRect;
    Object.defineProperty(list, 'scrollWidth', { value: 300, configurable: true });
    resizeCallbacks.forEach((cb) => cb());

    expect(root.style.getPropertyValue('--marquee-duration')).toBe('4s');
    expect(clones()).toHaveLength(2);
  });

  it('remide cuando la lista crece: imagenes que cargan tarde no dejan huecos', () => {
    // Con loading="lazy" (el default de Webflow) la lista mide de menos al
    // cargar. La raiz NO cambia de ancho cuando crece su contenido, asi que
    // vigilarla a ella sola dejaria la duracion y las copias congeladas sobre
    // una medida provisional — y eso se ve como huecos en la tira.
    const root = mountMarquee();
    initCssMarquee();
    expect(clones()).toHaveLength(2);

    const list = document.querySelector<HTMLElement>('.marquee__list')!;
    Object.defineProperty(list, 'scrollWidth', { value: 100, configurable: true });
    resizeCallbacks.forEach((cb) => cb());

    // 500 de carril sobre listas de 100 => 6 listas; ya habia 3.
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('1.3333333333333333s');
    expect(clones()).toHaveLength(5);
  });

  it('el resize no acumula copias: solo anade las que falten', () => {
    mountMarquee();
    initCssMarquee();
    resizeCallbacks.forEach((cb) => cb());
    resizeCallbacks.forEach((cb) => cb());
    expect(clones()).toHaveLength(2);
  });

  it('encuentra la lista por atributo, no por clase (canal ds- de Webflow)', () => {
    // El canal de Webflow prefija TODAS las clases con ds-, asi que .marquee__list
    // no existe ahi. Buscando por clase el modulo salia sin montar nada y la tira
    // se quedaba con el default del CSS: 30s fijos y una sola lista — rapida y
    // con hueco. Es el bug que se vio en produccion el 2026-08-19.
    document.body.innerHTML = `
      <div class="ds-marquee" data-marquee>
        <div class="ds-marquee__list" data-marquee-list><span class="ds-marquee__item">A</span></div>
      </div>`;
    const root = document.querySelector<HTMLElement>('[data-marquee]')!;
    const list = document.querySelector<HTMLElement>('[data-marquee-list]')!;
    root.getBoundingClientRect = () => ({ width: 500 }) as DOMRect;
    Object.defineProperty(list, 'scrollWidth', { value: 300, configurable: true });

    initCssMarquee();

    expect(root.style.getPropertyValue('--marquee-duration')).toBe('4s');
    expect(document.querySelectorAll('[data-marquee-clone]')).toHaveLength(2);
  });

  it('sincroniza la fase de todas las listas al clonar', () => {
    // Cada copia empieza a animarse cuando se inserta, no cuando lo hizo la
    // original. Desfasadas, dos listas dejan de estar separadas exactamente un
    // ancho y eso es hueco o solapamiento al reiniciar el ciclo.
    mountMarquee();
    initCssMarquee();

    const all = document.querySelectorAll<HTMLElement>('.marquee__list');
    expect(all).toHaveLength(3);
    // Tras el reinicio ninguna conserva el animation:none del pulso de sincronia.
    all.forEach((list) => expect(list.style.animation).toBe(''));
  });

  it('reduced-motion: la tira queda estatica y sin contenido repetido', () => {
    setReducedMotion(true);
    const root = mountMarquee();
    const cleanup = initCssMarquee();
    expect(clones()).toHaveLength(0);
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('');
    expect(() => cleanup()).not.toThrow();
  });

  it('data-motion-exempt: ese marquee no se inicializa', () => {
    const root = mountMarquee({ exempt: true });
    initCssMarquee();
    expect(root.dataset.marquee).toBe('');
    expect(clones()).toHaveLength(0);
  });

  it('no toca un marquee draggable: GSAP ya mueve ese mismo eje', () => {
    document.body.innerHTML = `
      <div class="marquee" data-marquee data-draggable-marquee>
        <div class="marquee__list" data-marquee-list><span class="marquee__item">A</span></div>
      </div>`;
    const root = document.querySelector<HTMLElement>('[data-marquee]')!;
    root.getBoundingClientRect = () => ({ width: 500 }) as DOMRect;
    initCssMarquee();
    expect(root.style.getPropertyValue('--marquee-duration')).toBe('');
    expect(clones()).toHaveLength(0);
  });
});
