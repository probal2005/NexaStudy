'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function DateCalculator() {
  const [date, setDate] = useState('');
  const [days, setDays] = useState('30');
  const [result, setResult] = useState('');

  function calculate() {
    const baseDate = new Date(`${date}T00:00:00`);
    const amount = Number(days);

    if (
      Number.isNaN(baseDate.getTime()) ||
      !Number.isFinite(amount)
    ) {
      setResult('');
      return;
    }

    baseDate.setDate(baseDate.getDate() + amount);
    setResult(formatDate(baseDate));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-foreground">
        Date Calculator
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Add or subtract days from a date.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <Input
          type="number"
          value={days}
          onChange={(event) => setDays(event.target.value)}
          placeholder="Number of days"
        />
      </div>

      <Button className="mt-4 w-full" onClick={calculate}>
        Calculate Date
      </Button>

      <div className="mt-4 rounded-xl bg-muted/60 p-4">
        <p className="text-xs text-muted-foreground">Result</p>
        <p className="mt-1 font-semibold text-foreground">
          {result || '—'}
        </p>
      </div>
    </div>
  );
}