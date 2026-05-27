import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from '../../../../packages/components-react/src/molecules/VideoPlayer';
import { initVideoPlayer } from '../../../../packages/animations/src/video-player';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type Ratio = '16:9' | '4:3' | '1:1';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Molecules/VideoPlayer',
  component: VideoPlayer,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {
  render: () => {
    const ratioOptions: { value: Ratio; label: string; w: number; h: number }[] = [
      { value: '16:9', label: '16:9', w: 1280, h: 720 },
      { value: '4:3', label: '4:3', w: 800, h: 600 },
      { value: '1:1', label: '1:1', w: 800, h: 800 },
    ];

    const [ratio, setRatio] = useState<Ratio>('16:9');
    const [autoplay, setAutoplay] = useState(false);
    const [muted, setMuted] = useState(false);

    const { animateTransition, transitionStyle } = useTransition();

    const selected = ratioOptions.find((r) => r.value === ratio)!;

    useEffect(() => {
      let cleanup: (() => void) | undefined;
      const raf = requestAnimationFrame(() => { cleanup = initVideoPlayer(); });
      return () => { cancelAnimationFrame(raf); cleanup?.(); };
    }, [ratio, autoplay, muted]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 24, padding: 24, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 200 }}>
            <div style={sectionLabelRow}><IconLayers />Ratio</div>
            <Tabs value={ratio} onValueChange={(v) => animateTransition(() => setRatio(v as Ratio))}>
              <TabsList animated>
                {ratioOptions.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div style={{ minWidth: 200 }}>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={switchRow}>
                <span style={switchLabel}>Autoplay</span>
                <Toggle animated checked={autoplay} onChange={setAutoplay} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Muted</span>
                <Toggle animated checked={muted} onChange={setMuted} />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ ...transitionStyle, width: '100%', maxWidth: 720 }}>
            <VideoPlayer
              key={`${ratio}-${autoplay}-${muted}`}
              videoId=""
              autoplay={autoplay}
              muted={muted}
              placeholder={`https://picsum.photos/seed/player/${selected.w}/${selected.h}`}
            />
          </div>
        </div>
      </div>
    );
  },
};
