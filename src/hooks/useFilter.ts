'use client';

import { useMemo, useState } from 'react';

export function useFilter<T, F>(
  items: T[],
  initialFilter: F,
  filterFn: (item: T, filter: F) => boolean,
) {
  const [filter, setFilter] = useState<F>(initialFilter);

  const filteredItems = useMemo(
    () => items.filter((item) => filterFn(item, filter)),
    [filter, filterFn, items],
  );

  const resetFilter = () => {
    setFilter(initialFilter);
  };

  return {
    filter,
    setFilter,
    filteredItems,
    resetFilter,
  };
}