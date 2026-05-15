import {
  type ReactNode,
  type KeyboardEvent,
  type InputHTMLAttributes,
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  forwardRef,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Icons ---- */

const ChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3.5 3.5" />
  </svg>
);

/* ---- Context ---- */

type ComboboxContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  onSelect: (value: string) => void;
  search: string;
  setSearch: (v: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  registerItem: (value: string, label: string) => void;
  unregisterItem: (value: string) => void;
  visibleItems: string[];
  filteredCount: number;
  autoHighlight: boolean;
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const ctx = useContext(ComboboxContext);
  if (!ctx) throw new Error('Combobox compound components must be used within <Combobox>');
  return ctx;
}

/* ---- Root ---- */

export type ComboboxProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoHighlight?: boolean;
  children: ReactNode;
  className?: string;
};

export function Combobox({
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  autoHighlight = false,
  children,
  className,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [registeredItems, setRegisteredItems] = useState<{ value: string; label: string }[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      onOpenChange ? onOpenChange(v) : setInternalOpen(v);
      if (!v) {
        setSearch('');
        setHighlightedIndex(-1);
      }
    },
    [onOpenChange],
  );

  const onSelect = useCallback(
    (v: string) => {
      const next = v === value ? '' : v;
      onValueChange ? onValueChange(next) : setInternalValue(next);
      setOpen(false);
    },
    [value, onValueChange, setOpen],
  );

  const registerItem = useCallback((v: string, label: string) => {
    setRegisteredItems((prev) =>
      prev.some((item) => item.value === v) ? prev : [...prev, { value: v, label }],
    );
  }, []);

  const unregisterItem = useCallback((v: string) => {
    setRegisteredItems((prev) => prev.filter((item) => item.value !== v));
  }, []);

  const filteredCount = registeredItems.filter(
    (item) => !search || item.label.toLowerCase().includes(search.toLowerCase()),
  ).length;

  // Close on outside click
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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  return (
    <ComboboxContext.Provider
      value={{
        open,
        setOpen,
        value,
        onSelect,
        search,
        setSearch,
        highlightedIndex,
        setHighlightedIndex,
        registerItem,
        unregisterItem,
        visibleItems: registeredItems.map((item) => item.value),
        filteredCount,
        autoHighlight,
      }}
    >
      <div ref={rootRef} className={cn('combobox', className)}>
        {children}
      </div>
    </ComboboxContext.Provider>
  );
}

/* ---- Trigger ---- */

export type ComboboxTriggerProps = {
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  children?: ReactNode;
  className?: string;
};

export function ComboboxTrigger({
  placeholder = 'Select...',
  disabled = false,
  invalid = false,
  children,
  className,
}: ComboboxTriggerProps) {
  const { open, setOpen, value } = useCombobox();

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(
        'combobox__trigger',
        open && 'combobox__trigger--open',
        disabled && 'combobox__trigger--disabled',
        className,
      )}
      onClick={() => setOpen(!open)}
      onKeyDown={handleKeyDown}
    >
      <span
        className={cn(
          'combobox__trigger-text',
          !value && !children && 'combobox__trigger-text--placeholder',
        )}
      >
        {children || (value ? value : placeholder)}
      </span>
      <span className="combobox__trigger-icon">
        <ChevronDown />
      </span>
    </button>
  );
}

/* ---- Content ---- */

export function ComboboxContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open } = useCombobox();
  if (!open) return null;
  return <div className={cn('combobox__content', className)}>{children}</div>;
}

/* ---- Input ---- */

export type ComboboxInputProps = {
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'className'>;

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, placeholder = 'Search...', ...props }, ref) => {
    const { search, setSearch, highlightedIndex, setHighlightedIndex, visibleItems, onSelect, autoHighlight } =
      useCombobox();
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Auto-focus when content opens
    useEffect(() => {
      inputRef.current?.focus();
    }, [inputRef]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(
          highlightedIndex < visibleItems.length - 1 ? highlightedIndex + 1 : 0,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(
          highlightedIndex > 0 ? highlightedIndex - 1 : visibleItems.length - 1,
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const item = visibleItems[highlightedIndex];
        if (item) onSelect(item);
      }
    };

    return (
      <div className={cn('combobox__input-wrapper', className)}>
        <span className="combobox__input-icon">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="combobox__input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlightedIndex(autoHighlight ? 0 : -1);
          }}
          placeholder={placeholder}
          aria-autocomplete="list"
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );
  },
);

ComboboxInput.displayName = 'ComboboxInput';

/* ---- List ---- */

export function ComboboxList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul role="listbox" className={cn('combobox__list', className)}>
      {children}
    </ul>
  );
}

/* ---- Empty ---- */

export function ComboboxEmpty({
  children = 'No results found.',
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { filteredCount } = useCombobox();
  if (filteredCount > 0) return null;
  return <div className={cn('combobox__empty', className)}>{children}</div>;
}

/* ---- Group ---- */

export function ComboboxGroup({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <li role="group" aria-label={label} className={className}>
      {label && <div className="combobox__group-label">{label}</div>}
      <ul role="group" className="combobox__group-list">{children}</ul>
    </li>
  );
}

/* ---- Item ---- */

export type ComboboxItemProps = {
  value: string;
  label?: string;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
};

export function ComboboxItem({ value: itemValue, label: labelProp, disabled = false, children, className }: ComboboxItemProps) {
  const { value, onSelect, search, highlightedIndex, visibleItems, registerItem, unregisterItem } =
    useCombobox();

  const isSelected = value === itemValue;
  const index = visibleItems.indexOf(itemValue);
  const isHighlighted = index === highlightedIndex;

  const searchLabel = labelProp || (typeof children === 'string' ? children : itemValue);

  // Register/unregister
  useEffect(() => {
    registerItem(itemValue, searchLabel);
    return () => unregisterItem(itemValue);
  }, [itemValue, searchLabel, registerItem, unregisterItem]);

  const matchesSearch =
    !search || searchLabel.toLowerCase().includes(search.toLowerCase());

  if (!matchesSearch) return null;

  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      className={cn(
        'combobox__item',
        isSelected && 'combobox__item--selected',
        isHighlighted && 'combobox__item--highlighted',
        disabled && 'combobox__item--disabled',
        className,
      )}
      onClick={() => {
        if (!disabled) onSelect(itemValue);
      }}
    >
      {children || itemValue}
    </li>
  );
}

/* ---- Separator ---- */

export function ComboboxSeparator({ className }: { className?: string }) {
  return <li role="separator" className={cn('combobox__separator', className)} />;
}
