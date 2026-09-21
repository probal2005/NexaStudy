'use client';

import {
  BookOpen,
  CalendarDays,
  Clock3,
} from 'lucide-react';

export interface DashboardExam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time?: string;
  room?: string;
  daysLeft: number;
}

interface UpcomingExamsProps {
  exams: DashboardExam[];
  onViewAll?: () => void;
}

export default function UpcomingExams({
  exams,
  onViewAll,
}: UpcomingExamsProps) {
  const visibleExams = exams.slice(0, 3);

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Upcoming exams
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your next academic milestones.
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </button>
        )}
      </div>

      {visibleExams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <BookOpen className="mx-auto h-7 w-7 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium">
            No upcoming exams
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your exam schedule is currently clear.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleExams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <BookOpen className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium">
                        {exam.title}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {exam.subject}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">
                      {exam.daysLeft === 0
                        ? 'Today'
                        : `${exam.daysLeft}d left`}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {exam.date}
                    </span>

                    {exam.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {exam.time}
                      </span>
                    )}

                    {exam.room && (
                      <span>{exam.room}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}