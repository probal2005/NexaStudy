'use client';

import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from './TaskCard';

import type { Subtask } from './SubtaskItem';

interface TaskFormProps {
  initialTask?: Task;
  subjects?: string[];
  defaultStatus?: TaskStatus;
  onSubmit: (task: Task) => void;
  onCancel?: () => void;
}

interface TaskFormState {
  title: string;
  description: string;
  subject: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  estimatedMinutes: string;
  tags: string;
  recurring: boolean;
  reminder: boolean;
}

const emptyForm: TaskFormState = {
  title: '',
  description: '',
  subject: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  dueTime: '',
  estimatedMinutes: '',
  tags: '',
  recurring: false,
  reminder: false,
};

function toDateInput(value?: string) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function TaskForm({
  initialTask,
  subjects = [],
  defaultStatus = 'todo',
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskFormState>({
    ...emptyForm,
    status: defaultStatus,
  });

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialTask) {
      setForm({
        ...emptyForm,
        status: defaultStatus,
      });
      setSubtasks([]);
      return;
    }

    setForm({
      title: initialTask.title,
      description: initialTask.description ?? '',
      subject: initialTask.subject ?? '',
      status: initialTask.status,
      priority: initialTask.priority,
      dueDate: toDateInput(initialTask.dueDate),
      dueTime: initialTask.dueTime ?? '',
      estimatedMinutes:
        initialTask.estimatedMinutes !== undefined
          ? String(initialTask.estimatedMinutes)
          : '',
      tags: initialTask.tags?.join(', ') ?? '',
      recurring: initialTask.recurring ?? false,
      reminder: initialTask.reminder ?? false,
    });

    setSubtasks(initialTask.subtasks ?? []);
  }, [initialTask, defaultStatus]);

  function update<K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function addSubtask() {
    const title = newSubtask.trim();

    if (!title) return;

    setSubtasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
    ]);

    setNewSubtask('');
  }

  function removeSubtask(id: string) {
    setSubtasks((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  function toggleSubtask(id: string) {
    setSubtasks((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const title = form.title.trim();

    if (!title) {
      setError('Task title is required.');
      return;
    }

    const estimatedMinutes = form.estimatedMinutes
      ? Number(form.estimatedMinutes)
      : undefined;

    if (
      estimatedMinutes !== undefined &&
      (!Number.isFinite(estimatedMinutes) ||
        estimatedMinutes < 0)
    ) {
      setError('Estimated time must be a valid positive number.');
      return;
    }

    let dueDate: string | undefined;

    if (form.dueDate) {
      const date = new Date(
        `${form.dueDate}T${form.dueTime || '23:59'}:00`,
      );

      if (Number.isNaN(date.getTime())) {
        setError('Please provide a valid due date.');
        return;
      }

      dueDate = date.toISOString();
    }

    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .filter(
        (tag, index, list) => list.indexOf(tag) === index,
      );

    const completedMinutes =
      initialTask?.completedMinutes ?? 0;

    const task: Task = {
      id: initialTask?.id ?? crypto.randomUUID(),
      title,
      description: form.description.trim() || undefined,
      subject: form.subject.trim() || undefined,
      status: form.status,
      priority: form.priority,
      dueDate,
      dueTime: form.dueTime || undefined,
      tags,
      subtasks,
      estimatedMinutes,
      completedMinutes,
      recurring: form.recurring,
      reminder: form.reminder,
      createdAt:
        initialTask?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(task);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {initialTask ? 'Edit Task' : 'Create Task'}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add all the information you need to manage this task.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">
            Task title *
          </span>

          <input
            value={form.title}
            onChange={(event) =>
              update('title', event.target.value)
            }
            placeholder="e.g. Complete database assignment"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">
            Description
          </span>

          <textarea
            value={form.description}
            onChange={(event) =>
              update('description', event.target.value)
            }
            rows={3}
            placeholder="Add details..."
            className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Subject
          </span>

          {subjects.length > 0 ? (
            <select
              value={form.subject}
              onChange={(event) =>
                update('subject', event.target.value)
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">No subject</option>

              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={form.subject}
              onChange={(event) =>
                update('subject', event.target.value)
              }
              placeholder="e.g. DBMS"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          )}
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Status
          </span>

          <select
            value={form.status}
            onChange={(event) =>
              update(
                'status',
                event.target.value as TaskStatus,
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Priority
          </span>

          <select
            value={form.priority}
            onChange={(event) =>
              update(
                'priority',
                event.target.value as TaskPriority,
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Estimated minutes
          </span>

          <input
            type="number"
            min="0"
            value={form.estimatedMinutes}
            onChange={(event) =>
              update(
                'estimatedMinutes',
                event.target.value,
              )
            }
            placeholder="60"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Due date
          </span>

          <input
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              update('dueDate', event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Due time
          </span>

          <input
            type="time"
            value={form.dueTime}
            onChange={(event) =>
              update('dueTime', event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">
            Tags
          </span>

          <input
            value={form.tags}
            onChange={(event) =>
              update('tags', event.target.value)
            }
            placeholder="assignment, important, exam"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Separate tags with commas.
          </p>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
          <input
            type="checkbox"
            checked={form.recurring}
            onChange={(event) =>
              update('recurring', event.target.checked)
            }
            className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
          />

          <span>
            <span className="block text-sm font-medium">
              Recurring task
            </span>
            <span className="text-xs text-muted-foreground">
              Repeat this task later.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
          <input
            type="checkbox"
            checked={form.reminder}
            onChange={(event) =>
              update('reminder', event.target.checked)
            }
            className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
          />

          <span>
            <span className="block text-sm font-medium">
              Reminder
            </span>
            <span className="text-xs text-muted-foreground">
              Enable a reminder for this task.
            </span>
          </span>
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Subtasks</h3>
          <p className="text-xs text-muted-foreground">
            Break this task into smaller steps.
          </p>
        </div>

        {subtasks.length > 0 && (
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 rounded-lg border p-2"
              >
                <button
                  type="button"
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    subtask.completed
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40'
                  }`}
                >
                  {subtask.completed && (
                    <span className="text-xs">✓</span>
                  )}
                </button>

                <span
                  className={`min-w-0 flex-1 text-sm ${
                    subtask.completed
                      ? 'text-muted-foreground line-through'
                      : ''
                  }`}
                >
                  {subtask.title}
                </span>

                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={newSubtask}
            onChange={(event) =>
              setNewSubtask(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addSubtask();
              }
            }}
            placeholder="Add a subtask..."
            className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={addSubtask}
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {initialTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}