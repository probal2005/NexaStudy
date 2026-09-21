'use client';

import { CheckCircle2, Circle, Clock3 } from 'lucide-react';

export interface DashboardTask {
  id: string;
  title: string;
  dueTime?: string;
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TodayTasksProps {
  tasks: DashboardTask[];
  onToggle?: (id: string) => void;
  onViewAll?: () => void;
}

export default function TodayTasks({
  tasks,
  onToggle,
  onViewAll,
}: TodayTasksProps) {
  const visibleTasks = tasks.slice(0, 5);

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Today&apos;s tasks</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay on top of your priorities.
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

      {visibleTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">
            No tasks for today
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your task list is clear.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className={[
                'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                task.completed
                  ? 'border-border bg-muted/20'
                  : 'border-border hover:bg-muted/30',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => onToggle?.(task.id)}
                className="shrink-0"
                aria-label={
                  task.completed
                    ? `Mark ${task.title} incomplete`
                    : `Complete ${task.title}`
                }
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={[
                    'truncate text-sm font-medium',
                    task.completed
                      ? 'text-muted-foreground line-through'
                      : '',
                  ].join(' ')}
                >
                  {task.title}
                </p>

                {task.dueTime && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3 w-3" />
                    {task.dueTime}
                  </p>
                )}
              </div>

              {task.priority && (
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    task.priority === 'high'
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : task.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  ].join(' ')}
                >
                  {task.priority}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}