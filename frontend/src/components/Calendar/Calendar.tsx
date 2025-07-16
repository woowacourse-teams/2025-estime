import { useCalender } from '@/hooks/Calendar/useCalender';
import * as S from './Calendar.styled';

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
    <>
      <header>
        <button onClick={prevMonth}>이전</button>
        <span>{current.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}</span>
        <button onClick={nextMonth}>다음</button>
      </header>
      <S.Container>
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
      </S.Container>
    </>
  );
};

export default Calender;
