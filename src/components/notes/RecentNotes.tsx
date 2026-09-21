import { Clock3 } from 'lucide-react';

import type { Note } from './NoteCard';

interface RecentNotesProps {
  notes: Note[];
  onOpen?: (note: Note) => void;
}

export function RecentNotes({
  notes,
  onOpen,
}: RecentNotesProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <Clock3 className="mx-auto h-8 w-8 text-muted-foreground" />

        <p className="mt-3 text-sm text-muted-foreground">
          No recent notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.slice(0, 5).map((note) => (
        <button
          key={note.id}
          type="button"
          onClick={() => onOpen?.(note)}
          className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition hover:bg-muted/50"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            style={{
              backgroundColor: note.color
                ? `${note.color}18`
                : undefined,
              color: note.color || undefined,
            }}
          >
            <Clock3 className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {note.title}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {note.subject || note.category}
            </p>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {note.updatedAt
              ? new Date(note.updatedAt).toLocaleDateString()
              : 'Recent'}
          </span>
        </button>
      ))}
    </div>
  );
}