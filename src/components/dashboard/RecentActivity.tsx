'use client';

import {
  Activity,
  BookOpen,
  CheckCircle2,
  FileText,
  ListTodo,
  NotebookPen,
} from 'lucide-react';

export type ActivityType =
  | 'task'
  | 'assignment'
  | 'study'
  | 'note'
  | 'document';

export interface DashboardActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: DashboardActivity[];
}

const icons = {
  task: ListTodo,
  assignment: FileText,
  study: BookOpen,
  note: NotebookPen,
  document: FileText,
};

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  const visibleActivities = activities.slice(0, 6);

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Activity className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Recent activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest actions.
          </p>
        </div>
      </div>

      {visibleActivities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleActivities.map((activity) => {
            const Icon = icons[activity.type];

            return (
              <div
                key={activity.id}
                className="flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}