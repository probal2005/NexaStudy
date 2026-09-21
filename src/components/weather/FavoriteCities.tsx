'use client';

import {
  ChevronRight,
  Star,
  Trash2,
} from 'lucide-react';

export interface WeatherCity {
  id: string;
  name: string;
  country?: string;
}

interface FavoriteCitiesProps {
  cities: WeatherCity[];
  activeCityId?: string;
  onSelect: (city: WeatherCity) => void;
  onRemove?: (city: WeatherCity) => void;
}

export function FavoriteCities({
  cities,
  activeCityId,
  onSelect,
  onRemove,
}: FavoriteCitiesProps) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-amber-500" />
        <h2 className="font-semibold">Favorite Cities</h2>
      </div>

      {cities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No favorite cities yet.
        </p>
      ) : (
        <div className="space-y-1">
          {cities.map((city) => (
            <div
              key={city.id}
              className={`flex items-center rounded-lg ${
                activeCityId === city.id
                  ? 'bg-primary/10'
                  : 'hover:bg-muted'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(city)}
                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
              >
                <Star className="h-4 w-4 shrink-0 text-amber-500" />

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
                  aria-label={`Remove ${city.name}`}
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