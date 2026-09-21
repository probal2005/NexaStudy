'use client';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NotesPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NotesPagination({
  page,
  totalPages,
  onPageChange,
}: NotesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="min-w-24 text-center text-sm text-muted-foreground">
        Page <strong className="text-foreground">{page}</strong> of{' '}
        <strong className="text-foreground">{totalPages}</strong>
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}