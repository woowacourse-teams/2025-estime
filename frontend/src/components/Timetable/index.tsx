import * as S from './Timetable.styled';
import { Field } from '@/types/field';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';

import Text from '@/components/Text';
import TimeTableCell from './TimeTableCell';
import Wrapper from '@/components/Layout/Wrapper';
import TimeTableDay from './TimeTableDay';

interface TimetableProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  selectedTimes: Field<Set<string>>;
}

const Timetable = ({ dateTimeSlots, availableDates, selectedTimes }: TimetableProps) => {
  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = useTimeSelection({
    selectedTimes: selectedTimes.value,
    setSelectedTimes: selectedTimes.set,
    time: '',
  });

  return (
    <S.TimetableContent onMouseLeave={onMouseLeave}>
      <S.TimeSlotColumn>
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
              handlers={{ onMouseDown, onMouseUp, onMouseEnter }}
              selectedTimes={selectedTimes}
            />
          ))}
        </Wrapper>
      ))}
    </S.TimetableContent>
  );
};
export default Timetable;
