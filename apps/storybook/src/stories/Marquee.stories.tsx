import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Marquee, MarqueeItem, MarqueeSeparator } from '../../../../packages/components-react/src/molecules/Marquee';
import { initDraggableMarquee } from '../../../../packages/animations/src/marquee-draggable';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconSettings } from '../utils/SectionIcons';

type Content = 'text' | 'stacked';
type Speed = '40' | '75' | '120';

const words1 = ['Atom UIKit', 'Design System', 'Components', 'Tokens', 'Animations'];
const words2 = ['Buttons', 'Inputs', 'Dialogs', 'Tables', 'Tabs'];

const meta: Meta<typeof Marquee> = {
  title: 'Molecules/Marquee',
  component: Marquee,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Marquee>;

export const Default: Story = {
  render: () => {
    const contentOptions: { value: Content; label: string }[] = [
      { value: 'text', label: 'Una fila' },
      { value: 'stacked', label: 'Dos filas' },
    ];
    const speedOptions: { value: Speed; label: string }[] = [
      { value: '40', label: 'Lento' },
      { value: '75', label: 'Normal' },
      { value: '120', label: 'Rapido' },
    ];

    const [content, setContent] = useState<Content>('text');
    const [speed, setSpeed] = useState<Speed>('75');
    const [reverse, setReverse] = useState(false);
    const [pauseOnHover, setPauseOnHover] = useState(false);
    const [fade, setFade] = useState(true);
    const [draggable, setDraggable] = useState(false);

    const { animateTransition } = useTransition();

    useEffect(() => {
      if (!draggable) return;
      let cleanup: (() => void) | undefined;
      const raf = requestAnimationFrame(() => { cleanup = initDraggableMarquee(); });
      return () => { cancelAnimationFrame(raf); cleanup?.(); };
    }, [draggable, content, speed, reverse]);

    const spd = parseInt(speed, 10);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 24, padding: 24, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 180 }}>
            <div style={sectionLabelRow}><IconLayers />Contenido</div>
            <Tabs value={content} onValueChange={(v) => animateTransition(() => setContent(v as Content))}>
              <TabsList animated>
                {contentOptions.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div style={{ minWidth: 200 }}>
            <div style={sectionLabelRow}><IconLayers />Velocidad</div>
            <Tabs value={speed} onValueChange={(v) => animateTransition(() => setSpeed(v as Speed))}>
              <TabsList animated>
                {speedOptions.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div style={{ minWidth: 200 }}>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={switchRow}>
                <span style={switchLabel}>Reversa</span>
                <Toggle animated checked={reverse} onChange={setReverse} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Pausa en hover</span>
                <Toggle animated checked={pauseOnHover} onChange={setPauseOnHover} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Fade</span>
                <Toggle animated checked={fade} onChange={setFade} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Draggable (GSAP)</span>
                <Toggle animated checked={draggable} onChange={setDraggable} />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--spacing-2)' }}>
          <Marquee key={`1-${speed}-${reverse}-${draggable}`} speed={spd} reverse={reverse} pauseOnHover={pauseOnHover} fade={fade} draggable={draggable}>
            {words1.map((w) => (
              <MarqueeItem key={w}>
                <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>{w}</span>
                <MarqueeSeparator />
              </MarqueeItem>
            ))}
          </Marquee>

          {content === 'stacked' && (
            <Marquee key={`2-${speed}-${reverse}-${draggable}`} speed={spd} reverse={!reverse} pauseOnHover={pauseOnHover} fade={fade} draggable={draggable}>
              {words2.map((w) => (
                <MarqueeItem key={w}>
                  <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>{w}</span>
                  <MarqueeSeparator />
                </MarqueeItem>
              ))}
            </Marquee>
          )}
        </div>
      </div>
    );
  },
};
