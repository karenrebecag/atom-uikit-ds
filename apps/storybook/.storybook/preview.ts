import type { Preview } from '@storybook/react';
// Live token build (ATOM language) — do not snapshot into this app
import '../../../packages/tokens/build/css/tokens.css';
import '../../../packages/tokens/build/css/dark.css';
import '../../../packages/css/src/index.css';

// GSAP real en el preview (estandar de stories 2026-08-03): los behaviors del
// DS leen globalThis.gsap/CustomEase/SplitText, asi que las stories muestran
// el motion VERDADERO — antes el toggle "animated" era un placebo (init hacia
// warn+noop sin gsap). Los snapshots siguen deterministas porque el
// test-runner emula prefers-reduced-motion y todos los behaviors degradan a
// su camino instantaneo (contrato verificado en animations-motion-contract).
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(CustomEase, SplitText, Flip);
(globalThis as Record<string, unknown>).gsap = gsap;
(globalThis as Record<string, unknown>).CustomEase = CustomEase;
(globalThis as Record<string, unknown>).SplitText = SplitText;
(globalThis as Record<string, unknown>).Flip = Flip;

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
