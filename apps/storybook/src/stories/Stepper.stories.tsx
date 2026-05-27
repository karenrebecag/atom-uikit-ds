import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper, type StepProps } from '../../../../packages/components-react/src/atoms/Stepper';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { StoryPreviewLayout, sectionLabelRow, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayout, IconActivity } from '../utils/SectionIcons';

const meta: Meta<typeof Stepper> = {
  title: 'Atoms/Layout/Stepper',
  component: Stepper,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    className: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const baseSteps: StepProps[] = [
  { title: 'Crear cuenta', description: 'Registra tu email corporativo', state: 'completed' },
  { title: 'Conectar WhatsApp', description: 'Vincula tu numero de negocio', state: 'active' },
  { title: 'Configurar agente', description: 'Entrena tu AI Agent', state: 'upcoming' },
];

export const Default: Story = {
  render: () => {
    type Orientation = 'horizontal' | 'vertical';

    const orientationOpts: { value: Orientation; label: string }[] = [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
    ];

    const activeStepOpts = [
      { value: '1', label: 'Paso 1' },
      { value: '2', label: 'Paso 2' },
      { value: '3', label: 'Paso 3' },
    ];

    const [orientation, setOrientation] = useState<Orientation>('horizontal');
    const [activeStep, setActiveStep] = useState('2');
    const { animateTransition, transitionStyle } = useTransition();

    const steps: StepProps[] = baseSteps.map((step, i) => ({
      ...step,
      state: i + 1 < Number(activeStep) ? 'completed' : i + 1 === Number(activeStep) ? 'active' : 'upcoming',
    }));

    return (
      <StoryPreviewLayout
        minHeight={360}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconLayout />Orientacion</div>
              <Tabs value={orientation} onValueChange={(v) => animateTransition(() => setOrientation(v as Orientation))}>
                <TabsList animated>
                  {orientationOpts.map((o) => (
                    <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Paso activo</div>
              <Tabs value={activeStep} onValueChange={(v) => animateTransition(() => setActiveStep(v))}>
                <TabsList animated>
                  {activeStepOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </>
        }
      >
        <div style={{ ...transitionStyle, width: orientation === 'horizontal' ? '100%' : 'auto', maxWidth: 520 }}>
          <Stepper orientation={orientation} steps={steps} />
        </div>
      </StoryPreviewLayout>
    );
  },
};
