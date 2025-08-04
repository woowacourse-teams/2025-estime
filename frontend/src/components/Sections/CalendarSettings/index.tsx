import Calender from '@/components/Calendar';
import * as S from './CalendarSettings.styled';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';
import Text from '@/components/Text';
import { Field } from '@/types/field';
import { RefObject } from 'react';

type CalendarSettingsProps = {
  availableDateSlots: Field<Set<string>>;
  CalendarRef: RefObject<HTMLDivElement | null>;
  isValid: boolean;
  shouldShake: boolean;
};

const CalendarSettings = ({
  availableDateSlots,
  CalendarRef,
  isValid,
  shouldShake,
}: CalendarSettingsProps) => {
  const today = new Date();
  const dateSelection = useDateSelection({
    selectedDates: availableDateSlots.value,
    setSelectedDates: availableDateSlots.set,
    today,
  });
  const mouseHandlers = {
    onMouseDown: dateSelection.onMouseDown,
    onMouseEnter: dateSelection.onMouseEnter,
    onMouseUp: dateSelection.onMouseUp,
    onMouseLeave: dateSelection.onMouseLeave,
  };

  return (
    <S.Container ref={CalendarRef} isValid={isValid} shouldShake={shouldShake}>
      <S.TextWrapper>
        <Text variant="h3">날짜 선택</Text>
        <Text variant="h4">가능한 날짜를 드래그해서 선택해주세요!</Text>
      </S.TextWrapper>
      <Calender
        today={today}
        selectedDates={availableDateSlots.value}
        mouseHandlers={mouseHandlers}
      />
    </S.Container>
  );
};

export default CalendarSettings;
