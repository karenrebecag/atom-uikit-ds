import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

type LinkButtonVariant = 'default' | 'destructive';
type LinkButtonSize = 'sm' | 'default' | 'lg';

export type LinkButtonProps = {
  variant?: LinkButtonVariant;
  size?: LinkButtonSize;
  disabled?: boolean;
  animated?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ArrowIcon = ({ animated }: { animated: boolean }) => (
  <span className="link-button__icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...(animated ? { 'data-link-button-icon': '' } : {})}
    >
      <path d="M2 12H21" stroke="currentColor" strokeWidth="2" />
      <path d="M14 5L21 12L14 19" stroke="currentColor" strokeWidth="2" />
    </svg>
  </span>
);

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      disabled = false,
      animated = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'link-button',
      `link-button--${size}`,
      variant === 'destructive' && 'link-button--destructive',
      disabled && 'link-button--disabled',
      className,
    );

    return (
      <a
        ref={ref}
        className={classes}
        aria-disabled={disabled}
        {...(animated ? { 'data-link-button-animate': '' } : {})}
        {...props}
      >
        <span className="link-button__text" {...(animated ? { 'data-link-button-text': '' } : {})}>
          {children}
        </span>
        <ArrowIcon animated={animated} />
      </a>
    );
  },
);

LinkButton.displayName = 'LinkButton';
