import Calender from '@/pages/CreateEvent/components/Calendar';
import * as S from './CalendarSettings.styled';
import { useDateSelection } from '@/pages/CreateEvent/hooks/Calendar/useDateSelection';
import Text from '@/shared/components/Text';
import type { Field } from '@/pages/CreateEvent/types/field';

type CalendarSettingsProps = {
  availableDateSlots: Field<Set<string>>;
  isValid: boolean;
  shouldShake: boolean;
};

const CalendarSettings = ({ availableDateSlots, isValid, shouldShake }: CalendarSettingsProps) => {
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
    <S.Container isValid={isValid} shouldShake={shouldShake}>
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
