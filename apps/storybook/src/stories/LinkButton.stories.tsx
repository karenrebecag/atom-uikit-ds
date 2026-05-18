import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from '../../../../packages/components-react/src/atoms/LinkButton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { Divider } from '../../../../packages/components-react/src/atoms/Divider';

/* Section icons (lucide-style, 14px) */
const iconSize = { width: 14, height: 14 };
const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

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

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/Buttons/LinkButton',
  component: LinkButton,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    animated: { control: 'boolean' },
    children: { control: 'text' },
    disabled: { table: { disable: true } },
    href: { table: { disable: true } },
  },
  args: {
    size: 'default',
    disabled: false,
    animated: false,
    children: 'View documentation',
    href: 'https://uikit.atomchat.io',
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {
  render: () => {
    type LinkState = 'default' | 'disabled';
    const sizeOpts: { value: 'xs' | 'sm' | 'default' | 'lg' | 'xl'; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 'sm', label: 'SM' },
      { value: 'default', label: 'Default' },
      { value: 'lg', label: 'LG' },
      { value: 'xl', label: 'XL' },
    ];
    const stateOpts: { value: LinkState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshabilitado' },
    ];

    const [size, setSize] = useState<'xs' | 'sm' | 'default' | 'lg' | 'xl'>('default');
    const [linkState, setLinkState] = useState<LinkState>('default');
    const [animated, setAnimated] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

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
      <div style={{ ...glass, display: 'flex', flexDirection: 'row', height: '100%', minHeight: '320px', margin: '12px' }}>
        {glassLayer}

        {/* Controls */}
        <div style={{ position: 'relative', zIndex: 1, width: '300px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>

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
            <Tabs value={linkState} onValueChange={(v) => animateTransition(() => setLinkState(v as LinkState))}>
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
              <LinkButton
                size={size}
                disabled={linkState === 'disabled'}
                animated={animated}
                href="https://uikit.atomchat.io"
                onClick={(e) => e.preventDefault()}
              >
                Ver documentaci&oacute;n
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const AllSizes: Story = {
  argTypes: {
    size: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <LinkButton {...args} size="xs">Extra small</LinkButton>
      <LinkButton {...args} size="sm">Small</LinkButton>
      <LinkButton {...args} size="default">Default</LinkButton>
      <LinkButton {...args} size="lg">Large</LinkButton>
      <LinkButton {...args} size="xl">Extra large</LinkButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
