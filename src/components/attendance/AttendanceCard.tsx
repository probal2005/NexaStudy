'use client';

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreVertical,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react';

import { cn } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  date: string;
  status: AttendanceStatus;
  startTime?: string;
  endTime?: string;
  remarks?: string;
}

interface AttendanceCardProps {
  record: AttendanceRecord;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (record: AttendanceRecord) => void;
}

const statusConfig: Record<
  AttendanceStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    variant: 'success' | 'danger' | 'warning';
  }
> = {
  present: {
    label: 'Present',
    icon: CheckCircle2,
    variant: 'success',
  },
  absent: {
    label: 'Absent',
    icon: XCircle,
    variant: 'danger',
  },
  late: {
    label: 'Late',
    icon: Clock3,
    variant: 'warning',
  },
};

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AttendanceCard({
  record,
  onEdit,
  onDelete,
}: AttendanceCardProps) {
  const config = statusConfig[record.status];
  const StatusIcon = config.icon;

  return (
    <article className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              record.status === 'present' && 'bg-emerald-500/10 text-emerald-600',
              record.status === 'absent' && 'bg-red-500/10 text-red-600',
              record.status === 'late' && 'bg-amber-500/10 text-amber-600',
            )}
          >
            <StatusIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">
              {record.subjectName}
            </h3>

            {record.subjectCode && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {record.subjectCode}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Badge variant={config.variant}>{config.label}</Badge>

          <div className="flex opacity-70 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit attendance for ${record.subjectName}`}
                onClick={() => onEdit(record)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete attendance for ${record.subjectName}`}
                onClick={() => onDelete(record)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{formatDate(record.date)}</span>
        </div>

        {(record.startTime || record.endTime) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 shrink-0" />
            <span>
              {record.startTime || '--:--'}
              {record.endTime ? ` - ${record.endTime}` : ''}
            </span>
          </div>
        )}
      </div>

      {record.remarks && (
        <p className="mt-3 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {record.remarks}
        </p>
      )}
    </article>
  );
}