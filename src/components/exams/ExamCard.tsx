import {
  CalendarDays,
  Clock3,
  Edit3,
  MapPin,
  MoreVertical,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

export type ExamStatus =
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'postponed';

export type ExamType =
  | 'midterm'
  | 'final'
  | 'quiz'
  | 'practical'
  | 'viva'
  | 'other';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  subjectCode?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  type: ExamType;
  status: ExamStatus;
  totalMarks?: number;
  durationMinutes?: number;
  syllabus?: string;
  notes?: string;
}

interface ExamCardProps {
  exam: Exam;
  onEdit?: (exam: Exam) => void;
  onDelete?: (exam: Exam) => void;
  onClick?: (exam: Exam) => void;
}

const typeConfig: Record<
  ExamType,
  {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'danger';
  }
> = {
  midterm: {
    label: 'Midterm',
    variant: 'warning',
  },
  final: {
    label: 'Final',
    variant: 'danger',
  },
  quiz: {
    label: 'Quiz',
    variant: 'default',
  },
  practical: {
    label: 'Practical',
    variant: 'success',
  },
  viva: {
    label: 'Viva',
    variant: 'warning',
  },
  other: {
    label: 'Other',
    variant: 'default',
  },
};

const statusConfig: Record<
  ExamStatus,
  {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'danger';
  }
> = {
  upcoming: {
    label: 'Upcoming',
    variant: 'default',
  },
  completed: {
    label: 'Completed',
    variant: 'success',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'danger',
  },
  postponed: {
    label: 'Postponed',
    variant: 'warning',
  },
};

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function formatTime(time?: string) {
  if (!time) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function ExamCard({
  exam,
  onEdit,
  onDelete,
  onClick,
}: ExamCardProps) {
  const type = typeConfig[exam.type];
  const status = statusConfig[exam.status];

  return (
    <article
      className={cn(
        'group rounded-2xl border bg-card p-5 shadow-sm transition',
        'hover:-translate-y-0.5 hover:shadow-md',
        onClick && 'cursor-pointer',
      )}
      onClick={() => onClick?.(exam)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={type.variant}>{type.label}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <h3 className="truncate text-lg font-semibold">
            {exam.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-primary">
            {exam.subject}
            {exam.subjectCode && (
              <span className="ml-2 text-muted-foreground">
                {exam.subjectCode}
              </span>
            )}
          </p>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${exam.title}`}
              onClick={() => onEdit(exam)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete ${exam.title}`}
              onClick={() => onDelete(exam)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}

          {!onEdit && !onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{formatDate(exam.date)}</span>
        </div>

        {exam.startTime && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 shrink-0" />

            <span>
              {formatTime(exam.startTime)}
              {exam.endTime && ` - ${formatTime(exam.endTime)}`}
            </span>
          </div>
        )}

        {exam.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{exam.location}</span>
          </div>
        )}

        {typeof exam.durationMinutes === 'number' && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">
              Duration:
            </span>{' '}
            {exam.durationMinutes} min
          </div>
        )}

        {typeof exam.totalMarks === 'number' && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">
              Total marks:
            </span>{' '}
            {exam.totalMarks}
          </div>
        )}
      </div>

      {exam.syllabus && (
        <div className="mt-4 rounded-xl bg-muted/40 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Syllabus
          </p>

          <p className="line-clamp-2 text-sm">
            {exam.syllabus}
          </p>
        </div>
      )}

      {exam.notes && (
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
          {exam.notes}
        </p>
      )}
    </article>
  );
}