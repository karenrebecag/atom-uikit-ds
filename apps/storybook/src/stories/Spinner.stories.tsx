import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../../../../packages/components-react/src/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconRuler } from '../utils/SectionIcons';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Indicators/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l'] },
    className: { table: { disable: true } },
  },
  args: { size: 'm' },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => {
    type Size = 'xs' | 's' | 'm' | 'l';

    const sizeOpts: { value: Size; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
    ];

    const [size, setSize] = useState<Size>('m');
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={250}
        controls={
          <>
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
          </>
        }
      >
        <div style={transitionStyle}>
          <Spinner size={size} />
        </div>
      </StoryPreviewLayout>
    );
  },
};
