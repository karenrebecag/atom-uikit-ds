import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '../../../../packages/components-react/src/atoms/Chip';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconActivity, IconSettings } from '../utils/SectionIcons';

const IconFilter = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h12M4 7h8M6 11h4" />
  </svg>
);

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Indicators/Chip',
  component: Chip,
  argTypes: {
    type: { control: 'select', options: ['outlined', 'filled'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    iconLeft: { control: 'boolean', mapping: { true: <IconFilter />, false: undefined } },
    onClose: { control: 'boolean', mapping: { true: () => {}, false: undefined } },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    focused: { table: { disable: true } },
    children: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    type: 'outlined',
    size: 's',
    children: 'Label',
    iconLeft: true as any,
    onClose: true as any,
    animated: false,
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => {
    type ChipType = 'outlined' | 'filled';
    type ChipState = 'default' | 'disabled' | 'error' | 'focused';
    type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

    const typeOpts: { value: ChipType; label: string }[] = [
      { value: 'outlined', label: 'Outlined' },
      { value: 'filled', label: 'Filled' },
    ];
    const stateOpts: { value: ChipState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshab.' },
      { value: 'error', label: 'Error' },
      { value: 'focused', label: 'Focus' },
    ];
    const sizeOpts: { value: Size; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ];

    const [chipType, setChipType] = useState<ChipType>('outlined');
    const [chipState, setChipState] = useState<ChipState>('default');
    const [size, setSize] = useState<Size>('s');
    const [showIcon, setShowIcon] = useState(true);
    const [closable, setClosable] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Tipo</div>
              <Tabs value={chipType} onValueChange={(v) => animateTransition(() => setChipType(v as ChipType))}>
                <TabsList animated>
                  {typeOpts.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as Size))}>
                <TabsList animated>
                  {sizeOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={chipState} onValueChange={(v) => animateTransition(() => setChipState(v as ChipState))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Elementos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Icono</span>
                  <Toggle animated checked={showIcon} onChange={setShowIcon} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Cerrable</span>
                  <Toggle animated checked={closable} onChange={setClosable} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Animado</span>
                  <Toggle animated checked={isAnimated} onChange={setIsAnimated} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Chip
            type={chipType}
            size={size}
            disabled={chipState === 'disabled'}
            error={chipState === 'error'}
            focused={chipState === 'focused'}
            animated={isAnimated}
            iconLeft={showIcon ? <IconFilter /> : undefined}
            onClose={closable ? () => {} : undefined}
          >
            Filtro
          </Chip>
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const ChipGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip type="filled" size="s" onClose={() => {}}>React</Chip>
      <Chip type="filled" size="s" onClose={() => {}}>TypeScript</Chip>
      <Chip type="filled" size="s" onClose={() => {}}>Astro</Chip>
      <Chip type="filled" size="s" onClose={() => {}}>CSS</Chip>
      <Chip type="outlined" size="s">+ Agregar</Chip>
    </div>
  ),
};
