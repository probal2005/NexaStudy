'use client';

import { BookOpen, ExternalLink, FileText, Star, X } from 'lucide-react';

import type { LibraryBook } from './LibraryBookCard';

interface LibraryBookDetailsProps {
  book: LibraryBook | null;
  open: boolean;
  onClose: () => void;
  onFavorite?: (book: LibraryBook) => void;
}

export function LibraryBookDetails({
  book,
  open,
  onClose,
  onFavorite,
}: LibraryBookDetailsProps) {
  if (!open || !book) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="library-book-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 id="library-book-title" className="font-semibold">
            Resource Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[180px_1fr]">
          <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-muted">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                className="h-full w-full object-cover"
              />
            ) : book.type === 'pdf' ? (
              <FileText className="h-14 w-14 text-muted-foreground" />
            ) : (
              <BookOpen className="h-14 w-14 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{book.title}</h3>

                  {book.author && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {book.author}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onFavorite?.(book)}
                  className="rounded-lg border p-2"
                  aria-label="Toggle favorite"
                >
                  <Star
                    className={`h-4 w-4 ${
                      book.favorite
                        ? 'fill-current text-amber-500'
                        : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                {book.category}
              </span>

              <span className="rounded-full bg-muted px-3 py-1">
                {book.type}
              </span>

              <span className="rounded-full bg-muted px-3 py-1">
                {book.status}
              </span>
            </div>

            {book.description && (
              <p className="text-sm leading-6 text-muted-foreground">
                {book.description}
              </p>
            )}

            {typeof book.progress === 'number' && (
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Reading progress</span>
                  <span className="font-medium">{book.progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, book.progress),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {book.notes && (
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </p>
                <p className="whitespace-pre-wrap text-sm">
                  {book.notes}
                </p>
              </div>
            )}

            {book.url && (
              <a
                href={book.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                Open Resource
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}