import * as S from './Timetable.styled';
import { Field } from '@/types/field';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';
import generateTimeList from '@/utils/Calendar/generateTimeList';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import TimeTableCell from './TimeTableCell';

interface TimetableProps {
  time: {
    startTime: string;
    endTime: string;
  };
  availableDates: Set<string>;
  selectedTimes: Field<Set<string>>;
}

const Timetable = ({ time, availableDates, selectedTimes }: TimetableProps) => {
  const { startTime, endTime } = time;

  const startTimeInMinutes = startTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
  const endTimeInMinutes = endTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
  const interval = 30;

  const timeList = [
    { timeText: 'Dates', isHour: false },
    ...generateTimeList({ startTimeInMinutes, endTimeInMinutes, interval }),
  ];

  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = useTimeSelection({
    selectedTimes: selectedTimes.value,
    setSelectedTimes: selectedTimes.set,
    time: '',
  });

  return (
    <Flex direction="column" gap="var(--gap-6)">
      <S.TimetableContent onMouseLeave={onMouseLeave}>
        <S.TimeSlotColumn>
          {timeList.map(({ timeText, isHour }) => (
            <S.GridContainer key={timeText}>
              {isHour && (
                <S.TimeLabel>
                  <Text variant="body" color="text">
                    {isHour ? timeText : ''}
                  </Text>
                </S.TimeLabel>
              )}
            </S.GridContainer>
          ))}
        </S.TimeSlotColumn>
        {[...availableDates].map((date) => (
          <Wrapper key={date} center={false}>
            {timeList.map(({ timeText }) => (
              <TimeTableCell
                key={`${date} ${timeText}`}
                date={date}
                timeText={timeText}
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
