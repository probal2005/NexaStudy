import { Heart } from 'lucide-react';

import { LibraryBookCard } from './LibraryBookCard';
import type { LibraryBook } from './LibraryBookCard';

interface LibraryFavoritesProps {
  books: LibraryBook[];
  onOpen?: (book: LibraryBook) => void;
  onFavorite?: (book: LibraryBook) => void;
}

export function LibraryFavorites({
  books,
  onOpen,
  onFavorite,
}: LibraryFavoritesProps) {
  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-3 font-semibold">No favorites yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Mark important resources as favorites for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {books.map((book) => (
        <LibraryBookCard
          key={book.id}
          book={book}
          onOpen={onOpen}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}