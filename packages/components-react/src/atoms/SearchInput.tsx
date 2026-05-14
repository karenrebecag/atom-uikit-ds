import { forwardRef, type InputHTMLAttributes } from 'react';

export type SearchInputProps = {
  value?: string;
  disabled?: boolean;
  onClear?: () => void;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const SearchIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3.5 3.5" />
  </svg>
);

const ClearIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </svg>
);

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      disabled = false,
      onClear,
      className,
      ...props
    },
    ref,
  ) => {
    const hasValue = value !== undefined ? value.length > 0 : false;

    return (
      <div className={cn('search-input', disabled && 'search-input--disabled', className)}>
        <span className="search-input__icon">
          <SearchIcon />
        </span>
        <input
          ref={ref}
          type="search"
          className="search-input__input"
          value={value}
          disabled={disabled}
          {...props}
        />
        {hasValue && !disabled && onClear && (
          <button
            type="button"
            className="search-input__clear"
            onClick={onClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <ClearIcon />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
