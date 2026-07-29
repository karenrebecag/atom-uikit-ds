import type { Meta, StoryObj } from '@storybook/react';
import { pricingPlans } from '../../../../packages/layouts/src/pricing-plans';

/**
 * La story NO reescribe el markup: consume el mismo `html` que publica el registry y
 * solo lo rellena. Si el layout deja de ser autosuficiente, esta story lo delata.
 */
const SLOT = /\{\{([\w-]+)\}\}/g;

/** Misma regla que documenta el pipeline: slot sin valor = elemento fuera. */
function fill(html: string, values: Record<string, string>): string {
  const pruned = html.replace(
    /<(\w+)[^>]*>\{\{([\w-]+)\}\}<\/\1>/g,
    (match, _tag: string, key: string) => (values[key] ? match : ''),
  );
  return pruned.replace(SLOT, (_, key: string) => values[key] ?? '');
}

/** Duplica la fila marcada con data-repeat tantas veces como filas de datos haya. */
function expandRepeats(html: string, rows: Record<string, Record<string, string>[]>): string {
  return html.replace(
    /(<ul[^>]*data-repeat="([\w-]+)"[^>]*>)([\s\S]*?)(<\/ul>)/g,
    (_, open: string, key: string, row: string, close: string) =>
      open + (rows[key] ?? []).map((values) => fill(row, values)).join('') + close,
  );
}

const CONTENT: Record<string, string> = {
  eyebrow: 'Planes',
  headline: 'Elige cómo quieres crecer con Atom',
  subtitle:
    'Ambos planes incluyen usuarios ilimitados, componentes IA y las integraciones que ya usas.',
  footnote: '*El onboarding está sujeto a las condiciones de Atom y de sus partners.',
  plan1_eyebrow: 'Plan más elegido',
  plan1_name: 'Profesional',
  plan1_price: '$1,100',
  plan1_priceUnit: 'USD/MES',
  plan1_channelsLabel: 'Canales: WhatsApp, Instagram y Messenger',
  plan1_ctaLabel: 'Hablar por WhatsApp',
  plan1_ctaHref: '#',
  plan1_ctaId: 'story_profesional',
  plan1_benefitsLabel: 'Incluye',
  plan2_name: 'Enterprise',
  plan2_price: 'Custom',
  plan2_channelsLabel: 'Canales: WhatsApp, Instagram, Messenger y Telegram',
  plan2_ctaLabel: 'Hablar con ventas',
  plan2_ctaHref: '#',
  plan2_ctaId: 'story_enterprise',
  plan2_benefitsLabel: 'Incluye',
};

const ROWS = {
  plan1_feature: [
    { feature_label: 'Números de WhatsApp', feature_value: '3' },
    { feature_label: 'Usuarios ilimitados', feature_value: '' },
    { feature_label: 'Componentes IA', feature_value: '' },
    { feature_label: 'Conversaciones incluidas', feature_value: '5,500' },
    { feature_label: 'Integración vía REST API', feature_value: '3 puntos' },
    { feature_label: 'Soporte de plataforma', feature_value: '12×5' },
  ],
  plan2_feature: [
    { feature_label: 'Números de WhatsApp', feature_value: '5' },
    { feature_label: 'Conversaciones incluidas', feature_value: '20,000+' },
    { feature_label: 'Integraciones Custom', feature_value: '' },
    { feature_label: 'Soporte de plataforma', feature_value: '12×5*' },
  ],
};

const html = fill(expandRepeats(pricingPlans.html, ROWS), CONTENT);

/** El CSS del layout (solo su rejilla) viaja en el propio artefacto: la story lo inyecta
 *  igual que lo instalaria un consumidor. Si faltara, la seccion se veria sin grid. */
function Section({ dangerouslySetInnerHTML }: { dangerouslySetInnerHTML: { __html: string } }) {
  return (
    <>
      <style>{pricingPlans.css}</style>
      <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
    </>
  );
}

const meta: Meta = {
  title: 'Layouts/Pricing Plans',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Section dangerouslySetInnerHTML={{ __html: html }} />,
};

/** El chip de valor y la unidad de precio son opcionales: sin ellos la card no debe romperse. */
export const SinDecoracion: Story = {
  render: () => (
    <Section
      dangerouslySetInnerHTML={{
        __html: fill(
          expandRepeats(pricingPlans.html, {
            plan1_feature: ROWS.plan1_feature.map((r) => ({ ...r, feature_value: '' })),
            plan2_feature: ROWS.plan2_feature.map((r) => ({ ...r, feature_value: '' })),
          }),
          { ...CONTENT, plan1_priceUnit: '', plan1_eyebrow: '' },
        ),
      }}
    />
  ),
};
