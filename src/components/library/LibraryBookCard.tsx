'use client';

import {
  BookOpen,
  Bookmark,
  Check,
  Clock3,
  Edit3,
  ExternalLink,
  FileText,
  MoreVertical,
  Star,
  Trash2,
} from 'lucide-react';

import type { LibraryResourceType } from './LibraryFilters';

export type LibraryBookStatus = 'unread' | 'reading' | 'completed';

export interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  description?: string;
  category: string;
  type: LibraryResourceType;
  status: LibraryBookStatus;
  progress?: number;
  rating?: number;
  favorite?: boolean;
  coverUrl?: string;
  url?: string;
  notes?: string;
  addedAt?: string;
  updatedAt?: string;
}

interface LibraryBookCardProps {
  book: LibraryBook;
  onOpen?: (book: LibraryBook) => void;
  onEdit?: (book: LibraryBook) => void;
  onDelete?: (book: LibraryBook) => void;
  onFavorite?: (book: LibraryBook) => void;
}

const statusConfig = {
  unread: {
    label: 'Unread',
    icon: Bookmark,
  },
  reading: {
    label: 'Reading',
    icon: Clock3,
  },
  completed: {
    label: 'Completed',
    icon: Check,
  },
};

const typeLabels: Record<LibraryResourceType, string> = {
  all: 'Resource',
  book: 'Book',
  pdf: 'PDF',
  article: 'Article',
  course: 'Course',
  reference: 'Reference',
};

export function LibraryBookCard({
  book,
  onOpen,
  onEdit,
  onDelete,
  onFavorite,
}: LibraryBookCardProps) {
  const status = statusConfig[book.status];
  const StatusIcon = status.icon;

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-muted">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {book.type === 'pdf' ? (
              <FileText className="h-10 w-10" />
            ) : (
              <BookOpen className="h-10 w-10" />
            )}

            <span className="text-xs font-medium">
              {typeLabels[book.type]}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onFavorite?.(book)}
          className="absolute right-3 top-3 rounded-full border bg-background/90 p-2 shadow-sm backdrop-blur transition hover:scale-105"
          aria-label={
            book.favorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <Star
            className={`h-4 w-4 ${
              book.favorite
                ? 'fill-current text-amber-500'
                : 'text-muted-foreground'
            }`}
          />
        </button>

        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {typeLabels[book.type]}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold" title={book.title}>
            {book.title}
          </h3>

          {book.author && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {book.author}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {book.category}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
        </div>

        {typeof book.progress === 'number' && (
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{book.progress}%</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, book.progress))}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 border-t pt-3">
          <button
            type="button"
            onClick={() => onOpen?.(book)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(book)}
              className="rounded-lg border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={`Edit ${book.title}`}
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(book)}
              className="rounded-lg border p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${book.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {!onEdit && !onDelete && (
            <button
              type="button"
              className="rounded-lg border p-2 text-muted-foreground"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}