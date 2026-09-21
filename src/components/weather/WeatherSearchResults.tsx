'use client';

import {
  MapPin,
  Navigation,
} from 'lucide-react';

export interface WeatherLocationResult {
  id: string;
  name: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

interface WeatherSearchResultsProps {
  results: WeatherLocationResult[];
  onSelect: (location: WeatherLocationResult) => void;
}

export function WeatherSearchResults({
  results,
  onSelect,
}: WeatherSearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
      {results.map((location) => (
        <button
          key={location.id}
          type="button"
          onClick={() => onSelect(location)}
          className="flex w-full items-center gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {location.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {[location.region, location.country]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>

          {(location.latitude !== undefined ||
            location.longitude !== undefined) && (
            <Navigation className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>
      ))}
    </div>
  );
}