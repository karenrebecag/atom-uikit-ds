// Odometer — cifras que ruedan como un contador mecanico al entrar en viewport.
//
// DOM contract:
//   [data-odometer]           el elemento cuyo TEXTO es la cifra final
//   [data-odometer-from]      arranque explicito; por defecto, 10 menos
//   [data-odometer-duration]  segundos del giro (1.2 por defecto)
//   [data-odometer-group]     contenedor opcional: dispara y escalona los suyos
//
// Cualquier caracter que no sea digito se queda quieto mientras las cifras
// ruedan. Por eso "+81%", "-30%" y "€12.499,95" funcionan sin configurar nada:
// el signo, el simbolo y los separadores son estaticos, no casos especiales.
//
// Sobre arrancar 10 antes y no en 0: desde 0 el numero atraviesa decenas que
// no significan nada y el giro se lee como una carga. A diez de distancia se
// lee como un remate — que es lo que una metrica quiere comunicar. Se clampa
// en 0 porque una cifra menor que 10 arrancaria en negativo.
//
// Requires: gsap + ScrollTrigger (globales)
// Respects: prefers-reduced-motion (cifra final, sin giro), data-motion-exempt

/** F8b — single source for Webflow/domContract; must list every data-* the module queries. */
export const REQUIRED_HOOKS = [
  'data-odometer',
  'data-odometer-from',
  'data-odometer-duration',
  'data-odometer-group',
] as const;

/**
 * El markup interno lo genera este modulo; el CSS que lo sostiene va por
 * atributo (odometer.css), no por clase, asi que el prefijo ds- del canal
 * Webflow no le afecta.
 */
export const REQUIRED_ANATOMY = [] as const;

export const GSAP_PLUGINS = ['ScrollTrigger'] as const;

/** Wave-1 Webflow: behaviors must not write canonical BEM classes. */
export const STATES_WRITTEN_AS_CLASSES = false;

type CleanupFn = () => void;

declare const gsap: any;
declare const ScrollTrigger: any;

/** Cuanto por debajo del destino arranca la cuenta si nadie dice otra cosa. */
const DEFAULT_GAP = 10;
const DEFAULT_DURATION = 1.2;
/** Dos vueltas de 0-9 para que TODO digito ruede hacia adelante, nunca atras. */
const DIGIT_CYCLES = 2;
const DIGIT_STAGGER = 0.04;
const ELEMENT_STAGGER = 0.1;

interface Segment {
  type: 'digit' | 'static';
  char: string;
  startDigit?: number;
  hidden?: boolean;
}

function numberAttr(el: Element, name: string): number | null {
  const raw = el.getAttribute(name);
  if (raw === null || raw.trim() === '') return null;
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

/** El paso vertical de la tira es una linea, en em para que escale con la fuente. */
function lineStep(el: Element): number {
  const styles = getComputedStyle(el);
  const lh = styles.lineHeight;
  if (lh === 'normal') return 1.2;
  return parseFloat(lh) / parseFloat(styles.fontSize);
}

function parseSegments(text: string): Segment[] {
  return [...text].map((char) => ({
    type: /\d/.test(char) ? 'digit' : 'static',
    char,
  }));
}

/** Reparte las cifras del arranque en los huecos de digito, alineadas a la derecha. */
function mapStartDigits(segments: Segment[], startValue: number): Segment[] {
  const slots = segments.filter((s) => s.type === 'digit').length;
  const padded = String(Math.floor(Math.abs(startValue)))
    .padStart(slots, '0')
    .slice(-slots);
  let i = 0;
  return segments.map((s) =>
    s.type === 'digit' ? { ...s, startDigit: parseInt(padded[i++], 10) } : s,
  );
}

/**
 * Marca los ceros de relleno de la izquierda.
 *
 * Sin esto, 90 -> 100 arrancaria mostrando "090": el cero sobrante delata que
 * la cifra final tiene un digito mas y estropea la sorpresa. Marcados, esas
 * columnas se despliegan al animar.
 */
function markHidden(segments: Segment[], startValue: number): Segment[] {
  const total = segments.filter((s) => s.type === 'digit').length;
  const abs = Math.floor(Math.abs(startValue));
  const startDigits = abs === 0 ? 1 : String(abs).length;
  const leading = Math.max(0, total - startDigits);
  if (leading === 0) return segments;

  let seen = 0;
  let firstDigitSeen = false;
  let prevHidden = false;
  return segments.map((seg) => {
    if (seg.type === 'digit') {
      firstDigitSeen = true;
      const hidden = seen < leading;
      prevHidden = hidden;
      seen += 1;
      return { ...seg, hidden };
    }
    return { ...seg, hidden: firstDigitSeen && prevHidden };
  });
}

interface Roller {
  roller: HTMLElement;
  targetPos: number;
}

function buildRollers(
  el: HTMLElement,
  segments: Segment[],
  step: number,
  grow: boolean,
): { rollers: Roller[]; reveals: HTMLElement[] } {
  el.innerHTML = '';
  const rollers: Roller[] = [];
  const reveals: HTMLElement[] = [];
  const strip = Array.from({ length: 10 * DIGIT_CYCLES }, (_, d) => d % 10).join('\n');

  segments.forEach((seg) => {
    if (seg.type === 'static') {
      const span = document.createElement('span');
      span.setAttribute('data-odometer-part', 'static');
      span.style.height = `${step}em`;
      span.style.lineHeight = String(step);
      span.textContent = seg.char;
      el.appendChild(span);
      if (grow && seg.hidden) {
        gsap.set(span, { opacity: 0 });
        reveals.push(span);
      }
      return;
    }

    const mask = document.createElement('span');
    mask.setAttribute('data-odometer-part', 'mask');
    mask.style.height = `${step}em`;
    mask.style.lineHeight = String(step);

    const roller = document.createElement('span');
    roller.setAttribute('data-odometer-part', 'roller');
    roller.style.lineHeight = String(step);
    roller.textContent = strip;

    mask.appendChild(roller);
    el.appendChild(mask);

    const startDigit = seg.startDigit ?? 0;
    const isReveal = grow && !!seg.hidden;
    gsap.set(roller, { y: isReveal ? `${step}em` : `${-startDigit * step}em` });

    const endDigit = parseInt(seg.char, 10);
    // Si el destino no es mayor que el arranque, se da la vuelta entera: asi
    // el digito siempre avanza y nunca retrocede a la vista.
    rollers.push({ roller, targetPos: endDigit > startDigit ? endDigit : 10 + endDigit });
    if (isReveal) reveals.push(mask);
  });

  return { rollers, reveals };
}

/** Deja el texto final y retira las tiras: en una pagina con muchas cifras, el
    DOM generado pesa mas que la animacion. */
function restore(el: HTMLElement, text: string) {
  el.innerHTML = '';
  el.textContent = text;
  el.style.removeProperty('width');
  el.style.removeProperty('overflow');
}

export function initOdometer(): CleanupFn {
  if (typeof document === 'undefined') return () => {};
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const cleanups: CleanupFn[] = [];
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const all = Array.from(document.querySelectorAll<HTMLElement>('[data-odometer]')).filter(
    (el) => el.dataset.motionExempt === undefined && el.dataset.odometer !== 'initialized',
  );
  if (!all.length) return () => {};

  // Sin giro, la cifra ya esta escrita en el markup: no hay nada que hacer.
  if (reduced) return () => {};

  // Cada grupo dispara y escalona a los suyos; los sueltos se disparan solos.
  const groups = new Map<HTMLElement | null, HTMLElement[]>();
  all.forEach((el) => {
    const group = el.closest<HTMLElement>('[data-odometer-group]');
    const key = group ?? el;
    const list = groups.get(key) ?? [];
    list.push(el);
    groups.set(key, list);
  });

  groups.forEach((elements, trigger) => {
    const prepared = elements.map((el) => {
      const text = (el.textContent ?? '').trim();
      const digits = parseInt(text.replace(/\D/g, ''), 10) || 0;
      const explicit = numberAttr(el, 'data-odometer-from');
      const from = Math.max(0, explicit ?? digits - DEFAULT_GAP);
      const duration = numberAttr(el, 'data-odometer-duration') ?? DEFAULT_DURATION;
      const step = lineStep(el);

      let segments = parseSegments(text);
      segments = mapStartDigits(segments, from);
      segments = markHidden(segments, from);

      const startDigitCount = from === 0 ? 1 : String(Math.floor(from)).length;
      const grow = startDigitCount < segments.filter((s) => s.type === 'digit').length;

      const { rollers, reveals } = buildRollers(el, segments, step, grow);
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const revealData = reveals.map((node) => {
        const widthEm = node.offsetWidth / fontSize;
        gsap.set(node, { width: 0, overflow: 'hidden' });
        return { node, widthEm };
      });

      el.dataset.odometer = 'initialized';
      return { el, text, rollers, revealData, duration, step };
    });

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: trigger as HTMLElement, start: 'top 80%', once: true },
      onComplete() {
        prepared.forEach(({ el, text }) => restore(el, text));
      },
    });

    prepared.forEach(({ rollers, revealData, duration, step }, index) => {
      const offset = index * ELEMENT_STAGGER;

      revealData.forEach(({ node, widthEm }) => {
        timeline.to(node, { width: `${widthEm}em`, opacity: 1, duration: 0.5, ease: 'power2.out' }, offset);
      });

      rollers.forEach(({ roller, targetPos }, digitIndex) => {
        // De derecha a izquierda: las unidades salen primero, como en un
        // contador real, donde las decenas solo se mueven cuando ya giraron.
        const reversed = rollers.length - 1 - digitIndex;
        timeline.to(
          roller,
          { y: `${-targetPos * step}em`, duration, ease: 'power3.out', force3D: true },
          offset + reversed * DIGIT_STAGGER,
        );
      });
    });

    cleanups.push(() => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      prepared.forEach(({ el, text }) => {
        restore(el, text);
        delete el.dataset.odometer;
      });
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups.length = 0;
  };
}
