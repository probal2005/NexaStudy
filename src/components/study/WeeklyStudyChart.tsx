interface WeeklyStudyData {
  day: string;
  minutes: number;
  goalMinutes?: number;
}

interface WeeklyStudyChartProps {
  data: WeeklyStudyData[];
}

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  return `${Math.floor(minutes / 60)}h`;
}

export function WeeklyStudyChart({
  data,
}: WeeklyStudyChartProps) {
  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(item.minutes, item.goalMinutes ?? 0),
    ),
    60,
  );

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="font-semibold">Weekly Study Activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your study time across the week.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No study activity available.
        </div>
      ) : (
        <div className="flex h-64 items-end gap-2 sm:gap-4">
          {data.map((item) => {
            const height =
              item.minutes > 0
                ? Math.max(5, (item.minutes / maxValue) * 100)
                : 2;

            const goalHeight =
              item.goalMinutes !== undefined
                ? Math.max(3, (item.goalMinutes / maxValue) * 100)
                : null;

            return (
              <div
                key={item.day}
                className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="relative flex h-48 w-full items-end justify-center">
                  {goalHeight !== null && (
                    <div
                      className="absolute bottom-0 w-full max-w-10 rounded-t-md border border-dashed border-primary/30 bg-primary/5"
                      style={{ height: `${goalHeight}%` }}
                      title={`Goal: ${formatMinutes(item.goalMinutes ?? 0)}`}
                    />
                  )}

                  <div
                    className="relative z-10 w-full max-w-10 rounded-t-md bg-primary transition-all duration-500"
                    style={{ height: `${height}%` }}
                    title={`${formatMinutes(item.minutes)} studied`}
                  />
                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}