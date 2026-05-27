import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image, type ImageSize, type ImageRatio, type ImageRadius } from '../../../../packages/components-react/src/atoms/Image';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconRuler, IconLayout, IconBox } from '../utils/SectionIcons';

const meta: Meta<typeof Image> = {
  title: 'Atoms/Media/Image',
  component: Image,
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'hero', 'full'] },
    ratio: { control: 'select', options: ['1x1', '4x3', '16x9', '21x9'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
    className: { table: { disable: true } },
  },
  args: {
    size: 'm',
    radius: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

const SAMPLE_IMG = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop';

export const Default: Story = {
  render: () => {
    const sizeOpts: { value: ImageSize; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'hero', label: 'Hero' },
      { value: 'full', label: 'Full' },
    ];
    const ratioOpts: { value: ImageRatio | 'auto'; label: string }[] = [
      { value: 'auto', label: 'Auto' },
      { value: '1x1', label: '1:1' },
      { value: '4x3', label: '4:3' },
      { value: '16x9', label: '16:9' },
      { value: '21x9', label: '21:9' },
    ];
    const radiusOpts: { value: ImageRadius; label: string }[] = [
      { value: 'none', label: 'None' },
      { value: 'sm', label: 'SM' },
      { value: 'md', label: 'MD' },
      { value: 'lg', label: 'LG' },
      { value: 'xl', label: 'XL' },
      { value: 'full', label: 'Full' },
    ];

    const [size, setSize] = useState<ImageSize>('m');
    const [ratio, setRatio] = useState<ImageRatio | 'auto'>('auto');
    const [radius, setRadius] = useState<ImageRadius>('md');
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={420}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconRuler />Tamano</div>
              <Tabs value={size} onValueChange={(v) => animateTransition(() => setSize(v as ImageSize))}>
                <TabsList animated>
                  {sizeOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconLayout />Aspect Ratio</div>
              <Tabs value={ratio} onValueChange={(v) => animateTransition(() => setRatio(v as ImageRatio | 'auto'))}>
                <TabsList animated>
                  {ratioOpts.map((r) => (
                    <TabsTrigger key={r.value} value={r.value}>{r.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconBox />Radius</div>
              <Tabs value={radius} onValueChange={(v) => animateTransition(() => setRadius(v as ImageRadius))}>
                <TabsList animated>
                  {radiusOpts.map((r) => (
                    <TabsTrigger key={r.value} value={r.value}>{r.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Image
            src={SAMPLE_IMG}
            alt="Sample image"
            size={size}
            ratio={ratio === 'auto' ? undefined : ratio}
            radius={radius}
          />
        </div>
      </StoryPreviewLayout>
    );
  },
};
