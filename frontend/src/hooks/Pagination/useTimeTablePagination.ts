import { useEffect, useRef } from 'react';
import { useColumnsPerPage } from './useColumnPerPage';
import { usePagination } from './usePagination';

interface TimeTablePaginationProps {
  availableDates: Set<string>;
  mode: 'view' | 'edit';
}

export const useTimeTablePagination = ({ availableDates, mode }: TimeTablePaginationProps) => {
  const MIN_COLUMN_WIDTH = 60;

  const timeTableContainerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);

  const columnCountPerPage = useColumnsPerPage({
    containerRef: timeTableContainerRef,
    timeColumnRef,
    minColumnWidth: MIN_COLUMN_WIDTH,
  });

  const { page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset } = usePagination({
    totalItemCount: availableDates.size,
    perPage: columnCountPerPage,
  });

  const startIndex = page * columnCountPerPage;
  const endIndex = startIndex + columnCountPerPage;

  const currentPageDates = new Set(Array.from(availableDates).slice(startIndex, endIndex));

  useEffect(() => {
    pageReset();
  }, [mode]);

  return {
    timeTableContainerRef,
    timeColumnRef,
    currentPageDates,
    handlePageNext: pageNext,
    handlePagePrev: pagePrev,
    canPagePrev,
    canPageNext,
  };
};
