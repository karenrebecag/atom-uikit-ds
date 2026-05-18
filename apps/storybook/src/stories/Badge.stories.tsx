import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../../../packages/components-react/src/atoms/Badge';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconActivity } from '../utils/SectionIcons';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Indicators/Badge',
  component: Badge,
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'inbox'] },
    state: { control: 'select', options: ['enabled', 'focused', 'subtle'] },
    children: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'neutral',
    state: 'enabled',
    children: '+100',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: () => {
    type Variant = 'neutral' | 'inbox';
    type State = 'enabled' | 'focused' | 'subtle';

    const variantOpts: { value: Variant; label: string }[] = [
      { value: 'neutral', label: 'Neutral' },
      { value: 'inbox', label: 'Inbox' },
    ];
    const stateOpts: { value: State; label: string }[] = [
      { value: 'enabled', label: 'Enabled' },
      { value: 'focused', label: 'Focused' },
      { value: 'subtle', label: 'Subtle' },
    ];

    const [variant, setVariant] = useState<Variant>('neutral');
    const [state, setState] = useState<State>('enabled');
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={280}
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
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={state} onValueChange={(v) => animateTransition(() => setState(v as State))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Badge variant={variant} state={state}>+100</Badge>
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '16px 32px', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }} />
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Neutral</strong>
      <strong style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Inbox</strong>

      <span style={{ fontSize: 12 }}>Enabled</span>
      <Badge variant="neutral" state="enabled">+100</Badge>
      <Badge variant="inbox" state="enabled">+100</Badge>

      <span style={{ fontSize: 12 }}>Focused</span>
      <Badge variant="neutral" state="focused">+100</Badge>
      <Badge variant="inbox" state="focused">+100</Badge>

      <span style={{ fontSize: 12 }}>Subtle</span>
      <Badge variant="neutral" state="subtle">+100</Badge>
      <Badge variant="inbox" state="subtle">+100</Badge>
    </div>
  ),
};
