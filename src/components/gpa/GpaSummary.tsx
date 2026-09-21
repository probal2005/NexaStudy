import {
  Calculator,
  CircleCheck,
} from 'lucide-react';

interface GpaSummaryProps {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
}

export function GpaSummary({
  gpa,
  totalCredits,
  totalGradePoints,
}: GpaSummaryProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />

          <h2 className="font-semibold">
            GPA Summary
          </h2>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">
            GPA
          </p>

          <p className="mt-1 text-3xl font-bold text-primary">
            {gpa.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Total Credits
          </p>

          <p className="mt-1 text-2xl font-bold">
            {totalCredits}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Total Grade Points
          </p>

          <p className="mt-1 text-2xl font-bold">
            {totalGradePoints.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t bg-muted/30 px-5 py-3 text-sm text-muted-foreground">
        <CircleCheck className="h-4 w-4 text-success" />

        <span>
          GPA = Σ(Credit × Grade Point) ÷ Σ(Credits)
        </span>
      </div>
    </section>
  );
}