'use client';

import { useMemo, useState } from 'react';

const factors = {
  milliliter: 0.001,
  liter: 1,
  'cubic-meter': 1000,
  'cubic-centimeter': 0.001,
  gallon: 3.785411784,
  quart: 0.946352946,
  pint: 0.473176473,
  cup: 0.2365882365,
} as const;

type Unit = keyof typeof factors;

export default function VolumeConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<Unit>('liter');
  const [to, setTo] = useState<Unit>('gallon');

  const result = useMemo(() => {
    const number = Number(value);

    if (!value || !Number.isFinite(number)) return '';

    return format(number * (factors[from] / factors[to]));
  }, [value, from, to]);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Volume</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Convert liquid and volume measurements.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="From"
          value={value}
          unit={from}
          units={Object.keys(factors) as Unit[]}
          onChange={setValue}
          onUnitChange={setFrom}
        />

        <Field
          label="Result"
          value={result}
          unit={to}
          units={Object.keys(factors) as Unit[]}
          readOnly
          onUnitChange={setTo}
        />
      </div>
    </div>
  );
}

function Field({
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
  return unit
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}