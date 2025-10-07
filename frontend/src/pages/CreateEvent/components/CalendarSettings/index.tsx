import Calender from '../Calendar';
import * as S from './CalendarSettings.styled';
import Text from '@/shared/components/Text';

type CalendarSettingsProps = {
  isValid: boolean;
  shouldShake: boolean;
};

const CalendarSettings = ({ isValid, shouldShake }: CalendarSettingsProps) => {
  return (
    <S.Container isValid={isValid} shouldShake={shouldShake}>
      <S.TextWrapper>
        <Text variant="h3">날짜 선택</Text>
        <Text variant="h4">가능한 날짜를 드래그해서 선택해주세요!</Text>
      </S.TextWrapper>
      <Calender />
    </S.Container>
  );
};

export default CalendarSettings;
