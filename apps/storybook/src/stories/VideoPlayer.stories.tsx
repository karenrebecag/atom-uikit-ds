import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from '../../../../packages/components-react/src/molecules/VideoPlayer';
import { initVideoPlayer } from '../../../../packages/animations/src/video-player';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel } from '../utils/StoryPreviewLayout';
import { IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Molecules/VideoPlayer',
  component: VideoPlayer,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {
  render: () => {
    const [autoplay, setAutoplay] = useState(false);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
      let cleanup: (() => void) | undefined;
      const raf = requestAnimationFrame(() => { cleanup = initVideoPlayer(); });
      return () => { cancelAnimationFrame(raf); cleanup?.(); };
    }, [autoplay, muted]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ padding: 24 }}>
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

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 720 }}>
            <VideoPlayer
              key={`${autoplay}-${muted}`}
              videoId=""
              autoplay={autoplay}
              muted={muted}
              placeholder="https://picsum.photos/seed/player/1280/720"
            />
          </div>
        </div>
      </div>
    );
  },
};
