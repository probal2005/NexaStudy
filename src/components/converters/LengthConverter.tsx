'use client';

import { useMemo, useState } from 'react';

interface LengthConverterProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const units = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
} as const;

type Unit = keyof typeof units;

export default function LengthConverter({
  value: externalValue = '',
  onValueChange,
}: LengthConverterProps) {
  const [value, setValue] = useState(externalValue);
  const [from, setFrom] = useState<Unit>('meter');
  const [to, setTo] = useState<Unit>('kilometer');

  const result = useMemo(() => {
    const number = Number(value);

    if (!value || !Number.isFinite(number)) {
      return '';
    }

    return format(number * (units[from] / units[to]));
  }, [value, from, to]);

  const updateValue = (next: string) => {
    setValue(next);
    onValueChange?.(next);
  };

  return (
    <ConverterLayout
      title="Length"
      description="Convert distance and length measurements."
      value={value}
      onValueChange={updateValue}
      from={from}
      to={to}
      onFromChange={setFrom}
      onToChange={setTo}
      units={Object.keys(units) as Unit[]}
      result={result}
    />
  );
}

function ConverterLayout({
  title,
  description,
  value,
  onValueChange,
  from,
  to,
  onFromChange,
  onToChange,
  units,
  result,
}: {
  title: string;
  description: string;
  value: string;
  onValueChange: (value: string) => void;
  from: string;
  to: string;
  onFromChange: (value: any) => void;
  onToChange: (value: any) => void;
  units: string[];
  result: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <ConverterInput
          label="From"
          value={value}
          onChange={onValueChange}
          unit={from}
          onUnitChange={onFromChange}
          units={units}
        />

        <div className="hidden h-10 items-center justify-center text-xl text-muted-foreground md:flex">
          →
        </div>

        <ConverterInput
          label="To"
          value={result}
          readOnly
          unit={to}
          onUnitChange={onToChange}
          units={units}
        />
      </div>
    </div>
  );
}

function ConverterInput({
  label,
  value,
  onChange,
  readOnly = false,
  unit,
  onUnitChange,
  units,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  unit: string;
  onUnitChange: (value: any) => void;
  units: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="flex overflow-hidden rounded-xl border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          type="number"
          className="min-w-0 flex-1 bg-background px-3 py-3 text-sm outline-none"
          placeholder="Enter value"
        />

        <select
          value={unit}
          onChange={(event) => onUnitChange(event.target.value)}
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
  if (!Number.isFinite(number)) return '';

  return Number(number.toFixed(10)).toString();
}

function formatUnit(unit: string) {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}