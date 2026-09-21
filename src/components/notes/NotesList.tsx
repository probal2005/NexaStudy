import { NoteRow } from './NoteRow';
import type { Note } from './NoteCard';

interface NotesListProps {
  notes: Note[];
  onOpen?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onPin?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
  onArchive?: (note: Note) => void;
}

export function NotesList({
  notes,
  onOpen,
  onEdit,
  onDelete,
  onPin,
  onFavorite,
  onArchive,
}: NotesListProps) {
  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteRow
          key={note.id}
          note={note}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={onPin}
          onFavorite={onFavorite}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}