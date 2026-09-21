import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

export type AssignmentStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'overdue';

export type AssignmentPriority = 'low' | 'medium' | 'high';

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: string;
  subjectId?: string;
  dueDate: string;
  dueTime?: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
  onStatusChange?: (
    assignment: Assignment,
    status: AssignmentStatus,
  ) => void;
}

const statusConfig: Record<
  AssignmentStatus,
  {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'danger';
  }
> = {
  pending: {
    label: 'Pending',
    variant: 'default',
  },
  'in-progress': {
    label: 'In Progress',
    variant: 'warning',
  },
  completed: {
    label: 'Completed',
    variant: 'success',
  },
  overdue: {
    label: 'Overdue',
    variant: 'danger',
  },
};

const priorityConfig: Record<
  AssignmentPriority,
  {
    label: string;
    className: string;
  }
> = {
  low: {
    label: 'Low',
    className: 'text-muted-foreground',
  },
  medium: {
    label: 'Medium',
    className: 'text-amber-600 dark:text-amber-400',
  },
  high: {
    label: 'High',
    className: 'text-red-600 dark:text-red-400',
  },
};

export function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
  onStatusChange,
}: AssignmentCardProps) {
  const status = statusConfig[assignment.status];
  const priority = priorityConfig[assignment.priority];

  const progress = Math.min(
    Math.max(assignment.progress ?? 0, 0),
    100,
  );

  const dueDate = formatDueDate(assignment.dueDate);

  return (
    <article
      className={cn(
        'group rounded-xl border border-border bg-card p-5 shadow-sm',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        assignment.status === 'overdue' &&
          'border-red-500/30',
        assignment.status === 'completed' &&
          'opacity-90',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={status.variant}>
              {status.label}
            </Badge>

            <span
              className={cn(
                'text-xs font-medium',
                priority.className,
              )}
            >
              {priority.label} priority
            </span>
          </div>

          <h3 className="truncate text-base font-semibold text-foreground">
            {assignment.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-primary">
            {assignment.subject}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(assignment)}
              aria-label={`Edit ${assignment.title}`}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={() => onDelete(assignment)}
              aria-label={`Delete ${assignment.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {!onEdit && !onDelete && (
            <MoreHorizontal
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {assignment.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {assignment.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {dueDate}
        </span>

        {assignment.dueTime && (
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {assignment.dueTime}
          </span>
        )}
      </div>

      {assignment.status !== 'completed' &&
        typeof assignment.progress === 'number' && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Progress
              </span>

              <span className="font-medium text-foreground">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={`${assignment.title} progress`}
              />
            </div>
          </div>
        )}

      {assignment.status !== 'completed' &&
        onStatusChange && (
          <div className="mt-5 flex flex-wrap gap-2">
            {assignment.status === 'pending' && (
              <Button
                type="button"
                variant="outline"
                className="text-xs"
                onClick={() =>
                  onStatusChange(
                    assignment,
                    'in-progress',
                  )
                }
              >
                Start assignment
              </Button>
            )}

            {assignment.status === 'in-progress' && (
              <Button
                type="button"
                className="text-xs"
                onClick={() =>
                  onStatusChange(
                    assignment,
                    'completed',
                  )
                }
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Mark completed
              </Button>
            )}
          </div>
        )}
    </article>
  );
}

function formatDueDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}