'use client';

interface TemperatureToggleProps {
  value: 'celsius' | 'fahrenheit';
  onChange: (
    value: 'celsius' | 'fahrenheit',
  ) => void;
}

export function TemperatureToggle({
  value,
  onChange,
}: TemperatureToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border bg-card p-1"
      role="group"
      aria-label="Temperature unit"
    >
      <button
        type="button"
        onClick={() => onChange('celsius')}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          value === 'celsius'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted'
        }`}
      >
        °C
      </button>

      <button
        type="button"
        onClick={() => onChange('fahrenheit')}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          value === 'fahrenheit'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted'
        }`}
      >
        °F
      </button>
    </div>
  );
}