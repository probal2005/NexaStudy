'use client';

import { useState, type FormEvent } from 'react';

import type { StudySession } from './StudySessionCard';

interface StudySessionFormProps {
  subjects?: string[];
  onSubmit: (session: StudySession) => void;
  onCancel?: () => void;
}

export function StudySessionForm({
  subjects = [],
  onSubmit,
  onCancel,
}: StudySessionFormProps) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const durationMinutes = Number(duration);

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      setError('Enter a valid study duration.');
      return;
    }

    const session: StudySession = {
      id: crypto.randomUUID(),
      subject: subject.trim() || undefined,
      topic: topic.trim() || undefined,
      durationMinutes: Math.round(durationMinutes),
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
      source: 'manual',
    };

    onSubmit(session);

    setSubject('');
    setTopic('');
    setDuration('30');
    setNotes('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">Log Study Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a completed study session to your activity history.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium">
            Subject
          </span>

          {subjects.length > 0 ? (
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select subject</option>
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          )}
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium">
            Duration (minutes) *
          </span>

          <input
            type="number"
            min="1"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">
            Topic
          </span>

          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. React Hooks"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium">
            Notes
          </span>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Optional notes about this session..."
            className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
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
          Save Session
        </button>
      </div>
    </form>
  );
}