import { useCallback, useMemo, useState } from 'react';

interface paginationProps {
  totalItemCount: number;
  perPage: number;
}

export const usePagination = ({ totalItemCount, perPage }: paginationProps) => {
  const [page, setPage] = useState(1);
  const totalPages = useMemo(() => {
    if (perPage <= 0) return 1;
    return Math.ceil(totalItemCount / perPage);
  }, [totalItemCount, perPage]);

  const pagePrev = useCallback(() => setPage((prev) => prev - 1), []);
  const pageNext = useCallback(() => setPage((prev) => prev + 1), []);
  const pageReset = useCallback(() => setPage(1), []);

  const canPagePrev = page > 1;
  const canPageNext = page < totalPages;

  return { totalPages, page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset };
};
