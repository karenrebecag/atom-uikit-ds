import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '../../../../packages/components-react/src/atoms/ButtonGroup';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { Divider } from '../../../../packages/components-react/src/atoms/Divider';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';

/* ---- Component icons ---- */

const IconBold = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
    <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
  </svg>
);

const IconItalic = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const IconUnderline = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v7a6 6 0 0012 0V3" /><line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/* ---- Section icons (14px) ---- */

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
const IconLayout = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
  </svg>
);
const IconBox = () => (
  <svg {...iconSize} viewBox="0 0 24 24" {...iconProps}>
    <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path d="M3.3 7l8.7 5 8.7-5" /><path d="M12 22V12" />
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

const meta: Meta<typeof ButtonGroup> = {
  title: 'Atoms/Buttons/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => {
    type Hierarchy = 'primary' | 'secondary' | 'tertiary';
    type Composition = 'buttons' | 'toolbar' | 'split' | 'pagination';
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
    const compositionOpts: { value: Composition; label: string }[] = [
      { value: 'buttons', label: 'Botones' },
      { value: 'toolbar', label: 'Toolbar' },
      { value: 'split', label: 'Split' },
      { value: 'pagination', label: 'Paginador' },
    ];
    const orientationOpts: { value: 'horizontal' | 'vertical'; label: string }[] = [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
    ];

    const [hierarchy, setHierarchy] = useState<Hierarchy>('secondary');
    const [destructive, setDestructive] = useState(false);
    const [size, setSize] = useState<'xs' | 's' | 'm' | 'l' | 'xl'>('m');
    const [composition, setComposition] = useState<Composition>('buttons');
    const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
    const [animated, setAnimated] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    const variant = destructive ? `destructive-${hierarchy}` as const : hierarchy;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!animated || !ref.current) return;
      const id = requestAnimationFrame(() => {
        initButtonHover({ scope: ref.current ?? undefined });
      });
      return () => cancelAnimationFrame(id);
    }, [animated, hierarchy, destructive, size, composition, orientation]);

    const animateTransition = (fn: () => void) => {
      setTransitioning(true);
      setTimeout(() => { fn(); setTransitioning(false); }, 200);
    };

    const sectionLabelRow: React.CSSProperties = {
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--muted-foreground, #a1a1aa)', marginBottom: '8px',
    };
    const switchRow: React.CSSProperties = {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0',
    };
    const switchLabel: React.CSSProperties = {
      fontSize: '13px', color: 'var(--foreground, #fafafa)',
    };
    const glass: React.CSSProperties = {
      position: 'relative', borderRadius: '20px', overflow: 'hidden', isolation: 'isolate',
      backdropFilter: 'saturate(120%) blur(16px)', WebkitBackdropFilter: 'saturate(120%) blur(16px)',
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

    const renderComposition = () => {
      switch (composition) {
        case 'buttons':
          return (
            <ButtonGroup orientation={orientation}>
              <Button variant={variant} size={size} animated={animated}>Izquierda</Button>
              <Button variant={variant} size={size} animated={animated}>Centro</Button>
              <Button variant={variant} size={size} animated={animated}>Derecha</Button>
            </ButtonGroup>
          );
        case 'toolbar':
          return (
            <ButtonGroup orientation={orientation}>
              <IconButton variant={variant} size={size} icon={<IconBold />} aria-label="Negrita" />
              <IconButton variant={variant} size={size} icon={<IconItalic />} aria-label="Cursiva" />
              <IconButton variant={variant} size={size} icon={<IconUnderline />} aria-label="Subrayado" />
            </ButtonGroup>
          );
        case 'split':
          return (
            <ButtonGroup orientation={orientation}>
              <Button variant={variant} size={size} animated={animated}>Guardar</Button>
              <ButtonGroupSeparator />
              <IconButton variant={variant} size={size} icon={<IconChevronDown />} aria-label="Opciones" />
            </ButtonGroup>
          );
        case 'pagination':
          return (
            <ButtonGroup orientation={orientation}>
              <Button variant={variant} size={size} animated={animated}>Anterior</Button>
              <ButtonGroupText>1 de 10</ButtonGroupText>
              <Button variant={variant} size={size} animated={animated}>Siguiente</Button>
            </ButtonGroup>
          );
      }
    };

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
            <div style={sectionLabelRow}><IconBox />{`Composici\u00f3n`}</div>
            <Tabs value={composition} onValueChange={(v) => animateTransition(() => setComposition(v as Composition))}>
              <TabsList animated>
                {compositionOpts.map((c) => (
                  <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <div style={sectionLabelRow}><IconLayout />{`Orientaci\u00f3n`}</div>
            <Tabs value={orientation} onValueChange={(v) => animateTransition(() => setOrientation(v as typeof orientation))}>
              <TabsList animated>
                {orientationOpts.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
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
          <div
            ref={ref}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1' }}
          >
            <div
              style={{
                transition: 'opacity 0.2s cubic-bezier(0.625, 0.05, 0, 1), transform 0.2s cubic-bezier(0.625, 0.05, 0, 1)',
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'scale(0.92)' : 'scale(1)',
              }}
            >
              {renderComposition()}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/* ---- All Sizes ---- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
      {(['xs', 's', 'm', 'l'] as const).map((size) => (
        <ButtonGroup key={size}>
          <Button variant="secondary" size={size}>A</Button>
          <Button variant="secondary" size={size}>B</Button>
          <Button variant="secondary" size={size}>C</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};
