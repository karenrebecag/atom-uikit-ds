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
  const tween = { kill: vi.fn(), progress: vi.fn(), timeScale: vi.fn(), pause: vi.fn(), resume: vi.fn() };
  const timeline: any = { to: vi.fn() };
  timeline.to.mockReturnValue(timeline);
  return {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => tween),
    fromTo: vi.fn(),
    timeline: vi.fn(() => timeline),
    killTweensOf: vi.fn(),
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
