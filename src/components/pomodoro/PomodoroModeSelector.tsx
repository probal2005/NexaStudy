'use client';

export type PomodoroMode =
  | 'focus'
  | 'shortBreak'
  | 'longBreak';

interface PomodoroModeSelectorProps {
  mode: PomodoroMode;
  onChange: (mode: PomodoroMode) => void;
  disabled?: boolean;
}

const modes: {
  id: PomodoroMode;
  label: string;
}[] = [
  {
    id: 'focus',
    label: 'Focus',
  },
  {
    id: 'shortBreak',
    label: 'Short Break',
  },
  {
    id: 'longBreak',
    label: 'Long Break',
  },
];

export function PomodoroModeSelector({
  mode,
  onChange,
  disabled = false,
}: PomodoroModeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1 rounded-xl border bg-muted/40 p-1">
      {modes.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(item.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === item.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          } disabled:cursor-not-allowed disabled:opacity-50`}
          aria-pressed={mode === item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}