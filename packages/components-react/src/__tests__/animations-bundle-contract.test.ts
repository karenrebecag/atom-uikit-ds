/**
 * Contrato del bundle de navegador (packages/animations/dist/atom-animations.js),
 * el artefacto que publica /v1/animations.js.
 *
 * Vive aqui por la misma razon que animations-motion-contract: este package tiene
 * la infra vitest+jsdom y animations no tiene runner propio.
 *
 * Las dos propiedades que hacen portable este artefacto — y que un refactor del
 * bundler romperia en silencio — son:
 *   1. cada modulo en SU scope (readMotionTokens existe dos veces con firmas distintas)
 *   2. los valores de motion salen de los tokens en runtime, no del JS
 * Ambas tienen test propio abajo.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BUNDLE = resolve(__dirname, '../../../animations/dist/atom-animations.js');
const bundleExists = existsSync(BUNDLE);
const g = globalThis as any;

/** Ejecuta el bundle en el window de jsdom y devuelve el global que expone. */
function loadBundle() {
  const src = readFileSync(BUNDLE, 'utf8');
  // El IIFE se asigna sobre globalThis; en jsdom eso es el window del test.
  new Function(src).call(g);
  return g.AtomMotion;
}

function gsapMock() {
  const timeline: any = { to: vi.fn(), clear: vi.fn(), kill: vi.fn() };
  timeline.to.mockReturnValue(timeline);
  timeline.clear.mockReturnValue(timeline);
  return {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => timeline),
    killTweensOf: vi.fn(),
    utils: { toArray: (s: string) => Array.from(document.querySelectorAll(s)) },
  };
}

function setReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: reduced && q.includes('prefers-reduced-motion'),
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe('bundle de animaciones — artefacto', () => {
  it('existe tras el build', () => {
    expect(
      bundleExists,
      'falta packages/animations/dist/atom-animations.js — corre: pnpm --filter @atom-uikit/animations build'
    ).toBe(true);
  });
});

describe.skipIf(!bundleExists)('bundle de animaciones — contrato', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setReducedMotion(false);
    delete g.AtomMotion;
    delete g.gsap;
    delete g.CustomEase;
    delete g.SplitText;
  });

  afterEach(() => {
    delete g.AtomMotion;
    delete g.gsap;
    delete g.CustomEase;
    delete g.SplitText;
    vi.restoreAllMocks();
  });

  it('expone el global AtomMotion con los 18 init* y initAll', () => {
    const api = loadBundle();
    expect(api).toBeDefined();
    const keys = Object.keys(api).sort();
    expect(keys).toEqual([
      'initAccordion',
      'initAccordionMorph',
      'initAll',
      'initBouncyTabs',
      'initButtonHover',
      'initCssMarquee',
      'initDraggableMarquee',
      'initMegaNav',
      'initMenuButton',
      'initNavAutohide',
      'initOdometer',
      'initProgressNav',
      'initScrollReveal',
      'initSidebarAnimation',
      'initTableOfContents',
      'initTabsSteps',
      'initTextReveal',
      'initTooltipSmart',
      'initVideoPlayer',
    ]);
  });

  it('NO inlinea GSAP: sigue siendo peer dependency', () => {
    const src = readFileSync(BUNDLE, 'utf8');
    // Si GSAP viajara dentro, el bundle pesaria de mas y quedaria congelado en
    // una version. Los modulos deben leerlo de globalThis.
    expect(src).not.toMatch(/gsap\.registerPlugin\s*=/);
    expect(src).toMatch(/globalThis|window/);
  });

  it('aisla cada modulo en su propio scope', () => {
    const src = readFileSync(BUNDLE, 'utf8');
    // readMotionTokens existe en varios modulos con FIRMAS DISTINTAS (number vs
    // string). En scope plano una pisa a la otra y el modulo perdedor recibe una
    // duracion del tipo equivocado, sin error visible. El conteo se deriva del
    // source para que agregar un modulo nuevo no caduque el test.
    const srcDir = resolve(__dirname, '../../../animations/src');
    const { readdirSync } = require('node:fs') as typeof import('node:fs');
    const moduleFiles = readdirSync(srcDir).filter(
      (f: string) => f.endsWith('.ts') && f !== 'index.ts'
    );
    const sourcesWithHelper = moduleFiles.filter((f: string) =>
      readFileSync(resolve(srcDir, f), 'utf8').includes('function readMotionTokens')
    ).length;
    expect(sourcesWithHelper).toBeGreaterThanOrEqual(2);
    expect(src.match(/function readMotionTokens/g)?.length).toBe(sourcesWithHelper);

    // No basta con que existan: cada modulo tiene que estar ENVUELTO.
    // Un wrapper por modulo, mas el IIFE externo que recibe `root`.
    const moduleWrappers = src.match(/\(function \(\) \{/g)?.length ?? 0;
    const exportedInits = src.match(/^\s{4}api\.init\w+ = /gm)?.length ?? 0;
    expect(
      moduleWrappers,
      'cada modulo debe ir en su propio IIFE: en scope compartido los helpers homonimos se pisan'
    ).toBe(exportedInits);
    expect(exportedInits).toBe(moduleFiles.length);

    expect(() => loadBundle()).not.toThrow();
  });

  it('initAll no explota sin GSAP y devuelve un cleanup usable', () => {
    const api = loadBundle();
    let cleanup: any;
    expect(() => {
      cleanup = api.initAll();
    }).not.toThrow();
    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();
  });

  it('initAll no explota en una pagina sin ningun data-attribute', () => {
    g.gsap = gsapMock();
    const api = loadBundle();
    document.body.innerHTML = '<main><p>sin hooks de motion</p></main>';
    expect(() => api.initAll()()).not.toThrow();
  });
});

describe.skipIf(!bundleExists)('bundle de animaciones — puente con los tokens', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setReducedMotion(false);
    delete g.AtomMotion;
  });

  afterEach(() => {
    delete g.AtomMotion;
    delete g.gsap;
    delete g.CustomEase;
    vi.restoreAllMocks();
  });

  it('toma ease y duracion de las custom properties, no del JS', () => {
    const gsap = gsapMock();
    g.gsap = gsap;
    const created: string[] = [];
    g.CustomEase = { create: (name: string, curve: string) => created.push(curve) };

    // Valores deliberadamente distintos de los fallbacks del modulo: si el bundle
    // los ignorara y usara sus literales, este test no los veria.
    document.body.innerHTML = `
      <div id="scope" data-menu-button-animate>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
      </div>`;
    const scope = document.getElementById('scope')!;
    scope.style.setProperty('--easing-osmo', 'cubic-bezier(0.1, 0.2, 0.3, 0.4)');
    scope.style.setProperty('--duration-300', '900ms');

    loadBundle().initMenuButton();

    expect(created).toContain('0.1, 0.2, 0.3, 0.4');
    const defaults = gsap.timeline.mock.calls[0]?.[0]?.defaults;
    expect(defaults?.duration).toBe(0.9);
    // menu-button lee la duracion como NUMERO; si heredara el readMotionTokens de
    // nav-autohide (que devuelve string) esto seria '900ms'.
    expect(typeof defaults?.duration).toBe('number');
  });

  it('cae a los valores del DS cuando la hoja de tokens no cargo', () => {
    const gsap = gsapMock();
    g.gsap = gsap;
    const created: string[] = [];
    g.CustomEase = { create: (_n: string, curve: string) => created.push(curve) };

    document.body.innerHTML = `
      <div data-menu-button-animate>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
      </div>`;

    loadBundle().initMenuButton();

    // El ease firma del DS, para que un DOM sin tokens no se quede sin animacion.
    expect(created).toContain('0.625, 0.05, 0, 1');
    expect(gsap.timeline.mock.calls[0]?.[0]?.defaults?.duration).toBe(0.3);
  });

  it('respeta prefers-reduced-motion aun con GSAP presente', () => {
    const gsap = gsapMock();
    g.gsap = gsap;
    g.CustomEase = { create: vi.fn() };
    setReducedMotion(true);

    document.body.innerHTML = `
      <div data-menu-button-animate>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
        <span class="burger-icon__line"></span>
      </div>`;

    const cleanup = loadBundle().initMenuButton();

    expect(gsap.timeline).not.toHaveBeenCalled();
    expect(typeof cleanup).toBe('function');
  });
});
