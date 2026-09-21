'use client';

import {
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

interface AttendanceOverviewProps {
  percentage: number;
  present: number;
  absent: number;
  late: number;
  target?: number;
}

export default function AttendanceOverview({
  percentage,
  present,
  absent,
  late,
  target = 75,
}: AttendanceOverviewProps) {
  const isSafe = percentage >= target;

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Attendance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your overall attendance status.
          </p>
        </div>

        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded-xl',
            isSafe
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-amber-500/10 text-amber-500',
          ].join(' ')}
        >
          {isSafe ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">
            {percentage}%
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Target: {target}%
          </p>
        </div>

        <GraduationCap className="h-8 w-8 text-muted-foreground/40" />
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={[
            'h-full rounded-full transition-all',
            isSafe ? 'bg-emerald-500' : 'bg-amber-500',
          ].join(' ')}
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Metric
          label="Present"
          value={present}
          className="text-emerald-500"
        />

        <Metric
          label="Absent"
          value={absent}
          className="text-red-500"
        />

        <Metric
          label="Late"
          value={late}
          className="text-amber-500"
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-3 text-center">
      <p className={`text-lg font-bold ${className}`}>
        {value}
      </p>

      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}