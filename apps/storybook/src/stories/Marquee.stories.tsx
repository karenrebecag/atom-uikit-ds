import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Marquee, MarqueeItem, MarqueeSeparator } from '../../../../packages/components-react/src/molecules/Marquee';
import { Avatar } from '../../../../packages/components-react/src/atoms/Avatar';
import { Tag } from '../../../../packages/components-react/src/atoms/Tag';
import { initDraggableMarquee } from '../../../../packages/animations/src/marquee-draggable';

const meta: Meta<typeof Marquee> = {
  title: 'Molecules/Marquee',
  component: Marquee,
  argTypes: {
    speed: { control: { type: 'range', min: 20, max: 200, step: 5 }, name: 'Speed (px/s)' },
    reverse: { control: 'boolean', name: 'Reverse' },
    pauseOnHover: { control: 'boolean', name: 'Pause on Hover' },
    fade: { control: 'boolean', name: 'Fade Edges' },
    draggable: { control: 'boolean', name: 'Draggable' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    duration: { table: { disable: true } },
    multiplier: { table: { disable: true } },
    sensitivity: { table: { disable: true } },
  },
  args: {
    speed: 75,
    reverse: false,
    pauseOnHover: false,
    fade: true,
    draggable: false,
  },
  decorators: [
    (Story, context) => {
      const draggable = context.args.draggable as boolean;
      useEffect(() => {
        if (!draggable) return;
        let cleanup: (() => void) | undefined;
        // Wait one frame for React DOM to commit
        const raf = requestAnimationFrame(() => {
          cleanup = initDraggableMarquee();
        });
        return () => {
          cancelAnimationFrame(raf);
          cleanup?.();
          parameters: { layout: 'fullscreen' },
};
      }, [draggable]);
      return <Story />;
    },
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Marquee>;

/* ---- Text ---- */

export const Text: Story = {
  render: (args) => (
    <Marquee speed={args.speed} reverse={args.reverse} pauseOnHover={args.pauseOnHover} fade={args.fade} draggable={args.draggable}>
      <MarqueeItem>
        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Atom UIKit</span>
        <MarqueeSeparator />
      </MarqueeItem>
      <MarqueeItem>
        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Design System</span>
        <MarqueeSeparator />
      </MarqueeItem>
      <MarqueeItem>
        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Components</span>
        <MarqueeSeparator />
      </MarqueeItem>
      <MarqueeItem>
        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Tokens</span>
        <MarqueeSeparator />
      </MarqueeItem>
    </Marquee>
  ),
};

/* ---- With Avatars ---- */

export const Avatars: Story = {
  render: (args) => (
    <Marquee speed={args.speed} reverse={args.reverse} pauseOnHover={args.pauseOnHover} fade={args.fade} draggable={args.draggable}>
      {['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'].map((id) => (
        <MarqueeItem key={id}>
          <Avatar type="image" shape="circle" size="m" src={`https://i.pravatar.cc/80?u=${id}`} alt="" />
        </MarqueeItem>
      ))}
    </Marquee>
  ),
};

/* ---- With Tags ---- */

export const Tags: Story = {
  render: (args) => {
    const techs = ['React', 'TypeScript', 'CSS', 'Astro', 'Vite', 'Storybook', 'Figma', 'GSAP'];
    const intents = ['brand', 'info', 'success', 'neutral', 'warning', 'ai', 'danger', 'info'] as const;
    return (
      <Marquee speed={args.speed} reverse={args.reverse} pauseOnHover={args.pauseOnHover} fade={args.fade} draggable={args.draggable}>
        {techs.map((t, i) => (
          <MarqueeItem key={t}>
            <Tag variant="filled" intent={intents[i]} size="m">{t}</Tag>
          </MarqueeItem>
        ))}
      </Marquee>
    );
  },
};

/* ---- Reverse ---- */

export const Reverse: Story = {
  args: { reverse: true },
  render: (args) => (
    <Marquee speed={args.speed} reverse={args.reverse} pauseOnHover={args.pauseOnHover} fade={args.fade} draggable={args.draggable}>
      {['Build', 'Ship', 'Iterate', 'Scale', 'Repeat'].map((w) => (
        <MarqueeItem key={w}>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-tight)' }}>{w}</span>
          <MarqueeSeparator />
        </MarqueeItem>
      ))}
    </Marquee>
  ),
};

/* ---- Stacked (two rows, opposite directions) ---- */

export const Stacked: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <Marquee speed={args.speed} fade={args.fade} draggable={args.draggable}>
        {['Components', 'Tokens', 'Animations', 'Typography', 'Colors'].map((w) => (
          <MarqueeItem key={w}>
            <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>{w}</span>
            <MarqueeSeparator />
          </MarqueeItem>
        ))}
      </Marquee>
      <Marquee speed={args.speed} reverse fade={args.fade} draggable={args.draggable}>
        {['Buttons', 'Inputs', 'Dialogs', 'Tables', 'Tabs'].map((w) => (
          <MarqueeItem key={w}>
            <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>{w}</span>
            <MarqueeSeparator />
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  ),
};
