'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowDown,
  ArrowUp,
  Minus,
} from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconClassName?: string;
}

export default function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  iconClassName = 'bg-primary/10 text-primary',
}: DashboardStatCardProps) {
  const TrendIcon =
    trend === 'up'
      ? ArrowUp
      : trend === 'down'
        ? ArrowDown
        : Minus;

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div
          className={[
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            iconClassName,
          ].join(' ')}
        >
          <Icon className="h-5 w-5" />
        </div>

        {trendValue && (
          <div
            className={[
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
              trend === 'up'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : trend === 'down'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'bg-muted text-muted-foreground',
            ].join(' ')}
          >
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted-foreground">{title}</p>

        <p className="mt-1 text-2xl font-bold tracking-tight">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}