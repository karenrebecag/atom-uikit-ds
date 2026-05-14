import StyleDictionary from 'style-dictionary';

// Custom transform: kebab-case naming
StyleDictionary.registerTransformGroup({
  name: 'atom/css',
  transforms: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'html/icon',
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
    'src/semantic/**/*.json',
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
