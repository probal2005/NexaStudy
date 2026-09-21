'use client';

interface StudyDay {
  day: string;
  hours: number;
}

interface WeeklyStudyChartProps {
  data: StudyDay[];
}

export default function WeeklyStudyChart({
  data,
}: WeeklyStudyChartProps) {
  const maxHours = Math.max(
    ...data.map((item) => item.hours),
    1,
  );

  const total = data.reduce(
    (sum, item) => sum + item.hours,
    0,
  );

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Weekly study activity
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Hours studied each day.
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold">
            {total.toFixed(1)}h
          </p>

          <p className="text-xs text-muted-foreground">
            Total
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">
        {data.map((item) => {
          const height =
            item.hours > 0
              ? Math.max(
                  (item.hours / maxHours) * 100,
                  4,
                )
              : 2;

          return (
            <div
              key={item.day}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {item.hours > 0
                  ? `${item.hours}h`
                  : '—'}
              </span>

              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${height}%` }}
                  title={`${item.day}: ${item.hours} hours`}
                />
              </div>

              <span className="text-xs text-muted-foreground">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}