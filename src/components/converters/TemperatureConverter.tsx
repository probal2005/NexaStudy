'use client';

import { useMemo, useState } from 'react';

type Unit = 'celsius' | 'fahrenheit' | 'kelvin';

export default function TemperatureConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<Unit>('celsius');
  const [to, setTo] = useState<Unit>('fahrenheit');

  const result = useMemo(() => {
    const number = Number(value);

    if (!value || !Number.isFinite(number)) return '';

    let celsius = number;

    if (from === 'fahrenheit') {
      celsius = (number - 32) * (5 / 9);
    }

    if (from === 'kelvin') {
      celsius = number - 273.15;
    }

    if (to === 'celsius') return format(celsius);

    if (to === 'fahrenheit') {
      return format(celsius * (9 / 5) + 32);
    }

    return format(celsius + 273.15);
  }, [value, from, to]);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Temperature</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Convert Celsius, Fahrenheit and Kelvin.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TemperatureField
          label="From"
          value={value}
          unit={from}
          units={['celsius', 'fahrenheit', 'kelvin']}
          onChange={setValue}
          onUnitChange={setFrom}
        />

        <TemperatureField
          label="Result"
          value={result}
          unit={to}
          units={['celsius', 'fahrenheit', 'kelvin']}
          readOnly
          onUnitChange={setTo}
        />
      </div>
    </div>
  );
}

function TemperatureField({
  label,
  value,
  unit,
  units,
  readOnly,
  onChange,
  onUnitChange,
}: {
  label: string;
  value: string;
  unit: Unit;
  units: Unit[];
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onUnitChange: (value: Unit) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="flex overflow-hidden rounded-xl border border-border">
        <input
          type="number"
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-background px-3 py-3 text-sm outline-none"
          placeholder="Enter temperature"
        />

        <select
          value={unit}
          onChange={(event) =>
            onUnitChange(event.target.value as Unit)
          }
          className="border-l border-border bg-muted/30 px-3 text-sm outline-none"
        >
          {units.map((item) => (
            <option key={item} value={item}>
              {formatUnit(item)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function format(number: number) {
  return Number(number.toFixed(10)).toString();
}

function formatUnit(unit: string) {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}