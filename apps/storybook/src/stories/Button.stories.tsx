import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { initButtonHover } from '../../../../packages/animations/src/button-hover';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconActivity, IconSettings } from '../utils/SectionIcons';

const IconPlus = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const AnimationScope = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const id = requestAnimationFrame(() => {
      initButtonHover({ scope: ref.current ?? undefined });
    });
    return () => cancelAnimationFrame(id);
  }, [key, children]);

  return <div ref={ref}>{children}</div>;
};

const meta: Meta<typeof Button> = {
  title: 'Atoms/Buttons/Button',
  component: Button,
  decorators: [
    (Story, context) => {
      if (context.args.animated) {
        return (
          <AnimationScope>
            <Story />
          </AnimationScope>
        );
      }
      return <Story />;
    },
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive-primary', 'destructive-secondary', 'destructive-tertiary'],
    },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
    },
    iconLeft: {
      control: 'boolean',
      mapping: { true: <IconPlus />, false: undefined },
    },
    iconRight: {
      control: 'boolean',
      mapping: { true: <IconChevronDown />, false: undefined },
    },
    animated: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'm',
    iconLeft: false as any,
    iconRight: false as any,
    animated: false,
    disabled: false,
    loading: false,
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: () => {
    type Hierarchy = 'primary' | 'secondary' | 'tertiary';
    type ButtonState = 'default' | 'loading' | 'disabled';
    const hierarchies: { value: Hierarchy; label: string }[] = [
      { value: 'primary', label: 'Primario' },
      { value: 'secondary', label: 'Secundario' },
      { value: 'tertiary', label: 'Terciario' },
    ];
    const sizeOptions: { value: 'xs' | 's' | 'm' | 'l' | 'xl'; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ];
    const stateOptions: { value: ButtonState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'loading', label: 'Cargando' },
      { value: 'disabled', label: 'Deshab.' },
    ];

    const [hierarchy, setHierarchy] = useState<Hierarchy>('primary');
    const [destructive, setDestructive] = useState(false);
    const [size, setSize] = useState<'xs' | 's' | 'm' | 'l' | 'xl'>('m');
    const [buttonState, setButtonState] = useState<ButtonState>('default');
    const [animated, setAnimated] = useState(true);
    const [iconLeft, setIconLeft] = useState(false);
    const [iconRight, setIconRight] = useState(false);

    const variant = destructive ? `destructive-${hierarchy}` as const : hierarchy;
    const { animateTransition, transitionStyle } = useTransition();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
      const id = requestAnimationFrame(() => {
        initButtonHover({ scope: ref.current ?? undefined });
      });
      return () => cancelAnimationFrame(id);
    }, [hierarchy, destructive, size, buttonState, animated, iconLeft, iconRight]);

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
                  {sizeOptions.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={buttonState} onValueChange={(v) => animateTransition(() => setButtonState(v as ButtonState))}>
                <TabsList animated>
                  {stateOptions.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
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
                <div style={switchRow}>
                  <span style={switchLabel}>Icono izquierda</span>
                  <Toggle animated checked={iconLeft} onChange={setIconLeft} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Icono derecha</span>
                  <Toggle animated checked={iconRight} onChange={setIconRight} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={transitionStyle}>
            <Button
              variant={variant}
              size={size}
              disabled={buttonState === 'disabled'}
              loading={buttonState === 'loading'}
              animated={animated}
              iconLeft={iconLeft ? <IconPlus /> : undefined}
              iconRight={iconRight ? <IconChevronDown /> : undefined}
            >
              Button
            </Button>
          </div>
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
        <Button {...args} variant="primary">Primary</Button>
        <Button {...args} variant="secondary">Secondary</Button>
        <Button {...args} variant="tertiary">Tertiary</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button {...args} variant="destructive-primary">Destructive Primary</Button>
        <Button {...args} variant="destructive-secondary">Dest. Secondary</Button>
        <Button {...args} variant="destructive-tertiary">Dest. Tertiary</Button>
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
      <Button {...args} size="xs">XS</Button>
      <Button {...args} size="s">S</Button>
      <Button {...args} size="m">M</Button>
      <Button {...args} size="l">L</Button>
      <Button {...args} size="xl">XL</Button>
    </div>
  ),
};
