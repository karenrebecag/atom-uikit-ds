// Mapa de valores CSS crudos -> tokens del Atom UIKit DS.
//
// WHY: el converter resuelve las utilidades Tailwind a CSS real; este módulo reexpresa esos
// valores en tokens del DS (regla de marca: nunca un valor de spacing/radius/color/timing a mano).
// Spacing y radius son base-4 compartidos, así que el mapeo es casi 1:1; la tipografía se ENCAJA a
// la escala Atom (la escala de la casa manda sobre el px exacto de Relume); los colores de scheme
// van a la pareja semántica del DS.

/** spacing-N = N*4 px. Set real publicado por el DS. */
const SPACING_STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 30, 32, 40, 50];
const RADIUS: Array<[number, string]> = [
  [0, 'none'], [4, 'sm'], [8, 'md'], [12, 'lg'], [16, 'xl'], [24, '2xl'], [9999, 'full'],
];
/** font-size token (rem) de Atom, ordenado para encajar por cercanía.
 * Valores REALES del DS (tokens.css: `calc(Npx * --u-text)`, escala 1.25), no inventados:
 * xs 10.24, sm 12.8, base 16, lg 20, xl 25, 2xl 31.25, 3xl 39.06, 4xl 48.83, 5xl 61.04, 6xl 76.29.
 * Solo se usa para elegir el NOMBRE del token por cercanía; el valor fluido lo pone el DS. */
const FONT_SIZE: Array<[number, string]> = [
  [0.64, 'xs'], [0.8, 'sm'], [1, 'base'], [1.25, 'lg'], [1.5625, 'xl'], [1.953125, '2xl'],
  [2.44125, '3xl'], [3.051875, '4xl'], [3.815, '5xl'], [4.768125, '6xl'],
];
const FONT_WEIGHT: Record<string, string> = {
  '400': 'regular', '500': 'medium', '600': 'semibold', '700': 'bold', '800': 'extrabold',
};

const REM = 16;

/** Convierte una longitud ("48px", "3rem", "1.5em") a px numéricos, o null si no es longitud simple. */
export function toPx(v: string): number | null {
  const m = /^(-?\d*\.?\d+)(px|rem|em)$/.exec(v.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === 'px' ? n : n * REM;
}

/** px -> var(--spacing-N) si cae exacto en un paso; si no, null (el caller decide dejar el crudo). */
export function spacingToken(px: number): string | null {
  if (px === 0) return 'var(--spacing-0)';
  const step = px / 4;
  return SPACING_STEPS.includes(step) ? `var(--spacing-${step})` : null;
}

/** px -> paso de spacing MÁS CERCANO. La escala de la casa manda sobre el px exacto de Relume
 * (mismo criterio que fontSizeToken): un margin/gap fuera de la escala se encaja, no se deja a mano. */
export function spacingTokenNearest(px: number): string {
  if (px <= 0) return 'var(--spacing-0)';
  const step = px / 4;
  let best = SPACING_STEPS[0];
  for (const s of SPACING_STEPS) if (Math.abs(s - step) < Math.abs(best - step)) best = s;
  return `var(--spacing-${best})`;
}

export function radiusToken(px: number): string {
  let best = RADIUS[0];
  for (const r of RADIUS) if (Math.abs(r[0] - px) < Math.abs(best[0] - px)) best = r;
  return `var(--radius-${best[1]})`;
}

/** rem -> token de font-size Atom más cercano (encaje a la escala de la casa). */
export function fontSizeToken(rem: number): string {
  let best = FONT_SIZE[0];
  for (const f of FONT_SIZE) if (Math.abs(f[0] - rem) < Math.abs(best[0] - rem)) best = f;
  return `var(--font-size-${best[1]})`;
}

export function fontWeightToken(w: string): string | null {
  const t = FONT_WEIGHT[w.trim()];
  return t ? `var(--font-weight-${t})` : null;
}

/** Colores de scheme de Relume + grises comunes -> pareja semántica del DS. */
const COLOR: Record<string, string> = {
  '#000000': 'var(--foreground)', '#000': 'var(--foreground)', black: 'var(--foreground)',
  'rgb(0 0 0 / 1)': 'var(--foreground)', 'rgb(0 0 0)': 'var(--foreground)',
  'rgb(0, 0, 0)': 'var(--foreground)', 'rgba(0, 0, 0, 1)': 'var(--foreground)',
  '#ffffff': 'var(--background)', '#fff': 'var(--background)', white: 'var(--background)',
  'rgb(255 255 255 / 1)': 'var(--background)', 'rgb(255, 255, 255)': 'var(--background)',
  'var(--scheme-text)': 'var(--foreground)',
  'var(--scheme-background)': 'var(--background)',
  'var(--scheme-border)': 'var(--border)',
  'var(--scheme-foreground)': 'var(--card)',
  'var(--scheme-btn-text)': 'var(--primary-foreground)',
};

export function colorToken(v: string): string | null {
  const key = v.trim().toLowerCase();
  return COLOR[key] ?? null;
}

/**
 * Reexpresa el VALOR de una declaración (prop, value) en tokens del DS.
 * Devuelve el valor nuevo, o el mismo si no hay token (p.ej. porcentajes, 100%, auto).
 */
export function mapValue(prop: string, value: string): string {
  const p = prop.toLowerCase();
  // multi-valor (padding: 4rem 5%) -> mapear token a token
  if (/\s/.test(value.trim()) && !value.includes('(')) {
    return value.trim().split(/\s+/).map((part) => mapValue(prop, part)).join(' ');
  }
  if (p.includes('radius')) {
    const px = toPx(value);
    return px === null ? value : radiusToken(px);
  }
  if (p === 'font-size') {
    const px = toPx(value);
    return px === null ? value : fontSizeToken(px / REM);
  }
  if (p === 'font-weight') return fontWeightToken(value) ?? value;
  // borde: un neutro (negro/gris de Relume) va al token de borde del DS, no a --foreground.
  if (p.startsWith('border') && p.includes('color')) {
    const t = colorToken(value);
    if (t === 'var(--foreground)' || t === 'var(--background)') return 'var(--border)';
    return t ?? value;
  }
  if (p.includes('color') || p === 'background' || p === 'fill' || p === 'stroke') {
    return colorToken(value) ?? value;
  }
  // margin/gap/padding/inset: se ENCAJAN al paso más cercano (la escala de la casa manda).
  if (/(padding|margin|gap|inset|^top$|^right$|^bottom$|^left$)/.test(p)) {
    const px = toPx(value);
    if (px !== null) return spacingTokenNearest(px);
  }
  // width/height/size: solo si cae EXACTO en un paso; si no, se deja (puede ser %, auto, un max real).
  if (/(width|height|size)/.test(p)) {
    const px = toPx(value);
    if (px !== null) {
      const tok = spacingToken(px);
      if (tok) return tok;
    }
  }
  return value;
}
