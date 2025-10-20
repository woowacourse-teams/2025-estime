import getDayState from '@/pages/CreateEvent/utils/Calendar/getDayState';
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
  const dayState = getDayState({ day, today, selectedDates });

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
      role={dayState.dateString && 'button'}
      aria-label={
        dayState.isSelected
          ? `${dayState.dateString}일 선택됨`
          : `${dayState.dateString}일 선택 안되어 있음`
      }
      tabIndex={dayState.dateString ? 0 : -1}
    >
      {dayState.dateString}
    </S.Container>
  );
};

export default DayCell;
