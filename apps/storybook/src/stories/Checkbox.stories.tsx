import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../../../packages/components-react/src/atoms/Checkbox';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Forms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    checked: false,
    disabled: false,
    error: false,
    label: 'Aceptar terminos',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    type CheckedState = 'unchecked' | 'checked' | 'indeterminate';
    type CheckboxState = 'default' | 'disabled' | 'error';
    const checkedOpts: { value: CheckedState; label: string }[] = [
      { value: 'unchecked', label: 'No' },
      { value: 'checked', label: 'Si' },
      { value: 'indeterminate', label: 'Parcial' },
    ];
    const stateOpts: { value: CheckboxState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
    ];

    const [checkedState, setCheckedState] = useState<CheckedState>('unchecked');
    const [checkboxState, setCheckboxState] = useState<CheckboxState>('default');
    const [showLabel, setShowLabel] = useState(true);
    const { animateTransition, transitionStyle } = useTransition();

    const checkedValue: boolean | 'indeterminate' =
      checkedState === 'checked' ? true :
      checkedState === 'indeterminate' ? 'indeterminate' : false;

    return (
      <StoryPreviewLayout
        minHeight={320}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconActivity />Marcado</div>
              <Tabs value={checkedState} onValueChange={(v) => animateTransition(() => setCheckedState(v as CheckedState))}>
                <TabsList animated>
                  {checkedOpts.map((c) => (
                    <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={checkboxState} onValueChange={(v) => animateTransition(() => setCheckboxState(v as CheckboxState))}>
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
                  <span style={switchLabel}>Etiqueta</span>
                  <Toggle animated checked={showLabel} onChange={setShowLabel} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Checkbox
            checked={checkedValue}
            disabled={checkboxState === 'disabled'}
            error={checkboxState === 'error'}
            label={showLabel ? 'Aceptar terminos y condiciones' : undefined}
            onChange={() => {
              setCheckedState(checkedState === 'checked' ? 'unchecked' : 'checked');
            }}
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
    error: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 32px', alignItems: 'center' }}>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Estado</strong>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>No marcado</strong>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Marcado</strong>

      <span style={{ fontSize: 12 }}>Habilitado</span>
      <Checkbox label="Sin marcar" />
      <Checkbox checked label="Marcado" />

      <span style={{ fontSize: 12 }}>Indeterminado</span>
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>&mdash;</span>
      <Checkbox checked="indeterminate" label="Indeterminado" />

      <span style={{ fontSize: 12 }}>Deshabilitado</span>
      <Checkbox disabled label="Deshabilitado" />
      <Checkbox disabled checked label="Deshab. marcado" />

      <span style={{ fontSize: 12 }}>Error</span>
      <Checkbox error label="Error" />
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>&mdash;</span>
    </div>
  ),
};
