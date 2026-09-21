'use client';

import {
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react';

interface PomodoroControlsProps {
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function PomodoroControls({
  running,
  onStart,
  onPause,
  onReset,
  onSkip,
}: PomodoroControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {running ? (
        <button
          type="button"
          onClick={onPause}
          className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Pause className="h-5 w-5" />
          Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={onStart}
          className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Play className="h-5 w-5" />
          Start
        </button>
      )}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>

      <button
        type="button"
        onClick={onSkip}
        className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted"
      >
        <SkipForward className="h-4 w-4" />
        Skip
      </button>
    </div>
  );
}