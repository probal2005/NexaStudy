'use client';

import { useMemo, useState } from 'react';

const factors = {
  milligram: 0.000001,
  gram: 0.001,
  kilogram: 1,
  tonne: 1000,
  ounce: 0.028349523125,
  pound: 0.45359237,
} as const;

type Unit = keyof typeof factors;

export default function WeightConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState<Unit>('kilogram');
  const [to, setTo] = useState<Unit>('pound');

  const result = useMemo(() => {
    const number = Number(value);

    if (!value || !Number.isFinite(number)) return '';

    return format(number * (factors[from] / factors[to]));
  }, [value, from, to]);

  return (
    <SimpleConverter
      title="Weight"
      description="Convert mass and weight measurements."
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

function SimpleConverter({
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
}: {
  title: string;
  description: string;
  value: string;
  result: string;
  from: string;
  to: string;
  units: string[];
  onValueChange: (value: string) => void;
  onFromChange: (value: any) => void;
  onToChange: (value: any) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

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
}: {
  label: string;
  value: string;
  unit: string;
  units: string[];
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onUnitChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="flex overflow-hidden rounded-xl border border-border">
        <input
          value={value}
          readOnly={readOnly}
          type="number"
          onChange={(event) => onChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-background px-3 py-3 text-sm outline-none"
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
  return Number(number.toFixed(10)).toString();
}

function formatUnit(unit: string) {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}