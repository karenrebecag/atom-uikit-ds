import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from '../../../../packages/components-react/src/molecules/UserProfile';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type AvatarType = 'initials' | 'image' | 'icon';
type AvatarShape = 'circle' | 'square';

const IconUser = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const meta: Meta<typeof UserProfile> = {
  title: 'Molecules/UserProfile',
  component: UserProfile,
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {
  render: () => {
    const typeOptions: { value: AvatarType; label: string }[] = [
      { value: 'initials', label: 'Iniciales' },
      { value: 'image', label: 'Imagen' },
      { value: 'icon', label: 'Icono' },
    ];
    const shapeOptions: { value: AvatarShape; label: string }[] = [
      { value: 'square', label: 'Cuadrado' },
      { value: 'circle', label: 'Circular' },
    ];

    const [avatarType, setAvatarType] = useState<AvatarType>('initials');
    const [shape, setShape] = useState<AvatarShape>('square');
    const [showOrg, setShowOrg] = useState(true);
    const [showStatus, setShowStatus] = useState(true);

    const { animateTransition, transitionStyle } = useTransition();

    const avatarProps = {
      type: avatarType,
      shape,
      size: 's' as const,
      status: showStatus,
      ...(avatarType === 'image' ? { src: 'https://i.pravatar.cc/64?u=karen' } : {}),
      ...(avatarType === 'icon' ? { icon: <IconUser /> } : {}),
    };

    return (
      <StoryPreviewLayout
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayers />Avatar</div>
              <Tabs value={avatarType} onValueChange={(v) => animateTransition(() => setAvatarType(v as AvatarType))}>
                <TabsList animated>
                  {typeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconLayers />Forma</div>
              <Tabs value={shape} onValueChange={(v) => animateTransition(() => setShape(v as AvatarShape))}>
                <TabsList animated>
                  {shapeOptions.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>{`Organizaci\u00f3n`}</span>
                  <Toggle animated checked={showOrg} onChange={(v) => animateTransition(() => setShowOrg(v))} />
                </div>
                <div style={switchRow}>
                  <span style={switchLabel}>Status</span>
                  <Toggle animated checked={showStatus} onChange={(v) => animateTransition(() => setShowStatus(v))} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div style={transitionStyle}>
            <UserProfile
              name="Karen Ortiz"
              org={showOrg ? 'Atom Design' : undefined}
              avatar={avatarProps}
            />
          </div>
        </div>
      </StoryPreviewLayout>
    );
  },
};
