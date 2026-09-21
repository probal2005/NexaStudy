'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FileFiltersProps {
  search: string;
  type: 'all' | 'pdf' | 'image' | 'other';
  onSearchChange: (value: string) => void;
  onTypeChange: (
    value: 'all' | 'pdf' | 'image' | 'other',
  ) => void;
  onClear?: () => void;
}

export function FileFilters({
  search,
  type,
  onSearchChange,
  onTypeChange,
  onClear,
}: FileFiltersProps) {
  const hasFilters =
    search.trim() !== '' || type !== 'all';

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search files..."
            className="pl-9"
          />
        </div>

        <select
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as
                | 'all'
                | 'pdf'
                | 'image'
                | 'other',
            )
          }
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All files</option>
          <option value="pdf">PDF</option>
          <option value="image">Images</option>
          <option value="other">Other</option>
        </select>

        {hasFilters && onClear && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}