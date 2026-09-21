'use client';

import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import type {
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
} from './AssignmentCard';

export interface AssignmentFormValues {
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  progress: number;
}

interface AssignmentFormProps {
  initialValues?: Partial<Assignment>;
  subjects?: string[];
  onSubmit: (
    values: AssignmentFormValues,
  ) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const defaultValues: AssignmentFormValues = {
  title: '',
  description: '',
  subject: '',
  dueDate: '',
  dueTime: '',
  priority: 'medium',
  status: 'pending',
  progress: 0,
};

export function AssignmentForm({
  initialValues,
  subjects = [],
  onSubmit,
  onCancel,
  submitLabel = 'Save Assignment',
}: AssignmentFormProps) {
  const [values, setValues] =
    useState<AssignmentFormValues>({
      ...defaultValues,
    });

  const [error, setError] = useState('');

  useEffect(() => {
    setValues({
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      subject: initialValues?.subject ?? '',
      dueDate: initialValues?.dueDate
        ? initialValues.dueDate.slice(0, 10)
        : '',
      dueTime: initialValues?.dueTime ?? '',
      priority: initialValues?.priority ?? 'medium',
      status: initialValues?.status ?? 'pending',
      progress: initialValues?.progress ?? 0,
    });
  }, [initialValues]);

  function updateField<K extends keyof AssignmentFormValues>(
    field: K,
    value: AssignmentFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!values.title.trim()) {
      setError('Assignment title is required.');
      return;
    }

    if (!values.subject.trim()) {
      setError('Subject is required.');
      return;
    }

    if (!values.dueDate) {
      setError('Due date is required.');
      return;
    }

    setError('');

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      subject: values.subject.trim(),
      progress:
        values.status === 'completed'
          ? 100
          : Math.min(
              Math.max(Number(values.progress) || 0, 0),
              100,
            ),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="assignment-title"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Title
          </label>

          <Input
            id="assignment-title"
            value={values.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
            placeholder="e.g. DBMS Assignment 3"
            required
          />
        </div>

        <div>
          <label
            htmlFor="assignment-subject"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Subject
          </label>

          {subjects.length > 0 ? (
            <select
              id="assignment-subject"
              value={values.subject}
              onChange={(event) =>
                updateField('subject', event.target.value)
              }
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Select subject</option>

              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id="assignment-subject"
              value={values.subject}
              onChange={(event) =>
                updateField('subject', event.target.value)
              }
              placeholder="e.g. DBMS"
              required
            />
          )}
        </div>

        <div>
          <label
            htmlFor="assignment-priority"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Priority
          </label>

          <select
            id="assignment-priority"
            value={values.priority}
            onChange={(event) =>
              updateField(
                'priority',
                event.target.value as AssignmentPriority,
              )
            }
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="assignment-due-date"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Due date
          </label>

          <Input
            id="assignment-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) =>
              updateField('dueDate', event.target.value)
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="assignment-due-time"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Due time
          </label>

          <Input
            id="assignment-due-time"
            type="time"
            value={values.dueTime}
            onChange={(event) =>
              updateField('dueTime', event.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="assignment-status"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Status
          </label>

          <select
            id="assignment-status"
            value={values.status}
            onChange={(event) =>
              updateField(
                'status',
                event.target.value as AssignmentStatus,
              )
            }
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">
              In Progress
            </option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="assignment-progress"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Progress (%)
          </label>

          <Input
            id="assignment-progress"
            type="number"
            min={0}
            max={100}
            value={values.progress}
            onChange={(event) =>
              updateField(
                'progress',
                Number(event.target.value),
              )
            }
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="assignment-description"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Description
          </label>

          <textarea
            id="assignment-description"
            value={values.description}
            onChange={(event) =>
              updateField(
                'description',
                event.target.value,
              )
            }
            placeholder="Add assignment details..."
            rows={4}
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}

        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}