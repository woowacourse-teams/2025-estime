import getDayState from '@/pages/CreateEvent/utils/Calendar/getDayState';
import * as S from './DayCell.styled';

export interface DayCellProps {
  day: Date | null;
  today: Date;
  selectedDates: Set<string>;
  onMouseDown: (date: Date | null) => void;
  onMouseEnter: (date: Date | null) => void;
  onMouseUp: () => void;
  onTouchStart: (date: Date | null) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

const DayCell = ({
  day,
  today,
  selectedDates,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: DayCellProps) => {
  const dayState = getDayState({ day, today, selectedDates });

  return (
    <S.Container
      data-date={day}
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
      onTouchStart={() => onTouchStart(day)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {dayState.dateString}
    </S.Container>
  );
};

export default DayCell;
