interface TaskCompletionChartProps {
  completed: number;
  pending: number;
  overdue: number;
}

export function TaskCompletionChart({
  completed,
  pending,
  overdue,
}: TaskCompletionChartProps) {
  const total = completed + pending + overdue;

  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Task Completion
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Current task status breakdown.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div
          className="relative h-32 w-32 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(
              hsl(var(--primary)) ${completionPercentage}%,
              hsl(var(--muted)) ${completionPercentage}% 100%
            )`,
          }}
          aria-label={`${completionPercentage}% of tasks completed`}
          role="img"
        >
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card">
            <span className="text-2xl font-bold text-foreground">
              {completionPercentage}%
            </span>
            <span className="text-[11px] text-muted-foreground">
              completed
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <LegendItem
            label="Completed"
            value={completed}
            className="bg-primary"
          />

          <LegendItem
            label="Pending"
            value={pending}
            className="bg-muted-foreground/40"
          />

          <LegendItem
            label="Overdue"
            value={overdue}
            className="bg-red-500"
          />
        </div>
      </div>
    </section>
  );
}

interface LegendItemProps {
  label: string;
  value: number;
  className: string;
}

function LegendItem({
  label,
  value,
  className,
}: LegendItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${className}`}
          aria-hidden="true"
        />
        <span className="text-muted-foreground">{label}</span>
      </div>

      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}