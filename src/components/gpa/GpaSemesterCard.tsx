import {
  CalendarDays,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

import { cn } from '@/utils';

interface GpaSemesterCardProps {
  semester: string;
  gpa: number;
  credits: number;
  courseCount: number;
  date?: string;
  onClick?: () => void;
}

export function GpaSemesterCard({
  semester,
  gpa,
  credits,
  courseCount,
  date,
  onClick,
}: GpaSemesterCardProps) {
  const score = Math.min(
    100,
    Math.max(0, gpa * 10),
  );

  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border bg-card p-5 text-left shadow-sm transition',
        onClick &&
          'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
        !onClick && 'cursor-default',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold">
              {semester}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {courseCount}{' '}
              {courseCount === 1 ? 'course' : 'courses'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {gpa.toFixed(2)}
          </p>

          <p className="text-xs text-muted-foreground">
            GPA
          </p>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {credits}{' '}
          {credits === 1 ? 'credit' : 'credits'}
        </span>

        {date && (
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {date}
          </span>
        )}

        {onClick && (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
    </button>
  );
}