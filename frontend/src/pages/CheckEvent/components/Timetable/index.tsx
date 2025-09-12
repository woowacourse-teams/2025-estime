import * as S from './Timetable.styled';
import TimeTableColumn from './TimeTableColumn';
import TimeSlotColumn from './TimeSlotColumn';
import useLocalTimeSelection from '@/pages/CheckEvent/hooks/useLocalTimeSelection';
import { RefObject, useMemo, useEffect } from 'react';

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
  const {
    localSelectedTimes,
    updateLocalTimes,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  } = useLocalTimeSelection({
    initialSelectedTimes,
  });

  useEffect(() => {
    updateLocalTimes(initialSelectedTimes);
  }, [initialSelectedTimes, updateLocalTimes]);

  const availableDatesArray = useMemo(() => [...availableDates], [availableDates]);

  return (
    <S.TimetableContent
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <TimeSlotColumn timeColumnRef={timeColumnRef} dateTimeSlots={dateTimeSlots} />
      {availableDatesArray.map((date) => (
        <TimeTableColumn
          key={date}
          date={date}
          dateTimeSlots={dateTimeSlots}
          selectedTimes={localSelectedTimes}
        />
      ))}
    </S.TimetableContent>
  );
};

export default Timetable;
