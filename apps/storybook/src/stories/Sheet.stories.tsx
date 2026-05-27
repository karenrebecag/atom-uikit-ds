import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter,
} from '../../../../packages/components-react/src/molecules/Sheet';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type Side = 'top' | 'right' | 'bottom' | 'left';

const meta: Meta<typeof Sheet> = {
  title: 'Molecules/Sheet',
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => {
    const sideOptions: { value: Side; label: string }[] = [
      { value: 'left', label: 'Izq' },
      { value: 'right', label: 'Der' },
      { value: 'top', label: 'Arriba' },
      { value: 'bottom', label: 'Abajo' },
    ];

    const [side, setSide] = useState<Side>('right');
    const [showClose, setShowClose] = useState(true);
    const [withForm, setWithForm] = useState(true);

    const { animateTransition } = useTransition();

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Lado</div>
              <Tabs value={side} onValueChange={(v) => animateTransition(() => setSide(v as Side))}>
                <TabsList animated>
                  {sideOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>{`Bot\u00f3n cerrar`}</span>
                  <Toggle animated checked={showClose} onChange={setShowClose} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Con formulario</span>
                  <Toggle animated checked={withForm} onChange={setWithForm} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Sheet>
            <SheetTrigger>
              <Button variant="secondary" size="m">Abrir sheet</Button>
            </SheetTrigger>
            <SheetContent side={side} showCloseButton={showClose}>
              <SheetHeader>
                <SheetTitle>{withForm ? 'Editar perfil' : 'Notificaciones'}</SheetTitle>
                <SheetDescription>
                  {withForm
                    ? 'Modifica tu informacion y guarda los cambios.'
                    : 'Revisa tus notificaciones recientes.'}
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                {withForm ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Field label="Nombre">
                      <Input placeholder="John Doe" />
                    </Field>
                    <Field label="Email">
                      <Input placeholder="john@example.com" type="email" />
                    </Field>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Nuevo mensaje de equipo', 'Tarea asignada', 'Comentario en proyecto', 'Deploy completado'].map((item) => (
                      <div key={item} style={{ padding: '12px 0', borderBottom: 'var(--stroke-hairline) solid var(--border)', fontSize: 'var(--font-size-sm)', color: 'var(--foreground)' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </SheetBody>
              {withForm && (
                <SheetFooter>
                  <Button variant="primary" size="m">Guardar</Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </StoryPreviewLayout>
    );
  },
};
