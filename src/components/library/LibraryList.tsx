import { LibraryBookRow } from './LibraryBookRow';
import type { LibraryBook } from './LibraryBookCard';

interface LibraryListProps {
  books: LibraryBook[];
  onOpen?: (book: LibraryBook) => void;
  onEdit?: (book: LibraryBook) => void;
  onDelete?: (book: LibraryBook) => void;
  onFavorite?: (book: LibraryBook) => void;
}

export function LibraryList({
  books,
  onOpen,
  onEdit,
  onDelete,
  onFavorite,
}: LibraryListProps) {
  return (
    <div className="space-y-3">
      {books.map((book) => (
        <LibraryBookRow
          key={book.id}
          book={book}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}