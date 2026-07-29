import type { Meta, StoryObj } from '@storybook/react';

/**
 * Section Header — eyebrow + titulo + subtitulo con medida de lectura (~60ch).
 * CSS-only: la entrada de cualquier seccion, para no volver a maquetarla por pagina.
 */
const COPY = {
  eyebrow: 'Planes',
  title: 'Elige cómo quieres crecer con Atom',
  subtitle:
    'Ambos planes incluyen AI Agents, usuarios ilimitados y las integraciones que ya usas. La diferencia está en el volumen y en cuánto quieres personalizar.',
};

function Header({ variant }: { variant?: 'center' | 'wide' }) {
  return (
    <header className={`section-header${variant ? ` section-header--${variant}` : ''}`}>
      <span className="eyebrow section-header__eyebrow">{COPY.eyebrow}</span>
      <h2 className="h2 section-header__title">{COPY.title}</h2>
      <p className="section-header__subtitle">{COPY.subtitle}</p>
    </header>
  );
}

const meta: Meta = { title: 'Layout/Section Header' };
export default meta;
type Story = StoryObj;

export const Left: Story = { render: () => <Header /> };

export const Center: Story = { render: () => <Header variant="center" /> };

/** --wide libera la medida de lectura: para subtitulos cortos a ancho completo. */
export const Wide: Story = { render: () => <Header variant="wide" /> };
