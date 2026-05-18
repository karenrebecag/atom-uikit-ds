import {
  type ReactNode,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Context ---- */

type ToggleGroupContextValue = {
  type: 'single' | 'multiple';
  value: string[];
  onToggle: (val: string) => void;
  variant: 'default' | 'outline';
  size: 'xs' | 's' | 'm' | 'l';
  animated: boolean;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error('ToggleGroupItem must be used within <ToggleGroup>');
  return ctx;
}

/* ---- Root ---- */

export type ToggleGroupProps = {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: 'default' | 'outline';
  size?: 'xs' | 's' | 'm' | 'l';
  orientation?: 'horizontal' | 'vertical';
  animated?: boolean;
  children: ReactNode;
  className?: string;
};

export function ToggleGroup({
  type = 'single',
  value: controlledValue,
  onValueChange,
  variant = 'default',
  size = 'm',
  orientation = 'horizontal',
  animated = false,
  children,
  className,
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);

  const value = controlledValue
    ? Array.isArray(controlledValue) ? controlledValue : [controlledValue]
    : internalValue;

  const onToggle = useCallback(
    (val: string) => {
      let next: string[];
      if (type === 'single') {
        next = value.includes(val) ? [] : [val];
      } else {
        next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];
      }

      if (onValueChange) {
        onValueChange(type === 'single' ? (next[0] ?? '') : next);
      } else {
        setInternalValue(next);
      }
    },
    [type, value, onValueChange],
  );

  return (
    <ToggleGroupContext.Provider value={{ type, value, onToggle, variant, size, animated }}>
      <div
        role="group"
        {...(animated ? { 'data-toggle-group-animate': '' } : {})}
        className={cn(
          'toggle-group',
          orientation === 'vertical' && 'toggle-group--vertical',
          variant === 'outline' && 'toggle-group--outline',
          className,
        )}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

/* ---- Item ---- */

export type ToggleGroupItemProps = {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function ToggleGroupItem({ value: itemValue, disabled = false, children, className }: ToggleGroupItemProps) {
  const { value, onToggle, size, animated } = useToggleGroup();
  const isActive = value.includes(itemValue);
  const isIconOnly = typeof children !== 'string';
  const useTextSwap = animated && !isIconOnly;

  const content = useTextSwap ? (
    <span className="button__label">
      <span className="button__label-inner">
        <span className="button__text is--default" data-button-text="">{children}</span>
        <span className="button__text is--hover" data-button-text="" aria-hidden="true">{children}</span>
      </span>
    </span>
  ) : children;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...(useTextSwap ? { 'data-toggle-group-animate': '' } : {})}
      className={cn(
        'toggle-group__item',
        `toggle-group__item--${size}`,
        isActive && 'toggle-group__item--active',
        disabled && 'toggle-group__item--disabled',
        isIconOnly && 'toggle-group__item--icon-only',
        className,
      )}
      onClick={() => {
        if (!disabled) onToggle(itemValue);
      }}
    >
      {content}
    </button>
  );
}
