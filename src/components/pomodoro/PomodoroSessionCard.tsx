import {
  BookOpen,
  Clock3,
  Trash2,
} from 'lucide-react';

import type { PomodoroSession } from './PomodoroSessionForm';

interface PomodoroSessionCardProps {
  session: PomodoroSession;
  onDelete?: (session: PomodoroSession) => void;
}

export function PomodoroSessionCard({
  session,
  onDelete,
}: PomodoroSessionCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Clock3 className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">
            {session.durationMinutes}-minute focus session
          </h3>

          {session.subject && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              {session.subject}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(session.completedAt).toLocaleString()}
        </p>

        {session.note && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {session.note}
          </p>
        )}
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(session)}
          className="self-end rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:self-auto"
          aria-label="Delete session"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}