import {
  BarChart3,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

export interface SemesterGpa {
  id: string;
  semester: string;
  gpa: number;
  credits: number;
}

interface CgpaOverviewProps {
  semesters: SemesterGpa[];
  cgpa: number;
  totalCredits: number;
}

export function CgpaOverview({
  semesters,
  cgpa,
  totalCredits,
}: CgpaOverviewProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />

            <h2 className="font-semibold">
              CGPA Overview
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Your academic performance across semesters.
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 px-4 py-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Current CGPA
          </p>

          <p className="mt-1 text-3xl font-bold text-primary">
            {cgpa.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {semesters.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Add semester results to calculate your CGPA.
          </div>
        ) : (
          semesters.map((semester) => {
            const percentage =
              Math.min(100, Math.max(0, semester.gpa * 10));

            return (
              <div key={semester.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {semester.semester}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {semester.credits}{' '}
                      {semester.credits === 1
                        ? 'credit'
                        : 'credits'}
                    </p>
                  </div>

                  <span className="font-semibold">
                    {semester.gpa.toFixed(2)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <BarChart3 className="h-4 w-4 text-primary" />

        <span>
          Total completed credits:{' '}
          <strong className="text-foreground">
            {totalCredits}
          </strong>
        </span>

        <TrendingUp className="ml-auto h-4 w-4" />
      </div>
    </section>
  );
}