interface PomodoroProgressProps {
  elapsedSeconds: number;
  totalSeconds: number;
  label?: string;
}

export function PomodoroProgress({
  elapsedSeconds,
  totalSeconds,
  label = 'Session progress',
}: PomodoroProgressProps) {
  const percentage =
    totalSeconds > 0
      ? Math.min(
          100,
          Math.max(0, (elapsedSeconds / totalSeconds) * 100),
        )
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}