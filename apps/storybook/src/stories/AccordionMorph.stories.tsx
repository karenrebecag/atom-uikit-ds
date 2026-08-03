import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { AccordionMorph } from '../../../../packages/components-react/src/molecules/AccordionMorph';
import { initAccordionMorph } from '../../../../packages/animations/src/accordion-morph';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel } from '../utils/StoryPreviewLayout';
import { IconSettings } from '../utils/SectionIcons';
import { CopyToWebflow } from '../utils/CopyToWebflow';
import accordionMorphCss from '../../../../packages/css/src/components/layout/accordion-morph.css?raw';

/**
 * Estandar de stories (Button es el canonico): behavior REAL con el GSAP que
 * carga preview.ts, toggle de animacion, y el theme lo pone el visor
 * (decorator global + &globals=theme:X desde la docu).
 *
 * El goo se ve DE VERDAD aqui. Los baselines visuales no se mueven: el
 * test-runner emula prefers-reduced-motion y el behavior degrada a su camino
 * instantaneo (disclosure funcional, cero filtro).
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

function MorphDemo({ multiple, animated }: { multiple: boolean; animated: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanup = initAccordionMorph({ scope: root });
    return cleanup;
  }, [multiple, animated]);

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 560 }}>
      <CopyToWebflow slug="accordion-morph" css={accordionMorphCss}>
        <AccordionMorph items={ITEMS} startOpen={0} multiple={multiple} animated={animated} />
      </CopyToWebflow>
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
    const [animated, setAnimated] = useState(true);

    return (
      <StoryPreviewLayout
        minHeight={420}
        controls={
          <div>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={switchRow}>
              <span style={switchLabel}>Animado (goo)</span>
              <Toggle animated checked={animated} onChange={setAnimated} />
            </div>
            <div style={switchRow}>
              <span style={switchLabel}>Varias abiertas</span>
              <Toggle animated checked={multiple} onChange={setMultiple} />
            </div>
          </div>
        }
      >
        <MorphDemo key={`${animated}-${multiple}`} multiple={multiple} animated={animated} />
      </StoryPreviewLayout>
    );
  },
};
