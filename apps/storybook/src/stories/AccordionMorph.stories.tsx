import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { AccordionMorph } from '../../../../packages/components-react/src/molecules/AccordionMorph';
import { initAccordionMorph } from '../../../../packages/animations/src/accordion-morph';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel } from '../utils/StoryPreviewLayout';
import { IconSettings } from '../utils/SectionIcons';

/**
 * La story ejecuta el behavior REAL contra la anatomia REAL del componente.
 *
 * En Storybook no hay GSAP, asi que se monta en modo instantaneo
 * (data-motion-exempt via animated=false): el camino sin-motion del behavior
 * es DOM directo y no toca gsap — el disclosure funciona de verdad al click y
 * el snapshot es determinista. El goo (blur+threshold) exige gsap+CustomEase
 * y navegador real: se valida en el E2E de ds-lab, no aqui.
 *
 * El stub de gsap solo satisface el guard del init; el camino instantaneo
 * jamas lo invoca.
 */

const ITEMS = [
  {
    question: 'Que hace diferentes a los marcos?',
    answer:
      'Cada marco se lamina en carbono crudo en un molde propio y se termina a mano antes de encordar. La rigidez aguanta anos de pista dura, no solo la salida de caja.',
  },
  {
    question: 'Fabrican para zurdos?',
    answer:
      'Todo grip y balance de marco se espeja bajo pedido sin costo extra. Se indica al comprar y se construye zurdo desde la primera capa.',
  },
  {
    question: 'Cual es la garantia por fisuras?',
    answer:
      'Dos anos contra fallo estructural en juego normal, sin letra chica de tension de cuerdas ni superficie. Foto enviada, reemplazo enviado.',
  },
];

function installGsapStub(): () => void {
  const host = globalThis as typeof globalThis & { gsap?: unknown };
  const previous = host.gsap;
  host.gsap = { set: () => {}, to: () => ({ kill: () => {} }), timeline: () => ({}), killTweensOf: () => {} };
  return () => {
    host.gsap = previous;
  };
}

function MorphDemo({ multiple }: { multiple: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const restore = installGsapStub();
    const cleanup = initAccordionMorph({ scope: root });
    return () => {
      cleanup();
      restore();
    };
  }, [multiple]);

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 560 }}>
      <AccordionMorph items={ITEMS} startOpen={0} multiple={multiple} animated={false} />
    </div>
  );
}

const meta: Meta = {
  title: 'Molecules/Accordion Morph',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [multiple, setMultiple] = useState(false);

    return (
      <StoryPreviewLayout
        minHeight={420}
        controls={
          <div>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={switchRow}>
              <span style={switchLabel}>Varias abiertas</span>
              <Toggle animated checked={multiple} onChange={setMultiple} />
            </div>
          </div>
        }
      >
        <MorphDemo key={String(multiple)} multiple={multiple} />
      </StoryPreviewLayout>
    );
  },
};
