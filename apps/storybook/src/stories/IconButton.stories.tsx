import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconActivity, IconSettings, IconImage } from '../utils/SectionIcons';

const IconPlus = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const IconArrow = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10">
    <path d="M14 19L21 12L14 5" />
    <path d="M21 12H2" />
  </svg>
);

const IconX = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </svg>
);

const IconCheck = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5l3.5 3.5 6.5-7" />
  </svg>
);

const IconHeart = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
  </svg>
);

const IconTrash = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/Buttons/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive-primary', 'destructive-secondary', 'destructive-tertiary'],
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
    },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
  args: {
    variant: 'primary',
    size: 'm',
    animated: false,
    disabled: false,
    loading: false,
    icon: <IconPlus />,
    'aria-label': 'Add item',
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

const iconOptions: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'plus', label: 'Plus', icon: <IconPlus /> },
  { value: 'x', label: 'Cerrar', icon: <IconX /> },
  { value: 'heart', label: 'Favorito', icon: <IconHeart /> },
  { value: 'trash', label: 'Eliminar', icon: <IconTrash /> },
];

export const Default: Story = {
  render: () => {
    type Hierarchy = 'primary' | 'secondary' | 'tertiary';
    type ButtonState = 'default' | 'loading' | 'disabled';
    const hierarchies: { value: Hierarchy; label: string }[] = [
      { value: 'primary', label: 'Primario' },
      { value: 'secondary', label: 'Secundario' },
      { value: 'tertiary', label: 'Terciario' },
    ];
    const sizeOpts: { value: 'xs' | 's' | 'm' | 'l' | 'xl'; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ];
    const stateOpts: { value: ButtonState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'loading', label: 'Cargando' },
      { value: 'disabled', label: 'Deshab.' },
    ];

    const [hierarchy, setHierarchy] = useState<Hierarchy>('primary');
    const [destructive, setDestructive] = useState(false);
    const [size, setSize] = useState<'xs' | 's' | 'm' | 'l' | 'xl'>('m');
    const [buttonState, setButtonState] = useState<ButtonState>('default');
    const [animated, setAnimated] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('plus');

    const variant = destructive ? `destructive-${hierarchy}` as const : hierarchy;
    const currentIcon = iconOptions.find((i) => i.value === selectedIcon)!;
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Variante</div>
              <Tabs value={hierarchy} onValueChange={(v) => animateTransition(() => setHierarchy(v as Hierarchy))}>
                <TabsList animated>
                  {hierarchies.map((h) => (
                    <TabsTrigger key={h.value} value={h.value}>{h.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />{`Tama\u00f1o`}</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as typeof size))}>
                <TabsList animated>
                  {sizeOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={buttonState} onValueChange={(v) => animateTransition(() => setButtonState(v as ButtonState))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconImage />Icono</div>
              <Tabs value={selectedIcon} onValueChange={(v) => animateTransition(() => setSelectedIcon(v))}>
                <TabsList animated>
                  {iconOptions.map((i) => (
                    <TabsTrigger key={i.value} value={i.value}>{i.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Destructivo</span>
                  <Toggle animated checked={destructive} onChange={(v) => animateTransition(() => setDestructive(v))} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Animado</span>
                  <Toggle animated checked={animated} onChange={setAnimated} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <IconButton
            variant={variant}
            size={size}
            disabled={buttonState === 'disabled'}
            loading={buttonState === 'loading'}
            animated={animated}
            icon={currentIcon.icon}
            aria-label={currentIcon.label}
          />
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllVariants: Story = {
  argTypes: {
    variant: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconButton {...args} variant="primary" aria-label="Primary" />
        <IconButton {...args} variant="secondary" aria-label="Secondary" />
        <IconButton {...args} variant="tertiary" aria-label="Tertiary" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconButton {...args} variant="destructive-primary" aria-label="Destructive Primary" />
        <IconButton {...args} variant="destructive-secondary" aria-label="Dest. Secondary" />
        <IconButton {...args} variant="destructive-tertiary" aria-label="Dest. Tertiary" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <IconButton {...args} size="xs" aria-label="XS" />
      <IconButton {...args} size="s" aria-label="S" />
      <IconButton {...args} size="m" aria-label="M" />
      <IconButton {...args} size="l" aria-label="L" />
      <IconButton {...args} size="xl" aria-label="XL" />
    </div>
  ),
};

export const WithArrowIcon: Story = {
  args: {
    icon: <IconArrow />,
    'aria-label': 'Next',
  },
};
