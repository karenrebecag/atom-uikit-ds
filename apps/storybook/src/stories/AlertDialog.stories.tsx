import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogMedia, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from '../../../../packages/components-react/src/molecules/AlertDialog';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconSettings } from '../utils/SectionIcons';

const IconAlertTriangle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

type Scenario = 'confirm' | 'warning' | 'destructive';
type Size = 'default' | 'sm';

const meta: Meta<typeof AlertDialog> = {
  title: 'Molecules/AlertDialog',
  component: AlertDialog,
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  render: () => {
    const scenarioOptions: { value: Scenario; label: string }[] = [
      { value: 'confirm', label: 'Confirmar' },
      { value: 'warning', label: 'Advertencia' },
      { value: 'destructive', label: 'Destructivo' },
    ];
    const sizeOptions: { value: Size; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'sm', label: 'Compacto' },
    ];

    const [scenario, setScenario] = useState<Scenario>('confirm');
    const [size, setSize] = useState<Size>('default');
    const [showMedia, setShowMedia] = useState(true);

    const { animateTransition } = useTransition();

    const config: Record<Scenario, {
      trigger: string;
      triggerVariant: 'secondary' | 'destructive-primary';
      title: string;
      description: string;
      actionLabel: string;
      actionVariant: 'primary' | 'destructive-primary';
      mediaVariant?: 'default' | 'destructive';
      icon: () => JSX.Element;
    }> = {
      confirm: {
        trigger: 'Confirmar accion',
        triggerVariant: 'secondary',
        title: 'Estas seguro?',
        description: 'Esta accion no se puede deshacer. Se eliminaran permanentemente los datos de tu cuenta.',
        actionLabel: 'Continuar',
        actionVariant: 'primary',
        icon: IconAlertTriangle,
      },
      warning: {
        trigger: 'Advertencia',
        triggerVariant: 'secondary',
        title: 'Precaucion requerida',
        description: 'Esta operacion afectara a todos los miembros del equipo. Asegurate de que todos han sido notificados.',
        actionLabel: 'Proceder',
        actionVariant: 'primary',
        mediaVariant: 'default',
        icon: IconAlertTriangle,
      },
      destructive: {
        trigger: 'Eliminar proyecto',
        triggerVariant: 'destructive-primary',
        title: 'Eliminar proyecto',
        description: 'Esto eliminara permanentemente el proyecto y todos sus datos. Esta accion no se puede deshacer.',
        actionLabel: 'Eliminar',
        actionVariant: 'destructive-primary',
        mediaVariant: 'destructive',
        icon: IconTrash,
      },
    };

    const c = config[scenario];

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Escenario</div>
              <Tabs value={scenario} onValueChange={(v) => animateTransition(() => setScenario(v as Scenario))}>
                <TabsList animated>
                  {scenarioOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as Size))}>
                <TabsList animated>
                  {sizeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Con icono</span>
                  <Toggle animated checked={showMedia} onChange={(v) => animateTransition(() => setShowMedia(v))} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant={c.triggerVariant} size="m">{c.trigger}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size={size}>
              <AlertDialogHeader>
                {showMedia && (
                  <AlertDialogMedia variant={c.mediaVariant}>
                    <c.icon />
                  </AlertDialogMedia>
                )}
                <AlertDialogTitle>{c.title}</AlertDialogTitle>
                <AlertDialogDescription>{c.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant={c.actionVariant}>{c.actionLabel}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </StoryPreviewLayout>
    );
  },
};
