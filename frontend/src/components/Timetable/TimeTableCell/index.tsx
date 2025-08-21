import * as S from './TimeTableCell.styled';
import type { Field } from '@/types/field';
import { getHeaderCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
  selectedTimes: Field<Set<string>>;
}
const TimeTableCell = ({ date, timeText, selectedTimes }: TimeTableCellProps) => {
  const theme = useTheme();

  const backgroundColor = getHeaderCellBackgroundColor({
    selectedTimes: selectedTimes.value,
    date,
    timeText,
    theme,
  });
  return (
    <S.HeaderCell
      key={`${date} ${timeText}`}
      backgroundColor={backgroundColor}
      className="selectable"
      data-time={`${date}T${timeText}`}
    ></S.HeaderCell>
  );
};

export default TimeTableCell;
