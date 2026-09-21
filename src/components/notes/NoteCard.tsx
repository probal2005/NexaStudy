'use client';

import {
  Archive,
  Edit3,
  Heart,
  MoreVertical,
  Pin,
  Trash2,
} from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  subject?: string;
  tags?: string[];
  color?: string;
  pinned?: boolean;
  favorite?: boolean;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface NoteCardProps {
  note: Note;
  onOpen?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onPin?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
  onArchive?: (note: Note) => void;
}

export function NoteCard({
  note,
  onOpen,
  onEdit,
  onDelete,
  onPin,
  onFavorite,
  onArchive,
}: NoteCardProps) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderTopColor: note.color || undefined,
        borderTopWidth: note.color ? 3 : undefined,
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpen?.(note)}
            className="min-w-0 flex-1 text-left"
          >
            <h3 className="truncate font-semibold">{note.title}</h3>

            {note.subject && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {note.subject}
              </p>
            )}
          </button>

          <div className="flex items-center gap-1">
            {note.pinned && (
              <Pin className="h-4 w-4 fill-current text-primary" />
            )}

            <button
              type="button"
              onClick={() => onFavorite?.(note)}
              className="rounded-lg p-1.5 hover:bg-muted"
              aria-label={
                note.favorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <Heart
                className={`h-4 w-4 ${
                  note.favorite
                    ? 'fill-current text-rose-500'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen?.(note)}
          className="mt-4 block w-full text-left"
        >
          <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {note.content || 'Empty note'}
          </p>
        </button>

        {note.tags && note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t pt-3">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {note.category}
          </span>

          <div className="flex items-center gap-1">
            {onPin && (
              <button
                type="button"
                onClick={() => onPin(note)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
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
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={
                  note.archived ? 'Restore note' : 'Archive note'
                }
              >
                <Archive className="h-4 w-4" />
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(note)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Edit note"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(note)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {!onPin && !onArchive && !onEdit && !onDelete && (
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}