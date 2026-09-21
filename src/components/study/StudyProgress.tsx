interface StudyProgressProps {
  label: string;
  value: number;
  max: number;
  description?: string;
  showPercentage?: boolean;
}

export function StudyProgress({
  label,
  value,
  max,
  description,
  showPercentage = true,
}: StudyProgressProps) {
  const percentage =
    max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{label}</p>

          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {showPercentage && (
          <span className="shrink-0 text-sm font-semibold">
            {percentage}%
          </span>
        )}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}