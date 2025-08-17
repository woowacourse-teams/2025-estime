import { useMemo, useState } from 'react';

interface paginationProps {
  totalItemCount: number;
  perPage: number;
}

export const usePagination = ({ totalItemCount, perPage }: paginationProps) => {
  const [page, setPage] = useState(0);
  const totalPages = useMemo(() => Math.ceil(totalItemCount / perPage), [totalItemCount, perPage]);

  const pagePrev = () => setPage((prev) => prev - 1);
  const pageNext = () => setPage((prev) => prev + 1);
  const pageReset = () => setPage(0);

  const canPagePrev = page > 0;
  const canPageNext = page < totalPages - 1;

  return { page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset };
};
