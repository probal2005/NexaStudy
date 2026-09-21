'use client';

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

export interface DashboardAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime?: string;
  status: 'pending' | 'submitted' | 'overdue';
  priority?: 'low' | 'medium' | 'high';
}

interface UpcomingAssignmentsProps {
  assignments: DashboardAssignment[];
  onViewAll?: () => void;
}

export default function UpcomingAssignments({
  assignments,
  onViewAll,
}: UpcomingAssignmentsProps) {
  const visibleAssignments = assignments.slice(0, 4);

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Upcoming assignments
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Keep your submissions on schedule.
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

      {visibleAssignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500" />

          <p className="mt-3 text-sm font-medium">
            No upcoming assignments
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            You&apos;re all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    assignment.status === 'overdue'
                      ? 'bg-red-500/10 text-red-500'
                      : assignment.status === 'submitted'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-primary/10 text-primary',
                  ].join(' ')}
                >
                  {assignment.status === 'overdue' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : assignment.status === 'submitted' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <CalendarDays className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {assignment.subject}
                      </p>
                    </div>

                    {assignment.priority && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                        {assignment.priority}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {assignment.dueDate}
                    </span>

                    {assignment.dueTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {assignment.dueTime}
                      </span>
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