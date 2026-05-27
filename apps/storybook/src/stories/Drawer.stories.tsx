import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerBody, DrawerFooter,
} from '../../../../packages/components-react/src/molecules/Drawer';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type Direction = 'top' | 'right' | 'bottom' | 'left';

const meta: Meta<typeof Drawer> = {
  title: 'Molecules/Drawer',
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const dirOptions: { value: Direction; label: string }[] = [
      { value: 'bottom', label: 'Abajo' },
      { value: 'top', label: 'Arriba' },
      { value: 'right', label: 'Der' },
      { value: 'left', label: 'Izq' },
    ];

    const [direction, setDirection] = useState<Direction>('bottom');
    const [withForm, setWithForm] = useState(true);
    const [withFooter, setWithFooter] = useState(true);

    const { animateTransition } = useTransition();

    const dismissHint: Record<Direction, string> = {
      bottom: 'Desliza hacia abajo para cerrar.',
      top: 'Desliza hacia arriba para cerrar.',
      right: 'Desliza hacia la derecha para cerrar.',
      left: 'Desliza hacia la izquierda para cerrar.',
    };

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />{`Direcci\u00f3n`}</div>
              <Tabs value={direction} onValueChange={(v) => animateTransition(() => setDirection(v as Direction))}>
                <TabsList animated>
                  {dirOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Con formulario</span>
                  <Toggle animated checked={withForm} onChange={setWithForm} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Footer</span>
                  <Toggle animated checked={withFooter} onChange={setWithFooter} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Drawer>
            <DrawerTrigger>
              <Button variant="secondary" size="m">Abrir drawer</Button>
            </DrawerTrigger>
            <DrawerContent direction={direction}>
              <DrawerHeader>
                <DrawerTitle>{withForm ? 'Editar perfil' : 'Notificaciones'}</DrawerTitle>
                <DrawerDescription>{dismissHint[direction]}</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                {withForm ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 340, margin: '0 auto', width: '100%' }}>
                    <Field label="Nombre"><Input placeholder="John Doe" /></Field>
                    <Field label="Email"><Input placeholder="john@example.com" /></Field>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340, margin: '0 auto', width: '100%' }}>
                    {['Nuevo mensaje de equipo', 'Tarea asignada', 'Deploy completado'].map((item) => (
                      <div key={item} style={{ padding: '12px 0', borderBottom: 'var(--stroke-hairline) solid var(--border)', fontSize: 'var(--font-size-sm)', color: 'var(--foreground)' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </DrawerBody>
              {withFooter && (
                <DrawerFooter>
                  <Button variant="primary" size="m">{withForm ? 'Guardar' : 'Ver todo'}</Button>
                </DrawerFooter>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </StoryPreviewLayout>
    );
  },
};
