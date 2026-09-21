import { Pin } from 'lucide-react';

import { NoteCard } from './NoteCard';
import type { Note } from './NoteCard';

interface PinnedNotesProps {
  notes: Note[];
  onOpen?: (note: Note) => void;
  onPin?: (note: Note) => void;
  onEdit?: (note: Note) => void;
}

export function PinnedNotes({
  notes,
  onOpen,
  onPin,
  onEdit,
}: PinnedNotesProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <Pin className="mx-auto h-8 w-8 text-muted-foreground" />

        <h3 className="mt-3 font-semibold">No pinned notes</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Pin important notes to access them quickly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onOpen={onOpen}
          onPin={onPin}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}