import * as S from '../Timetable.styled';
import { useTimetableHoverContext } from '@/pages/CheckEvent/providers/TimetableProvider';

interface TimeTableCellProps {
  date: string;
  timeText: string;
}

const TimeTableCell = ({ date, timeText }: TimeTableCellProps) => {
  const { timeTableCellHover } = useTimetableHoverContext();

  const dateTimeKey = `${date}T${timeText}`;

  const handleEnter = () => timeTableCellHover(timeText);
  const handleLeave = () => timeTableCellHover(null);

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
