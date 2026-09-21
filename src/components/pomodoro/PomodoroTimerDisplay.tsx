interface PomodoroTimerDisplayProps {
  minutes: number;
  seconds: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  running: boolean;
}

const modeLabels = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export function PomodoroTimerDisplay({
  minutes,
  seconds,
  mode,
  running,
}: PomodoroTimerDisplayProps) {
  return (
    <div className="text-center">
      <div className="mb-4">
        <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          {modeLabels[mode]}
        </span>
      </div>

      <div
        className={`font-mono text-7xl font-bold tracking-tight transition-all sm:text-8xl ${
          running ? 'scale-[1.01]' : ''
        }`}
        aria-live="polite"
        aria-label={`${minutes} minutes ${seconds} seconds`}
      >
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {running ? 'Stay focused.' : 'Ready when you are.'}
      </p>
    </div>
  );
}