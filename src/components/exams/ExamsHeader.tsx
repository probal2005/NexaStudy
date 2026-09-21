'use client';

import {
  CalendarDays,
  Plus,
  RefreshCw,
  Download,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface ExamsHeaderProps {
  onAddExam?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ExamsHeader({
  onAddExam,
  onRefresh,
  onExport,
}: ExamsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your exams, schedules, subjects, and preparation.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}

        {onExport && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}

        {onAddExam && (
          <Button type="button" size="sm" onClick={onAddExam}>
            <Plus className="mr-2 h-4 w-4" />
            Add Exam
          </Button>
        )}
      </div>
    </div>
  );
}