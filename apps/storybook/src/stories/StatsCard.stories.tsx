import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard, type StatsTrend } from '../../../../packages/components-react/src/molecules/StatsCard';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings } from '../utils/SectionIcons';

const meta: Meta<typeof StatsCard> = {
  title: 'Molecules/StatsCard',
  component: StatsCard,
  argTypes: {
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  render: () => {
    const trendOpts: { value: StatsTrend; label: string }[] = [
      { value: 'up', label: 'Subida' },
      { value: 'down', label: 'Bajada' },
      { value: 'neutral', label: 'Neutral' },
    ];

    const [trend, setTrend] = useState<StatsTrend>('up');
    const [compact, setCompact] = useState(false);
    const [gradient, setGradient] = useState(false);
    const { animateTransition, transitionStyle } = useTransition();

    return (
      <StoryPreviewLayout
        minHeight={320}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconActivity />Tendencia</div>
              <Tabs value={trend} onValueChange={(v) => animateTransition(() => setTrend(v as StatsTrend))}>
                <TabsList animated>
                  {trendOpts.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={switchRow}>
                <span style={switchLabel}>Compacto</span>
                <Toggle animated checked={compact} onChange={(v) => animateTransition(() => setCompact(v))} />
              </div>
              <div style={switchRow}>
                <span style={switchLabel}>Gradiente</span>
                <Toggle animated checked={gradient} onChange={(v) => animateTransition(() => setGradient(v))} />
              </div>
            </div>
          </>
        }
      >
        <div style={{ ...transitionStyle, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', maxWidth: 560 }}>
          <StatsCard
            value="3.2x"
            label="Tasa de conversion"
            trend={trend}
            trendValue="+12% vs mes anterior"
            compact={compact}
            gradient={gradient}
          />
          <StatsCard
            value="-68%"
            label="Tiempo de respuesta"
            trend={trend === 'up' ? 'down' : trend === 'down' ? 'up' : 'neutral'}
            trendValue="vs trimestre anterior"
            compact={compact}
            gradient={gradient}
          />
          <StatsCard
            value="+41%"
            label="Revenue por agente"
            trend={trend}
            trendValue="crecimiento MoM"
            compact={compact}
            gradient={gradient}
          />
        </div>
      </StoryPreviewLayout>
    );
  },
};
