import { RefObject } from 'react';
import * as S from '../Timetable.styled';
import { HoveredTimeRef } from '@/pages/CheckEvent/types/hoveredTimeRef';

interface TimeTableCellProps {
  date: string;
  timeText: string;
  hoveredTimeRef: RefObject<HoveredTimeRef>;
}

const TimeTableCell = ({ date, timeText, hoveredTimeRef }: TimeTableCellProps) => {
  const dateTimeKey = `${date}T${timeText}`;

  const handleEnter = () => {
    hoveredTimeRef.current.current = timeText;
    hoveredTimeRef.current.update?.(timeText);
  };

  const handleLeave = () => {
    hoveredTimeRef.current.current = null;
    hoveredTimeRef.current.update?.(null);
  };

  return (
    <S.TimetableCell
      className="heat-map-cell"
      data-time={dateTimeKey}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    />
  );
};

export default TimeTableCell;
