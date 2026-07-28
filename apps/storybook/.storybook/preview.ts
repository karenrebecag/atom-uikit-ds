import type { Preview } from '@storybook/react';
// Live token build (OSMO language) — do not snapshot into this app
import '../../../packages/tokens/build/css/tokens.css';
import '../../../packages/tokens/build/css/dark.css';
import '../../../packages/css/src/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / Dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      // Canvas chrome uses semantic tokens so QA sees the real language
      document.body.style.backgroundColor =
        theme === 'dark' ? 'var(--background, #0a0a0a)' : 'var(--muted, #f5f5f5)';
      document.body.style.color = 'var(--foreground)';
      document.body.style.fontFamily = 'var(--font-family-sans)';
      return Story();
    },
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
