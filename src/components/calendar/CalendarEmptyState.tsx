'use client';

import { CalendarX2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface CalendarEmptyStateProps {
  filtered?: boolean;
  onAddEvent?: () => void;
}

export function CalendarEmptyState({
  filtered = false,
  onAddEvent,
}: CalendarEmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarX2 className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {filtered ? 'No matching events' : 'Your calendar is empty'}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {filtered
          ? 'Try changing the current filters to see other events.'
          : 'Add classes, assignments, exams, and study sessions to organize your academic schedule.'}
      </p>

      {!filtered && onAddEvent && (
        <Button className="mt-5" onClick={onAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      )}
    </div>
  );
}