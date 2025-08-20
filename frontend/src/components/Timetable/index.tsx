import * as S from './Timetable.styled';
import { Field } from '@/types/field';

import Text from '@/components/Text';
import TimeTableCell from './TimeTableCell';
import Wrapper from '@/components/Layout/Wrapper';
import TimeTableDay from './TimeTableDay';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';
import { RefObject } from 'react';

interface TimetableProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  selectedTimes: Field<Set<string>>;
}

const Timetable = ({ timeColumnRef, dateTimeSlots, availableDates, selectedTimes }: TimetableProps) => {
  const {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  } = useTimeSelection({
    selectedTimes: selectedTimes.value,
    setSelectedTimes: selectedTimes.set,
  });

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
      <S.TimeSlotColumn ref={timeColumnRef}>
        {dateTimeSlots.map((dateTimeSlot) => (
          <S.GridContainer key={dateTimeSlot}>
            {dateTimeSlot.endsWith(':00') && (
              <S.TimeLabel>
                <Text variant="body" color="text">
                  {dateTimeSlot}
                </Text>
              </S.TimeLabel>
            )}
          </S.GridContainer>
        ))}
      </S.TimeSlotColumn>
      {[...availableDates].map((date) => (
        <Wrapper key={date} center={false} maxWidth="100%">
          <TimeTableDay date={date} key={`${date}-day`} />
          {dateTimeSlots.map((dateTimeSlot) => (
            <TimeTableCell
              key={`${date} ${dateTimeSlot}`}
              date={date}
              timeText={dateTimeSlot}
              selectedTimes={selectedTimes}
            />
          ))}
        </Wrapper>
      ))}
    </S.TimetableContent>
  );
};
export default Timetable;
