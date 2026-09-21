import { NoteCard, type Note } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  onOpen?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onPin?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
  onArchive?: (note: Note) => void;
}

export function NotesGrid({
  notes,
  onOpen,
  onEdit,
  onDelete,
  onPin,
  onFavorite,
  onArchive,
}: NotesGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard
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