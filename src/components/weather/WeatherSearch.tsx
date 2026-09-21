'use client';

import {
  Loader2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface WeatherSearchProps {
  value?: string;
  isLoading?: boolean;
  placeholder?: string;
  onSearch: (city: string) => void;
  onClear?: () => void;
  onUseCurrentLocation?: () => void;
}

export function WeatherSearch({
  value = '',
  isLoading = false,
  placeholder = 'Search city...',
  onSearch,
  onClear,
  onUseCurrentLocation,
}: WeatherSearchProps) {
  const [query, setQuery] = useState(value);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const city = query.trim();

    if (!city || isLoading) {
      return;
    }

    onSearch(city);
  }

  return (
    <div className="space-y-2">
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder={placeholder}
            className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onClear?.();
              }}
              aria-label="Clear city search"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Search
        </button>
      </form>

      {onUseCurrentLocation && (
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <MapPin className="h-3.5 w-3.5" />
          Use my location
        </button>
      )}
    </div>
  );
}