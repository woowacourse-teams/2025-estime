import * as S from './TimeTableCell.styled';
import type { Field } from '@/types/field';
import Text from '@/components/Text';
import Flex from '@/components/Layout/Flex';
import { getHeaderCellBackgroundColor } from '@/utils/getBackgroundColor';
import { DateManager } from '@/utils/common/DateManager';
import { useTheme } from '@emotion/react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
  handlers: {
    onMouseDown: (time: string) => void;
    onMouseUp: () => void;
    onMouseEnter: (time: string) => void;
  };
  selectedTimes: Field<Set<string>>;
}
const TimeTableCell = ({ date, timeText, handlers, selectedTimes }: TimeTableCellProps) => {
  const { onMouseDown, onMouseUp, onMouseEnter } = handlers;
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
      onMouseDown={() => onMouseDown(`${date}T${timeText}`)}
      onMouseUp={onMouseUp}
      onMouseMove={() => onMouseEnter(`${date}T${timeText}`)}
      backgroundColor={backgroundColor}
    ></S.HeaderCell>
  );
};

export default TimeTableCell;
