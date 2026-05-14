import { type ReactNode } from 'react';

type ChipType = 'outlined' | 'filled';
type ChipSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export type ChipProps = {
  type?: ChipType;
  size?: ChipSize;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  animated?: boolean;
  iconLeft?: ReactNode;
  onClose?: () => void;
  children: string;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const CloseIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </svg>
);

export function Chip({
  type = 'outlined',
  size = 's',
  disabled = false,
  error = false,
  focused = false,
  animated = false,
  iconLeft,
  onClose,
  children,
  className,
}: ChipProps) {
  const classes = cn(
    'chip',
    `chip--${type}`,
    `chip--${size}`,
    disabled && 'chip--disabled',
    error && 'chip--error',
    focused && 'chip--focused',
    className,
  );

  return (
    <span className={classes} {...(animated ? { 'data-chip-animate': '' } : {})}>
      {iconLeft && <span className="chip__icon">{iconLeft}</span>}
      <span className="chip__label">{children}</span>
      {onClose && (
        <button
          type="button"
          className="chip__close"
          onClick={onClose}
          disabled={disabled}
          aria-label={`Remove ${children}`}
          tabIndex={-1}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}
