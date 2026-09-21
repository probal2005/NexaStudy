'use client';

import {
  CalendarDays,
  Check,
  Clock3,
  MoreHorizontal,
  Pencil,
  Tag,
  Trash2,
} from 'lucide-react';

import {
  TaskPriorityBadge,
} from './TaskPriorityBadge';

import {
  TaskStatusBadge,
} from './TaskStatusBadge';

import { SubtaskList } from './SubtaskList';

import type { Subtask } from '@/types';

export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  tags?: string[];
  subtasks?: Subtask[];
  estimatedMinutes?: number;
  completedMinutes?: number;
  recurring?: boolean;
  reminder?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (
    task: Task,
    status: TaskStatus,
  ) => void;
  onSubtaskToggle?: (
    task: Task,
    subtask: Subtask,
  ) => void;
}

function formatDueDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === 'completed') {
    return false;
  }

  const due = new Date(task.dueDate);

  if (Number.isNaN(due.getTime())) {
    return false;
  }

  return due.getTime() < Date.now();
}

export function TaskCard({
  task,
  compact = false,
  onEdit,
  onDelete,
  onStatusChange,
  onSubtaskToggle,
}: TaskCardProps) {
  const overdue = isOverdue(task);
  const subtasks = task.subtasks ?? [];
  const completedSubtasks = subtasks.filter(
    (item) => item.completed,
  ).length;

  return (
    <article
      className={`rounded-xl border bg-card shadow-sm transition hover:shadow-md ${
        overdue ? 'border-red-500/40' : ''
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() =>
            onStatusChange?.(
              task,
              task.status === 'completed'
                ? 'todo'
                : 'completed',
            )
          }
          aria-label={
            task.status === 'completed'
              ? 'Mark task incomplete'
              : 'Mark task complete'
          }
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
            task.status === 'completed'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/40 hover:border-primary'
          }`}
        >
          {task.status === 'completed' && (
            <Check className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`font-semibold ${
                  task.status === 'completed'
                    ? 'text-muted-foreground line-through'
                    : ''
                }`}
              >
                {task.title}
              </h3>

              {task.description && !compact && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>

            <details className="relative shrink-0">
              <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </summary>

              <div className="absolute right-0 top-9 z-30 min-w-36 rounded-lg border bg-card p-1 shadow-xl">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(task)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            </details>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />

            {task.subject && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {task.subject}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 ${
                  overdue
                    ? 'font-medium text-red-600 dark:text-red-400'
                    : ''
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {overdue ? 'Overdue · ' : ''}
                {formatDueDate(task.dueDate)}
                {task.dueTime ? ` · ${task.dueTime}` : ''}
              </span>
            )}

            {task.estimatedMinutes !== undefined && (
              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {task.estimatedMinutes} min
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {task.tags.length} tags
              </span>
            )}
          </div>

          {task.tags && task.tags.length > 0 && !compact && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {subtasks.length > 0 && !compact && (
            <div className="mt-4 border-t pt-4">
              <SubtaskList
                subtasks={subtasks}
                onToggle={(subtask) =>
                  onSubtaskToggle?.(task, subtask)
                }
              />

              <div className="mt-2 text-xs text-muted-foreground">
                {completedSubtasks}/{subtasks.length} subtasks complete
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}