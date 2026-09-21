import type { LibraryBook } from './LibraryBookCard';

interface LibraryGridProps {
  books: LibraryBook[];
  onOpen?: (book: LibraryBook) => void;
  onEdit?: (book: LibraryBook) => void;
  onDelete?: (book: LibraryBook) => void;
  onFavorite?: (book: LibraryBook) => void;
}

import { LibraryBookCard } from './LibraryBookCard';

export function LibraryGrid({
  books,
  onOpen,
  onEdit,
  onDelete,
  onFavorite,
}: LibraryGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {books.map((book) => (
        <LibraryBookCard
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