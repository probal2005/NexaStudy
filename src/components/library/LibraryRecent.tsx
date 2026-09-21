import { Clock3 } from 'lucide-react';

import type { LibraryBook } from './LibraryBookCard';

interface LibraryRecentProps {
  books: LibraryBook[];
  onOpen?: (book: LibraryBook) => void;
}

export function LibraryRecent({
  books,
  onOpen,
}: LibraryRecentProps) {
  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <Clock3 className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          No recently added resources.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {books.slice(0, 5).map((book) => (
        <button
          key={book.id}
          type="button"
          onClick={() => onOpen?.(book)}
          className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition hover:bg-muted/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock3 className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{book.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {book.author || book.category}
            </p>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {book.type}
          </span>
        </button>
      ))}
    </div>
  );
}