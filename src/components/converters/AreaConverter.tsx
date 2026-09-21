'use client';

import { useMemo, useState } from 'react';

const factors = {
  'square-meter': 1,
  'square-kilometer': 1_000_000,
  'square-centimeter': 0.0001,
  'square-foot': 0.09290304,
  'square-yard': 0.83612736,
  acre: 4046.8564224,
  hectare: 10000,
} as const;

type Unit = keyof typeof factors;

export default function AreaConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<Unit>('square-meter');
  const [to, setTo] = useState<Unit>('square-foot');

  const result = useMemo(() => {
    const number = Number(value);

    if (!value || !Number.isFinite(number)) return '';

    return format(number * (factors[from] / factors[to]));
  }, [value, from, to]);

  return (
    <Converter
      title="Area"
      description="Convert common area measurements."
      value={value}
      result={result}
      from={from}
      to={to}
      units={Object.keys(factors) as Unit[]}
      onValueChange={setValue}
      onFromChange={setFrom}
      onToChange={setTo}
    />
  );
}

function Converter({
  title,
  description,
  value,
  result,
  from,
  to,
  units,
  onValueChange,
  onFromChange,
  onToChange,
}: any) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="From"
          value={value}
          unit={from}
          units={units}
          onChange={onValueChange}
          onUnitChange={onFromChange}
        />

        <Field
          label="Result"
          value={result}
          unit={to}
          units={units}
          readOnly
          onUnitChange={onToChange}
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
}: any) {
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
          onChange={(event) => onUnitChange(event.target.value)}
          className="border-l border-border bg-muted/30 px-3 text-sm outline-none"
        >
          {units.map((item: string) => (
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