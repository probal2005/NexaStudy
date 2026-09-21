'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { AttendanceRecord, AttendanceStatus } from './AttendanceCard';

interface AttendanceFormProps {
  subjects: string[];
  initialData?: AttendanceRecord | null;
  onSubmit: (record: AttendanceRecord) => void;
  onCancel?: () => void;
}

interface FormState {
  subjectName: string;
  subjectCode: string;
  date: string;
  status: AttendanceStatus;
  startTime: string;
  endTime: string;
  remarks: string;
}

const emptyForm: FormState = {
  subjectName: '',
  subjectCode: '',
  date: '',
  status: 'present',
  startTime: '',
  endTime: '',
  remarks: '',
};

export function AttendanceForm({
  subjects,
  initialData,
  onSubmit,
  onCancel,
}: AttendanceFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        subjectName: initialData.subjectName,
        subjectCode: initialData.subjectCode ?? '',
        date: initialData.date,
        status: initialData.status,
        startTime: initialData.startTime ?? '',
        endTime: initialData.endTime ?? '',
        remarks: initialData.remarks ?? '',
      });
    } else {
      setForm(emptyForm);
    }

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

    if (!form.subjectName.trim()) {
      setError('Please select or enter a subject.');
      return;
    }

    if (!form.date) {
      setError('Please select a date.');
      return;
    }

    const record: AttendanceRecord = {
      id: initialData?.id ?? crypto.randomUUID(),
      subjectId:
        initialData?.subjectId ??
        form.subjectName.trim().toLowerCase().replace(/\s+/g, '-'),
      subjectName: form.subjectName.trim(),
      subjectCode: form.subjectCode.trim() || undefined,
      date: form.date,
      status: form.status,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      remarks: form.remarks.trim() || undefined,
    };

    onSubmit(record);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {initialData ? 'Edit Attendance' : 'Add Attendance'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Record the attendance details for a class.
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
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Subject
          </span>

          {subjects.length > 0 ? (
            <select
              value={form.subjectName}
              onChange={(event) =>
                updateField('subjectName', event.target.value)
              }
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
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
              value={form.subjectName}
              onChange={(event) =>
                updateField('subjectName', event.target.value)
              }
              placeholder="e.g. Database Management"
            />
          )}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Subject Code
          </span>

          <Input
            value={form.subjectCode}
            onChange={(event) =>
              updateField('subjectCode', event.target.value)
            }
            placeholder="e.g. CSE-301"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Date</span>

          <Input
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Status
          </span>

          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                'status',
                event.target.value as AttendanceStatus,
              )
            }
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Start Time
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
            End Time
          </span>

          <Input
            type="time"
            value={form.endTime}
            onChange={(event) =>
              updateField('endTime', event.target.value)
            }
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">
          Remarks
        </span>

        <textarea
          value={form.remarks}
          onChange={(event) =>
            updateField('remarks', event.target.value)
          }
          placeholder="Optional notes..."
          rows={3}
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
          {initialData ? 'Update Record' : 'Save Record'}
        </Button>
      </div>
    </form>
  );
}