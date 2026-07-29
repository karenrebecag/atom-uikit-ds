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
    // Necesarios para RESOLVER referencias de component tokens (no se emiten):
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
          destination: 'dark.css',
          format: 'css/variables',
          // Component tokens TAMBIEN se re-declaran bajo [data-theme=dark]:
          // las custom properties resuelven var() donde se DEFINEN, asi que
          // sin re-declararlas heredan la cadena ya resuelta en claro y los
          // componentes no rethemean en superficies dark (bug pricing-card CTA).
          filter: (token) =>
            token.filePath.includes('semantic/dark') ||
            token.filePath.includes('/components/'),
          options: { selector: '[data-theme="dark"]' },
        },
      ],
    },
  },
};
