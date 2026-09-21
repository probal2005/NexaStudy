'use client';

import { BarChart3, Download, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface AnalyticsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
}

export function AnalyticsHeader({
  onRefresh,
  onExport,
  isRefreshing = false,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your study activity, productivity, and academic progress.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh analytics"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              aria-hidden="true"
            />
            Refresh
          </Button>
        )}

        {onExport && (
          <Button type="button" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}