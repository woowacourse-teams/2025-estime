import * as S from './Timetable.styled';
import { Field } from '@/types/field';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import TimeTableCell from './TimeTableCell';

interface TimetableProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  selectedTimes: Field<Set<string>>;
}

const Timetable = ({ dateTimeSlots, availableDates, selectedTimes }: TimetableProps) => {
  const timeList = ['Dates', ...dateTimeSlots];

  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = useTimeSelection({
    selectedTimes: selectedTimes.value,
    setSelectedTimes: selectedTimes.set,
    time: '',
  });

  return (
    <Flex direction="column" gap="var(--gap-6)">
      <S.TimetableContent onMouseLeave={onMouseLeave}>
        <S.TimeSlotColumn>
          {timeList.map((dateTimeSlot) => (
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
          <Wrapper key={date} center={false}>
            {timeList.map((dateTimeSlot) => (
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
    </Flex>
  );
};
export default Timetable;
