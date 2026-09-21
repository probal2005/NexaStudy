'use client';

import { Filter, LayoutGrid, List } from 'lucide-react';

export type LibraryViewMode = 'grid' | 'list';

export type LibraryStatus =
  | 'all'
  | 'unread'
  | 'reading'
  | 'completed';

export type LibraryResourceType =
  | 'all'
  | 'book'
  | 'pdf'
  | 'article'
  | 'course'
  | 'reference';

interface LibraryFiltersProps {
  status: LibraryStatus;
  type: LibraryResourceType;
  category: string;
  categories: string[];
  viewMode: LibraryViewMode;
  onStatusChange: (status: LibraryStatus) => void;
  onTypeChange: (type: LibraryResourceType) => void;
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: LibraryViewMode) => void;
}

export function LibraryFilters({
  status,
  type,
  category,
  categories,
  viewMode,
  onStatusChange,
  onTypeChange,
  onCategoryChange,
  onViewModeChange,
}: LibraryFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as LibraryStatus)
          }
          className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Filter by reading status"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={type}
          onChange={(event) =>
            onTypeChange(event.target.value as LibraryResourceType)
          }
          className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Filter by resource type"
        >
          <option value="all">All Types</option>
          <option value="book">Book</option>
          <option value="pdf">PDF</option>
          <option value="article">Article</option>
          <option value="course">Course</option>
          <option value="reference">Reference</option>
        </select>

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-9 max-w-48 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
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
          <LayoutGrid className="h-4 w-4" />
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