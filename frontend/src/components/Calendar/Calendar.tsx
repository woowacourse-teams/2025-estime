import { useCalender } from '@/hooks/Calendar/useCalender';
import * as Styled from './Calendar.styled';

export default function Calender() {
  const { current, prevMonth, nextMonth, matrix } = useCalender();

  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

  const isItPast = (day: Date | null) => {
    if (!day) return false;
    const today = new Date();
    return day < today;
  };

  return (
    <>
      <header>
        <button onClick={prevMonth}>이전</button>
        <span>{current.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}</span>
        <button onClick={nextMonth}>다음</button>
      </header>

      <Styled.Grid>
        {weekdays.map((w) => (
          <Styled.Weekday key={w}>{w}</Styled.Weekday>
        ))}

        {matrix.flat().map((day, i) => (
          <Styled.DayCell key={i} dimmed={isItPast(day)}>
            {day ? day.getDate() : ''}
          </Styled.DayCell>
        ))}
      </Styled.Grid>
    </>
  );
}
