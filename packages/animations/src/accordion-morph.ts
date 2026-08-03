// Tipos locales (no importar de './index'): este archivo se distribuye SOLO
// como artefacto del registry y debe ser auto-contenido en el consumidor.
// Mismo patron que marquee-draggable/progress-nav/video-player.

/**
 * Morphing accordion — la respuesta "se vierte" de la pildora de la pregunta
 * como liquido (filtro goo blur+threshold) y asienta en un panel limpio.
 *
 * Adaptado de Annnimate (annnimate.com/animations/morphing-accordion) a las
 * convenciones del DS: motion por tokens, contrato data-*, cleanup real.
 *
 * DESVIACION DELIBERADA del original: sin twins "crisp". Alli el trigger/panel
 * son transparentes y una copia nitida fuera del filtro pinta el borde visible
 * (el filtro redondea las esquinas mientras el blur vive). Aqui el trigger y el
 * panel-inner pintan SU PROPIO fondo — elementos reales, opacos, encima del
 * filtro — y cumplen ese rol gratis: el wobble queda tapado salvo en el cuello
 * liquido, que es justo lo que debe verse. Dos divs menos por fila.
 *
 * FUNCIONAL, no decorativo: un accordion es disclosure. reduced-motion y
 * data-motion-exempt quitan el motion (cero timelines, cero filtro), NUNCA la
 * funcion — el toggle instantaneo va por DOM directo, sin gsap.
 *
 * Sin pausa de gsap.globalTimeline en visibilitychange (el original la trae):
 * pausar el timeline GLOBAL toca las animaciones de todo el host — un modulo
 * de un DS no puede permitirselo.
 *
 * Contract:
 *   [data-accordion-morph]              → stage (config via data-attrs)
 *   [data-accordion-morph-row]          → cada fila
 *   [data-accordion-morph-trigger]      → boton pregunta (pinta su fondo)
 *   [data-accordion-morph-panel]        → panel respuesta (height 0, overflow hidden)
 *   [data-accordion-morph-answer]       → texto respuesta (SplitText opcional)
 *   [data-accordion-morph-icon]         → icono +/x (rotacion 135)
 *   [data-accordion-morph-goo]          → capa filtrada (solo formas, sin texto)
 *   [data-accordion-morph-multiple]     → "true" = varias abiertas (default una)
 *   [data-accordion-morph-start-open]   → indice abierto al cargar
 *   [data-accordion-morph-goo-strength] → stdDeviation del blur (default 9)
 *
 * Motion desde tokens (readMotionTokens; fallbacks espejo de los publicados):
 *   apertura  → --duration-700 + --easing-spring  (vecino DS del elastic.out)
 *   cierre    → 0.65 * apertura + --easing-out    (asienta calmo a proposito)
 *   icono     → --duration-500 + --easing-osmo
 *   respuesta → --duration-600 + --stagger-2 + --easing-out
 * Geometria desde tokens: --spacing-3 (gap pildora-panel, debe igualar el
 * margin-top de panel-inner en CSS), --spacing-4 (aire de fila abierta),
 * --spacing-1 (inset de parking del panel goo).
 *
 * Requires: gsap (global). CustomEase para los cubic-bezier de los tokens y
 * SplitText para el reveal por lineas — ambos opcionales con degradacion.
 */

/**
 * F10b — Webflow/domContract single source: contrato ESTRUCTURAL (siempre
 * presente en el markup). Config opcional por dataset — multiple, start-open,
 * goo-strength — queda fuera a proposito, como en marquee-draggable.
 *
 * TODO por data-*, NUNCA por clase: el canal Webflow prefija toda clase con
 * `ds-`, asi que un querySelector('.accordion-morph__x') encuentra NADA en el
 * paste y el componente muere en silencio (bug real, E2E 2026-08-03 — los
 * estilos llegaban, los clicks no). Las clases son pintura prefijable; la
 * estructura viaja por atributos, que el prefijador no toca.
 */
export const REQUIRED_HOOKS = [
  'data-accordion-morph',
  'data-accordion-morph-row',
  'data-accordion-morph-trigger',
  'data-accordion-morph-panel',
  'data-accordion-morph-inner',
  'data-accordion-morph-answer',
  'data-accordion-morph-icon',
  'data-accordion-morph-goo',
  'data-accordion-morph-goo-pill',
  'data-accordion-morph-goo-panel',
  'data-accordion-morph-filter',
] as const;

/** Solo pintura (documentacion de anatomia CSS) — el JS no las consulta. */
export const REQUIRED_ANATOMY = [
  '.accordion-morph__goo-pill',
  '.accordion-morph__goo-panel',
  '.accordion-morph__panel-inner',
  '.accordion-morph__filter-svg',
] as const;

export const GSAP_PLUGINS = ['CustomEase', 'SplitText'] as const;

export const STATES_WRITTEN_AS_CLASSES = false;

export type CleanupFn = () => void;
export interface AnimationConfig {
  scope?: HTMLElement | string;
  debug?: boolean;
}

const ICON_OPEN_ROTATION = 135; // giro amplio que aterriza exacto en una X
const CLOSE_SCALE = 0.65; // el cierre asienta mas calmo que la apertura
const ANSWER_AT = 0.32; // el reveal arranca a esta fraccion de la apertura
const RESIZE_DEBOUNCE_MS = 150;

function parseCssTime(raw: string, fallbackSec: number): number {
  if (!raw) return fallbackSec;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallbackSec;
  return raw.endsWith('ms') ? n / 1000 : n;
}

function parseCssPx(raw: string, fallbackPx: number): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallbackPx;
}

interface Motion {
  openDur: number;
  openEase: string;
  closeEase: string;
  iconDur: number;
  iconEase: string;
  revealDur: number;
  revealEase: string;
  stagger: number;
  panelGap: number;
  openGap: number;
  parkInset: number;
}

/**
 * Motion y geometria desde los tokens en runtime: un cambio de token re-afina
 * cada consumidor sin tocar este modulo. Sin CustomEase, cada cubic-bezier cae
 * a su vecino NOMBRADO de gsap (spring→back.out, resto→expo.out).
 */
function readMotionTokens(el: Element, CustomEase: any): Motion {
  const s = getComputedStyle(el);
  const v = (name: string) => s.getPropertyValue(name).trim();

  const ease = (varName: string, id: string, namedFallback: string): string => {
    const raw = v(varName);
    const bezier = /cubic-bezier\(([^)]+)\)/.exec(raw)?.[1];
    if (bezier && CustomEase) {
      CustomEase.create(id, bezier);
      return id;
    }
    return namedFallback;
  };

  return {
    openDur: parseCssTime(v('--duration-700'), 0.7),
    openEase: ease('--easing-spring', 'accordion-morph-open', 'back.out(1.7)'),
    closeEase: ease('--easing-out', 'accordion-morph-close', 'expo.out'),
    iconDur: parseCssTime(v('--duration-500'), 0.5),
    iconEase: ease('--easing-osmo', 'accordion-morph-icon', 'expo.out'),
    revealDur: parseCssTime(v('--duration-600'), 0.6),
    revealEase: ease('--easing-out', 'accordion-morph-close', 'expo.out'),
    stagger: parseCssTime(v('--stagger-2'), 0.05),
    panelGap: parseCssPx(v('--spacing-3'), 12),
    openGap: parseCssPx(v('--spacing-4'), 16),
    parkInset: parseCssPx(v('--spacing-1'), 4),
  };
}

interface Row {
  el: HTMLElement;
  gooEl: HTMLElement;
  gooPill: HTMLElement | null;
  gooPanel: HTMLElement | null;
  trigger: HTMLElement;
  panel: HTMLElement;
  panelInner: HTMLElement;
  answer: HTMLElement | null;
  icon: HTMLElement | null;
  filterId: string;
  blurEl: SVGElement | null;
  filterClone: SVGElement | null;
  goo: { std: number };
  isOpen: boolean;
  triggerH: number;
  innerH: number;
  rowW: number;
  split: any;
  answerTl: any;
  tl: any;
  onClick: (e: Event) => void;
  onKeydown: (e: KeyboardEvent) => void;
}

let instanceCounter = 0;

export function initAccordionMorph(config: AnimationConfig = {}): CleanupFn {
  const gsap = (globalThis as any).gsap;
  const CustomEase = (globalThis as any).CustomEase;
  const SplitText = (globalThis as any).SplitText;

  if (!gsap) {
    console.warn('[atom-uikit] initAccordionMorph: gsap not found');
    return () => {};
  }

  const scope = config.scope
    ? typeof config.scope === 'string'
      ? document.querySelector(config.scope)
      : config.scope
    : document;
  if (!scope) return () => {};

  const containers = Array.from(
    (scope as Element).querySelectorAll<HTMLElement>('[data-accordion-morph]'),
  );
  if (!containers.length) return () => {};

  const prefersReducedMotion =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const cleanups: CleanupFn[] = [];
  for (const container of containers) {
    const instant = prefersReducedMotion || container.dataset.motionExempt !== undefined;
    cleanups.push(initContainer(container, { gsap, CustomEase, SplitText, instant }));
  }
  return () => cleanups.forEach((fn) => fn());
}

function initContainer(
  container: HTMLElement,
  ctx: { gsap: any; CustomEase: any; SplitText: any; instant: boolean },
): CleanupFn {
  const { gsap, CustomEase, SplitText, instant } = ctx;

  const svg = container.querySelector<SVGElement>('[data-accordion-morph-filter]');
  const filterTemplate = svg?.querySelector('filter') ?? null;
  const defs = svg?.querySelector('defs') ?? null;
  const rowEls = container.querySelectorAll<HTMLElement>('[data-accordion-morph-row]');
  if (!rowEls.length) return () => {};

  const allowMultiple = container.dataset.accordionMorphMultiple === 'true';
  const gooStrength = parseFloat(container.dataset.accordionMorphGooStrength || '9');
  const startOpenRaw = container.dataset.accordionMorphStartOpen;
  const startOpenIndex =
    startOpenRaw !== undefined && startOpenRaw !== '' ? parseInt(startOpenRaw, 10) : -1;

  const motion = readMotionTokens(container, CustomEase);
  const uid = 'accordion-morph-' + ++instanceCounter;

  const rows: Row[] = [];

  const setAria = (r: Row, open: boolean) => {
    r.trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    r.panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) r.panel.removeAttribute('inert');
    else r.panel.setAttribute('inert', '');
  };

  const setGoo = (r: Row, on: boolean) => {
    r.gooEl.style.filter = on ? `url(#${r.filterId})` : 'none';
  };

  const applyBlur = (r: Row) => {
    r.blurEl?.setAttribute('stdDeviation', String(r.goo.std));
  };

  const measure = (r: Row) => {
    r.triggerH = r.trigger.offsetHeight;
    r.innerH = r.panelInner.offsetHeight;
    r.rowW = r.el.offsetWidth;
  };

  // El panel goo arranca metido DETRAS de la pildora: el puente liquido crece
  // desde dentro en vez de aparecer ya formado. El inset esconde sus esquinas
  // (radius-xl, constante — nunca se anima) tras la capsula.
  const parkGooPanel = (r: Row) => {
    if (!r.gooPanel) return;
    gsap.set(r.gooPanel, {
      x: motion.parkInset,
      y: motion.parkInset,
      width: r.rowW - motion.parkInset * 2,
      height: Math.max(r.triggerH - motion.parkInset * 2, 0),
      force3D: true,
    });
  };

  const fitGooPill = (r: Row) => {
    if (!r.gooPill) return;
    gsap.set(r.gooPill, { height: r.triggerH, borderRadius: r.triggerH / 2 });
  };

  const killRowTweens = (r: Row) => {
    r.tl?.kill();
    r.tl = null;
    gsap.killTweensOf([r.gooPanel, r.panel, r.el, r.icon, r.goo, r.answer].filter(Boolean));
  };

  const resetAnswer = (r: Row) => {
    r.answerTl?.kill();
    r.answerTl = null;
    r.split?.revert?.();
    r.split = null;
    if (r.answer) gsap.set(r.answer, { autoAlpha: 0 });
  };

  const animateAnswer = (r: Row) => {
    if (!r.answer) return;
    if (!SplitText) {
      gsap.set(r.answer, { autoAlpha: 1 });
      return;
    }
    resetAnswer(r);
    gsap.set(r.answer, { autoAlpha: 1 });
    r.split = SplitText.create(r.answer, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'accordion-morph__answer-line',
      onSplit: (instance: any) => {
        // Clase generada EN RUNTIME: el prefijador ds- del canal Webflow no
        // puede verla, asi que se anade la variante prefijada a mano — sin
        // esto la mascara de linea no aplica sobre el paste.
        for (const line of instance.lines as Element[]) {
          line.classList.add('ds-accordion-morph__answer-line');
        }
        gsap.set(instance.lines, { yPercent: 100, force3D: true });
        r.answerTl = gsap.timeline();
        r.answerTl.to(instance.lines, {
          yPercent: 0,
          duration: motion.revealDur,
          stagger: motion.stagger,
          ease: motion.revealEase,
          force3D: true,
        });
        return null;
      },
    });
  };

  // Disclosure sin motion: DOM directo, ni gsap ni filtro. La capa goo queda
  // oculta por CSS (solo se enciende en el camino animado).
  const openInstant = (r: Row) => {
    r.isOpen = true;
    setAria(r, true);
    r.panel.style.height = 'auto';
  };
  const closeInstant = (r: Row) => {
    r.isOpen = false;
    setAria(r, false);
    r.panel.style.height = '';
  };

  const openRow = (r: Row) => {
    if (instant) return openInstant(r);
    r.isOpen = true;
    measure(r);
    setAria(r, true);
    killRowTweens(r);

    const openPanelH = motion.panelGap + r.innerH + motion.openGap;

    setGoo(r, true);
    r.goo.std = gooStrength;
    applyBlur(r);
    if (r.gooEl) r.gooEl.style.opacity = '1';

    r.tl = gsap.timeline({ defaults: { force3D: true } });
    r.tl
      .to(
        r.gooPanel,
        {
          x: 0,
          y: r.triggerH + motion.panelGap,
          width: r.rowW,
          height: r.innerH,
          duration: motion.openDur,
          ease: motion.openEase,
        },
        0,
      )
      .to(r.panel, { height: openPanelH, duration: motion.openDur, ease: motion.openEase }, 0)
      .to(r.el, { marginTop: motion.openGap, duration: motion.openDur, ease: motion.openEase }, 0);
    if (r.icon) {
      r.tl.to(
        r.icon,
        { rotation: ICON_OPEN_ROTATION, duration: motion.iconDur, ease: motion.iconEase },
        0,
      );
    }
    r.tl
      // el goo se disuelve mientras el spring asienta — un toggle seco del
      // filtro "revienta" (el gap de reposo sigue al alcance del blur)
      .to(
        r.goo,
        {
          std: 0,
          duration: motion.openDur * 0.25,
          ease: 'power1.in',
          onUpdate: () => applyBlur(r),
          onComplete: () => setGoo(r, false),
        },
        motion.openDur * 0.4,
      )
      .call(() => animateAnswer(r), null, motion.openDur * ANSWER_AT);
  };

  const closeRow = (r: Row) => {
    if (instant) return closeInstant(r);
    r.isOpen = false;
    setAria(r, false);
    killRowTweens(r);

    const closeDur = motion.openDur * CLOSE_SCALE;
    setGoo(r, true);

    r.tl = gsap.timeline({ defaults: { force3D: true } });
    r.tl
      .to(
        r.goo,
        {
          std: gooStrength,
          duration: closeDur * 0.3,
          ease: 'power1.in',
          onUpdate: () => applyBlur(r),
        },
        0,
      )
      .to(
        r.gooPanel,
        {
          x: motion.parkInset,
          y: motion.parkInset,
          width: r.rowW - motion.parkInset * 2,
          height: Math.max(r.triggerH - motion.parkInset * 2, 0),
          duration: closeDur,
          ease: motion.closeEase,
        },
        0,
      )
      .to(r.panel, { height: 0, duration: closeDur, ease: motion.closeEase }, 0)
      .to(r.el, { marginTop: 0, duration: closeDur, ease: motion.closeEase }, 0);
    if (r.icon) {
      r.tl.to(r.icon, { rotation: 0, duration: motion.iconDur, ease: motion.iconEase }, 0);
    }
    if (r.answer) {
      r.tl.to(r.answer, { autoAlpha: 0, duration: 0.15, ease: 'power2.out' }, 0);
    }
    r.tl.to(
      r.goo,
      {
        std: 0,
        duration: closeDur * 0.3,
        ease: 'power1.out',
        onUpdate: () => applyBlur(r),
        onComplete: () => {
          setGoo(r, false);
          resetAnswer(r);
        },
      },
      closeDur * 0.7,
    );
  };

  const toggleRow = (index: number) => {
    const r = rows[index];
    if (!r) return;
    if (r.isOpen) return closeRow(r);
    if (!allowMultiple) {
      rows.forEach((other, i) => {
        if (i !== index && other.isOpen) closeRow(other);
      });
    }
    openRow(r);
  };

  const moveFocus = (from: number, dir: number) => {
    const n = rows.length;
    if (!n) return;
    rows[(from + dir + n) % n].trigger.focus();
  };

  rowEls.forEach((rowEl, i) => {
    const trigger = rowEl.querySelector<HTMLElement>('[data-accordion-morph-trigger]');
    const panel = rowEl.querySelector<HTMLElement>('[data-accordion-morph-panel]');
    const panelInner = rowEl.querySelector<HTMLElement>('[data-accordion-morph-inner]');
    const gooEl = rowEl.querySelector<HTMLElement>('[data-accordion-morph-goo]');
    if (!trigger || !panel || !panelInner || !gooEl) return;

    // Cada fila clona su propio filtro: transiciones concurrentes jamas
    // comparten rampa de blur.
    let filterClone: SVGElement | null = null;
    let filterId = '';
    if (filterTemplate && defs && !instant) {
      filterClone = filterTemplate.cloneNode(true) as SVGElement;
      filterId = `${uid}-${i}`;
      filterClone.setAttribute('id', filterId);
      defs.appendChild(filterClone);
    }

    const r: Row = {
      el: rowEl,
      gooEl,
      gooPill: rowEl.querySelector<HTMLElement>('[data-accordion-morph-goo-pill]'),
      gooPanel: rowEl.querySelector<HTMLElement>('[data-accordion-morph-goo-panel]'),
      trigger,
      panel,
      panelInner,
      answer: rowEl.querySelector<HTMLElement>('[data-accordion-morph-answer]'),
      icon: rowEl.querySelector<HTMLElement>('[data-accordion-morph-icon]'),
      filterId,
      blurEl: filterClone?.querySelector('feGaussianBlur') ?? null,
      filterClone,
      goo: { std: 0 },
      isOpen: false,
      triggerH: 0,
      innerH: 0,
      rowW: 0,
      split: null,
      answerTl: null,
      tl: null,
      onClick: () => toggleRow(rows.indexOf(r)),
      onKeydown: (e: KeyboardEvent) => {
        const idx = rows.indexOf(r);
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          moveFocus(idx, 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          moveFocus(idx, -1);
        }
      },
    };

    trigger.addEventListener('click', r.onClick);
    trigger.addEventListener('keydown', r.onKeydown);
    rows.push(r);
  });

  if (!rows.length) return () => {};

  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  const onResize = () => {
    if (instant) return;
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      rows.forEach((r) => {
        measure(r);
        fitGooPill(r);
        if (r.isOpen) {
          gsap.set(r.gooPanel, {
            x: 0,
            y: r.triggerH + motion.panelGap,
            width: r.rowW,
            height: r.innerH,
          });
          gsap.set(r.panel, { height: motion.panelGap + r.innerH + motion.openGap });
          gsap.set(r.el, { marginTop: motion.openGap });
        } else {
          parkGooPanel(r);
          gsap.set(r.el, { marginTop: 0 });
        }
      });
    }, RESIZE_DEBOUNCE_MS);
  };
  window.addEventListener('resize', onResize);

  // Estado inicial
  rows.forEach((r, i) => {
    const openAtStart = i === startOpenIndex;
    r.isOpen = openAtStart;
    setAria(r, openAtStart);

    if (instant) {
      if (openAtStart) r.panel.style.height = 'auto';
      return;
    }

    measure(r);
    fitGooPill(r);
    parkGooPanel(r);
    setGoo(r, false);
    if (r.gooEl) r.gooEl.style.opacity = '1';
    if (r.answer) gsap.set(r.answer, { autoAlpha: 0 });

    if (openAtStart) {
      gsap.set(r.gooPanel, {
        x: 0,
        y: r.triggerH + motion.panelGap,
        width: r.rowW,
        height: r.innerH,
      });
      gsap.set(r.panel, { height: motion.panelGap + r.innerH + motion.openGap });
      gsap.set(r.el, { marginTop: motion.openGap });
      if (r.icon) gsap.set(r.icon, { rotation: ICON_OPEN_ROTATION });
      animateAnswer(r);
    }
  });

  return () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    rows.forEach((r) => {
      r.trigger.removeEventListener('click', r.onClick);
      r.trigger.removeEventListener('keydown', r.onKeydown);
      killRowTweens(r);
      r.answerTl?.kill();
      r.split?.revert?.();
      r.filterClone?.remove();
    });
  };
}
