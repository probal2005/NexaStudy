import {
  BookOpen,
  CalendarDays,
  Clock3,
  Trash2,
} from 'lucide-react';

export interface StudySession {
  id: string;
  subject?: string;
  topic?: string;
  durationMinutes: number;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  source?: 'manual' | 'pomodoro' | 'timer';
}

interface StudySessionCardProps {
  session: StudySession;
  onDelete?: (session: StudySession) => void;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining > 0
    ? `${hours}h ${remaining}m`
    : `${hours}h`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function StudySessionCard({
  session,
  onDelete,
}: StudySessionCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">
                {session.topic || session.subject || 'Study Session'}
              </h3>

              {session.subject && session.topic && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {session.subject}
                </p>
              )}
            </div>

            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {formatDuration(session.durationMinutes)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(session.startedAt)}
            </span>

            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {session.source ?? 'manual'}
            </span>
          </div>

          {session.notes && (
            <p className="mt-3 text-sm text-muted-foreground">
              {session.notes}
            </p>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(session)}
            aria-label="Delete study session"
            className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}