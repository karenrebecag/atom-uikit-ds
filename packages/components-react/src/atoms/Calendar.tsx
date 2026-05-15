import { useState, useMemo, useCallback } from 'react';
import { IconButton } from './IconButton';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ChevronLeft = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ---- Helpers ---- */

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, from: Date | null, to: Date | null) {
  if (!from || !to) return false;
  const t = day.getTime();
  return t > from.getTime() && t < to.getTime();
}

function getDaysGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const days: Date[] = [];
  for (let i = -startDay; i < 42 - startDay; i++) {
    days.push(new Date(year, month, i + 1));
  }
  return days;
}

/* ---- Component ---- */

export type CalendarProps = {
  mode?: 'single' | 'range';
  selected?: Date | null;
  rangeFrom?: Date | null;
  rangeTo?: Date | null;
  onSelect?: (date: Date) => void;
  onRangeSelect?: (from: Date | null, to: Date | null) => void;
  disabledDates?: (date: Date) => boolean;
  className?: string;
};

export function Calendar({
  mode = 'single',
  selected = null,
  rangeFrom = null,
  rangeTo = null,
  onSelect,
  onRangeSelect,
  disabledDates,
  className,
}: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const initial = selected || rangeFrom || today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const days = useMemo(() => getDaysGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }, [viewMonth]);

  // Range selection state
  const [rangeStep, setRangeStep] = useState<'from' | 'to'>(rangeFrom && !rangeTo ? 'to' : 'from');

  const handleDayClick = (day: Date) => {
    if (mode === 'single') {
      onSelect?.(day);
    } else {
      if (rangeStep === 'from') {
        onRangeSelect?.(day, null);
        setRangeStep('to');
      } else {
        if (rangeFrom && day.getTime() < rangeFrom.getTime()) {
          onRangeSelect?.(day, null);
          setRangeStep('to');
        } else {
          onRangeSelect?.(rangeFrom, day);
          setRangeStep('from');
        }
      }
    }
  };

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={cn('calendar', className)}>
      <div className="calendar__nav">
        <IconButton
          variant="tertiary"
          size="xs"
          icon={<ChevronLeft />}
          aria-label="Previous month"
          onClick={prevMonth}
        />
        <span className="calendar__title">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <IconButton
          variant="tertiary"
          size="xs"
          icon={<ChevronRight />}
          aria-label="Next month"
          onClick={nextMonth}
        />
      </div>
      <table className="calendar__grid" role="grid">
        <thead>
          <tr>
            {DAYS.map((d) => (
              <th key={d} className="calendar__head">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                const isOutside = day.getMonth() !== viewMonth;
                const isToday = isSameDay(day, today);
                const isDisabled = disabledDates?.(day) ?? false;

                let isSelected = false;
                let isRangeStart = false;
                let isRangeEnd = false;
                let isInRangeDay = false;

                if (mode === 'single' && selected) {
                  isSelected = isSameDay(day, selected);
                } else if (mode === 'range') {
                  if (rangeFrom) isRangeStart = isSameDay(day, rangeFrom);
                  if (rangeTo) isRangeEnd = isSameDay(day, rangeTo);
                  isSelected = isRangeStart || isRangeEnd;
                  isInRangeDay = isInRange(day, rangeFrom, rangeTo);
                }

                return (
                  <td key={di} style={{ padding: 0 }}>
                    <button
                      type="button"
                      className={cn(
                        'calendar__day',
                        isOutside && 'calendar__day--outside',
                        isToday && 'calendar__day--today',
                        isSelected && 'calendar__day--selected',
                        isRangeStart && 'calendar__day--range-start',
                        isRangeEnd && 'calendar__day--range-end',
                        isInRangeDay && 'calendar__day--in-range',
                        isDisabled && 'calendar__day--disabled',
                      )}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(day)}
                      tabIndex={isOutside ? -1 : 0}
                      aria-selected={isSelected || undefined}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
