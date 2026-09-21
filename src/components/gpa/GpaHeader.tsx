'use client';

import {
  Calculator,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface GpaHeaderProps {
  onAddCourse?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function GpaHeader({
  onAddCourse,
  onRefresh,
  onExport,
}: GpaHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />

          <h1 className="text-2xl font-bold tracking-tight">
            GPA & CGPA
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Calculate your semester GPA and track your overall CGPA.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
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

        {onAddCourse && (
          <Button
            type="button"
            size="sm"
            onClick={onAddCourse}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        )}
      </div>
    </div>
  );
}