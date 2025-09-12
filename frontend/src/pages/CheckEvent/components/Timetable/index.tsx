import * as S from './Timetable.styled';
import TimeTableColumn from './TimeTableColumn';
import TimeSlotColumn from './TimeSlotColumn';
import useLocalTimeSelection from '@/pages/CheckEvent/hooks/useLocalTimeSelection';
import { RefObject, memo, useMemo, useEffect } from 'react';

interface TimetableProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  initialSelectedTimes: Set<string>;
}

const Timetable = memo(
  ({ timeColumnRef, dateTimeSlots, availableDates, initialSelectedTimes }: TimetableProps) => {
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

    // 외부에서 selectedTimes가 변경되면 로컬 상태 업데이트
    useEffect(() => {
      updateLocalTimes(initialSelectedTimes);
    }, [initialSelectedTimes, updateLocalTimes]);

    // availableDates를 배열로 변환하여 메모이제이션
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
  },
  (prevProps, nextProps) => {
    // props가 실제로 변경되었는지 확인
    return (
      prevProps.dateTimeSlots === nextProps.dateTimeSlots &&
      prevProps.availableDates === nextProps.availableDates &&
      prevProps.initialSelectedTimes === nextProps.initialSelectedTimes
    );
  }
);

Timetable.displayName = 'Timetable';

export default Timetable;
