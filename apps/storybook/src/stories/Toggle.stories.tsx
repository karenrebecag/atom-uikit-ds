import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Forms/Toggle',
  component: Toggle,
  argTypes: {
    checked: { control: 'boolean' },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    checked: false,
    animated: false,
    disabled: false,
    label: 'Activar notificaciones',
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => {
    type ToggleState = 'default' | 'disabled';
    const stateOpts: { value: ToggleState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshabilitado' },
    ];

    const [toggleState, setToggleState] = useState<ToggleState>('default');
    const [isAnimated, setIsAnimated] = useState(true);
    const [showLabel, setShowLabel] = useState(true);
    const [checked, setChecked] = useState(false);
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={280}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={toggleState} onValueChange={(v) => animateTransition(() => setToggleState(v as ToggleState))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Animado</span>
                  <Toggle animated checked={isAnimated} onChange={setIsAnimated} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Etiqueta</span>
                  <Toggle animated checked={showLabel} onChange={setShowLabel} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Toggle
            checked={checked}
            disabled={toggleState === 'disabled'}
            animated={isAnimated}
            label={showLabel ? 'Activar notificaciones' : undefined}
            onChange={setChecked}
          />
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllStates: Story = {
  argTypes: {
    checked: { table: { disable: true } },
    disabled: { table: { disable: true } },
    animated: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 32px', alignItems: 'center' }}>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Estado</strong>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Apagado</strong>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Encendido</strong>

      <span style={{ fontSize: 12 }}>Habilitado</span>
      <Toggle label="Apagado" />
      <Toggle checked label="Encendido" />

      <span style={{ fontSize: 12 }}>Animado</span>
      <Toggle animated label="Apagado" />
      <Toggle animated checked label="Encendido" />

      <span style={{ fontSize: 12 }}>Deshabilitado</span>
      <Toggle disabled label="Deshab. apagado" />
      <Toggle disabled checked label="Deshab. encendido" />
    </div>
  ),
};
