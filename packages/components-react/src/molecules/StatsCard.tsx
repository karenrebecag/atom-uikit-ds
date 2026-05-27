import { forwardRef, type ReactNode } from 'react';

export type StatsTrend = 'up' | 'down' | 'neutral';

export type StatsCardProps = {
  value: string;
  label: string;
  trend?: StatsTrend;
  trendValue?: string;
  compact?: boolean;
  gradient?: boolean;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function TrendIcon({ direction }: { direction: 'up' | 'down' }) {
  if (direction === 'up') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ value, label, trend, trendValue, compact, gradient, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'stats-card',
          compact && 'stats-card--compact',
          gradient && 'stats-card--gradient',
          className,
        )}
      >
        <span className="stats-card__value">{value}</span>
        <span className="stats-card__label">{label}</span>
        {trend && trendValue && (
          <span className={cn('stats-card__trend', `stats-card__trend--${trend}`)}>
            {trend !== 'neutral' && (
              <span className="stats-card__trend-icon" aria-hidden="true">
                <TrendIcon direction={trend} />
              </span>
            )}
            {trendValue}
          </span>
        )}
      </div>
    );
  },
);

StatsCard.displayName = 'StatsCard';
