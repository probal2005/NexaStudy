'use client';

import {
  RefreshCw,
  Settings2,
  Star,
} from 'lucide-react';

interface WeatherHeaderProps {
  city?: string;
  isFavorite?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onToggleFavorite?: () => void;
  onSettings?: () => void;
}

export function WeatherHeader({
  city,
  isFavorite = false,
  isRefreshing = false,
  onRefresh,
  onToggleFavorite,
  onSettings,
}: WeatherHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Weather
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {city
            ? `Current weather and forecast for ${city}.`
            : 'Check weather conditions and forecasts for your cities.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {city && onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={
              isFavorite
                ? 'Remove city from favorites'
                : 'Add city to favorites'
            }
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Star
              className={`h-4 w-4 ${
                isFavorite
                  ? 'fill-current text-amber-500'
                  : ''
              }`}
            />
            {isFavorite ? 'Favorite' : 'Favorite'}
          </button>
        )}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </button>
        )}

        {onSettings && (
          <button
            type="button"
            onClick={onSettings}
            aria-label="Weather settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}