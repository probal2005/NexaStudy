'use client';

import {
  Clock3,
  History,
  RefreshCw,
  Settings2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface PomodoroHeaderProps {
  onSettings?: () => void;
  onHistory?: () => void;
  onReset?: () => void;
  loading?: boolean;
}

export function PomodoroHeader({
  onSettings,
  onHistory,
  onReset,
  loading = false,
}: PomodoroHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clock3 className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pomodoro
          </h1>

          <p className="text-sm text-muted-foreground">
            Focus deeply, take intentional breaks, and track your study time.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {onHistory && (
          <Button variant="outline" onClick={onHistory}>
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        )}

        {onSettings && (
          <Button variant="outline" onClick={onSettings}>
            <Settings2 className="mr-2 h-4 w-4" />
            Settings
          </Button>
        )}

        {onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}