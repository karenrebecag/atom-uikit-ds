import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem } from '../../../../packages/components-react/src/atoms/Accordion';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

const faqItems = [
  { title: 'Es accesible?', body: 'Si. Cada trigger usa aria-expanded y el contenido anima via CSS grid transitions, siguiendo el patron WAI-ARIA.' },
  { title: 'Soporta dark mode?', body: 'Si. Todos los tokens semanticos se adaptan automaticamente con data-theme="dark" en el elemento html.' },
  { title: 'Se puede personalizar?', body: 'Si. Sobreescribe CSS custom properties en tu stylesheet para cambiar colores, spacing y tipografia sin modificar los paquetes.' },
  { title: 'Como se anima?', body: 'El alto del contenido anima con la tecnica CSS grid-template-rows. El chevron rota 180 grados con transicion.' },
];

const meta: Meta<typeof Accordion> = {
  title: 'Atoms/Layout/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => {
    type ItemCount = '2' | '3' | '4';

    const countOptions: { value: ItemCount; label: string }[] = [
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ];

    const [count, setCount] = useState<ItemCount>('3');
    const [firstOpen, setFirstOpen] = useState(true);

    const { animateTransition, transitionStyle } = useTransition();

    const visibleItems = faqItems.slice(0, parseInt(count, 10));

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Items</div>
              <Tabs value={count} onValueChange={(v) => animateTransition(() => setCount(v as ItemCount))}>
                <TabsList animated>
                  {countOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Primero abierto</span>
                  <Toggle animated checked={firstOpen} onChange={(v) => animateTransition(() => setFirstOpen(v))} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={{ ...transitionStyle, width: '100%', maxWidth: 480 }}>
            <Accordion key={`${count}-${firstOpen}`}>
              {visibleItems.map((item, i) => (
                <AccordionItem
                  key={item.title}
                  title={item.title}
                  defaultOpen={firstOpen && i === 0}
                >
                  {item.body}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
