import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { Divider } from '../../../../packages/components-react/src/atoms/Divider';

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

/* Section icons (lucide-style, 14px) */
const iconSize = { width: 14, height: 14 };
const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const IconLayers = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);
const IconRuler = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <path d="M21.3 15.3a2.4 2.4 0 010 3.4l-2.6 2.6a2.4 2.4 0 01-3.4 0L2.7 8.7a2.4 2.4 0 010-3.4l2.6-2.6a2.4 2.4 0 013.4 0z" />
    <path d="M14.5 12.5L12 10" /><path d="M11.5 9.5L9 7" /><path d="M8.5 6.5L6 4" />
  </svg>
);
const IconActivity = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconSettings = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEye = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <path d="M2.062 12.348a1 1 0 010-.696 10.75 10.75 0 0119.876 0 1 1 0 010 .696 10.75 10.75 0 01-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconImage = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
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
    const [transitioning, setTransitioning] = useState(false);

    const variant = destructive ? `destructive-${hierarchy}` as const : hierarchy;
    const currentIcon = iconOptions.find((i) => i.value === selectedIcon)!;

    const animateTransition = (fn: () => void) => {
      setTransitioning(true);
      setTimeout(() => { fn(); setTransitioning(false); }, 200);
    };

    const sectionLabelRow: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '10px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--muted-foreground, #a1a1aa)',
      marginBottom: '8px',
    };
    const switchRow: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 0',
    };
    const switchLabel: React.CSSProperties = {
      fontSize: '13px',
      color: 'var(--foreground, #fafafa)',
    };
    const glass: React.CSSProperties = {
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      isolation: 'isolate',
      backdropFilter: 'saturate(120%) blur(16px)',
      WebkitBackdropFilter: 'saturate(120%) blur(16px)',
      background: 'color-mix(in srgb, var(--card, #27272a) 55%, transparent)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
      border: '1px solid color-mix(in srgb, var(--border, #3f3f46) 40%, transparent)',
    };
    const glassLayer = (
      <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', opacity: 0.04, backgroundColor: '#d4d4d4' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'overlay' as const, boxShadow: 'inset 0.28em 0.28em 0.09em -0.33em rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'plus-lighter' as const, boxShadow: 'inset 0.19em 0.28em 0.09em -0.19em rgba(179,179,179,0.35)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'overlay' as const, boxShadow: 'inset -0.19em -0.28em 0.09em -0.19em rgba(179,179,179,0.2)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'darken' as const, boxShadow: 'inset 0 0 1.75em rgba(242,242,242,0.05)' }} />
      </div>
    );

    return (
      <div style={{ ...glass, display: 'flex', flexDirection: 'row', height: '100%', minHeight: '420px', margin: '12px' }}>
        {glassLayer}

        {/* Controls */}
        <div style={{ position: 'relative', zIndex: 1, width: '300px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>

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

        </div>

        {/* Divider */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'stretch', padding: '16px 0' }}>
          <Divider orientation="vertical" />
        </div>

        {/* Preview */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: '1', padding: '24px' }}>
          <div style={{ ...sectionLabelRow, marginBottom: '0' }}><IconEye />Preview</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1' }}>
            <div
              style={{
                transition: 'opacity 0.2s cubic-bezier(0.625, 0.05, 0, 1), transform 0.2s cubic-bezier(0.625, 0.05, 0, 1)',
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'scale(0.92)' : 'scale(1)',
              }}
            >
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
          </div>
        </div>
      </div>
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
