import * as S from './Timetable.styled';
import TimeSlotColumn from './TimeSlotColumn';
import useLocalTimeSelection from '@/pages/CheckEvent/hooks/useLocalTimeSelection';
import { RefObject, useRef } from 'react';
import HeatmapPreview from '../HeatMapPreview';
import Wrapper from '@/shared/layout/Wrapper';
import { HoveredTimeRef } from '../../types/hoveredTimeRef';
import TimeTableColumn from './TimeTableColumn';

interface TimetableProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  showHeatmapPreview: boolean;
}

const Timetable = ({
  timeColumnRef,
  dateTimeSlots,
  availableDates,
  showHeatmapPreview,
}: TimetableProps) => {
  const { containerRef, pointerHandlers } = useLocalTimeSelection();

  const hoveredTimeRef = useRef<HoveredTimeRef>({ current: null });

  return (
    <>
      <S.TimetableContent ref={containerRef} {...pointerHandlers}>
        <TimeSlotColumn
          timeColumnRef={timeColumnRef}
          dateTimeSlots={dateTimeSlots}
          hoveredTimeRef={hoveredTimeRef}
        />
        {[...availableDates].map((date) => (
          <Wrapper key={date} maxWidth="100%">
            <HeatmapPreview date={date} dateTimeSlots={dateTimeSlots} show={showHeatmapPreview} />
            <TimeTableColumn
              date={date}
              dateTimeSlots={dateTimeSlots}
              hoveredTimeRef={hoveredTimeRef}
            />
          </Wrapper>
        ))}
      </S.TimetableContent>
    </>
  );
};

export default Timetable;
