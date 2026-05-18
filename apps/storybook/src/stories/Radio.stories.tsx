import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '../../../../packages/components-react/src/atoms/Radio';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings, IconBox } from '../utils/SectionIcons';

const meta: Meta<typeof Radio> = {
  title: 'Atoms/Forms/Radio',
  component: Radio,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
    name: { table: { disable: true } },
    value: { table: { disable: true } },
  },
  args: {
    checked: false,
    disabled: false,
    error: false,
    label: 'Opcion uno',
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => {
    type RadioState = 'default' | 'disabled' | 'error';
    type ContentType = 'single' | 'group';
    const stateOpts: { value: RadioState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
    ];
    const contentOpts: { value: ContentType; label: string }[] = [
      { value: 'single', label: 'Individual' },
      { value: 'group', label: 'Grupo' },
    ];

    const options = [
      { value: 'free', label: 'Gratuito' },
      { value: 'pro', label: 'Profesional' },
      { value: 'enterprise', label: 'Empresarial' },
    ];

    const [radioState, setRadioState] = useState<RadioState>('default');
    const [contentType, setContentType] = useState<ContentType>('group');
    const [showLabel, setShowLabel] = useState(true);
    const [selected, setSelected] = useState('free');
    const { animateTransition, transitionStyle } = useTransition();

    const isDisabled = radioState === 'disabled';
    const isError = radioState === 'error';

    return (
      <StoryPreviewLayout
        minHeight={320}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconBox />Contenido</div>
              <Tabs value={contentType} onValueChange={(v) => animateTransition(() => setContentType(v as ContentType))}>
                <TabsList animated>
                  {contentOpts.map((c) => (
                    <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={radioState} onValueChange={(v) => animateTransition(() => setRadioState(v as RadioState))}>
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
          {contentType === 'single' ? (
            <Radio
              checked={selected === 'free'}
              disabled={isDisabled}
              error={isError}
              label={showLabel ? 'Opcion seleccionada' : undefined}
              name="preview-single"
              onChange={() => setSelected(selected === 'free' ? '' : 'free')}
            />
          ) : (
            <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {options.map((opt) => (
                <Radio
                  key={opt.value}
                  checked={selected === opt.value}
                  disabled={isDisabled}
                  error={isError}
                  label={showLabel ? opt.label : undefined}
                  name="preview-group"
                  value={opt.value}
                  onChange={() => setSelected(opt.value)}
                />
              ))}
            </fieldset>
          )}
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
      <Radio label="Sin marcar" name="s-enabled" />
      <Radio checked label="Marcado" name="s-enabled-checked" />

      <span style={{ fontSize: 12 }}>Deshabilitado</span>
      <Radio disabled label="Deshabilitado" name="s-disabled" />
      <Radio disabled checked label="Deshab. marcado" name="s-disabled-checked" />

      <span style={{ fontSize: 12 }}>Error</span>
      <Radio error label="Error" name="s-error" />
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>&mdash;</span>
    </div>
  ),
};
