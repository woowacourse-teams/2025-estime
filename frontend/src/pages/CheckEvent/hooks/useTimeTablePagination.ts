import { useEffect, useMemo, useRef } from 'react';
// import { useColumnsPerPage } from './useColumnPerPage';
import usePagination from '../../../shared/hooks/Pagination/usePagination';

const MIN_COLUMN_WIDTH = 60;

interface TimeTablePaginationProps {
  availableDates: Set<string>;
}

const useTimeTablePagination = ({ availableDates }: TimeTablePaginationProps) => {
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

  const pagination = useMemo(
    () => ({
      totalPages,
      page,
      canPagePrev,
      canPageNext,
      handlePageNext: pageNext,
      handlePagePrev: pagePrev,
      pageReset,
    }),
    [totalPages, page, canPagePrev, canPageNext, pageNext, pagePrev, pageReset]
  );
  const refs = useMemo(
    () => ({
      timeTableContainerRef,
      timeColumnRef,
    }),
    []
  );

  return {
    refs,
    pagination,
    currentPageDates,
  };
};

export default useTimeTablePagination;
