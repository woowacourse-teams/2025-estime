import { useEffect, useRef } from 'react';
// import { useColumnsPerPage } from './useColumnPerPage';
import usePagination from '../../../shared/hooks/Pagination/usePagination';

const MIN_COLUMN_WIDTH = 60;

interface TimeTablePaginationProps {
  availableDates: Set<string>;
}

export interface TimeTablePaginationReturns {
  totalPages: number;
  page: number;
  timeTableContainerRef: React.RefObject<HTMLDivElement | null>;
  timeColumnRef: React.RefObject<HTMLDivElement | null>;
  currentPageDates: Set<string>;
  handlePageNext: () => void;
  handlePagePrev: () => void;
  canPagePrev: boolean;
  canPageNext: boolean;
  pageReset: () => void;
}

const useTimeTablePagination = ({
  availableDates,
}: TimeTablePaginationProps): TimeTablePaginationReturns => {
  const timeTableContainerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);
  const maxColumnCountPerPageRef = useRef(0);

  useEffect(() => {
    if (!timeTableContainerRef.current || !timeColumnRef.current) return;

    const containerWidth = timeTableContainerRef.current.getBoundingClientRect().width;
    const style = getComputedStyle(timeTableContainerRef.current);
    const containerWidthWithoutPadding =
      containerWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    const timeColumnWidth = timeColumnRef.current.getBoundingClientRect().width;

    maxColumnCountPerPageRef.current = Math.floor(
      (containerWidthWithoutPadding - timeColumnWidth) / MIN_COLUMN_WIDTH
    );
  }, []);

  const { totalPages, page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset } =
    usePagination({
      totalItemCount: availableDates.size,
      perPage: maxColumnCountPerPageRef.current,
    });

  const maxColumnCountPerPage = maxColumnCountPerPageRef.current;

  const startIndex = (page - 1) * maxColumnCountPerPage;
  const endIndex = startIndex + maxColumnCountPerPage;

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

export default useTimeTablePagination;
