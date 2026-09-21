'use client';

import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

export function useSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  delay = 250,
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  const results = useMemo(() => {
    const normalizedQuery = debouncedQuery
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      searchFn(item, normalizedQuery),
    );
  }, [debouncedQuery, items, searchFn]);

  return {
    query,
    setQuery,
    results,
    isSearching: query !== debouncedQuery,
  };
}