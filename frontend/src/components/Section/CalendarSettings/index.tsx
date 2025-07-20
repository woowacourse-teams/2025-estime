import Calender from '@/components/Calendar';
import * as S from './CalendarSettings.styled';
import { useState } from 'react';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';
import Text from '@/components/Text';

const CalendarSettings = () => {
  const today = new Date();
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const dateSelection = useDateSelection({ selectedDates, setSelectedDates, today });
  const mouseHandlers = {
    onMouseDown: dateSelection.onMouseDown,
    onMouseEnter: dateSelection.onMouseEnter,
    onMouseUp: dateSelection.onMouseUp,
    onMouseLeave: dateSelection.onMouseLeave,
  };
  return (
    <S.Container>
      <S.TextWrapper>
        <Text variant="h3">날짜 선택</Text>
        <Text variant="body">참여자들에게 드래그 해주세요! 뭐라카노</Text>
      </S.TextWrapper>
      <Calender today={today} selectedDates={selectedDates} mouseHandlers={mouseHandlers} />
    </S.Container>
  );
};

export default CalendarSettings;
