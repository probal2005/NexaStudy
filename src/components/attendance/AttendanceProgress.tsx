'use client';

import { cn } from '@/utils';

interface AttendanceProgressProps {
  percentage: number;
  target?: number;
  label?: string;
  showTarget?: boolean;
}

export function AttendanceProgress({
  percentage,
  target = 75,
  label = 'Attendance',
  showTarget = true,
}: AttendanceProgressProps) {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  const safeTarget = Math.max(0, Math.min(100, target));

  const status =
    safePercentage >= safeTarget
      ? 'good'
      : safePercentage >= safeTarget - 10
        ? 'warning'
        : 'danger';

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {showTarget && (
            <p className="text-xs text-muted-foreground">
              Target: {safeTarget}%
            </p>
          )}
        </div>

        <span
          className={cn(
            'text-lg font-bold',
            status === 'good' && 'text-emerald-600',
            status === 'warning' && 'text-amber-600',
            status === 'danger' && 'text-red-600',
          )}
        >
          {safePercentage}%
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercentage}
        aria-label={`${label}: ${safePercentage}%`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            status === 'good' && 'bg-emerald-500',
            status === 'warning' && 'bg-amber-500',
            status === 'danger' && 'bg-red-500',
          )}
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      {showTarget && (
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>0%</span>
          <span>{safeTarget}% target</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}