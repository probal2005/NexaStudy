interface StudyTimeItem {
  label: string;
  minutes: number;
}

interface StudyTimeChartProps {
  data: StudyTimeItem[];
}

export function StudyTimeChart({
  data,
}: StudyTimeChartProps) {
  const maxMinutes = Math.max(
    ...data.map((item) => item.minutes),
    1,
  );

  const totalMinutes = data.reduce(
    (total, item) => total + item.minutes,
    0,
  );

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Study Time
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Time spent studying each day.
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            {totalHours}h {remainingMinutes}m
          </p>
          <p className="text-xs text-muted-foreground">
            total
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage =
            item.minutes > 0
              ? Math.max((item.minutes / maxMinutes) * 100, 3)
              : 0;

          return (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {item.label}
                </span>

                <span className="font-medium text-foreground">
                  {formatMinutes(item.minutes)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatMinutes(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remaining = safeMinutes % 60;

  if (hours === 0) {
    return `${remaining}m`;
  }

  if (remaining === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}m`;
}