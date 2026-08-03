import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/atoms/*.tsx', 'src/molecules/*.tsx', 'src/molecules/sidebar/*.tsx'],
  format: ['esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom', '@atom-uikit/css'],
  jsx: 'automatic',
});
