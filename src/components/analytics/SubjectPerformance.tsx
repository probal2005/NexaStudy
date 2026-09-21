interface SubjectPerformanceItem {
  id: string;
  name: string;
  score: number;
  color?: string;
}

interface SubjectPerformanceProps {
  subjects: SubjectPerformanceItem[];
}

export function SubjectPerformance({
  subjects,
}: SubjectPerformanceProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Subject Performance
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your current performance by subject.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No subject performance data available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {subjects.map((subject) => {
            const score = Math.min(Math.max(subject.score, 0), 100);

            return (
              <div key={subject.id}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="truncate text-sm font-medium text-foreground">
                    {subject.name}
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {score}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${score}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={score}
                    aria-label={`${subject.name}: ${score}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}