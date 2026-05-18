import { type ReactNode, useState } from 'react';
import { Divider } from '../../../../packages/components-react/src/atoms/Divider';
import { IconEye } from './SectionIcons';

/* ---- Shared styles ---- */

export const sectionLabelRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--muted-foreground, #a1a1aa)',
  marginBottom: '8px',
};

export const switchRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px 0',
};

export const switchLabel: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--foreground, #fafafa)',
};

/* ---- Transition hook ---- */

export function useTransition() {
  const [transitioning, setTransitioning] = useState(false);

  const animateTransition = (fn: () => void) => {
    setTransitioning(true);
    setTimeout(() => {
      fn();
      setTransitioning(false);
    }, 200);
  };

  const transitionStyle: React.CSSProperties = {
    transition: 'opacity 0.2s cubic-bezier(0.625, 0.05, 0, 1), transform 0.2s cubic-bezier(0.625, 0.05, 0, 1)',
    opacity: transitioning ? 0 : 1,
    transform: transitioning ? 'scale(0.92)' : 'scale(1)',
  };

  return { transitioning, animateTransition, transitionStyle };
}

/* ---- Glass container layout ---- */

const glass: React.CSSProperties = {
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  isolation: 'isolate',
  backdropFilter: 'saturate(120%) blur(16px)',
  WebkitBackdropFilter: 'saturate(120%) blur(16px)',
  background: 'color-mix(in srgb, var(--card, #27272a) 55%, transparent)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
  border: '1px solid color-mix(in srgb, var(--border, #3f3f46) 40%, transparent)',
};

const GlassLayers = () => (
  <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', zIndex: 0 }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', opacity: 0.04, backgroundColor: '#d4d4d4' }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'overlay', boxShadow: 'inset 0.28em 0.28em 0.09em -0.33em rgba(255,255,255,0.6)' }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'plus-lighter', boxShadow: 'inset 0.19em 0.28em 0.09em -0.19em rgba(179,179,179,0.35)' }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'overlay', boxShadow: 'inset -0.19em -0.28em 0.09em -0.19em rgba(179,179,179,0.2)' }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', mixBlendMode: 'darken', boxShadow: 'inset 0 0 1.75em rgba(242,242,242,0.05)' }} />
  </div>
);

type StoryPreviewLayoutProps = {
  controls: ReactNode;
  children: ReactNode;
  minHeight?: number;
};

export function StoryPreviewLayout({ controls, children, minHeight = 420 }: StoryPreviewLayoutProps) {
  return (
    <div style={{ ...glass, display: 'flex', flexDirection: 'row', height: '100%', minHeight, margin: '12px' }}>
      <GlassLayers />

      {/* Controls - left */}
      <div style={{ position: 'relative', zIndex: 1, width: '300px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
        {controls}
      </div>

      {/* Divider */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'stretch', padding: '16px 0' }}>
        <Divider orientation="vertical" />
      </div>

      {/* Preview - right */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: '1', padding: '24px' }}>
        <div style={{ ...sectionLabelRow, marginBottom: '0' }}><IconEye />Preview</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
