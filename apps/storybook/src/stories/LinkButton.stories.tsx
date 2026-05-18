import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from '../../../../packages/components-react/src/atoms/LinkButton';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconRuler, IconActivity, IconSettings } from '../utils/SectionIcons';

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
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={320}
        controls={
          <>
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
          </>
        }
      >
        <div style={transitionStyle}>
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
      </StoryPreviewLayout>
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
