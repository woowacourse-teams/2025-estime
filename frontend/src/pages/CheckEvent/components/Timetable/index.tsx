import * as S from './Timetable.styled';
import TimeTableColumn from './TimeTableColumn';
import TimeSlotColumn from './TimeSlotColumn';
import useLocalTimeSelection from '@/pages/CheckEvent/hooks/useLocalTimeSelection';
import { RefObject } from 'react';
import HeatmapPreview from '../HeatMapPreview';
import Wrapper from '@/shared/layout/Wrapper';

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

  return (
    <>
      <S.TimetableContent ref={containerRef} {...pointerHandlers}>
        <TimeSlotColumn timeColumnRef={timeColumnRef} dateTimeSlots={dateTimeSlots} />
        {[...availableDates].map((date) => (
          <Wrapper key={date} maxWidth="100%">
            <HeatmapPreview date={date} dateTimeSlots={dateTimeSlots} show={showHeatmapPreview} />
            <TimeTableColumn date={date} dateTimeSlots={dateTimeSlots} />
          </Wrapper>
        ))}
      </S.TimetableContent>
    </>
  );
};

export default Timetable;
