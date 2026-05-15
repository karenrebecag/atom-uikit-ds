import StyleDictionary from 'style-dictionary';

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

export default {
  source: [
    'src/primitives/**/*.json',
    'src/semantic/dark.json',
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
          destination: 'dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic/dark'),
          options: { selector: '[data-theme="dark"]' },
        },
      ],
    },
  },
};
