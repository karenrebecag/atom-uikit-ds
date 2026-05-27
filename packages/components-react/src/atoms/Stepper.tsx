import { forwardRef } from 'react';

export type StepState = 'completed' | 'active' | 'upcoming';

export type StepProps = {
  state?: StepState;
  title: string;
  description?: string;
};

export type StepperProps = {
  orientation?: 'horizontal' | 'vertical';
  steps: StepProps[];
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ orientation = 'horizontal', steps, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('stepper', `stepper--${orientation}`, className)}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => {
          const state = step.state ?? 'upcoming';
          const isLast = index === steps.length - 1;

          return (
            <>
              <div
                key={`step-${index}`}
                className={cn('stepper__step', `stepper__step--${state}`)}
                role="listitem"
                aria-current={state === 'active' ? 'step' : undefined}
              >
                <div className="stepper__indicator" aria-hidden="true">
                  {state === 'completed' ? <CheckIcon /> : index + 1}
                </div>
                <div className="stepper__content">
                  <span className="stepper__title">{step.title}</span>
                  {step.description && (
                    <span className="stepper__description">{step.description}</span>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  key={`conn-${index}`}
                  className={cn(
                    'stepper__connector',
                    state === 'completed' && 'stepper__connector--completed',
                  )}
                  aria-hidden="true"
                />
              )}
            </>
          );
        })}
      </div>
    );
  },
);

Stepper.displayName = 'Stepper';
