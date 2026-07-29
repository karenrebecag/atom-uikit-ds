import type { Meta, StoryObj } from '@storybook/react';

/**
 * Logo — marca oficial theme-aware. Los assets son los SVG oficiales en R2
 * (documentados en atoms/logo.css); el sistema muestra la versión correcta
 * según data-theme, sin recolorear nada.
 */
const LIGHT = 'https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-light.svg';
const DARK = 'https://pub-c8d801a0ff204d758910633021fa302b.r2.dev/ATOM-horizontal-dark.svg';

function Logo({ size }: { size: 's' | 'm' | 'l' }) {
  return (
    <a className={`logo logo--${size}`} href="https://atomchat.io" aria-label="Atom">
      <img className="logo__light" src={LIGHT} alt="Atom" />
      <img className="logo__dark" src={DARK} alt="Atom" />
    </a>
  );
}

const meta: Meta = { title: 'Atoms/Logo' };
export default meta;
type Story = StoryObj;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
      <Logo size="s" />
      <Logo size="m" />
      <Logo size="l" />
    </div>
  ),
};

/** data-theme en cualquier ancestro voltea la versión — mismo mecanismo que el resto del DS. */
export const Theming: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 0 }}>
      <div style={{ padding: 32, background: 'var(--background)' }}>
        <Logo size="m" />
      </div>
      <div data-theme="dark" style={{ padding: 32, background: 'var(--background)' }}>
        <Logo size="m" />
      </div>
    </div>
  ),
};
