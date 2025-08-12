import * as S from './TimeTableCell.styled';
import type { Field } from '@/types/field';
import { getHeaderCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
  'data-item': string;
  selectedTimes: Field<Set<string>>;
}

const TimeTableCell = ({
  date,
  timeText,
  'data-item': dataItem,
  selectedTimes,
}: TimeTableCellProps) => {
  const theme = useTheme();

  const backgroundColor = getHeaderCellBackgroundColor({
    selectedTimes: selectedTimes.value,
    date,
    timeText,
    theme,
  });

  return <S.HeaderCell data-item={dataItem} backgroundColor={backgroundColor} />;
};

export default TimeTableCell;
