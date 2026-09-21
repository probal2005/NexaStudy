'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function PercentageCalculator() {
  const [percentage, setPercentage] = useState('');
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    const percent = Number(percentage);
    const value = Number(number);

    if (!Number.isFinite(percent) || !Number.isFinite(value)) {
      setResult(null);
      return;
    }

    setResult((percent / 100) * value);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-foreground">
        Percentage Calculator
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Calculate a percentage of a number.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          type="number"
          value={percentage}
          onChange={(event) => setPercentage(event.target.value)}
          placeholder="Percentage"
          aria-label="Percentage"
        />

        <Input
          type="number"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          placeholder="Number"
          aria-label="Number"
        />
      </div>

      <Button className="mt-4 w-full" onClick={calculate}>
        Calculate
      </Button>

      <div className="mt-4 rounded-xl bg-muted/60 p-4">
        <p className="text-xs text-muted-foreground">Result</p>
        <p className="mt-1 text-xl font-semibold text-foreground">
          {result === null ? '—' : result}
        </p>
      </div>
    </div>
  );
}