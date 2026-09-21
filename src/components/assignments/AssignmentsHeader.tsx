'use client';

import {
  ClipboardList,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface AssignmentsHeaderProps {
  onAdd?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
}

export function AssignmentsHeader({
  onAdd,
  onRefresh,
  onExport,
  isRefreshing = false,
}: AssignmentsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardList
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assignments
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Organize, track, and complete your academic
            assignments.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </Button>
        )}

        {onExport && (
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}

        {onAdd && (
          <Button type="button" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
        )}
      </div>
    </div>
  );
}