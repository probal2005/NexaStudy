'use client';

interface PomodoroSubjectSelectorProps {
  subjects: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PomodoroSubjectSelector({
  subjects,
  value,
  onChange,
  disabled = false,
}: PomodoroSubjectSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="pomodoro-subject"
        className="text-sm font-medium"
      >
        Study subject
      </label>

      <select
        id="pomodoro-subject"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">No subject selected</option>

        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
    </div>
  );
}