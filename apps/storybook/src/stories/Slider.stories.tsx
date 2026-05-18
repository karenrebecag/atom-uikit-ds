import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider, RangeSlider } from '../../../../packages/components-react/src/atoms/Slider';
import { Tabs, TabsList, TabsTrigger } from '../../../../packages/components-react/src/atoms/Tabs';
import { Toggle } from '../../../../packages/components-react/src/atoms/Toggle';
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconActivity, IconSettings, IconBox, IconRuler } from '../utils/SectionIcons';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Forms/Slider',
  component: Slider,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: { min: 0, max: 100, step: 1, disabled: false },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    type SliderType = 'single' | 'range';
    type SliderState = 'default' | 'disabled';
    type StepSize = '1' | '5' | '10' | '25';

    const typeOpts: { value: SliderType; label: string }[] = [
      { value: 'single', label: 'Simple' },
      { value: 'range', label: 'Rango' },
    ];
    const stateOpts: { value: SliderState; label: string }[] = [
      { value: 'default', label: 'Normal' },
      { value: 'disabled', label: 'Deshabilitado' },
    ];
    const stepOpts: { value: StepSize; label: string }[] = [
      { value: '1', label: '1' },
      { value: '5', label: '5' },
      { value: '10', label: '10' },
      { value: '25', label: '25' },
    ];

    const [sliderType, setSliderType] = useState<SliderType>('single');
    const [sliderState, setSliderState] = useState<SliderState>('default');
    const [stepSize, setStepSize] = useState<StepSize>('1');
    const [showValue, setShowValue] = useState(true);
    const [singleValue, setSingleValue] = useState(50);
    const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);
    const { animateTransition, transitionStyle } = useTransition();

    const isDisabled = sliderState === 'disabled';
    const step = Number(stepSize);

    return (
      <StoryPreviewLayout
        minHeight={320}
        controls={
          <>
            <div>
              <div style={sectionLabelRow}><IconBox />Tipo</div>
              <Tabs value={sliderType} onValueChange={(v) => animateTransition(() => setSliderType(v as SliderType))}>
                <TabsList animated>
                  {typeOpts.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconActivity />Estado</div>
              <Tabs value={sliderState} onValueChange={(v) => animateTransition(() => setSliderState(v as SliderState))}>
                <TabsList animated>
                  {stateOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconRuler />Incremento</div>
              <Tabs value={stepSize} onValueChange={(v) => setStepSize(v as StepSize)}>
                <TabsList animated>
                  {stepOpts.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <div style={sectionLabelRow}><IconSettings />Propiedades</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={switchRow}>
                  <span style={switchLabel}>Mostrar valor</span>
                  <Toggle animated checked={showValue} onChange={setShowValue} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <div style={{ width: '100%', maxWidth: '320px', ...transitionStyle }}>
          {sliderType === 'single' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <Slider value={singleValue} onValueChange={setSingleValue} min={0} max={100} step={step} disabled={isDisabled} />
              {showValue && (
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                  {singleValue}
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <RangeSlider value={rangeValue} onValueChange={setRangeValue} min={0} max={100} step={step} disabled={isDisabled} />
              {showValue && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
                  <span>{rangeValue[0]}</span>
                  <span>{rangeValue[1]}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </StoryPreviewLayout>
    );
  },
};
