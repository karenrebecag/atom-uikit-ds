import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogBody, DialogFooter,
} from '../../../../packages/components-react/src/molecules/Dialog';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type Scenario = 'form' | 'confirm' | 'destructive';

const meta: Meta<typeof Dialog> = {
  title: 'Molecules/Dialog',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => {
    const scenarioOptions: { value: Scenario; label: string }[] = [
      { value: 'form', label: 'Formulario' },
      { value: 'confirm', label: 'Confirmar' },
      { value: 'destructive', label: 'Destructivo' },
    ];

    const [scenario, setScenario] = useState<Scenario>('form');
    const [showClose, setShowClose] = useState(true);
    const [stickyFooter, setStickyFooter] = useState(false);
    const [open, setOpen] = useState(false);

    const { animateTransition } = useTransition();

    const triggerLabel: Record<Scenario, string> = {
      form: 'Editar perfil',
      confirm: 'Confirmar accion',
      destructive: 'Eliminar cuenta',
    };

    const triggerVariant: Record<Scenario, 'secondary' | 'destructive-primary'> = {
      form: 'secondary',
      confirm: 'secondary',
      destructive: 'destructive-primary',
    };

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Escenario</div>
              <Tabs value={scenario} onValueChange={(v) => animateTransition(() => { setScenario(v as Scenario); setOpen(false); })}>
                <TabsList animated>
                  {scenarioOptions.map((o) => (
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
                  <span style={switchLabel}>Footer sticky</span>
                  <Toggle animated checked={stickyFooter} onChange={setStickyFooter} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button variant={triggerVariant[scenario]} size="m">
                {triggerLabel[scenario]}
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={showClose}>

              {scenario === 'form' && (
                <>
                  <DialogHeader>
                    <DialogTitle>Editar perfil</DialogTitle>
                    <DialogDescription>Modifica tu informacion y guarda los cambios.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <Field label="Nombre">
                        <Input placeholder="John Doe" />
                      </Field>
                      <Field label="Email">
                        <Input placeholder="john@example.com" type="email" />
                      </Field>
                    </div>
                  </DialogBody>
                  <DialogFooter sticky={stickyFooter}>
                    <Button variant="primary" size="m" onClick={() => setOpen(false)}>Guardar</Button>
                  </DialogFooter>
                </>
              )}

              {scenario === 'confirm' && (
                <>
                  <DialogHeader>
                    <DialogTitle>Confirmar accion</DialogTitle>
                    <DialogDescription>Esta seguro de que desea continuar? Esta accion no se puede deshacer.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter sticky={stickyFooter}>
                    <Button variant="secondary" size="m" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="primary" size="m" onClick={() => setOpen(false)}>Confirmar</Button>
                  </DialogFooter>
                </>
              )}

              {scenario === 'destructive' && (
                <>
                  <DialogHeader>
                    <DialogTitle>Eliminar cuenta</DialogTitle>
                    <DialogDescription>Esto eliminara permanentemente tu cuenta y todos los datos asociados. Esta accion no se puede deshacer.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter sticky={stickyFooter}>
                    <Button variant="secondary" size="m" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="destructive-primary" size="m" onClick={() => setOpen(false)}>Eliminar</Button>
                  </DialogFooter>
                </>
              )}

            </DialogContent>
          </Dialog>
        </div>
      </StoryPreviewLayout>
    );
  },
};
