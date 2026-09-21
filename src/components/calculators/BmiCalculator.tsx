'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function getCategory(bmi: number) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}

export function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const category = useMemo(
    () => (result === null ? '' : getCategory(result)),
    [result],
  );

  function calculate() {
    const heightCm = Number(height);
    const weightKg = Number(weight);

    if (
      !Number.isFinite(heightCm) ||
      !Number.isFinite(weightKg) ||
      heightCm <= 0 ||
      weightKg <= 0
    ) {
      setResult(null);
      return;
    }

    const heightMeters = heightCm / 100;
    setResult(weightKg / (heightMeters * heightMeters));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-foreground">BMI Calculator</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Calculate BMI from height and weight.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          type="number"
          min="0"
          value={height}
          onChange={(event) => setHeight(event.target.value)}
          placeholder="Height (cm)"
        />

        <Input
          type="number"
          min="0"
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          placeholder="Weight (kg)"
        />
      </div>

      <Button className="mt-4 w-full" onClick={calculate}>
        Calculate BMI
      </Button>

      {result !== null && (
        <div className="mt-4 rounded-xl bg-muted/60 p-4 text-center">
          <p className="text-xs text-muted-foreground">BMI</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {result.toFixed(1)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {category}
          </p>
        </div>
      )}
    </div>
  );
}