'use client';

import { CheckSquare, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TasksHeaderProps {
  onAddTask?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function TasksHeader({
  onAddTask,
  onRefresh,
  isRefreshing = false,
}: TasksHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Organize assignments, study work, deadlines, and daily tasks.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
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

        <Button size="sm" onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
}