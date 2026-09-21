'use client';

import {
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface WeatherErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function WeatherError({
  message = 'Unable to load weather data.',
  onRetry,
}: WeatherErrorProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
        <AlertTriangle className="h-5 w-5" />
      </div>

      <h2 className="mt-3 font-semibold">
        Weather data unavailable
      </h2>

      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}