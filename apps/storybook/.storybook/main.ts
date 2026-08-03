import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (cfg) => {
    // El playground Copy to Webflow importa el generador XscpData del canal,
    // cuya cadena toca lightningcss (binding nativo de Node). En el navegador
    // se sustituye por un stub que lanza: generate-xscp lo tolera y el unico
    // afectado es el prefijado del headCss (identico al del artefacto de la
    // docu, de donde se copia).
    cfg.resolve ??= {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      lightningcss: fileURLToPath(new URL('./lightningcss-browser-stub.mjs', import.meta.url)),
    };
    return cfg;
  },
};

export default config;
