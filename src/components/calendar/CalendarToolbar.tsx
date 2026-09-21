'use client';

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

export type CalendarView =
  | 'month'
  | 'week'
  | 'day'
  | 'agenda';

interface CalendarToolbarProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent?: () => void;
}

function formatPeriod(date: Date, view: CalendarView) {
  if (view === 'day') {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onAddEvent,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            aria-label="Previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            aria-label="Next period"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={onToday}
            className="ml-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Today
          </Button>

          <h2 className="ml-2 hidden text-lg font-semibold text-foreground sm:block">
            {formatPeriod(currentDate, view)}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              ['month', 'Month'],
              ['week', 'Week'],
              ['day', 'Day'],
              ['agenda', 'Agenda'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onViewChange(value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                view === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}

          {onAddEvent && (
            <Button
              size="icon"
              className="ml-1 sm:hidden"
              onClick={onAddEvent}
              aria-label="Add event"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <h2 className="text-base font-semibold text-foreground sm:hidden">
        {formatPeriod(currentDate, view)}
      </h2>
    </div>
  );
}