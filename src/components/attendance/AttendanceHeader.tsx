'use client';

import { Download, Plus, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface AttendanceHeaderProps {
  onAdd?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
}

export function AttendanceHeader({
  onAdd,
  onRefresh,
  onExport,
  loading = false,
}: AttendanceHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Attendance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your classes, attendance records, and attendance percentage.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh attendance"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        )}

        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}

        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        )}
      </div>
    </header>
  );
}