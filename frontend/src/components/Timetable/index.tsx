import Flex from '../Layout/Flex';
import Wrapper from '../Layout/Wrapper';
import { useState } from 'react';
import useTimeSelection from '@/hooks/TimeTable/useTimeSelection';
import { useTheme } from '@emotion/react';
import Text from '../Text';
import { getDayOfWeek } from '@/utils/Calendar/getDayofWeek';
import * as S from './Timetable.styled';
import generateTimeList from '@/utils/Calendar/generateTimeList';

const response = {
  title: 'Bether 스터디',
  availableDates: ['2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19'],
  startTime: '09:00',
  endTime: '18:00',
  deadLine: '2026-07-15T10:00',
  isPublic: true,
  roomSession: '4d1f3a7e-6b8c-4d9a-9e0b-2f7c1a5b9d8e',
};

const startTime = response.startTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
const endTime = response.endTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
const interval = 30;

const timeList = [
  { timeText: 'Dates', isHour: false },
  ...generateTimeList({ startTime, endTime, interval }),
];
const Timetable = () => {
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());

  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = useTimeSelection({
    selectedTimes,
    setSelectedTimes,
    time: '',
  });

  const theme = useTheme();

  return (
    <Flex justify="center">
      <Wrapper maxWidth={600}>
        {timeList.map(({ timeText, isHour }) => (
          <S.GridContainer key={timeText} availableDates={response.availableDates.length}>
            <S.TimeLabel isHour={isHour}>
              <Text variant="body">{isHour ? timeText : ''}</Text>
            </S.TimeLabel>
            {response.availableDates.map((date) => (
              <S.HeaderCell
                key={`${date}-${timeText}`}
                onMouseDown={() => onMouseDown(`${date} ${timeText}`)}
                // onMouseEnter={() => onMouseEnter(`${date} ${timeText}`)}
                onMouseUp={() => onMouseUp()}
                // onMouseLeave={() => onMouseLeave()}
                selectedTimes={selectedTimes}
                date={date}
                timeText={timeText}
              >
                {timeText === 'Dates' && (
                  <Text variant="body">
                    <Flex direction="column" justify="center" align="center">
                      <div>{date.split('-').slice(1).join('.')}</div>
                      <div>({getDayOfWeek(date)})</div>
                    </Flex>
                  </Text>
                )}
              </S.HeaderCell>
            ))}
          </S.GridContainer>
        ))}
      </Wrapper>
    </Flex>
  );
};
export default Timetable;
