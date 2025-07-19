import Text from '@/components/Text';
import * as S from './BasicSettings.styled';
import Input from '@/components/Input';
import Button from '@/components/Button';
import TimePicker from '@/components/Timepicker';
import useTimePicker from '@/hooks/useTimePicker';
import useSelectTime from '@/hooks/useSelectTime';

//Todo: 페이지에서 상태를 내려줄 경우
interface BasicSettingsProps {}

const BasicSettings = ({}: BasicSettingsProps) => {
  const { isOpen: isStartOpen, toggleOpen: toggleStartOpen } = useTimePicker();

  const { isOpen: isEndOpen, toggleOpen: toggleEndOpen } = useTimePicker();

  const {
    startTime,
    endTime,
    selectedButtons,
    showCustomTime,
    handleDayNightButtonClick,
    handleCustomButtonClick,
    handleCustomStartClick,
    handleCustomEndClick,
  } = useSelectTime();
  return (
    <S.Container>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">방 제목</Text>
          <Text variant="body">참여자들에게 표시될 방의 제목을 입력해주세요.</Text>
        </S.TextWrapper>
        <S.InputWrapper>
          <Input placeholder="예: 1팀 7월 정기 회의" />
        </S.InputWrapper>
      </S.InfoWrapper>
      <S.InfoWrapper>
        <S.TextWrapper>
          <Text variant="h3">시간 선택</Text>
          <Text variant="body">참여자가 선택할 수 있는 시간의 범위를 설정합니다.</Text>
        </S.TextWrapper>
        <S.ButtonWrapper>
          <Button
            color="orange40"
            onClick={() => handleDayNightButtonClick('day')}
            selected={selectedButtons.includes('day')}
          >
            <S.ImageWrapper color="secondary">
              <img src="/sun.svg" alt="sun" />
            </S.ImageWrapper>
            <Text
              variant="button"
              color={selectedButtons.includes('day') ? 'background' : 'secondary'}
            >
              9~18시
            </Text>
          </Button>
          <Button
            color="primary"
            onClick={() => handleDayNightButtonClick('night')}
            selected={selectedButtons.includes('night')}
          >
            <S.ImageWrapper color="primary">
              <img src="/moon.svg" alt="moon" />
            </S.ImageWrapper>

            <Text
              variant="button"
              color={selectedButtons.includes('night') ? 'background' : 'primary'}
            >
              18~24시
            </Text>
          </Button>
          <Button
            color="primary"
            onClick={handleCustomButtonClick}
            selected={selectedButtons.includes('custom')}
          >
            <Text
              variant="button"
              color={selectedButtons.includes('custom') ? 'background' : 'primary'}
            >
              커스텀
            </Text>
          </Button>
        </S.ButtonWrapper>

        {showCustomTime && (
          <S.CustomTimeWrapper selected={selectedButtons}>
            <S.Label>
              <Text variant="body">시작 시간</Text>
              <TimePicker
                selectedHour={startTime}
                selectHour={handleCustomStartClick}
                toggleOpen={toggleStartOpen}
                isOpen={isStartOpen}
              />
            </S.Label>
            <S.Label>
              <Text variant="body">종료 시간</Text>
              <TimePicker
                selectedHour={endTime}
                selectHour={handleCustomEndClick}
                toggleOpen={toggleEndOpen}
                isOpen={isEndOpen}
              />
            </S.Label>
          </S.CustomTimeWrapper>
        )}
      </S.InfoWrapper>
    </S.Container>
  );
};

export default BasicSettings;
