'use client';

import {
  BookOpen,
  Check,
  Clock3,
  Edit3,
  ExternalLink,
  FileText,
  Star,
  Trash2,
} from 'lucide-react';

import type { LibraryBook } from './LibraryBookCard';

interface LibraryBookRowProps {
  book: LibraryBook;
  onOpen?: (book: LibraryBook) => void;
  onEdit?: (book: LibraryBook) => void;
  onDelete?: (book: LibraryBook) => void;
  onFavorite?: (book: LibraryBook) => void;
}

const statusIcons = {
  unread: Clock3,
  reading: BookOpen,
  completed: Check,
};

export function LibraryBookRow({
  book,
  onOpen,
  onEdit,
  onDelete,
  onFavorite,
}: LibraryBookRowProps) {
  const StatusIcon = statusIcons[book.status];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 transition hover:shadow-md md:flex-row md:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : book.type === 'pdf' ? (
          <FileText className="h-7 w-7 text-muted-foreground" />
        ) : (
          <BookOpen className="h-7 w-7 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{book.title}</h3>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {book.author || 'Unknown author'}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
            {book.category}
          </span>

          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <StatusIcon className="h-3.5 w-3.5" />
            {book.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:ml-auto">
        <button
          type="button"
          onClick={() => onFavorite?.(book)}
          className="rounded-lg border p-2 transition hover:bg-muted"
          aria-label="Toggle favorite"
        >
          <Star
            className={`h-4 w-4 ${
              book.favorite ? 'fill-current text-amber-500' : ''
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => onOpen?.(book)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Open
        </button>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="rounded-lg border p-2 hover:bg-muted"
            aria-label="Edit resource"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(book)}
            className="rounded-lg border p-2 text-destructive hover:bg-destructive/10"
            aria-label="Delete resource"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}