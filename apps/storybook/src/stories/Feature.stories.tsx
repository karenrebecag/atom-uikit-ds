import type { Meta, StoryObj } from '@storybook/react';

/**
 * Feature — fila "icono + texto (+ valor)". CSS-only: el DS define el wrapper y el
 * consumidor mete su SVG (el DS no envia paths: los iconos son contenido).
 */
const Check = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M9.55 17.6 4.2 12.25l1.42-1.42 3.93 3.93 8.83-8.83 1.42 1.42z" />
  </svg>
);

type Row = { label: string; value?: string };

const ROWS: Row[] = [
  { label: 'WhatsApp, Instagram y Messenger', value: '3 canales' },
  { label: 'Conversaciones incluidas', value: '5,500' },
  { label: 'Usuarios ilimitados' },
  { label: 'Integración vía REST API', value: '3 puntos' },
];

function List({ rows, className }: { rows: Row[]; className: string }) {
  return (
    <ul className={className} style={{ maxWidth: 520 }}>
      {rows.map((row) => (
        <li className="feature" key={row.label}>
          <span className="feature__label">
            <span className="feature__icon">
              <Check />
            </span>
            <span className="feature__text">{row.label}</span>
          </span>
          {row.value ? (
            <span className="tag tag--mono tag--inverse tag--s feature__value">{row.value}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const meta: Meta = { title: 'Atoms/Feature' };
export default meta;
type Story = StoryObj;

/** Variante de lista con hairlines entre filas — la que usa pricing-card. */
export const Divided: Story = {
  render: () => <List rows={ROWS} className="feature-list feature-list--divided" />,
};

export const Plain: Story = {
  render: () => <List rows={ROWS} className="feature-list" />,
};

/** El texto largo hace wrap sin empujar al chip de valor (min-width: 0 + text-wrap: pretty). */
export const TextoLargo: Story = {
  render: () => (
    <List
      className="feature-list feature-list--divided"
      rows={[
        {
          label:
            'Integración con HubSpot, Salesforce, Zapier y cualquier CRM que exponga una API REST documentada',
          value: '3 puntos',
        },
        { label: 'Soporte de plataforma', value: '12×5' },
      ]}
    />
  ),
};
