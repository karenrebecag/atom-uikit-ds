import {
  type ReactNode,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/* ---- Context ---- */

type SelectContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  onSelect: (value: string, label: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  items: string[];
  registerItem: (value: string) => void;
  unregisterItem: (value: string) => void;
  selectedLabel: string;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select components must be used within <Select>');
  return ctx;
}

/* ---- Root ---- */

export type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function Select({
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [items, setItems] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      onOpenChange ? onOpenChange(v) : setInternalOpen(v);
      if (!v) setHighlightedIndex(-1);
    },
    [onOpenChange],
  );

  const onSelect = useCallback(
    (v: string, label: string) => {
      onValueChange ? onValueChange(v) : setInternalValue(v);
      setSelectedLabel(label);
      setOpen(false);
    },
    [onValueChange, setOpen],
  );

  const registerItem = useCallback((v: string) => {
    setItems((prev) => (prev.includes(v) ? prev : [...prev, v]));
  }, []);

  const unregisterItem = useCallback((v: string) => {
    setItems((prev) => prev.filter((item) => item !== v));
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  return (
    <SelectContext.Provider
      value={{ open, setOpen, value, onSelect, highlightedIndex, setHighlightedIndex, items, registerItem, unregisterItem, selectedLabel }}
    >
      <div ref={rootRef} className={cn('select', className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

/* ---- Trigger ---- */

export type SelectTriggerProps = {
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  children?: ReactNode;
  className?: string;
};

export function SelectTrigger({
  placeholder = 'Select...',
  disabled = false,
  invalid = false,
  children,
  className,
}: SelectTriggerProps) {
  const { open, setOpen, value, selectedLabel, highlightedIndex, setHighlightedIndex, items, onSelect } = useSelect();

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (e.key === 'ArrowDown') {
        setHighlightedIndex(highlightedIndex < items.length - 1 ? highlightedIndex + 1 : 0);
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        const item = items[highlightedIndex];
        if (item) onSelect(item, item);
      }
    } else if (e.key === 'ArrowUp' && open) {
      e.preventDefault();
      setHighlightedIndex(highlightedIndex > 0 ? highlightedIndex - 1 : items.length - 1);
    }
  };

  const displayValue = children || (value ? selectedLabel || value : null);

  return (
    <button
      type="button"
      role="listbox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(
        'select__trigger',
        open && 'select__trigger--open',
        disabled && 'select__trigger--disabled',
        className,
      )}
      onClick={() => setOpen(!open)}
      onKeyDown={handleKeyDown}
    >
      <span className={cn('select__value', !displayValue && 'select__value--placeholder')}>
        {displayValue || placeholder}
      </span>
      <span className="select__icon">
        <ChevronDown />
      </span>
    </button>
  );
}

/* ---- Content ---- */

export function SelectContent({ children, className }: { children: ReactNode; className?: string }) {
  const { open } = useSelect();
  if (!open) return null;
  return <div className={cn('select__content', className)}>{children}</div>;
}

/* ---- Group ---- */

export function SelectGroup({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={className}>
      {label && <div className="select__label">{label}</div>}
      <ul className="select__group-list">{children}</ul>
    </div>
  );
}

/* ---- Item ---- */

export type SelectItemProps = {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
};

export function SelectItem({ value: itemValue, disabled = false, children, className }: SelectItemProps) {
  const { value, onSelect, highlightedIndex, items, registerItem, unregisterItem } = useSelect();

  const isSelected = value === itemValue;
  const index = items.indexOf(itemValue);
  const isHighlighted = index === highlightedIndex;
  const label = typeof children === 'string' ? children : itemValue;

  useEffect(() => {
    registerItem(itemValue);
    return () => unregisterItem(itemValue);
  }, [itemValue, registerItem, unregisterItem]);

  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      className={cn(
        'select__item',
        isSelected && 'select__item--selected',
        isHighlighted && 'select__item--highlighted',
        disabled && 'select__item--disabled',
        className,
      )}
      onClick={() => {
        if (!disabled) onSelect(itemValue, label);
      }}
    >
      {children || itemValue}
    </li>
  );
}

/* ---- Separator ---- */

export function SelectSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('select__separator', className)} />;
}
