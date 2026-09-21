'use client';

import { Calculator, History, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface CalculatorHeaderProps {
  onClearHistory?: () => void;
  onShowHistory?: () => void;
}

export function CalculatorHeader({
  onClearHistory,
  onShowHistory,
}: CalculatorHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Calculators
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Useful academic, financial, health, and everyday calculators.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {onShowHistory && (
          <Button variant="outline" onClick={onShowHistory}>
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        )}

        {onClearHistory && (
          <Button variant="outline" onClick={onClearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>
    </header>
  );
}