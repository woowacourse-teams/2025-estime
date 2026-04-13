import { useCallback, useEffect, useMemo, useState } from 'react';

interface paginationProps {
  totalItemCount: number;
  perPage: number;
}

const usePagination = ({ totalItemCount, perPage }: paginationProps) => {
  const [page, setPage] = useState(1);
  const totalPages = useMemo(() => {
    if (perPage <= 0) return 1;
    return Math.ceil(totalItemCount / perPage);
  }, [totalItemCount, perPage]);

  useEffect(() => {
    setPage((prev) => Math.min(Math.max(prev, 1), totalPages));
  }, [totalPages]);

  const pagePrev = useCallback(() => setPage((prev) => Math.max(prev - 1, 1)), []);
  const pageNext = useCallback(() => setPage((prev) => Math.min(prev + 1, totalPages)), [totalPages]);
  const pageReset = useCallback(() => setPage(1), []);

  const canPagePrev = page > 1;
  const canPageNext = page < totalPages;

  return { totalPages, page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset };
};

export default usePagination;
