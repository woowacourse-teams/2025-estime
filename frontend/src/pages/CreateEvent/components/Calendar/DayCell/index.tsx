import getDayState from '@/pages/CreateEvent/utils/Calendar/getDayState';
import * as S from './DayCell.styled';

export interface DayCellProps {
  day: Date | null;
  today: Date;
  selectedDates: Set<string>;
  onPointerDown: (date: Date | null) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>, date: Date | null) => void;
  onPointerUp: () => void;
}

const DayCell = ({
  day,
  today,
  selectedDates,
  onPointerDown,
  onPointerMove,
  onPointerUp,
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
      onPointerDown={() => onPointerDown(day)}
      onPointerMove={(e) => onPointerMove(e, day)}
      onPointerUp={onPointerUp}
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
