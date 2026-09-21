'use client';

import { Search, X } from 'lucide-react';

interface ConverterSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ConverterSearch({
  value,
  onChange,
}: ConverterSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search converters..."
        aria-label="Search converters"
        className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Clear converter search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}