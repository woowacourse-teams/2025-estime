import * as S from './Calendar.styled';
import { weekdays } from '@/constants/calender';
import { isItCurrentMonth, isItPast, isToday } from '@/utils/Calendar/dateUtils';
import { formatDateToString } from '@/utils/Calendar/format';
import { useCalender } from '@/hooks/Calendar/useCalender';

import CalendarButton from './CalendarButton/CalendarButton';
import Text from '@/components/Text';

interface CalenderProps {
  today: Date;
  selectedDates: Set<string>;
  handleMouseDown: (date: Date | null) => void;
  handleMouseEnter: (date: Date | null) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

const Calender = ({
  today,
  selectedDates,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  handleMouseLeave,
}: CalenderProps) => {
  const { current, prevMonth, nextMonth, matrix } = useCalender(today);

  return (
    <S.Container>
      <S.Header>
        <Text variant="h2">
          {current.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}
        </Text>
        <S.ButtonContainer>
          <CalendarButton onClick={prevMonth} disabled={isItCurrentMonth(current, today)}>
            <Text variant="body" color="gray90">
              {'<'}
            </Text>
          </CalendarButton>
          <CalendarButton onClick={nextMonth}>
            <Text variant="body" color="gray90">
              {'>'}
            </Text>
          </CalendarButton>
        </S.ButtonContainer>
      </S.Header>
      <S.CalendarContainer>
        <S.Grid onMouseLeave={handleMouseLeave}>
          {weekdays.map((w) => (
            <S.Weekday key={w} isSunday={w === '일'} isSaturday={w === '토'}>
              {w}
            </S.Weekday>
          ))}

          {matrix.flat().map((day, i) => (
            <S.DayCell
              key={i}
              isPast={isItPast(day, today)}
              isSunday={day?.getDay() === 0}
              isSaturday={day?.getDay() === 6}
              isToday={isToday(day, today)}
              isSelected={day ? selectedDates.has(formatDateToString(day)) : false}
              isEmpty={!day}
              onMouseDown={() => handleMouseDown(day)}
              onMouseEnter={() => handleMouseEnter(day)}
              onMouseUp={handleMouseUp}
            >
              {day ? day.getDate() : ''}
            </S.DayCell>
          ))}
        </S.Grid>
      </S.CalendarContainer>
    </S.Container>
  );
};

export default Calender;
