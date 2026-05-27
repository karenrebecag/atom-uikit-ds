import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    outDir: 'dist',
  },
  {
    entry: ['src/auto-init.ts'],
    format: ['iife'],
    globalName: 'AtomWhatsApp',
    outDir: 'dist',
    outExtension: () => ({ js: '.iife.js' }),
    minify: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'browser',
  },
]);
