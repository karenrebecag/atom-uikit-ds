import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    environmentMatchGlobs: [
      ['test/contract.test.ts', 'node'],
      ['test/schema-isomorph.test.ts', 'node'],
      ['test/submit.test.ts', 'node'],
      ['test/endpoint.test.ts', 'node'],
    ],
    coverage: {
      provider: 'v8',
      include: ['src/core/**', 'src/schemas/**', 'src/transport/**', 'src/context/**'],
      reporter: ['text', 'json-summary'],
      reportsDirectory: './coverage',
    },
  },
});
