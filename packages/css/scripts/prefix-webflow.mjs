/**
 * Reescribe las clases del artefacto de Webflow al namespace `ds-`, vía el
 * visitor de selectores de LightningCSS (AST real — nunca regex sobre el CSS
 * compilado; ADR 006).
 *
 * Por qué existe: en Webflow las clases son globales y cuatro nombres del DS ya
 * están tomados en atomchat.io con otra semántica (.button, .button__label,
 * .is--default, .is--hover). Reusarlos acoplaría los componentes nuevos a
 * estilos ajenos, así que el canal de Webflow consume el mismo CSS con nombres
 * propios.
 *
 * EXCEPCIÓN: `button__split-char` NO se prefija. Esa clase no la escribe nadie
 * en el Designer — la genera GSAP SplitText en runtime (charsClass en
 * button-hover.ts), así que el CSS tiene que seguir esperándola tal cual.
 */
import { transform } from 'lightningcss';

export const PREFIX = 'ds-';

/** Clases generadas por JS en runtime: el CSS debe conservar el nombre literal. */
export const RUNTIME_CLASSES = new Set(['button__split-char']);

/**
 * Nombres que el DS escribe con doble guion de estado y el canal de Webflow
 * expone como combo `ds-is-*` (Webflow no acepta `--` en nombres de clase).
 */
const STATE_RENAMES = new Map([
  ['is--default', 'is-default'],
  ['is--hover', 'is-hover'],
  ['is--static', 'is-static'],
  ['button__label-inner', 'button__inner'],
  // whatsapp-button-motion: el patron button-009 necesita los dos iconos, y sus
  // posiciones son estado, no variante.
  ['is--left', 'is-left'],
  ['is--right', 'is-right'],
  ['atom-wa-btn--animated', 'atom-wa-btn-animated'],
]);

/** Un estado del DS que llegue aqui sin renombrar deja un `ds-is--x` feo en Webflow. */
export function findUnrenamedStates(css) {
  return [...new Set([...css.matchAll(/\.ds-([a-z0-9_-]*--[a-z0-9_-]+)/g)].map((m) => m[1]))];
}

export function prefixClassName(name) {
  if (RUNTIME_CLASSES.has(name)) return name;
  return PREFIX + (STATE_RENAMES.get(name) ?? name);
}

/**
 * @param {unknown[]} selector Lista de componentes de selector de LightningCSS.
 *
 * Recursivo a propósito: el visitor NO desciende a los argumentos de `:is()`,
 * `:where()` y compañía, así que un `.button` dentro de `:is(.button, …)` se
 * quedaba sin prefijar y el artefacto seguía pudiendo pisar al host.
 */
export function prefixSelector(selector) {
  return selector.map((part) => {
    if (part?.type === 'class') return { ...part, name: prefixClassName(part.name) };
    if (part?.type === 'pseudo-class' && Array.isArray(part.selectors)) {
      return { ...part, selectors: part.selectors.map(prefixSelector) };
    }
    return part;
  });
}

/**
 * @param {string} css CSS compilado del entry de Webflow.
 * @returns {string} El mismo CSS con las clases bajo el namespace `ds-`.
 */
/**
 * Baseline moderna para NO emitir los fallbacks legacy de `:is()`.
 *
 * LightningCSS expande `:is()` a `:-webkit-any()` / `:-moz-any()`, y el visitor
 * de selectores NO entra en esas ramas: las clases de adentro quedaban sin
 * prefijar y el artefacto seguía llevando un `.button` capaz de pisar al del
 * sitio anfitrión. Con targets donde `:is()` es nativo, esas ramas no se generan.
 * (`:is()` — Chrome 88, Safari 14, Firefox 78.)
 */
const MODERN = { chrome: 88 << 16, firefox: 78 << 16, safari: 14 << 16 };

export function prefixWebflowCss(css) {
  const { code } = transform({
    filename: 'webflow.css',
    code: Buffer.from(css),
    minify: true,
    targets: MODERN,
    visitor: { Selector: prefixSelector },
  });
  return code.toString();
}

/**
 * Clases que quedaron SIN prefijar y no son de runtime. Una sola basta para que
 * el artefacto pise estilos del sitio anfitrión, que es justo lo que este
 * namespace evita — por eso el build falla en vez de avisar.
 *
 * @param {string} css
 * @returns {string[]}
 */
export function findUnprefixedClasses(css) {
  const offenders = new Set();
  transform({
    filename: 'webflow.css',
    code: Buffer.from(css),
    minify: false,
    targets: MODERN,
    visitor: {
      Selector(selector) {
        const walk = (parts) => {
          for (const part of parts) {
            if (part?.type === 'class') {
              if (!RUNTIME_CLASSES.has(part.name) && !part.name.startsWith(PREFIX)) {
                offenders.add(part.name);
              }
            } else if (part?.type === 'pseudo-class' && Array.isArray(part.selectors)) {
              part.selectors.forEach(walk);
            }
          }
        };
        walk(selector);
        return selector;
      },
    },
  });

  // El visitor no ve dentro de los fallbacks legacy de `:is()`, así que una
  // clase sin prefijar podía sobrevivir ahí. Barrido textual como red: no
  // sustituye al AST, lo cubre donde el AST no llega.
  for (const m of css.matchAll(/[:-]any\(([^)]*)\)/g)) {
    for (const cls of m[1].matchAll(/\.([a-zA-Z][\w-]*)/g)) {
      if (!RUNTIME_CLASSES.has(cls[1]) && !cls[1].startsWith(PREFIX)) offenders.add(cls[1]);
    }
  }
  return [...offenders];
}
