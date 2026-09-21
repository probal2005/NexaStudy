'use client';

import {
  Archive,
  Edit3,
  Heart,
  Pin,
  Trash2,
} from 'lucide-react';

import type { Note } from './NoteCard';

interface NoteRowProps {
  note: Note;
  onOpen?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onPin?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
  onArchive?: (note: Note) => void;
}

export function NoteRow({
  note,
  onOpen,
  onEdit,
  onDelete,
  onPin,
  onFavorite,
  onArchive,
}: NoteRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 transition hover:shadow-md md:flex-row md:items-center">
      <button
        type="button"
        onClick={() => onOpen?.(note)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-center gap-2">
          {note.pinned && (
            <Pin className="h-4 w-4 shrink-0 fill-current text-primary" />
          )}

          <h3 className="truncate font-semibold">{note.title}</h3>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {note.content || 'Empty note'}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
            {note.category}
          </span>

          {note.subject && (
            <span className="text-xs text-muted-foreground">
              {note.subject}
            </span>
          )}
        </div>
      </button>

      <div className="flex items-center gap-1 md:ml-auto">
        <button
          type="button"
          onClick={() => onFavorite?.(note)}
          className="rounded-lg p-2 hover:bg-muted"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`h-4 w-4 ${
              note.favorite
                ? 'fill-current text-rose-500'
                : 'text-muted-foreground'
            }`}
          />
        </button>

        {onPin && (
          <button
            type="button"
            onClick={() => onPin(note)}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Toggle pin"
          >
            <Pin
              className={`h-4 w-4 ${
                note.pinned ? 'fill-current text-primary' : ''
              }`}
            />
          </button>
        )}

        {onArchive && (
          <button
            type="button"
            onClick={() => onArchive(note)}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Archive note"
          >
            <Archive className="h-4 w-4" />
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(note)}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Edit note"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(note)}
            className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}