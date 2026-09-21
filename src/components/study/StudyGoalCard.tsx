import {
  CalendarDays,
  Check,
  Clock3,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

export type StudyGoalStatus = 'active' | 'completed' | 'paused';

export type StudyGoalPriority = 'low' | 'medium' | 'high';

export interface StudyGoal {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  targetMinutes: number;
  completedMinutes: number;
  deadline?: string;
  status: StudyGoalStatus;
  priority: StudyGoalPriority;
  createdAt?: string;
}

interface StudyGoalCardProps {
  goal: StudyGoal;
  onEdit?: (goal: StudyGoal) => void;
  onDelete?: (goal: StudyGoal) => void;
  onComplete?: (goal: StudyGoal) => void;
  onPause?: (goal: StudyGoal) => void;
}

const priorityConfig: Record<
  StudyGoalPriority,
  { label: string; className: string }
> = {
  low: {
    label: 'Low',
    className:
      'bg-muted text-muted-foreground',
  },
  medium: {
    label: 'Medium',
    className:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  high: {
    label: 'High',
    className:
      'bg-red-500/10 text-red-700 dark:text-red-400',
  },
};

const statusConfig: Record<
  StudyGoalStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  completed: {
    label: 'Completed',
    className:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  paused: {
    label: 'Paused',
    className:
      'bg-muted text-muted-foreground',
  },
};

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}

function formatDeadline(deadline?: string) {
  if (!deadline) return 'No deadline';

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function StudyGoalCard({
  goal,
  onEdit,
  onDelete,
  onComplete,
  onPause,
}: StudyGoalCardProps) {
  const progress =
    goal.targetMinutes > 0
      ? Math.min(
          100,
          Math.round((goal.completedMinutes / goal.targetMinutes) * 100),
        )
      : 0;

  const status = statusConfig[goal.status];
  const priority = priorityConfig[goal.priority];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{goal.title}</h3>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}
            >
              {priority.label}
            </span>
          </div>

          {goal.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {goal.description}
            </p>
          )}

          {goal.subject && (
            <p className="mt-2 text-sm font-medium text-primary">
              {goal.subject}
            </p>
          )}
        </div>

        <details className="relative shrink-0">
          <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
          </summary>

          <div className="absolute right-0 top-9 z-20 min-w-36 rounded-lg border bg-card p-1 shadow-lg">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(goal)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}

            {onPause && goal.status === 'active' && (
              <button
                type="button"
                onClick={() => onPause(goal)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Pause
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(goal)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </details>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatMinutes(goal.completedMinutes)} /{' '}
            {formatMinutes(goal.targetMinutes)}
          </span>

          {goal.deadline && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDeadline(goal.deadline)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {onComplete && goal.status !== 'completed' && (
          <button
            type="button"
            onClick={() => onComplete(goal)}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Check className="h-4 w-4" />
            Complete
          </button>
        )}

        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          {formatMinutes(Math.max(goal.targetMinutes - goal.completedMinutes, 0))}{' '}
          remaining
        </div>
      </div>
    </div>
  );
}