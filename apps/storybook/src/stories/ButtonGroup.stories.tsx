import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '../../../../packages/components-react/src/atoms/ButtonGroup';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { IconButton } from '../../../../packages/components-react/src/atoms/IconButton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconBox, IconLayout, IconSettings } from '../utils/SectionIcons';

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

    const variant = destructive ? `destructive-${hierarchy}` as const : hierarchy;
    const { animateTransition, transitionStyle } = useTransition();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!animated || !ref.current) return;
      const id = requestAnimationFrame(() => {
        initButtonHover({ scope: ref.current ?? undefined });
      });
      return () => cancelAnimationFrame(id);
    }, [animated, hierarchy, destructive, size, composition, orientation]);

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
          </>
        }
      >
        <div
          ref={ref}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
        >
          <div style={transitionStyle}>
            {renderComposition()}
          </div>
        </div>
      </StoryPreviewLayout>
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
