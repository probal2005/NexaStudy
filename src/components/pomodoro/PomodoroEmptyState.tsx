'use client';

import { Clock3, Play } from 'lucide-react';

interface PomodoroEmptyStateProps {
  onStart?: () => void;
}

export function PomodoroEmptyState({
  onStart,
}: PomodoroEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Clock3 className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        Ready for your next focus session?
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Start a Pomodoro session and build your study streak one focused block at a time.
      </p>

      {onStart && (
        <button
          type="button"
          onClick={onStart}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Play className="h-4 w-4" />
          Start Focus
        </button>
      )}
    </div>
  );
}