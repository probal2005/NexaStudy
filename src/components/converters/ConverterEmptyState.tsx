'use client';

import { ArrowLeftRight, SearchX } from 'lucide-react';

interface ConverterEmptyStateProps {
  searched?: boolean;
  onReset?: () => void;
}

export default function ConverterEmptyState({
  searched = false,
  onReset,
}: ConverterEmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {searched ? (
          <SearchX className="h-7 w-7" />
        ) : (
          <ArrowLeftRight className="h-7 w-7" />
        )}
      </div>

      <h3 className="font-semibold">
        {searched ? 'No converter found' : 'No converter available'}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {searched
          ? 'Try another search term or clear your search.'
          : 'Choose a converter to start converting values.'}
      </p>

      {searched && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}