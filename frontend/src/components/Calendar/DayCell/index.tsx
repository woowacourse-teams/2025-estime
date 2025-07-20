import { useDayState } from '@/hooks/Calendar/useDayState';
import * as S from './DayCell.styled';

interface DayCellProps {
  day: Date | null;
  today: Date;
  selectedDates: Set<string>;
  onMouseDown: (date: Date | null) => void;
  onMouseEnter: (date: Date | null) => void;
  onMouseUp: () => void;
}

const DayCell = ({
  day,
  today,
  selectedDates,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: DayCellProps) => {
  const dayState = useDayState({ day, today, selectedDates });

  return (
    <S.DayCell
      isPast={dayState.isPast}
      isSunday={dayState.isSunday}
      isSaturday={dayState.isSaturday}
      isToday={dayState.isToday}
      isSelected={dayState.isSelected}
      isEmpty={dayState.isEmpty}
      onMouseDown={() => onMouseDown(day)}
      onMouseEnter={() => onMouseEnter(day)}
      onMouseUp={onMouseUp}
    >
      {dayState.dateString}
    </S.DayCell>
  );
};

export default DayCell;
