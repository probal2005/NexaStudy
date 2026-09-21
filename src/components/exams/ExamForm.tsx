'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import type {
  Exam,
  ExamStatus,
  ExamType,
} from './ExamCard';

interface ExamFormProps {
  initialExam?: Exam | null;
  subjects?: string[];
  onSubmit: (exam: Exam) => void;
  onCancel?: () => void;
}

interface FormState {
  title: string;
  subject: string;
  subjectCode: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: ExamType;
  status: ExamStatus;
  totalMarks: string;
  durationMinutes: string;
  syllabus: string;
  notes: string;
}

const emptyForm: FormState = {
  title: '',
  subject: '',
  subjectCode: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  type: 'midterm',
  status: 'upcoming',
  totalMarks: '',
  durationMinutes: '',
  syllabus: '',
  notes: '',
};

function examToForm(exam?: Exam | null): FormState {
  if (!exam) {
    return emptyForm;
  }

  return {
    title: exam.title,
    subject: exam.subject,
    subjectCode: exam.subjectCode ?? '',
    date: exam.date,
    startTime: exam.startTime ?? '',
    endTime: exam.endTime ?? '',
    location: exam.location ?? '',
    type: exam.type,
    status: exam.status,
    totalMarks:
      typeof exam.totalMarks === 'number'
        ? String(exam.totalMarks)
        : '',
    durationMinutes:
      typeof exam.durationMinutes === 'number'
        ? String(exam.durationMinutes)
        : '',
    syllabus: exam.syllabus ?? '',
    notes: exam.notes ?? '',
  };
}

export function ExamForm({
  initialExam,
  subjects = [],
  onSubmit,
  onCancel,
}: ExamFormProps) {
  const [form, setForm] = useState<FormState>(
    examToForm(initialExam),
  );
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(examToForm(initialExam));
    setError('');
  }, [initialExam]);

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
      setError('Exam title is required.');
      return;
    }

    if (!form.subject.trim()) {
      setError('Subject is required.');
      return;
    }

    if (!form.date) {
      setError('Exam date is required.');
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

    const totalMarks = form.totalMarks.trim()
      ? Number(form.totalMarks)
      : undefined;

    const durationMinutes = form.durationMinutes.trim()
      ? Number(form.durationMinutes)
      : undefined;

    if (
      totalMarks !== undefined &&
      (!Number.isFinite(totalMarks) || totalMarks < 0)
    ) {
      setError('Total marks must be a valid positive number.');
      return;
    }

    if (
      durationMinutes !== undefined &&
      (!Number.isFinite(durationMinutes) ||
        durationMinutes <= 0)
    ) {
      setError('Duration must be greater than zero.');
      return;
    }

    const exam: Exam = {
      id: initialExam?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      subject: form.subject.trim(),
      subjectCode: form.subjectCode.trim() || undefined,
      date: form.date,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      location: form.location.trim() || undefined,
      type: form.type,
      status: form.status,
      totalMarks,
      durationMinutes,
      syllabus: form.syllabus.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    onSubmit(exam);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {initialExam ? 'Edit Exam' : 'Add Exam'}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the exam schedule and preparation details.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="exam-title"
            className="mb-1.5 block text-sm font-medium"
          >
            Exam title
          </label>

          <Input
            id="exam-title"
            value={form.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
            placeholder="e.g. Database Management Systems Final"
          />
        </div>

        <div>
          <label
            htmlFor="exam-subject"
            className="mb-1.5 block text-sm font-medium"
          >
            Subject
          </label>

          <Input
            id="exam-subject"
            list="exam-subjects"
            value={form.subject}
            onChange={(event) =>
              updateField('subject', event.target.value)
            }
            placeholder="e.g. Advanced Database"
          />

          {subjects.length > 0 && (
            <datalist id="exam-subjects">
              {subjects.map((subject) => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          )}
        </div>

        <div>
          <label
            htmlFor="exam-code"
            className="mb-1.5 block text-sm font-medium"
          >
            Subject code
          </label>

          <Input
            id="exam-code"
            value={form.subjectCode}
            onChange={(event) =>
              updateField('subjectCode', event.target.value)
            }
            placeholder="e.g. CSP-310"
          />
        </div>

        <div>
          <label
            htmlFor="exam-date"
            className="mb-1.5 block text-sm font-medium"
          >
            Exam date
          </label>

          <Input
            id="exam-date"
            type="date"
            value={form.date}
            onChange={(event) =>
              updateField('date', event.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="exam-location"
            className="mb-1.5 block text-sm font-medium"
          >
            Location
          </label>

          <Input
            id="exam-location"
            value={form.location}
            onChange={(event) =>
              updateField('location', event.target.value)
            }
            placeholder="e.g. Block B - Room 204"
          />
        </div>

        <div>
          <label
            htmlFor="exam-start"
            className="mb-1.5 block text-sm font-medium"
          >
            Start time
          </label>

          <Input
            id="exam-start"
            type="time"
            value={form.startTime}
            onChange={(event) =>
              updateField('startTime', event.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="exam-end"
            className="mb-1.5 block text-sm font-medium"
          >
            End time
          </label>

          <Input
            id="exam-end"
            type="time"
            value={form.endTime}
            onChange={(event) =>
              updateField('endTime', event.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="exam-type"
            className="mb-1.5 block text-sm font-medium"
          >
            Exam type
          </label>

          <select
            id="exam-type"
            value={form.type}
            onChange={(event) =>
              updateField(
                'type',
                event.target.value as ExamType,
              )
            }
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="practical">Practical</option>
            <option value="viva">Viva</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="exam-status"
            className="mb-1.5 block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="exam-status"
            value={form.status}
            onChange={(event) =>
              updateField(
                'status',
                event.target.value as ExamStatus,
              )
            }
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="exam-marks"
            className="mb-1.5 block text-sm font-medium"
          >
            Total marks
          </label>

          <Input
            id="exam-marks"
            type="number"
            min="0"
            value={form.totalMarks}
            onChange={(event) =>
              updateField('totalMarks', event.target.value)
            }
            placeholder="e.g. 100"
          />
        </div>

        <div>
          <label
            htmlFor="exam-duration"
            className="mb-1.5 block text-sm font-medium"
          >
            Duration (minutes)
          </label>

          <Input
            id="exam-duration"
            type="number"
            min="1"
            value={form.durationMinutes}
            onChange={(event) =>
              updateField(
                'durationMinutes',
                event.target.value,
              )
            }
            placeholder="e.g. 180"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="exam-syllabus"
            className="mb-1.5 block text-sm font-medium"
          >
            Syllabus
          </label>

          <textarea
            id="exam-syllabus"
            value={form.syllabus}
            onChange={(event) =>
              updateField('syllabus', event.target.value)
            }
            rows={4}
            placeholder="Chapters, modules, units, or important topics..."
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="exam-notes"
            className="mb-1.5 block text-sm font-medium"
          >
            Notes
          </label>

          <textarea
            id="exam-notes"
            value={form.notes}
            onChange={(event) =>
              updateField('notes', event.target.value)
            }
            rows={3}
            placeholder="Preparation notes, instructions, or reminders..."
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            Cancel
          </Button>
        )}

        <Button type="submit">
          {initialExam ? 'Update Exam' : 'Save Exam'}
        </Button>
      </div>
    </form>
  );
}