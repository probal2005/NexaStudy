'use client';

import { Calculator, SearchX } from 'lucide-react';

interface CalculatorEmptyStateProps {
  searched?: boolean;
}

export function CalculatorEmptyState({
  searched = false,
}: CalculatorEmptyStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {searched ? (
          <SearchX className="h-7 w-7" />
        ) : (
          <Calculator className="h-7 w-7" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {searched
          ? 'No calculators found'
          : 'No calculators available'}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {searched
          ? 'Try another search term or clear your current search.'
          : 'Calculator tools will appear here.'}
      </p>
    </div>
  );
}