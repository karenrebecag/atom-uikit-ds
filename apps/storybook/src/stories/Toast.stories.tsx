import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from '../../../../packages/components-react/src/molecules/Toast';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconSettings } from '../utils/SectionIcons';

type Variant = 'default' | 'success' | 'error' | 'warning' | 'info';
type Position = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';

const meta: Meta<typeof Toaster> = {
  title: 'Molecules/Toast',
  component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => {
    const variantOptions: { value: Variant; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'success', label: 'Success' },
      { value: 'error', label: 'Error' },
      { value: 'warning', label: 'Warning' },
      { value: 'info', label: 'Info' },
    ];
    const positionOptions: { value: Position; label: string }[] = [
      { value: 'top-right', label: 'Top R' },
      { value: 'top-center', label: 'Top C' },
      { value: 'bottom-right', label: 'Bot R' },
      { value: 'bottom-center', label: 'Bot C' },
    ];

    const [variant, setVariant] = useState<Variant>('default');
    const [position, setPosition] = useState<Position>('bottom-right');
    const [withDescription, setWithDescription] = useState(false);
    const [withAction, setWithAction] = useState(false);

    const titles: Record<Variant, string> = {
      default: 'Evento creado',
      success: 'Cambios guardados',
      error: 'Algo salio mal',
      warning: 'Revisa tu input',
      info: 'Nueva version disponible',
    };

    const fireToast = () => {
      const opts: Parameters<typeof toast>[1] = {};
      if (withDescription) opts.description = 'Esta es una descripcion adicional del toast.';
      if (withAction) opts.action = { label: 'Deshacer', onClick: () => toast.success('Accion revertida') };

      const fn = variant === 'default' ? toast
        : variant === 'success' ? toast.success
        : variant === 'error' ? toast.error
        : variant === 'warning' ? toast.warning
        : toast.info;

      fn(titles[variant], opts);
    };

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Variante</div>
              <Tabs value={variant} onValueChange={(v) => setVariant(v as Variant)}>
                <TabsList animated>
                  {variantOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Posici\u00f3n`}</div>
              <Tabs value={position} onValueChange={(v) => setPosition(v as Position)}>
                <TabsList animated>
                  {positionOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>{`Descripci\u00f3n`}</span>
                  <Toggle animated checked={withDescription} onChange={setWithDescription} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>{`Acci\u00f3n (Deshacer)`}</span>
                  <Toggle animated checked={withAction} onChange={setWithAction} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Button variant="tertiary" size="m" onClick={fireToast}>
            Mostrar toast
          </Button>
        </div>
        <Toaster position={position} />
      </StoryPreviewLayout>
    );
  },
};
