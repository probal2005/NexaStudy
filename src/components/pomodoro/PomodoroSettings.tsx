'use client';

import { Save, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

export interface PomodoroSettingsData {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

interface PomodoroSettingsProps {
  open: boolean;
  settings: PomodoroSettingsData;
  onClose: () => void;
  onSave: (settings: PomodoroSettingsData) => void;
}

export function PomodoroSettings({
  open,
  settings,
  onClose,
  onSave,
}: PomodoroSettingsProps) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (open) {
      setForm(settings);
    }
  }, [open, settings]);

  if (!open) {
    return null;
  }

  const updateNumber = (
    key: keyof PomodoroSettingsData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: Math.max(1, Number(value) || 1),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      ...form,
      focusMinutes: Math.max(1, form.focusMinutes),
      shortBreakMinutes: Math.max(1, form.shortBreakMinutes),
      longBreakMinutes: Math.max(1, form.longBreakMinutes),
      sessionsBeforeLongBreak: Math.max(
        1,
        form.sessionsBeforeLongBreak,
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-semibold">Pomodoro Settings</h2>
            <p className="text-xs text-muted-foreground">
              Customize your focus routine.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">
              Focus duration
            </span>
            <input
              type="number"
              min={1}
              max={180}
              value={form.focusMinutes}
              onChange={(event) =>
                updateNumber('focusMinutes', event.target.value)
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">
              Short break
            </span>
            <input
              type="number"
              min={1}
              max={60}
              value={form.shortBreakMinutes}
              onChange={(event) =>
                updateNumber(
                  'shortBreakMinutes',
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">
              Long break
            </span>
            <input
              type="number"
              min={1}
              max={120}
              value={form.longBreakMinutes}
              onChange={(event) =>
                updateNumber(
                  'longBreakMinutes',
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">
              Sessions before long break
            </span>
            <input
              type="number"
              min={1}
              max={12}
              value={form.sessionsBeforeLongBreak}
              onChange={(event) =>
                updateNumber(
                  'sessionsBeforeLongBreak',
                  event.target.value,
                )
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            />
          </label>

          <div className="space-y-3 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.autoStartBreaks}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    autoStartBreaks: event.target.checked,
                  }))
                }
              />
              Automatically start breaks
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.autoStartFocus}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    autoStartFocus: event.target.checked,
                  }))
                }
              />
              Automatically start the next focus session
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.soundEnabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    soundEnabled: event.target.checked,
                  }))
                }
              />
              Enable completion sound
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}