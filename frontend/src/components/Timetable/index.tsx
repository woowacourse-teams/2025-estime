import * as S from './Timetable.styled';
import type { Field } from '@/types/field';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';
import { getDayOfWeek } from '@/utils/Calendar/getDayofWeek';
import generateTimeList from '@/utils/Calendar/generateTimeList';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import Button from '@/components/Button';

interface TimetableProps {
  name: string;
  time: {
    startTime: string;
    endTime: string;
  };
  availableDates: Set<string>;
  selectedTimes: Field<Set<string>>;
  userAvailabilitySubmit: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

const Timetable = ({
  name,
  time,
  availableDates,
  selectedTimes,
  userAvailabilitySubmit,
  ref,
}: TimetableProps) => {
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
    <Wrapper maxWidth={780} ref={ref}>
      <S.Container>
        <Flex direction="column" gap="var(--gap-6)">
          <S.TimetableHeader>
            <Flex direction="column" gap="var(--gap-4)">
              <Text variant="h2" color="text">
                {name}의 시간 등록하기
              </Text>
              <Text variant="body" color="text">
                가능한 시간을 아래 시간표에서 드래그 해주세요 !
              </Text>
            </Flex>
            <Wrapper maxWidth={100} center={false}>
              <Button color="primary" onClick={userAvailabilitySubmit}>
                <Text variant="button" color="text">
                  저장하기
                </Text>
              </Button>
            </Wrapper>
          </S.TimetableHeader>
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
                  <S.HeaderCell
                    key={`${date}T${timeText}`}
                    onMouseDown={() => onMouseDown(`${date}T${timeText}`)}
                    onMouseUp={() => onMouseUp()}
                    onMouseMove={() => onMouseEnter(`${date}T${timeText}`)}
                    selectedTimes={selectedTimes.value}
                    date={date}
                    timeText={timeText}
                  >
                    {timeText === 'Dates' && (
                      <Text variant="body" color="text">
                        <Flex direction="column" justify="center" align="center">
                          <Text>{date.split('-').slice(1).join('.')}</Text>
                          <Text>({getDayOfWeek(date)})</Text>
                        </Flex>
                      </Text>
                    )}
                  </S.HeaderCell>
                ))}
              </Wrapper>
            ))}
          </S.TimetableContent>
        </Flex>
      </S.Container>
    </Wrapper>
  );
};
export default Timetable;
