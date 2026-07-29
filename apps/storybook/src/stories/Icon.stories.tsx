import type { Meta, StoryObj } from '@storybook/react';

/**
 * Icon — el DS envia la ESCALA y el color, no los paths (los iconos son contenido).
 * Los tamanos son em: el icono acompana al texto y escala con el.
 */
const PATH = 'M9.55 17.6 4.2 12.25l1.42-1.42 3.93 3.93 8.83-8.83 1.42 1.42z';

const SIZES = ['xs', 's', 'm', 'l', 'xl'] as const;
const INTENTS = ['', 'success', 'brand', 'muted'] as const;

function Icon({ size, intent }: { size?: string; intent?: string }) {
  return (
    <svg
      className={`icon${size ? ` icon--${size}` : ''}${intent ? ` icon--${intent}` : ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATH} />
    </svg>
  );
}

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 24 };
const label: React.CSSProperties = { fontSize: 11, color: 'var(--muted-foreground)', width: 24 };

const meta: Meta = { title: 'Atoms/Icon' };
export default meta;
type Story = StoryObj;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((size) => (
        <div style={row} key={size}>
          <span style={label}>{size}</span>
          <Icon size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Intents: Story = {
  render: () => (
    <div style={row}>
      {INTENTS.map((intent) => (
        <Icon size="l" intent={intent} key={intent || 'current'} />
      ))}
    </div>
  ),
};

/** Sin intent el icono hereda currentColor: escala y color vienen del texto que acompana. */
export const EnTexto: Story = {
  render: () => (
    <p style={{ maxWidth: 420, fontSize: 20 }}>
      <Icon size="s" intent="success" /> El icono escala con el font-size del contexto, sin
      dimensionar SVGs a mano.
    </p>
  ),
};
