'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import type {
  CalendarEvent,
  CalendarEventType,
} from './CalendarEventCard';

interface CalendarEventFormProps {
  initialData?: CalendarEvent | null;
  onSubmit: (event: CalendarEvent) => void;
  onCancel?: () => void;
}

interface FormState {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: CalendarEventType;
  subject: string;
  location: string;
  color: string;
  reminder: boolean;
}

const initialForm: FormState = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  type: 'other',
  subject: '',
  location: '',
  color: '#4F46E5',
  reminder: false,
};

export function CalendarEventForm({
  initialData,
  onSubmit,
  onCancel,
}: CalendarEventFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialData) {
      setForm(initialForm);
      setError('');
      return;
    }

    setForm({
      title: initialData.title,
      description: initialData.description || '',
      date: initialData.date,
      startTime: initialData.startTime || '',
      endTime: initialData.endTime || '',
      type: initialData.type,
      subject: initialData.subject || '',
      location: initialData.location || '',
      color: initialData.color || '#4F46E5',
      reminder: initialData.reminder || false,
    });

    setError('');
  }, [initialData]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Please enter an event title.');
      return;
    }

    if (!form.date) {
      setError('Please select an event date.');
      return;
    }

    if (
      form.startTime &&
      form.endTime &&
      form.endTime < form.startTime
    ) {
      setError('End time cannot be earlier than start time.');
      return;
    }

    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      date: form.date,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      type: form.type,
      subject: form.subject.trim() || undefined,
      location: form.location.trim() || undefined,
      color: form.color,
      reminder: form.reminder,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {initialData ? 'Edit Event' : 'Create Event'}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add an event to your academic calendar.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-foreground">
            Event title
          </span>

          <Input
            value={form.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
            placeholder="e.g. Database lecture"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Date
          </span>

          <Input
            type="date"
            value={form.date}
            onChange={(event) =>
              updateField('date', event.target.value)
            }
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Type
          </span>

          <select
            value={form.type}
            onChange={(event) =>
              updateField(
                'type',
                event.target.value as CalendarEventType,
              )
            }
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="class">Class</option>
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
            <option value="study">Study</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Start time
          </span>

          <Input
            type="time"
            value={form.startTime}
            onChange={(event) =>
              updateField('startTime', event.target.value)
            }
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            End time
          </span>

          <Input
            type="time"
            value={form.endTime}
            onChange={(event) =>
              updateField('endTime', event.target.value)
            }
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Subject
          </span>

          <Input
            value={form.subject}
            onChange={(event) =>
              updateField('subject', event.target.value)
            }
            placeholder="Optional subject"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Location
          </span>

          <Input
            value={form.location}
            onChange={(event) =>
              updateField('location', event.target.value)
            }
            placeholder="e.g. Room 204"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Event color
          </span>

          <div className="flex h-10 items-center gap-3 rounded-xl border border-input bg-background px-3">
            <input
              type="color"
              value={form.color}
              onChange={(event) =>
                updateField('color', event.target.value)
              }
              className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label="Event color"
            />

            <span className="text-sm text-muted-foreground">
              {form.color}
            </span>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.reminder}
            onChange={(event) =>
              updateField('reminder', event.target.checked)
            }
            className="h-4 w-4 rounded border-border"
          />

          <span>
            <span className="block text-sm font-medium text-foreground">
              Enable reminder
            </span>

            <span className="block text-xs text-muted-foreground">
              Save this preference with the event.
            </span>
          </span>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">
          Description
        </span>

        <textarea
          value={form.description}
          onChange={(event) =>
            updateField('description', event.target.value)
          }
          rows={4}
          placeholder="Add optional notes or details..."
          className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}

        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          {initialData ? 'Update Event' : 'Save Event'}
        </Button>
      </div>
    </form>
  );
}