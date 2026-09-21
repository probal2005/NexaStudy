'use client';

import {
  Archive,
  Edit3,
  Heart,
  Pin,
  X,
} from 'lucide-react';

import type { Note } from './NoteCard';

interface NoteDetailsProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (note: Note) => void;
  onPin?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
  onArchive?: (note: Note) => void;
}

export function NoteDetails({
  note,
  open,
  onClose,
  onEdit,
  onPin,
  onFavorite,
  onArchive,
}: NoteDetailsProps) {
  if (!open || !note) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-details-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border bg-card shadow-2xl"
      >
        <div
          className="flex items-center justify-between border-b p-4"
          style={{
            borderTopColor: note.color || undefined,
            borderTopWidth: note.color ? 4 : undefined,
          }}
        >
          <div className="min-w-0">
            <h2
              id="note-details-title"
              className="truncate font-semibold"
            >
              {note.title}
            </h2>

            <p className="text-xs text-muted-foreground">
              {note.category}
              {note.subject ? ` • ${note.subject}` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close note"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {note.category}
            </span>

            {note.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                <Pin className="h-3 w-3 fill-current" />
                Pinned
              </span>
            )}

            {note.favorite && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                <Heart className="h-3 w-3 fill-current text-rose-500" />
                Favorite
              </span>
            )}
          </div>

          <div className="whitespace-pre-wrap text-sm leading-7">
            {note.content || 'This note is empty.'}
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            {onPin && (
              <button
                type="button"
                onClick={() => onPin(note)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                <Pin className="h-4 w-4" />
                {note.pinned ? 'Unpin' : 'Pin'}
              </button>
            )}

            {onFavorite && (
              <button
                type="button"
                onClick={() => onFavorite(note)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                <Heart className="h-4 w-4" />
                {note.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
            )}

            {onArchive && (
              <button
                type="button"
                onClick={() => onArchive(note)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                <Archive className="h-4 w-4" />
                {note.archived ? 'Restore' : 'Archive'}
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(note)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                <Edit3 className="h-4 w-4" />
                Edit Note
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}