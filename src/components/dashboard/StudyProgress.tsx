'use client';

import {
  BookOpen,
  Clock3,
  Target,
} from 'lucide-react';

interface StudyProgressProps {
  weeklyGoalHours: number;
  studiedHours: number;
  completedSessions: number;
  totalSessions: number;
}

export default function StudyProgress({
  weeklyGoalHours,
  studiedHours,
  completedSessions,
  totalSessions,
}: StudyProgressProps) {
  const progress =
    weeklyGoalHours > 0
      ? Math.min(
          Math.round(
            (studiedHours / weeklyGoalHours) * 100,
          ),
          100,
        )
      : 0;

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Study progress
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            This week&apos;s study activity.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Target className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold">
              {studiedHours.toFixed(1)}h
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              of {weeklyGoalHours}h weekly goal
            </p>
          </div>

          <span className="text-sm font-semibold text-primary">
            {progress}%
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/40 p-3">
          <Clock3 className="h-4 w-4 text-primary" />

          <p className="mt-2 text-lg font-semibold">
            {studiedHours.toFixed(1)}h
          </p>

          <p className="text-xs text-muted-foreground">
            Study time
          </p>
        </div>

        <div className="rounded-xl bg-muted/40 p-3">
          <BookOpen className="h-4 w-4 text-primary" />

          <p className="mt-2 text-lg font-semibold">
            {completedSessions}/{totalSessions}
          </p>

          <p className="text-xs text-muted-foreground">
            Sessions
          </p>
        </div>
      </div>
    </section>
  );
}