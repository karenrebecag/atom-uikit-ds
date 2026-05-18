import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../../../packages/components-react/src/atoms/Skeleton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconBox } from '../utils/SectionIcons';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Indicators/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: { control: 'select', options: ['default', 'circle', 'text'] },
    className: { table: { disable: true } },
  },
  args: { variant: 'default' },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => {
    type Variant = 'default' | 'circle' | 'text';
    type Composition = 'single' | 'card' | 'user' | 'list';

    const variantOpts: { value: Variant; label: string }[] = [
      { value: 'default', label: 'Default' },
      { value: 'circle', label: 'Circular' },
      { value: 'text', label: 'Texto' },
    ];
    const compositionOpts: { value: Composition; label: string }[] = [
      { value: 'single', label: 'Individual' },
      { value: 'card', label: 'Card' },
      { value: 'user', label: 'Usuario' },
      { value: 'list', label: 'Lista' },
    ];

    const [variant, setVariant] = useState<Variant>('default');
    const [composition, setComposition] = useState<Composition>('single');
    const { animateTransition, transitionStyle } = useTransition();

    const renderComposition = () => {
      switch (composition) {
        case 'single':
          return variant === 'circle'
            ? <Skeleton variant="circle" style={{ width: 48, height: 48 }} />
            : variant === 'text'
              ? <Skeleton variant="text" style={{ width: 200 }} />
              : <Skeleton style={{ width: 200, height: 24 }} />;
        case 'card':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: 280, padding: 'var(--spacing-4)', border: 'var(--stroke-hairline) solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <Skeleton style={{ width: '100%', height: 140 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Skeleton variant="text" style={{ width: '70%' }} />
                <Skeleton variant="text" style={{ width: '100%' }} />
                <Skeleton variant="text" style={{ width: '40%' }} />
              </div>
            </div>
          );
        case 'user':
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Skeleton variant="circle" style={{ width: 40, height: 40 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Skeleton variant="text" style={{ width: 120 }} />
                <Skeleton variant="text" style={{ width: 180 }} />
              </div>
            </div>
          );
        case 'list':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: 280 }}>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <Skeleton variant="circle" style={{ width: 32, height: 32 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Skeleton variant="text" style={{ width: '60%' }} />
                    <Skeleton variant="text" style={{ width: '90%' }} />
                  </div>
                </div>
              ))}
            </div>
          );
      }
    };

    return (
      <StoryPreviewLayout
        minHeight={360}
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
              <div style={sectionLabelRow}><IconBox />{`Composici\u00f3n`}</div>
              <Tabs value={composition} onValueChange={(v) => animateTransition(() => setComposition(v as Composition))}>
                <TabsList animated>
                  {compositionOpts.map((c) => (
                    <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          {renderComposition()}
        </div>
      </StoryPreviewLayout>
    );
  },
};
