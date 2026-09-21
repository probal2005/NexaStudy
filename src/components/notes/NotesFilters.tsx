'use client';

import { Archive, Grid2X2, List, SlidersHorizontal } from 'lucide-react';

export type NotesViewMode = 'grid' | 'list';

export type NotesStatus =
  | 'all'
  | 'active'
  | 'pinned'
  | 'favorites'
  | 'archived';

interface NotesFiltersProps {
  status: NotesStatus;
  category: string;
  categories: string[];
  viewMode: NotesViewMode;
  onStatusChange: (status: NotesStatus) => void;
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: NotesViewMode) => void;
}

export function NotesFilters({
  status,
  category,
  categories,
  viewMode,
  onStatusChange,
  onCategoryChange,
  onViewModeChange,
}: NotesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as NotesStatus)
          }
          className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Filter notes by status"
        >
          <option value="all">All Notes</option>
          <option value="active">Active</option>
          <option value="pinned">Pinned</option>
          <option value="favorites">Favorites</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-9 max-w-48 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Filter notes by category"
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {status === 'archived' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Archive className="h-3.5 w-3.5" />
            Archived
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 self-end rounded-lg border p-1 lg:self-auto">
        <button
          type="button"
          onClick={() => onViewModeChange('grid')}
          className={`rounded-md p-2 transition ${
            viewMode === 'grid'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
        >
          <Grid2X2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          className={`rounded-md p-2 transition ${
            viewMode === 'list'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}