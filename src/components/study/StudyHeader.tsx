'use client';

import { Plus, RefreshCw, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StudyHeaderProps {
  onRefresh?: () => void;
  onAddGoal?: () => void;
  isRefreshing?: boolean;
}

export function StudyHeader({
  onRefresh,
  onAddGoal,
  isRefreshing = false,
}: StudyHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Study</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Plan your study goals, track sessions, and monitor your progress.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>

        <Button size="sm" onClick={onAddGoal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>
    </div>
  );
}