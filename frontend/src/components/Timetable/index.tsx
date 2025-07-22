import Flex from '../Layout/Flex';
import Wrapper from '../Layout/Wrapper';
import { useState } from 'react';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';
import { useTheme } from '@emotion/react';
import Text from '../Text';
import { getDayOfWeek } from '@/utils/Calendar/getDayofWeek';
import * as S from './Timetable.styled';
import generateTimeList from '@/utils/Calendar/generateTimeList';
import Button from '../Button';

interface TimetableProps {
  availableDates: string[];
  startTime: string;
  endTime: string;
}

const Timetable = ({ availableDates, startTime, endTime }: TimetableProps) => {
  const startTimeInMinutes = startTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
  const endTimeInMinutes = endTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
  const interval = 30;

  const timeList = [
    { timeText: 'Dates', isHour: false },
    ...generateTimeList({ startTimeInMinutes, endTimeInMinutes, interval }),
  ];

  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = useTimeSelection({
    selectedTimes,
    setSelectedTimes,
    time: '',
  });

  const theme = useTheme();

  return (
    <Wrapper
      maxWidth={800}
      backgroundColor={theme.colors.background}
      paddingTop="var(--padding-9)"
      paddingRight="var(--padding-9)"
      paddingBottom="var(--padding-9)"
      paddingLeft="var(--padding-9)"
      borderRadius="var(--radius-6)"
    >
      <Flex direction="column" gap="var(--gap-6)">
        <S.TimetableHeader>
          <Flex direction="column" gap="var(--gap-4)">
            <Text variant="h2" color="text">
              내 시간 등록하기
            </Text>
            <Text variant="body" color="text">
              가능한 시간을 아래 시간표에서 드래그 해주세요 !
            </Text>
          </Flex>
          <Wrapper maxWidth={100} center={false}>
            <Button color="primary">
              <Text variant="button" color="text">
                저장하기
              </Text>
            </Button>
          </Wrapper>
        </S.TimetableHeader>
        <S.TimetableContent>
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
          {availableDates.map((date) => (
            <Wrapper key={date} center={false}>
              {timeList.map(({ timeText }) => (
                <S.HeaderCell
                  key={`${date}-${timeText}`}
                  onMouseDown={() => onMouseDown(`${date}T${timeText}`)}
                  onMouseUp={() => onMouseUp()}
                  onMouseMove={() => onMouseEnter(`${date}T${timeText}`)}
                  selectedTimes={selectedTimes}
                  date={date}
                  timeText={timeText}
                >
                  {timeText === 'Dates' && (
                    <Text variant="body" color="text">
                      <Flex direction="column" justify="center" align="center">
                        <div>{date.split('-').slice(1).join('.')}</div>
                        <div>({getDayOfWeek(date)})</div>
                      </Flex>
                    </Text>
                  )}
                </S.HeaderCell>
              ))}
            </Wrapper>
          ))}
        </S.TimetableContent>
      </Flex>
    </Wrapper>
  );
};
export default Timetable;
