import {
  CloudSun,
  MapPin,
} from 'lucide-react';

interface WeatherEmptyStateProps {
  onSearch?: () => void;
  onUseLocation?: () => void;
}

export function WeatherEmptyState({
  onSearch,
  onUseLocation,
}: WeatherEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CloudSun className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        Search for a city
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Search for a city to view current conditions,
        hourly forecasts, and the upcoming forecast.
      </p>

      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        {onSearch && (
          <button
            type="button"
            onClick={onSearch}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search City
          </button>
        )}

        {onUseLocation && (
          <button
            type="button"
            onClick={onUseLocation}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <MapPin className="h-4 w-4" />
            Use My Location
          </button>
        )}
      </div>
    </div>
  );
}