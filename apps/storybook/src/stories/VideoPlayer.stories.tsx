import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from '../../../../packages/components-react/src/molecules/VideoPlayer';
import { initVideoPlayer } from '../../../../packages/animations/src/video-player';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Molecules/VideoPlayer',
  component: VideoPlayer,
  argTypes: {
    videoId: { table: { disable: true } },
    customer: { table: { disable: true } },
    autoplay: { table: { disable: true } },
    muted: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        let cleanup: (() => void) | undefined;
        const raf = requestAnimationFrame(() => {
          cleanup = initVideoPlayer();
        });
        return () => {
          cancelAnimationFrame(raf);
          cleanup?.();
          parameters: { layout: 'fullscreen' },
};
      }, []);
      return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {
  render: () => (
    <VideoPlayer videoId="" placeholder="https://picsum.photos/seed/player/1280/720" />
  ),
};
