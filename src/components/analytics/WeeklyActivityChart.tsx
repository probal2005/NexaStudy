interface WeeklyActivity {
  day: string;
  studyHours: number;
  tasksCompleted: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyActivity[];
}

export function WeeklyActivityChart({
  data,
}: WeeklyActivityChartProps) {
  const maxHours = Math.max(
    ...data.map((item) => item.studyHours),
    1,
  );

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">
          Weekly Activity
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your study hours across the week.
        </p>
      </div>

      <div
        className="flex h-64 items-end gap-2 sm:gap-4"
        aria-label="Weekly study activity chart"
      >
        {data.map((item) => {
          const height =
            item.studyHours === 0
              ? 0
              : Math.max((item.studyHours / maxHours) * 100, 5);

          return (
            <div
              key={item.day}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {item.studyHours}h
              </span>

              <div className="flex h-44 w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-md bg-primary transition-all duration-500 hover:opacity-80"
                  style={{ height: `${height}%` }}
                  title={`${item.studyHours} hours, ${item.tasksCompleted} tasks completed`}
                />
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}