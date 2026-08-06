import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '@emotion/react';
import usePagination from '@/shared/hooks/Pagination/usePagination';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { paginationStore } from '../stores/paginationStore';

const DESKTOP_COLUMNS_PER_PAGE = 5;
const MOBILE_MAX_COLUMNS_PER_PAGE = 3;

interface TimeTablePaginationProps {
  availableDates: Set<string>;
}

export interface PagedDateColumn {
  date: string;
  isWeekBoundary: boolean;
}

export interface TimeTablePaginationReturns {
  totalPages: number;
  page: number;
  timeTableContainerRef: React.RefObject<HTMLDivElement | null>;
  timeColumnRef: React.RefObject<HTMLDivElement | null>;
  currentPageDates: PagedDateColumn[];
  handlePageNext: () => void;
  handlePagePrev: () => void;
  canPagePrev: boolean;
  canPageNext: boolean;
  pageReset: () => void;
}

const getWeekStartKey = (date: string) => {
  const currentDate = new Date(date);
  const diffFromMonday = (currentDate.getDay() + 6) % 7;
  currentDate.setDate(currentDate.getDate() - diffFromMonday);
  return FormatManager.formatDate(currentDate);
};

const buildPageSizes = (dateCount: number, maxColumnsPerPage: number) => {
  if (dateCount === 0) return [1];

  const totalPages = Math.ceil(dateCount / maxColumnsPerPage);
  const baseSize = Math.floor(dateCount / totalPages);
  const remainder = dateCount % totalPages;

  return Array.from({ length: totalPages }, (_, index) => baseSize + (index < remainder ? 1 : 0));
};

const useTimeTablePagination = ({
  availableDates,
}: TimeTablePaginationProps): TimeTablePaginationReturns => {
  const { isMobile } = useTheme();
  const timeTableContainerRef = useRef<HTMLDivElement>(null);
  const timeColumnRef = useRef<HTMLDivElement>(null);

  const pageGroups = useMemo(() => {
    const dates = Array.from(availableDates);
    const maxColumnsPerPage = isMobile ? MOBILE_MAX_COLUMNS_PER_PAGE : DESKTOP_COLUMNS_PER_PAGE;
    const pageSizes = buildPageSizes(dates.length, maxColumnsPerPage);
    const pages: PagedDateColumn[][] = [];

    let startIndex = 0;
    for (const pageSize of pageSizes) {
      const currentDates = dates.slice(startIndex, startIndex + pageSize);
      pages.push(
        currentDates.map((date, index) => ({
          date,
          isWeekBoundary:
            index > 0 && getWeekStartKey(date) !== getWeekStartKey(currentDates[index - 1]),
        }))
      );
      startIndex += pageSize;
    }

    return pages;
  }, [availableDates, isMobile]);

  const { totalPages, page, canPagePrev, canPageNext, pagePrev, pageNext, pageReset } =
    usePagination({
      totalItemCount: pageGroups.length,
      perPage: 1,
    });

  const currentPageDates = pageGroups[page - 1] ?? [];

  // 페이지 변경시 스토어 업데이트
  useEffect(() => {
    paginationStore.setState({ currentPage: page });
  }, [page]);

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
