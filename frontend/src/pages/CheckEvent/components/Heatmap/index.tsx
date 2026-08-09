import Text from '@/shared/components/Text';
import * as S from './Heatmap.styled';
import HeatMapDataCell from './HeatMapDataCell';
import TimeTableDay from '@/pages/CheckEvent/components/Timetable/TimeTableDay';
import { RefObject, useEffect, useMemo } from 'react';
import { cellDataStore } from '../../stores/CellDataStore';
import { cellHoverStore, useCellHoverState } from '../../stores/CellHoverStore';
import { useTheme } from '@emotion/react';
import { PagedDateColumn } from '../../hooks/useTimeTablePagination';

interface HeatmapProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: PagedDateColumn[];
}

const Heatmap = ({ timeColumnRef, dateTimeSlots, availableDates }: HeatmapProps) => {
  const { isMobile } = useTheme();

  const cellHoverState = useCellHoverState();

  useEffect(() => {
    if (isMobile) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const current = cellDataStore.getSnapshot();
      const tooltipVisible = !!current?.participantNames?.length;

      if (!tooltipVisible) return;
      if (
        target?.closest('[data-tooltip-close]') ||
        target?.closest('[data-tooltip-root]') ||
        target?.closest('[data-cell]')
      )
        return;
      cellHoverStore.handleCellHoverUnLock();
      cellDataStore.initialStore();
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isMobile]);

  const timeSlotNodes = useMemo(
    () =>
      dateTimeSlots.map((timeText) => (
        <S.GridContainer key={timeText}>
          {timeText.endsWith(':00') && (
            <S.TimeLabel>
              <Text variant="body" color="text">
                {timeText}
              </Text>
            </S.TimeLabel>
          )}
        </S.GridContainer>
      )),
    [dateTimeSlots]
  );

  return (
    <>
      <S.HeatMapContent>
        <S.TimeSlotColumn ref={timeColumnRef} aria-hidden={true}>
          {timeSlotNodes}
        </S.TimeSlotColumn>
        {availableDates.map(({ date, isWeekBoundary }) => (
          <S.DateColumn key={date} isWeekBoundary={isWeekBoundary}>
            <TimeTableDay date={date} />
            {dateTimeSlots.map((timeText) => (
              <HeatMapDataCell
                key={`${date}T${timeText}`}
                date={date}
                timeText={timeText}
                isLocked={cellHoverState}
              />
            ))}
          </S.DateColumn>
        ))}
      </S.HeatMapContent>
    </>
  );
};

export default Heatmap;
