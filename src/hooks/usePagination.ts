'use client';

import { useMemo, useState } from 'react';

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination(
  totalItems: number,
  pageSize = 10,
): PaginationResult {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  );

  const safePage = Math.min(currentPage, totalPages);

  const goToPage = (page: number) => {
    setCurrentPage(
      Math.max(1, Math.min(page, totalPages)),
    );
  };

  const nextPage = () => {
    goToPage(safePage + 1);
  };

  const previousPage = () => {
    goToPage(safePage - 1);
  };

  return useMemo(
    () => ({
      currentPage: safePage,
      totalPages,
      pageSize,
      startIndex: (safePage - 1) * pageSize,
      endIndex: Math.min(
        safePage * pageSize,
        totalItems,
      ),
      goToPage,
      nextPage,
      previousPage,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    }),
    [pageSize, safePage, totalItems, totalPages],
  );
}