'use client';

import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';

export interface PomodoroSession {
  id: string;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  durationMinutes: number;
  completedAt: string;
  subject?: string;
  note?: string;
}

interface PomodoroSessionFormProps {
  subjects: string[];
  onSubmit: (session: PomodoroSession) => void;
}

export function PomodoroSessionForm({
  subjects,
  onSubmit,
}: PomodoroSessionFormProps) {
  const [subject, setSubject] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [note, setNote] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      id: crypto.randomUUID(),
      mode: 'focus',
      durationMinutes: Math.max(1, durationMinutes),
      completedAt: new Date().toISOString(),
      subject: subject || undefined,
      note: note.trim() || undefined,
    });

    setNote('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-card p-5"
    >
      <div>
        <h2 className="font-semibold">Log Focus Session</h2>
        <p className="text-xs text-muted-foreground">
          Manually record a completed focus session.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Subject</span>

          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
          >
            <option value="">No subject</option>

            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Duration (minutes)
          </span>

          <input
            type="number"
            min={1}
            max={300}
            value={durationMinutes}
            onChange={(event) =>
              setDurationMinutes(Number(event.target.value) || 1)
            }
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Note</span>

        <textarea
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="What did you work on?"
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        <Save className="h-4 w-4" />
        Save Session
      </button>
    </form>
  );
}