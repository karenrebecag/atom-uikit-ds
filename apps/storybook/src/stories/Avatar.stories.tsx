import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconLayout, IconActivity } from '../utils/SectionIcons';

const sampleImg = 'https://i.pravatar.cc/150?img=12';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Indicators/Avatar',
  component: Avatar,
  argTypes: {
    type: { control: 'select', options: ['image', 'image-border', 'initials', 'icon'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l'] },
    status: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    src: { table: { disable: true } },
    alt: { table: { disable: true } },
    initials: { table: { disable: true } },
    icon: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    type: 'image-border',
    shape: 'circle',
    size: 's',
    status: true,
    skeleton: false,
    src: sampleImg,
    initials: 'KO',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => {
    type AvatarType = 'image' | 'image-border' | 'initials' | 'icon' | 'skeleton';
    type Shape = 'circle' | 'square';
    type Size = 'xs' | 's' | 'm' | 'l';
    type Status = 'none' | 'online';

    const typeOpts: { value: AvatarType; label: string }[] = [
      { value: 'image', label: 'Imagen' },
      { value: 'image-border', label: 'Con borde' },
      { value: 'initials', label: 'Iniciales' },
      { value: 'icon', label: 'Icono' },
      { value: 'skeleton', label: 'Skeleton' },
    ];
    const shapeOpts: { value: Shape; label: string }[] = [
      { value: 'circle', label: 'Circular' },
      { value: 'square', label: 'Cuadrado' },
    ];
    const sizeOpts: { value: Size; label: string }[] = [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
    ];
    const statusOpts: { value: Status; label: string }[] = [
      { value: 'none', label: 'Ninguno' },
      { value: 'online', label: 'Online' },
    ];

    const [avatarType, setAvatarType] = useState<AvatarType>('image-border');
    const [shape, setShape] = useState<Shape>('circle');
    const [size, setSize] = useState<Size>('m');
    const [status, setStatus] = useState<Status>('online');
    const { animateTransition, transitionStyle } = useTransition();

    const isSkeleton = avatarType === 'skeleton';
    const resolvedType = isSkeleton ? 'image-border' : avatarType;

    return (
      <StoryPreviewLayout
        minHeight={340}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Tipo</div>
              <Tabs value={avatarType} onValueChange={(v) => animateTransition(() => setAvatarType(v as AvatarType))}>
                <TabsList animated>
                  {typeOpts.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconLayout />Forma</div>
              <Tabs value={shape} onValueChange={(v) => animateTransition(() => setShape(v as Shape))}>
                <TabsList animated>
                  {shapeOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
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
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={status} onValueChange={(v) => animateTransition(() => setStatus(v as Status))}>
                <TabsList animated>
                  {statusOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <Avatar
            type={resolvedType}
            shape={shape}
            size={size}
            src={sampleImg}
            initials="KO"
            status={status === 'online' && !isSkeleton}
            skeleton={isSkeleton}
          />
        </div>
      </StoryPreviewLayout>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      {(['image', 'image-border', 'initials', 'icon'] as const).map((t) => (
        <div key={t} style={{ textAlign: 'center' }}>
          <Avatar type={t} size="m" shape="circle" src={sampleImg} initials="KO" status />
          <p style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 4 }}>{t}</p>
        </div>
      ))}
      <div style={{ textAlign: 'center' }}>
        <Avatar type="image-border" size="m" shape="circle" skeleton />
        <p style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 4 }}>skeleton</p>
      </div>
    </div>
  ),
};
