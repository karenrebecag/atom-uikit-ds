import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: 'src/index.css',
      output: {
        assetFileNames: 'atom.[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      drafts: {
        customMedia: true,
      },
    },
  },
});
