import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { cn } from '@/utils';

export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: StatTrend;
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  className,
}: StatCardProps) {
  const TrendIcon =
    trend === 'up'
      ? ArrowUpRight
      : trend === 'down'
        ? ArrowDownRight
        : Minus;

  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      {trendValue && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium',
              trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
              trend === 'down' && 'text-red-600 dark:text-red-400',
              trend === 'neutral' && 'text-muted-foreground',
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {trendValue}
          </span>

          <span className="text-muted-foreground">vs previous period</span>
        </div>
      )}
    </article>
  );
}