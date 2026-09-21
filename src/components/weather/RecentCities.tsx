'use client';

import {
  Clock3,
  ChevronRight,
  Trash2,
} from 'lucide-react';

import type { WeatherCity } from './FavoriteCities';

interface RecentCitiesProps {
  cities: WeatherCity[];
  onSelect: (city: WeatherCity) => void;
  onRemove?: (city: WeatherCity) => void;
  onClear?: () => void;
}

export function RecentCities({
  cities,
  onSelect,
  onRemove,
  onClear,
}: RecentCitiesProps) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Recent Cities</h2>
        </div>

        {cities.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {cities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Your recently searched cities will appear here.
        </p>
      ) : (
        <div className="space-y-1">
          {cities.map((city) => (
            <div
              key={city.id}
              className="flex items-center rounded-lg hover:bg-muted"
            >
              <button
                type="button"
                onClick={() => onSelect(city)}
                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {city.name}
                  </span>

                  {city.country && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {city.country}
                    </span>
                  )}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(city)}
                  aria-label={`Remove ${city.name} from recent cities`}
                  className="mr-2 rounded-md p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}