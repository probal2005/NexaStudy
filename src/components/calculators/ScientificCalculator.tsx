'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AngleMode = 'deg' | 'rad';

export function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [result, setResult] = useState('');

  const angle = useMemo(
    () => (angleMode === 'deg' ? Math.PI / 180 : 1),
    [angleMode],
  );

  function evaluate() {
    const value = Number(expression);

    if (!Number.isFinite(value)) {
      setResult('Enter a valid number.');
      return;
    }

    setResult(value.toString());
  }

  function calculateFunction(
    fn: 'sin' | 'cos' | 'tan' | 'sqrt' | 'log' | 'ln',
  ) {
    const value = Number(expression);

    if (!Number.isFinite(value)) {
      setResult('Enter a valid number.');
      return;
    }

    let output: number;

    switch (fn) {
      case 'sin':
        output = Math.sin(value * angle);
        break;
      case 'cos':
        output = Math.cos(value * angle);
        break;
      case 'tan':
        output = Math.tan(value * angle);
        break;
      case 'sqrt':
        output = Math.sqrt(value);
        break;
      case 'log':
        output = Math.log10(value);
        break;
      case 'ln':
        output = Math.log(value);
        break;
    }

    if (!Number.isFinite(output)) {
      setResult('Undefined');
      return;
    }

    setResult(String(output));
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground">
            Scientific Calculator
          </h2>
          <p className="text-xs text-muted-foreground">
            Trigonometric and logarithmic functions
          </p>
        </div>

        <div className="flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setAngleMode('deg')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              angleMode === 'deg'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            DEG
          </button>

          <button
            type="button"
            onClick={() => setAngleMode('rad')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              angleMode === 'rad'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            RAD
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Input
          type="number"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="Enter a number..."
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(['sin', 'cos', 'tan', 'sqrt', 'log', 'ln'] as const).map(
            (fn) => (
              <Button
                key={fn}
                variant="outline"
                onClick={() => calculateFunction(fn)}
              >
                {fn}
              </Button>
            ),
          )}
        </div>

        <Button className="w-full" onClick={evaluate}>
          Calculate
        </Button>

        <div className="rounded-xl bg-muted/60 p-4">
          <p className="text-xs text-muted-foreground">Result</p>
          <p className="mt-1 break-all text-xl font-semibold text-foreground">
            {result || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}