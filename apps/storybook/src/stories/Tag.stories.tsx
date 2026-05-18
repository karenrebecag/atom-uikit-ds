import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '../../../../packages/components-react/src/atoms/Tag';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconActivity, IconSettings } from '../utils/SectionIcons';

const IconStar = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.67l-3.52 1.68.67-3.93L2.3 5.64l3.94-.57L8 1.5z" />
  </svg>
);

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Indicators/Tag',
  component: Tag,
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'filled', 'outlined'] },
    intent: { control: 'select', options: ['success', 'warning', 'danger', 'info', 'neutral', 'brand', 'ai', 'disabled'] },
    size: { control: 'select', options: ['xs', 's', 'm'] },
    dot: { control: 'boolean' },
    icon: { control: 'boolean', mapping: { true: <IconStar />, false: undefined } },
    children: { control: 'text' },
    avatar: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'filled',
    intent: 'success',
    size: 's',
    dot: false,
    icon: false as any,
    children: 'Label',
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  render: () => {
    type Variant = 'ghost' | 'filled' | 'outlined';
    type Intent = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'ai' | 'disabled';
    type Size = 'xs' | 's' | 'm';

    const variantOpts: { value: Variant; label: string }[] = [
      { value: 'filled', label: 'Filled' },
      { value: 'ghost', label: 'Ghost' },
      { value: 'outlined', label: 'Outlined' },
    ];
    const intentOpts: { value: Intent; label: string }[] = [
      { value: 'success', label: 'Exito' },
      { value: 'warning', label: 'Alerta' },
      { value: 'danger', label: 'Peligro' },
      { value: 'info', label: 'Info' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'brand', label: 'Marca' },
      { value: 'ai', label: 'AI' },
      { value: 'disabled', label: 'Deshab.' },
    ];
    const sizeOpts: { value: Size; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
    ];

    const [variant, setVariant] = useState<Variant>('filled');
    const [intent, setIntent] = useState<Intent>('success');
    const [size, setSize] = useState<Size>('s');
    const [showDot, setShowDot] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [showAvatar, setShowAvatar] = useState(false);
    const { animateTransition, transitionStyle } = useTransition();

    const intentLabels: Record<Intent, string> = {
      success: 'Completado',
      warning: 'En revision',
      danger: 'Error',
      info: 'Informacion',
      neutral: 'Borrador',
      brand: 'Destacado',
      ai: 'Generado por IA',
      disabled: 'Inactivo',
    };

    return (
      <StoryPreviewLayout
        minHeight={380}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Variante</div>
              <Tabs value={variant} onValueChange={(v) => animateTransition(() => setVariant(v as Variant))}>
                <TabsList animated>
                  {variantOpts.map((v) => (
                    <TabsTrigger key={v.value} value={v.value}>{v.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />{`Intenci\u00f3n`}</div>
              <Tabs value={intent} onValueChange={(v) => animateTransition(() => setIntent(v as Intent))}>
                <TabsList animated>
                  {intentOpts.map((i) => (
                    <TabsTrigger key={i.value} value={i.value}>{i.label}</TabsTrigger>
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
              <div style={sectionLabelRow}><IconSettings />Elementos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Punto indicador</span>
                  <Toggle animated checked={showDot} onChange={setShowDot} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Icono</span>
                  <Toggle animated checked={showIcon} onChange={setShowIcon} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Avatar</span>
                  <Toggle animated checked={showAvatar} onChange={setShowAvatar} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Tag
            variant={variant}
            intent={intent}
            size={size}
            dot={showDot}
            icon={showIcon ? <IconStar /> : undefined}
            avatar={showAvatar ? 'https://i.pravatar.cc/32' : undefined}
          >
            {intentLabels[intent]}
          </Tag>
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllIntents: Story = {
  argTypes: { intent: { table: { disable: true } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['filled', 'ghost', 'outlined'] as const).map((v) => (
        <div key={v}>
          <strong style={{ fontSize: 11, color: 'var(--muted-foreground)', display: 'block', marginBottom: 8 }}>{v}</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['success', 'warning', 'danger', 'info', 'neutral', 'brand', 'ai', 'disabled'] as const).map((i) => (
              <Tag key={i} variant={v} intent={i}>{i}</Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
