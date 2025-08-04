import { useDayState } from '@/hooks/Calendar/useDayState';
import * as S from './DayCell.styled';

export interface DayCellProps {
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
    <S.Container
      isPast={dayState.isPast}
      isSunday={dayState.isSunday}
      isSaturday={dayState.isSaturday}
      isToday={dayState.isToday}
      isSelected={dayState.isSelected}
      isEmpty={dayState.isEmpty}
      isDateBlockedByLimit={dayState.isDateBlockedByLimit}
      onMouseDown={() => onMouseDown(day)}
      onMouseEnter={() => onMouseEnter(day)}
      onMouseUp={onMouseUp}
    >
      {dayState.dateString}
    </S.Container>
  );
};

export default DayCell;
