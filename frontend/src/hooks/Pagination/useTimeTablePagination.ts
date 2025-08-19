import { useRef } from 'react';
import { useColumnsPerPage } from './useColumnPerPage';
import { usePagination } from './usePagination';

const MIN_COLUMN_WIDTH = 60;

interface TimeTablePaginationProps {
  availableDates: Set<string>;
}

export const useTimeTablePagination = ({ availableDates }: TimeTablePaginationProps) => {
  const timeTableContainerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);

  const columnCountPerPage = useColumnsPerPage({
    containerRef: timeTableContainerRef,
    timeColumnRef,
    minColumnWidth: MIN_COLUMN_WIDTH,
  });

  const { totalPages, page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset } =
    usePagination({
      totalItemCount: availableDates.size,
      perPage: columnCountPerPage,
    });

  const startIndex = (page - 1) * columnCountPerPage;
  const endIndex = startIndex + columnCountPerPage;

  const currentPageDates = new Set(Array.from(availableDates).slice(startIndex, endIndex));

  return {
    totalPages,
    page,
    timeTableContainerRef,
    timeColumnRef,
    currentPageDates,
    handlePageNext: pageNext,
    handlePagePrev: pagePrev,
    canPagePrev,
    canPageNext,
    pageReset,
  };
};
