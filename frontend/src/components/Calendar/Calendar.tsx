import { useCalender } from '@/hooks/Calendar/useCalender';
import * as S from './Calendar.styled';
import CalendarButton from './CalendarButton/CalendarButton';

interface CalenderProps {
  today: Date;
}

const Calender = ({ today }: CalenderProps) => {
  const { current, prevMonth, nextMonth, matrix } = useCalender(today);

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const isToday = (day: Date | null, today: Date) => {
    if (!day) return false;

    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const isItPast = (day: Date | null) => {
    if (isToday(day, today)) return false;
    if (!day) return false;
    return day < today;
  };

  return (
    <S.Container>
      <S.Header>
        <S.Month>{current.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}</S.Month>
        <S.ButtonContainer>
          <CalendarButton onClick={prevMonth} disabled={current.getMonth() === today.getMonth()}>
            {'<'}
          </CalendarButton>
          <CalendarButton onClick={nextMonth}>{'>'}</CalendarButton>
        </S.ButtonContainer>
      </S.Header>
      <S.CalendarContainer>
        <S.Grid>
          {weekdays.map((w) => (
            <S.Weekday key={w} isSunday={w === '일'} isSaturday={w === '토'}>
              {w}
            </S.Weekday>
          ))}

          {matrix.flat().map((day, i) => (
            <S.DayCell
              key={i}
              past={isItPast(day)}
              isSunday={day?.getDay() === 0}
              isSaturday={day?.getDay() === 6}
              isToday={isToday(day, today)}
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
