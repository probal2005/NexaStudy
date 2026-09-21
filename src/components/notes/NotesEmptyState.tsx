'use client';

import { FileText, Plus, Search } from 'lucide-react';

interface NotesEmptyStateProps {
  search?: string;
  onAdd?: () => void;
  onClearSearch?: () => void;
}

export function NotesEmptyState({
  search,
  onAdd,
  onClearSearch,
}: NotesEmptyStateProps) {
  const hasSearch = Boolean(search?.trim());

  return (
    <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {hasSearch ? (
          <Search className="h-6 w-6" />
        ) : (
          <FileText className="h-6 w-6" />
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        {hasSearch ? 'No notes found' : 'No notes yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {hasSearch
          ? `Nothing matches "${search}". Try another search.`
          : 'Create your first note to start organizing your study material.'}
      </p>

      <div className="mt-5 flex justify-center gap-2">
        {hasSearch && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Clear Search
          </button>
        )}

        {!hasSearch && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Create Note
          </button>
        )}
      </div>
    </div>
  );
}