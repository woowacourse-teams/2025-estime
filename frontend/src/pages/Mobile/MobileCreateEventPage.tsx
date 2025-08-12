import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import BasicSettings from '@/components/Sections/BasicSettings';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/hooks/useCreateRoom';
import { useTheme } from '@emotion/react';
import useShakeAnimation from '@/hooks/CreateRoom/useShakeAnimation';
import { useRef, useState } from 'react';
import { useToastContext } from '@/contexts/ToastContext';
import * as S from './MobileCreateEventPage.styled';
import Calender from '@/components/Calendar';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';

const MobileCreateEventPage = () => {
  //  Todo: funnel 반영하기 (임의로 step 정보)
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const {
    title,
    availableDateSlots,
    time,
    deadline,
    isCalendarReady,
    isBasicReady,
    roomInfoSubmit,
  } = useCreateRoom();

  const { shouldShake, handleShouldShake } = useShakeAnimation();

  const showValidation = useRef(false);

  const { addToast } = useToastContext();

  const handleCreateRoom = async () => {
    if (!isCalendarReady && !isBasicReady) {
      addToast({
        type: 'warning',
        message: '날짜와 약속 정보를 입력해주세요.',
      });
      showValidation.current = true;
      handleShouldShake();
      return;
    }
    if (!isCalendarReady) {
      addToast({
        type: 'warning',
        message: '날짜를 선택해주세요.',
      });
      return;
    }
    if (!isBasicReady) {
      addToast({
        type: 'warning',
        message: '약속 정보를 입력해주세요.',
      });
      return;
    }

    const session = await roomInfoSubmit();
    addToast({
      type: 'success',
      message: '방 생성이 완료되었습니다.',
    });

    if (session) {
      navigate(`/check?id=${session}`, { replace: true });
    }
  };

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
    <Wrapper maxWidth={430} padding="var(--padding-8)">
      {step === 1 && (
        <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
          <Text variant="h3" color="primary">
            약속 만들기
          </Text>
          <Text variant="h4" color="primary">
            약속을 만들고, 친구들과 일정을 조율해보세요.
          </Text>
          <Button
            color="primary"
            selected={true}
            size="small"
            onClick={() => setStep((prev) => prev + 1)}
          >
            다음
          </Button>
        </Flex>
      )}
      {step === 2 && (
        <Flex direction="column" justify="space-between" gap="var(--gap-8)">
          <S.TextWrapper>
            <Text variant="h3">날짜 선택</Text>
            <Text variant="h4">가능한 날짜를 드래그해서 선택해주세요!</Text>
          </S.TextWrapper>
          <Calender
            today={today}
            selectedDates={availableDateSlots.value}
            mouseHandlers={mouseHandlers}
          />
          <Flex justify="space-between" gap="var(--gap-4)">
            <Button
              color="primary"
              selected={false}
              size="large"
              // 이전 단계 돌아가야 함
              onClick={() => setStep((prev) => prev - 1)}
            >
              <Text variant="button" color="primary">
                이전
              </Text>
            </Button>
            <Button
              color="primary"
              selected={true}
              size="large"
              onClick={() => setStep((prev) => prev + 1)}
            >
              <Text variant="button" color="background">
                다음
              </Text>
            </Button>
          </Flex>
        </Flex>
      )}

      {step === 3 && (
        <Flex direction="column" justify="space-between" gap="var(--gap-8)">
          <BasicSettings
            title={title}
            time={time}
            deadline={deadline}
            isValid={!showValidation.current || isBasicReady}
            shouldShake={shouldShake}
          />
          <Flex justify="flex-end">
            <Button
              color="primary"
              selected={false}
              size="small"
              // 이전 단계 돌아가야 함
              onClick={() => setStep((prev) => prev - 1)}
            >
              <Text variant="button" color="background">
                이전
              </Text>
            </Button>
            <Button
              color="primary"
              selected={true}
              size="small"
              onClick={handleCreateRoom}
              data-ga-id="create-event-button"
            >
              <Text variant="button" color="background">
                방 만들기
              </Text>
            </Button>
          </Flex>
        </Flex>
      )}
    </Wrapper>
  );
};

export default MobileCreateEventPage;
