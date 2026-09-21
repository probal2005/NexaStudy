'use client';

import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K;
  direction: SortDirection;
}

export function useSort<T, K extends string>(
  items: T[],
  initialKey: K,
  getValue: (item: T, key: K) => string | number | Date,
) {
  const [sort, setSort] = useState<SortState<K>>({
    key: initialKey,
    direction: 'asc',
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = getValue(a, sort.key);
      const second = getValue(b, sort.key);

      const firstValue =
        first instanceof Date
          ? first.getTime()
          : typeof first === 'string'
            ? first.toLowerCase()
            : first;

      const secondValue =
        second instanceof Date
          ? second.getTime()
          : typeof second === 'string'
            ? second.toLowerCase()
            : second;

      if (firstValue < secondValue) {
        return sort.direction === 'asc' ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sort.direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }, [getValue, items, sort]);

  const setSortKey = (key: K) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  return {
    sort,
    sortedItems,
    setSortKey,
  };
}