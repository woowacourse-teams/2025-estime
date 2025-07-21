import * as S from './Calendar.styled';
import { weekdays } from '@/constants/calender';
import { isItCurrentMonth } from '@/utils/Calendar/dateUtils';
import { useCalender } from '@/hooks/Calendar/useCalender';

import CalendarButton from './CalendarButton/CalendarButton';
import DayCell from './DayCell';
import Text from '@/components/Text';
import IChevronLeft from '@/icons/IChevronLeft';
import IChevronRight from '@/icons/IChevronRight';

interface CalenderProps {
  today: Date;
  selectedDates: Set<string>;
  mouseHandlers: {
    onMouseDown: (date: Date | null) => void;
    onMouseEnter: (date: Date | null) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };
}

const Calender = ({ today, selectedDates, mouseHandlers }: CalenderProps) => {
  const { current, prevMonth, nextMonth, monthMatrix } = useCalender(today);
  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = mouseHandlers;
  return (
    <S.Container>
      <S.Header>
        <Text variant="h2">
          {current.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}
        </Text>
        <S.ButtonContainer>
          <CalendarButton onClick={prevMonth} disabled={isItCurrentMonth(current, today)}>
            <IChevronLeft width={20} height={20} />
          </CalendarButton>
          <CalendarButton onClick={nextMonth}>
            <IChevronRight width={20} height={20} />
          </CalendarButton>
        </S.ButtonContainer>
      </S.Header>
      <S.CalendarContainer>
        <S.Grid onMouseLeave={onMouseLeave}>
          {weekdays.map((w) => (
            <S.Weekday key={w} isSunday={w === '일'} isSaturday={w === '토'}>
              {w}
            </S.Weekday>
          ))}

          {monthMatrix.flat().map((day, i) => (
            <DayCell
              key={i}
              day={day}
              today={today}
              selectedDates={selectedDates}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </S.Grid>
      </S.CalendarContainer>
    </S.Container>
  );
};

export default Calender;
