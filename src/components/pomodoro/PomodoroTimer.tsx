'use client';

import {
  PomodoroControls,
} from './PomodoroControls';

import {
  PomodoroModeSelector,
  type PomodoroMode,
} from './PomodoroModeSelector';

import { PomodoroProgress } from './PomodoroProgress';

import { PomodoroTimerDisplay } from './PomodoroTimerDisplay';

interface PomodoroTimerProps {
  mode: PomodoroMode;
  minutes: number;
  seconds: number;
  running: boolean;
  elapsedSeconds: number;
  totalSeconds: number;
  onModeChange: (mode: PomodoroMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function PomodoroTimer({
  mode,
  minutes,
  seconds,
  running,
  elapsedSeconds,
  totalSeconds,
  onModeChange,
  onStart,
  onPause,
  onReset,
  onSkip,
}: PomodoroTimerProps) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mx-auto max-w-2xl space-y-7">
        <PomodoroModeSelector
          mode={mode}
          onChange={onModeChange}
          disabled={running}
        />

        <PomodoroTimerDisplay
          minutes={minutes}
          seconds={seconds}
          mode={mode}
          running={running}
        />

        <PomodoroProgress
          elapsedSeconds={elapsedSeconds}
          totalSeconds={totalSeconds}
        />

        <PomodoroControls
          running={running}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          onSkip={onSkip}
        />
      </div>
    </section>
  );
}