'use client';

import { useEffect, useState, type FormEvent } from 'react';

import type {
  StudyGoal,
  StudyGoalPriority,
  StudyGoalStatus,
} from './StudyGoalCard';

interface StudyGoalFormProps {
  initialGoal?: StudyGoal;
  onSubmit: (goal: StudyGoal) => void;
  onCancel?: () => void;
}

interface GoalFormState {
  title: string;
  description: string;
  subject: string;
  targetHours: string;
  targetMinutes: string;
  deadline: string;
  priority: StudyGoalPriority;
  status: StudyGoalStatus;
}

const emptyForm: GoalFormState = {
  title: '',
  description: '',
  subject: '',
  targetHours: '1',
  targetMinutes: '0',
  deadline: '',
  priority: 'medium',
  status: 'active',
};

export function StudyGoalForm({
  initialGoal,
  onSubmit,
  onCancel,
}: StudyGoalFormProps) {
  const [form, setForm] = useState<GoalFormState>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialGoal) {
      setForm(emptyForm);
      return;
    }

    const hours = Math.floor(initialGoal.targetMinutes / 60);
    const minutes = initialGoal.targetMinutes % 60;

    setForm({
      title: initialGoal.title,
      description: initialGoal.description ?? '',
      subject: initialGoal.subject ?? '',
      targetHours: String(hours),
      targetMinutes: String(minutes),
      deadline: initialGoal.deadline
        ? initialGoal.deadline.slice(0, 10)
        : '',
      priority: initialGoal.priority,
      status: initialGoal.status,
    });
  }, [initialGoal]);

  function update<K extends keyof GoalFormState>(
    key: K,
    value: GoalFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const title = form.title.trim();

    if (!title) {
      setError('Goal title is required.');
      return;
    }

    const hours = Number(form.targetHours);
    const minutes = Number(form.targetMinutes);

    if (
      !Number.isFinite(hours) ||
      !Number.isFinite(minutes) ||
      hours < 0 ||
      minutes < 0 ||
      minutes > 59
    ) {
      setError('Enter a valid target study duration.');
      return;
    }

    const targetMinutes = hours * 60 + minutes;

    if (targetMinutes <= 0) {
      setError('Target study time must be greater than zero.');
      return;
    }

    const goal: StudyGoal = {
      id: initialGoal?.id ?? crypto.randomUUID(),
      title,
      description: form.description.trim() || undefined,
      subject: form.subject.trim() || undefined,
      targetMinutes,
      completedMinutes: initialGoal?.completedMinutes ?? 0,
      deadline: form.deadline
        ? new Date(`${form.deadline}T23:59:59`).toISOString()
        : undefined,
      status: form.status,
      priority: form.priority,
      createdAt: initialGoal?.createdAt ?? new Date().toISOString(),
    };

    onSubmit(goal);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {initialGoal ? 'Edit Study Goal' : 'Create Study Goal'}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Define what you want to accomplish and how much study time it needs.
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
            Goal title *
          </span>

          <input
            value={form.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="e.g. Complete React revision"
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
            placeholder="What exactly do you want to finish?"
            className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Subject
          </span>

          <input
            value={form.subject}
            onChange={(event) => update('subject', event.target.value)}
            placeholder="e.g. Web Development"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Deadline
          </span>

          <input
            type="date"
            value={form.deadline}
            onChange={(event) => update('deadline', event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium">
            Target study time
          </span>

          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="sr-only">Hours</span>
              <input
                type="number"
                min="0"
                value={form.targetHours}
                onChange={(event) =>
                  update('targetHours', event.target.value)
                }
                placeholder="Hours"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label>
              <span className="sr-only">Minutes</span>
              <input
                type="number"
                min="0"
                max="59"
                value={form.targetMinutes}
                onChange={(event) =>
                  update('targetMinutes', event.target.value)
                }
                placeholder="Minutes"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
        </div>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Priority
          </span>

          <select
            value={form.priority}
            onChange={(event) =>
              update(
                'priority',
                event.target.value as StudyGoalPriority,
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        {initialGoal && (
          <label>
            <span className="mb-2 block text-sm font-medium">
              Status
            </span>

            <select
              value={form.status}
              onChange={(event) =>
                update(
                  'status',
                  event.target.value as StudyGoalStatus,
                )
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
          {initialGoal ? 'Save Changes' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
}