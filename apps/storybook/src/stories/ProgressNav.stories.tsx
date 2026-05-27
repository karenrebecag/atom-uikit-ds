import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressNav } from '../../../../packages/components-react/src/molecules/ProgressNav';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof ProgressNav> = {
  title: 'Molecules/ProgressNav',
  component: ProgressNav,
  argTypes: {
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressNav>;

const ATOM_LOGO = 'https://cdn.jsdelivr.net/npm/@atomchat.io/mcp-docs@latest/assets/ATOM-horizontal-light.svg';

const items = [
  { id: 'intro', label: '1. Intro' },
  { id: 'concepto', label: '2. Concepto' },
  { id: 'producto', label: '3. Producto' },
  { id: 'resultado', label: '4. Resultado' },
];

export const Default: Story = {
  render: () => {
    const [showLogo, setShowLogo] = useState(true);
    const [showCta, setShowCta] = useState(true);
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={280}
        controls={
          <div>
            <div style={sectionLabelRow}><IconSettings />Propiedades</div>
            <div style={switchRow}>
              <span style={switchLabel}>Logo</span>
              <Toggle animated checked={showLogo} onChange={(v) => animateTransition(() => setShowLogo(v))} />
            </div>
            <div style={switchRow}>
              <span style={switchLabel}>CTA</span>
              <Toggle animated checked={showCta} onChange={(v) => animateTransition(() => setShowCta(v))} />
            </div>
          </div>
        }
      >
        <div style={{ ...transitionStyle, width: '100%' }}>
          <style>{`
            .progress-nav--story {
              position: relative !important;
              padding: 0 !important;
              top: auto !important;
              left: auto !important;
              width: 100% !important;
              z-index: auto !important;
            }
          `}</style>
          <ProgressNav
            items={items}
            logo={showLogo ? <img src={ATOM_LOGO} alt="Atom" style={{ height: 24 }} /> : undefined}
            cta={showCta ? { label: 'Contacto', href: '#contact' } : undefined}
            className="progress-nav--story"
          />
        </div>
      </StoryPreviewLayout>
    );
  },
};
