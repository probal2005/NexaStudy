'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

function calculateAge(birthDate: string, endDate: string): AgeResult | null {
  const start = new Date(`${birthDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return null;
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      0,
    ).getDate();

    days += previousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);

  const [birthDate, setBirthDate] = useState('');
  const [endDate, setEndDate] = useState(today);
  const [result, setResult] = useState<AgeResult | null>(null);

  function calculate() {
    setResult(calculateAge(birthDate, endDate));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-foreground">Age Calculator</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Calculate age between two dates.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Date of birth
          </span>

          <Input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Calculate until
          </span>

          <Input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
      </div>

      <Button className="mt-4 w-full" onClick={calculate}>
        Calculate Age
      </Button>

      {result && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-xl font-bold text-foreground">
              {result.years}
            </p>
            <p className="text-xs text-muted-foreground">Years</p>
          </div>

          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-xl font-bold text-foreground">
              {result.months}
            </p>
            <p className="text-xs text-muted-foreground">Months</p>
          </div>

          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-xl font-bold text-foreground">
              {result.days}
            </p>
            <p className="text-xs text-muted-foreground">Days</p>
          </div>
        </div>
      )}
    </div>
  );
}