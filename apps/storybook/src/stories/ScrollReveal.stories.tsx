import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { initScrollReveal } from '../../../../packages/animations/src/scroll-reveal';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow } from '../utils/StoryPreviewLayout';
import { IconActivity } from '../utils/SectionIcons';

/**
 * La story ejecuta el behavior REAL (W6a): si `initScrollReveal` deja de
 * encontrar su contrato de data-attrs, esta story lo delata.
 *
 * GSAP e IntersectionObserver se sustituyen por dobles, como en ArticleToc:
 * en Storybook no hay GSAP y el baseline visual necesita ser determinista (un
 * observer real depende del scroll). El doble de IO dispara la entrada de
 * forma sincrona y el de gsap registra el tween sin mover pixeles — el readout
 * bajo las cards muestra duracion/stagger/ease que el behavior resolvio desde
 * los tokens, que es el contrato que importa.
 */

interface TweenCall {
  targets: number;
  duration: number;
  stagger: number;
  ease: string;
}

function installDoubles(onTween: (call: TweenCall) => void): () => void {
  const host = globalThis as typeof globalThis & {
    gsap?: unknown;
    IntersectionObserver?: unknown;
  };
  const previous = { gsap: host.gsap, io: host.IntersectionObserver };

  host.gsap = {
    set: () => {},
    to: (targets: Element[], vars: Record<string, unknown>) => {
      onTween({
        targets: Array.isArray(targets) ? targets.length : 1,
        duration: Number(vars.duration ?? 0),
        stagger: Number(vars.stagger ?? 0),
        ease: String(vars.ease ?? ''),
      });
      return { kill: () => {} };
    },
  };

  // Entrega sincrona: el snapshot captura SIEMPRE el estado post-reveal.
  host.IntersectionObserver = class {
    private cb: (entries: Array<{ isIntersecting: boolean }>) => void;
    constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ isIntersecting: true }]);
    }
    disconnect() {}
  };

  return () => {
    host.gsap = previous.gsap;
    host.IntersectionObserver = previous.io;
  };
}

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

function RevealDemo({ stagger }: { stagger: '1' | '2' | '3' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tween, setTween] = useState<TweenCall | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const restore = installDoubles(setTween);
    const cleanup = initScrollReveal({ scope: root });
    return () => {
      cleanup();
      restore();
    };
  }, [stagger]);

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 520 }}>
      <section
        data-reveal
        data-reveal-stagger={stagger}
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
      <p
        style={{
          marginTop: 'var(--spacing-4, 16px)',
          fontFamily: 'var(--font-family-mono, monospace)',
          fontSize: '11px',
          color: 'var(--muted-foreground)',
        }}
      >
        {tween
          ? `gsap.to → ${tween.targets} targets · duration ${tween.duration}s · stagger ${tween.stagger}s · ease ${tween.ease}`
          : 'behavior sin disparar'}
      </p>
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

    return (
      <StoryPreviewLayout
        minHeight={360}
        controls={
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
        }
      >
        <RevealDemo key={stagger} stagger={stagger} />
      </StoryPreviewLayout>
    );
  },
};
