import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { initScrollReveal } from '../../../../packages/animations/src/scroll-reveal';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings } from '../utils/SectionIcons';

/**
 * Estandar de stories (Button es el canonico): behavior REAL con el GSAP que
 * carga preview.ts, toggle de animacion, theme desde el visor.
 *
 * El remount (key) re-dispara la entrada: cambiar cualquier control es tambien
 * el boton de "replay". Baselines estables: el test-runner emula
 * prefers-reduced-motion y el behavior muestra el contenido al instante.
 */

const card: React.CSSProperties = {
  padding: 'var(--spacing-6, 24px)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg, 12px)',
  background: 'var(--card)',
  color: 'var(--card-foreground)',
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-size-base)',
  fontWeight: 600,
};

const cardBody: React.CSSProperties = {
  margin: 'var(--spacing-2, 8px) 0 0',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--muted-foreground)',
};

function RevealDemo({ stagger, animated }: { stagger: '1' | '2' | '3'; animated: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanup = initScrollReveal({ scope: root });
    return cleanup;
  }, [stagger, animated]);

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 520 }}>
      <section
        data-reveal
        data-reveal-stagger={stagger}
        data-motion-exempt={animated ? undefined : ''}
        aria-label="Reveal demo"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 12px)' }}
      >
        {['Frames', 'Trainers', 'Warranty'].map((title, i) => (
          <div key={title} className="card" data-reveal-item style={card}>
            <h3 style={cardTitle}>{`0${i + 1} — ${title}`}</h3>
            <p style={cardBody}>
              Entra con el ease firma y el stagger del token seleccionado.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Behaviors/Scroll Reveal',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [stagger, setStagger] = useState<'1' | '2' | '3'>('2');
    const [animated, setAnimated] = useState(true);
    const [replay, setReplay] = useState(0);

    return (
      <StoryPreviewLayout
        minHeight={360}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconActivity />Stagger token</div>
              <Tabs value={stagger} onValueChange={(v) => setStagger(v as '1' | '2' | '3')}>
                <TabsList animated>
                  <TabsTrigger value="1">--stagger-1</TabsTrigger>
                  <TabsTrigger value="2">--stagger-2</TabsTrigger>
                  <TabsTrigger value="3">--stagger-3</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={switchRow}>
                <span style={switchLabel}>Animado</span>
                <Toggle animated checked={animated} onChange={setAnimated} />
              </div>
              <div style={{ marginTop: 'var(--spacing-2, 8px)' }}>
                <Button variant="secondary" size="s" onClick={() => setReplay((n) => n + 1)}>
                  Replay
                </Button>
              </div>
            </div>
          </>
        }
      >
        <RevealDemo key={`${stagger}-${animated}-${replay}`} stagger={stagger} animated={animated} />
      </StoryPreviewLayout>
    );
  },
};
