import {
  type ReactNode,
  type KeyboardEvent,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Context ---- */

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  orientation: 'horizontal' | 'vertical';
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

/* ---- Root ---- */

export type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  className?: string;
};

export function Tabs({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const setValue = useCallback(
    (v: string) => {
      onValueChange ? onValueChange(v) : setInternalValue(v);
    },
    [onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value, setValue, orientation }}>
      <div className={cn('tabs', orientation === 'vertical' && 'tabs--vertical', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ---- List ---- */

export type TabsListProps = {
  variant?: 'default' | 'line';
  children: ReactNode;
  className?: string;
};

export function TabsList({ variant = 'default', children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn('tabs__list', variant === 'line' && 'tabs__list--line', className)}
    >
      {children}
    </div>
  );
}

/* ---- Trigger ---- */

export type TabsTriggerProps = {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function TabsTrigger({ value: triggerValue, disabled = false, children, className }: TabsTriggerProps) {
  const { value, setValue, orientation } = useTabs();
  const isActive = value === triggerValue;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const list = el.parentElement;
    if (!list) return;

    const triggers = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
    const idx = triggers.indexOf(el);
    let next = -1;

    const isHorizontal = orientation === 'horizontal';

    if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
      next = idx < triggers.length - 1 ? idx + 1 : 0;
    } else if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
      next = idx > 0 ? idx - 1 : triggers.length - 1;
    }

    if (next >= 0) {
      e.preventDefault();
      triggers[next].focus();
      triggers[next].click();
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cn(
        'tabs__trigger',
        isActive && 'tabs__trigger--active',
        disabled && 'tabs__trigger--disabled',
        className,
      )}
      onClick={() => { if (!disabled) setValue(triggerValue); }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
}

/* ---- Content ---- */

export type TabsContentProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export function TabsContent({ value: contentValue, children, className }: TabsContentProps) {
  const { value } = useTabs();
  if (value !== contentValue) return null;

  return (
    <div role="tabpanel" tabIndex={0} className={cn('tabs__content', className)}>
      {children}
    </div>
  );
}
