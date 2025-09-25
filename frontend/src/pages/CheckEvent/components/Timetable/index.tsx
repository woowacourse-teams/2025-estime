import * as S from './Timetable.styled';
import TimeTableColumn from './TimeTableColumn';
import TimeSlotColumn from './TimeSlotColumn';
import useLocalTimeSelection from '@/pages/CheckEvent/hooks/useLocalTimeSelection';
import { RefObject } from 'react';

interface TimetableProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  initialSelectedTimes: Set<string>;
}

const Timetable = ({
  timeColumnRef,
  dateTimeSlots,
  availableDates,
  initialSelectedTimes,
}: TimetableProps) => {
  const { containerRef, pointerHandlers } = useLocalTimeSelection({
    initialSelectedTimes,
  });

  return (
    <S.TimetableContent ref={containerRef} {...pointerHandlers}>
      <TimeSlotColumn timeColumnRef={timeColumnRef} dateTimeSlots={dateTimeSlots} />
      {[...availableDates].map((date) => (
        <TimeTableColumn key={date} date={date} dateTimeSlots={dateTimeSlots} />
      ))}
    </S.TimetableContent>
  );
};

export default Timetable;
