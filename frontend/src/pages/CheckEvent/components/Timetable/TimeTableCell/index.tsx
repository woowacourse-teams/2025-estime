import * as S from './TimeTableCell.styled';
import { useTheme } from '@emotion/react';
import { memo } from 'react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
  selectedTimes: Set<string>;
}

const TimeTableCell = ({ date, timeText, selectedTimes }: TimeTableCellProps) => {
  const theme = useTheme();

  const dateTimeKey = `${date}T${timeText}`;
  const isSelected = selectedTimes.has(dateTimeKey);

  const backgroundColor = isSelected ? theme.colors.primary : theme.colors.gray10;

  return (
    <S.HeaderCell
      backgroundColor={backgroundColor}
      className="selectable"
      data-time={dateTimeKey}
    />
  );
};

const areEqual = (prevProps: TimeTableCellProps, nextProps: TimeTableCellProps) => {
  const prevKey = `${prevProps.date}T${prevProps.timeText}`;
  const nextKey = `${nextProps.date}T${nextProps.timeText}`;

  if (prevKey !== nextKey) return false;

  const prevSelected = prevProps.selectedTimes.has(prevKey);
  const nextSelected = nextProps.selectedTimes.has(nextKey);

  return prevSelected === nextSelected;
};

export default memo(TimeTableCell, areEqual);
