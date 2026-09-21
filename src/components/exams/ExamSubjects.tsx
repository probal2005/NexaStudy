import { BookOpen, ChevronRight } from 'lucide-react';

import { cn } from '@/utils';

interface SubjectExamSummary {
  subject: string;
  totalExams: number;
  upcomingExams: number;
  nextExamDate?: string;
}

interface ExamSubjectsProps {
  subjects: SubjectExamSummary[];
  onSubjectClick?: (subject: string) => void;
}

function formatDate(date?: string) {
  if (!date) {
    return 'No upcoming exam';
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function ExamSubjects({
  subjects,
  onSubjectClick,
}: ExamSubjectsProps) {
  if (subjects.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">Subjects</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          No subject-wise exam data is available yet.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold">Exam by Subject</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Quickly see how your exams are distributed across subjects.
        </p>
      </div>

      <div className="space-y-2">
        {subjects.map((item) => (
          <button
            key={item.subject}
            type="button"
            onClick={() => onSubjectClick?.(item.subject)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition',
              'hover:bg-muted/50',
              onSubjectClick && 'cursor-pointer',
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {item.subject}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.totalExams}{' '}
                {item.totalExams === 1 ? 'exam' : 'exams'} •{' '}
                {item.upcomingExams} upcoming
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs text-muted-foreground">
                Next exam
              </p>

              <p className="text-sm font-medium">
                {formatDate(item.nextExamDate)}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </section>
  );
}