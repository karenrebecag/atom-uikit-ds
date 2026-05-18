import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { AvatarGroup } from '../../../../packages/components-react/src/atoms/AvatarGroup';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconRuler, IconBox, IconLayers, IconLayout, IconActivity } from '../utils/SectionIcons';

const avatars = [
  'https://i.pravatar.cc/80?u=g1',
  'https://i.pravatar.cc/80?u=g2',
  'https://i.pravatar.cc/80?u=g3',
  'https://i.pravatar.cc/80?u=g4',
  'https://i.pravatar.cc/80?u=g5',
  'https://i.pravatar.cc/80?u=g6',
];
const initials = ['JD', 'KR', 'AB', 'MN', 'OP', 'QR'];

const meta: Meta<typeof AvatarGroup> = {
  title: 'Atoms/Indicators/AvatarGroup',
  component: AvatarGroup,
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l'] },
    max: { control: 'number' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: { size: 's', max: undefined },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: () => {
    type Size = 'xs' | 's' | 'm' | 'l';
    type AvatarType = 'image' | 'image-border' | 'initials' | 'icon' | 'skeleton';
    type Shape = 'circle' | 'square';
    type Status = 'none' | 'online';
    type MaxOpt = '3' | '4' | '5' | 'all';

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
    const maxOpts: { value: MaxOpt; label: string }[] = [
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: 'all', label: 'Todos' },
    ];

    const [avatarType, setAvatarType] = useState<AvatarType>('image-border');
    const [shape, setShape] = useState<Shape>('circle');
    const [size, setSize] = useState<Size>('m');
    const [status, setStatus] = useState<Status>('online');
    const [maxOpt, setMaxOpt] = useState<MaxOpt>('4');
    const { animateTransition, transitionStyle } = useTransition();

    const max = maxOpt === 'all' ? undefined : Number(maxOpt);
    const isSkeleton = avatarType === 'skeleton';
    const resolvedType = isSkeleton ? 'image-border' : avatarType;

    return (
      <StoryPreviewLayout
        minHeight={380}
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

            <div>
              <div style={sectionLabelRow}><IconBox />{`M\u00e1ximo visible`}</div>
              <Tabs value={maxOpt} onValueChange={(v) => animateTransition(() => setMaxOpt(v as MaxOpt))}>
                <TabsList animated>
                  {maxOpts.map((m) => (
                    <TabsTrigger key={m.value} value={m.value}>{m.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </>
        }
      >
        <div style={transitionStyle}>
          <AvatarGroup size={size} shape={shape} max={max}>
            {avatars.map((src, i) => (
              <Avatar
                key={i}
                type={resolvedType}
                shape={shape}
                size={size}
                src={resolvedType === 'initials' || resolvedType === 'icon' ? undefined : src}
                initials={initials[i]}
                status={status === 'online' && !isSkeleton}
                skeleton={isSkeleton}
              />
            ))}
          </AvatarGroup>
        </div>
      </StoryPreviewLayout>
    );
  },
};
