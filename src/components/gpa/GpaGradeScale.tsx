interface GradeScaleItem {
  grade: string;
  point: number;
  description?: string;
}

interface GpaGradeScaleProps {
  items?: GradeScaleItem[];
}

const defaultScale: GradeScaleItem[] = [
  {
    grade: 'A+',
    point: 10,
    description: 'Outstanding',
  },
  {
    grade: 'A',
    point: 9,
    description: 'Excellent',
  },
  {
    grade: 'B+',
    point: 8,
    description: 'Very Good',
  },
  {
    grade: 'B',
    point: 7,
    description: 'Good',
  },
  {
    grade: 'C+',
    point: 6,
    description: 'Above Average',
  },
  {
    grade: 'C',
    point: 5,
    description: 'Average',
  },
  {
    grade: 'D',
    point: 4,
    description: 'Pass',
  },
  {
    grade: 'F',
    point: 0,
    description: 'Fail',
  },
];

export function GpaGradeScale({
  items = defaultScale,
}: GpaGradeScaleProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold">
          Grade Scale
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Grade points used by this calculator.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-3 font-medium">
                Grade
              </th>

              <th className="px-3 py-3 font-medium">
                Grade Point
              </th>

              <th className="px-3 py-3 font-medium">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.grade}-${item.point}`}
                className="border-b last:border-0"
              >
                <td className="px-3 py-3 font-semibold">
                  {item.grade}
                </td>

                <td className="px-3 py-3">
                  {item.point.toFixed(2)}
                </td>

                <td className="px-3 py-3 text-muted-foreground">
                  {item.description ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}