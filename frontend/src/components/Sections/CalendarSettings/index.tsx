import Calender from '@/components/Calendar';
import * as S from './CalendarSettings.styled';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';
import Text from '@/components/Text';
import type { Field } from '@/types/field';

type CalendarSettingsProps = {
  availableDates: Field<Set<string>>;
};

const CalendarSettings = ({ availableDates }: CalendarSettingsProps) => {
  const today = new Date();
  const dateSelection = useDateSelection({
    selectedDates: availableDates.value,
    setSelectedDates: availableDates.set,
    today,
  });
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
        <Text variant="body">가능한 날짜를 드래그해서 선택해주세요!</Text>
      </S.TextWrapper>
      <Calender today={today} selectedDates={availableDates.value} mouseHandlers={mouseHandlers} />
    </S.Container>
  );
};

export default CalendarSettings;
