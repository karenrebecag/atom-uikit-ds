import StyleDictionary from 'style-dictionary';

/**
 * Fluid design unit: spacing, font-size and radius emit as multiples of --u
 * (1 "design pixel", declared in foundation/scaling.css as
 * `calc(var(--size-font) / 16)` — an absolute length that follows the fluid
 * scale). This is what makes the whole system breathe with the viewport, like
 * OSMO — WITHOUT the em trap: em resolves against the local font-size (a
 * padding token used inside an h1 would triple), --u is immune to it.
 *
 * Deliberately NOT fluid: stroke (1px hairlines blur at 1.33px — OSMO keeps
 * theirs fixed too), z-index/opacity/duration (not lengths), radius-full.
 */
const FLUID_CATEGORIES = new Set(['spacing', 'font-size', 'radius', 'rhythm']);

StyleDictionary.registerTransform({
  name: 'size/fluid-u',
  type: 'value',
  filter: (token) => {
    const v = token.$value ?? token.value;
    return FLUID_CATEGORIES.has(token.path[0]) && /^-?[\d.]+(px|rem)$/.test(String(v));
  },
  transform: (token) => {
    const raw = String(token.$value ?? token.value);
    const px = raw.endsWith('rem') ? parseFloat(raw) * 16 : parseFloat(raw);
    if (px === 0) return '0';
    if (px >= 9999) return `${px}px`; // radius-full stays a pill, not a length
    return `calc(${px} * var(--u, 1px))`;
  },
});

// Custom transform: kebab-case naming
StyleDictionary.registerTransformGroup({
  name: 'atom/css',
  transforms: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'html/icon',
    'size/fluid-u',
    'size/rem',
    'color/css',
  ],
});

StyleDictionary.registerTransformGroup({
  name: 'atom/js',
  transforms: [
    'attribute/cti',
    'name/camel',
    'color/hex',
  ],
});

export default {
  source: [
    'src/primitives/**/*.json',
    // Explicit list — not a glob (see 04-contexto-inicial.md quirk)
    'src/semantic/light.json',
    'src/semantic/spacing.json',
    'src/components/**/*.json',
  ],
  platforms: {
    css: {
      transformGroup: 'atom/css',
      buildPath: 'build/css/',
      options: {
        outputReferences: true,
      },
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
        {
          destination: 'primitives.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('primitives'),
          options: { selector: ':root' },
        },
        {
          destination: 'semantic.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic'),
          options: { selector: ':root' },
        },
        {
          destination: 'components.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('components'),
          options: { selector: ':root' },
        },
      ],
    },
    scss: {
      transformGroup: 'atom/css',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_tokens.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
      ],
    },
    js: {
      transformGroup: 'atom/js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.cjs',
          format: 'javascript/module-flat',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    json: {
      transformGroup: 'atom/js',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
        {
          destination: 'tokens-nested.json',
          format: 'json/nested',
        },
      ],
    },
  },
};
