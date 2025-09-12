import * as S from './TimeTableCell.styled';
import { useTheme } from '@emotion/react';
import { memo, useMemo } from 'react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
  selectedTimes: Set<string>;
}

const TimeTableCell = memo(
  ({ date, timeText, selectedTimes }: TimeTableCellProps) => {
    const theme = useTheme();

    const dateTimeKey = useMemo(() => `${date}T${timeText}`, [date, timeText]);
    const isSelected = selectedTimes.has(dateTimeKey);

    const backgroundColor = useMemo(() => {
      return isSelected ? theme.colors.primary : theme.colors.gray10;
    }, [isSelected, theme.colors.primary, theme.colors.gray10]);

    return (
      <S.HeaderCell
        backgroundColor={backgroundColor}
        className="selectable"
        data-time={dateTimeKey}
      />
    );
  },
  (prevProps, nextProps) => {
    const prevKey = `${prevProps.date}T${prevProps.timeText}`;
    const nextKey = `${nextProps.date}T${nextProps.timeText}`;

    if (prevKey !== nextKey) return false;

    const prevSelected = prevProps.selectedTimes.has(prevKey);
    const nextSelected = nextProps.selectedTimes.has(nextKey);

    return prevSelected === nextSelected;
  }
);

TimeTableCell.displayName = 'TimeTableCell';

export default TimeTableCell;
