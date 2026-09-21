'use client';

import { Filter, RotateCcw } from 'lucide-react';

import type {
  TaskPriority,
  TaskStatus,
} from './TaskCard';

export type TaskDueFilter =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'no-date';

export interface TaskFilterState {
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  due: TaskDueFilter;
  subject: string;
}

interface TaskFiltersProps {
  filters: TaskFilterState;
  subjects?: string[];
  onChange: (filters: TaskFilterState) => void;
  onReset?: () => void;
}

export function TaskFilters({
  filters,
  subjects = [],
  onChange,
  onReset,
}: TaskFiltersProps) {
  function update<K extends keyof TaskFilterState>(
    key: K,
    value: TaskFilterState[K],
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Filters</span>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Status
          </span>

          <select
            value={filters.status}
            onChange={(event) =>
              update(
                'status',
                event.target.value as TaskFilterState['status'],
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Priority
          </span>

          <select
            value={filters.priority}
            onChange={(event) =>
              update(
                'priority',
                event.target.value as TaskFilterState['priority'],
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Due date
          </span>

          <select
            value={filters.due}
            onChange={(event) =>
              update(
                'due',
                event.target.value as TaskDueFilter,
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">Any date</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
            <option value="no-date">No due date</option>
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Subject
          </span>

          <select
            value={filters.subject}
            onChange={(event) =>
              update('subject', event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All subjects</option>

            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}