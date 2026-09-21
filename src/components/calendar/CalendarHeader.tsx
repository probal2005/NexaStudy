'use client';

import { CalendarDays, Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface CalendarHeaderProps {
  onAddEvent?: () => void;
}

export function CalendarHeader({
  onAddEvent,
}: CalendarHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Calendar
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage classes, assignments, exams, study sessions, and events.
          </p>
        </div>
      </div>

      {onAddEvent && (
        <Button onClick={onAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      )}
    </header>
  );
}