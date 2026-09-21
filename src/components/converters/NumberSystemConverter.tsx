'use client';

import { useMemo, useState } from 'react';

type Base = 2 | 8 | 10 | 16;

const bases: Array<{
  value: Base;
  label: string;
}> = [
  { value: 2, label: 'Binary' },
  { value: 8, label: 'Octal' },
  { value: 10, label: 'Decimal' },
  { value: 16, label: 'Hexadecimal' },
];

export default function NumberSystemConverter() {
  const [value, setValue] = useState('255');
  const [from, setFrom] = useState<Base>(10);
  const [to, setTo] = useState<Base>(16);

  const result = useMemo(() => {
    if (!value.trim()) return '';

    try {
      const decimal = parseInt(value, from);

      if (!Number.isFinite(decimal) || Number.isNaN(decimal)) {
        return '';
      }

      return decimal.toString(to).toUpperCase();
    } catch {
      return '';
    }
  }, [value, from, to]);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Number System</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Convert binary, octal, decimal and hexadecimal numbers.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="From"
          value={value}
          base={from}
          onValueChange={setValue}
          onBaseChange={setFrom}
          readOnly={false}
        />

        <Field
          label="Result"
          value={result}
          base={to}
          onBaseChange={setTo}
          readOnly
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  base,
  readOnly,
  onValueChange,
  onBaseChange,
}: {
  label: string;
  value: string;
  base: Base;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
  onBaseChange: (base: Base) => void;
}) {
  const baseInfo = bases.find((item) => item.value === base);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="flex overflow-hidden rounded-xl border border-border">
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onValueChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-background px-3 py-3 font-mono text-sm uppercase outline-none"
          placeholder="Enter number"
        />

        <select
          value={base}
          onChange={(event) =>
            onBaseChange(Number(event.target.value) as Base)
          }
          className="border-l border-border bg-muted/30 px-3 text-sm outline-none"
        >
          {bases.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Base {base} · {baseInfo?.label}
      </p>
    </div>
  );
}