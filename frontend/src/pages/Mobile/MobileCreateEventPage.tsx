import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/hooks/useCreateRoom';
import useShakeAnimation from '@/hooks/CreateRoom/useShakeAnimation';
import { useRef, useState } from 'react';
import { useToastContext } from '@/contexts/ToastContext';
import MobileBasicSettings from '@/components/Mobile/MobileBasicSettings';
import MobileCalendarSettings from '@/components/Mobile/MobileCalendarSettings';
import IEstimeLogo from '@/icons/IEstimeLogo';
import { useTheme } from '@emotion/react';
import IEstimeIcon from '@/icons/IEstimeIcon';
import * as S from '../styles/MobileCreateEventPage.styled';

const MobileCreateEventPage = () => {
  //  Todo: funnel 반영하기 (임의로 step 정보)
  const [step, setStep] = useState(1);
  const theme = useTheme();

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

  const handleNextStep = () => {
    if (step === 2 && !isCalendarReady) {
      addToast({
        type: 'warning',
        message: '날짜를 선택해주세요.',
      });
      showValidation.current = true;
      handleShouldShake();
      return;
    }

    if (step === 3) {
      if (!isBasicReady) {
        addToast({
          type: 'warning',
          message: '약속 정보를 입력해주세요.',
        });
        showValidation.current = true;
        handleShouldShake();
        return;
      }
      handleCreateRoom();
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleCreateRoom = async () => {
    const session = await roomInfoSubmit();
    addToast({
      type: 'success',
      message: '방 생성이 완료되었습니다.',
    });

    if (session) {
      navigate(`/check?id=${session}`, { replace: true });
    }
  };

  return (
    <Wrapper maxWidth={430} padding="var(--padding-6)" borderRadius="var(--radius-4)">
      {step === 1 && (
        <Wrapper
          paddingTop="var(--padding-11)"
          paddingLeft="var(--padding-7)"
          paddingRight="var(--padding-7)"
        >
          <Flex direction="column" align="center" justify="space-between" gap="var(--gap-12)">
            <IEstimeLogo color={theme.colors.primary} />
            <S.LogoWrapper>
              <IEstimeIcon color={theme.colors.primary} />
            </S.LogoWrapper>
            <S.ButtonWrapper>
              <Button color="primary" selected={true} onClick={() => setStep((prev) => prev + 1)}>
                <Text variant="h4" color="background">
                  방 만들기
                </Text>
              </Button>
            </S.ButtonWrapper>
          </Flex>
        </Wrapper>
      )}
      {step === 2 && (
        <Flex direction="column" justify="space-between" gap="var(--gap-8)">
          <MobileCalendarSettings
            availableDateSlots={availableDateSlots}
            isValid={!showValidation.current || isCalendarReady}
            shouldShake={shouldShake}
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
            <Button color="primary" selected={true} size="large" onClick={handleNextStep}>
              <Text variant="button" color="background">
                다음
              </Text>
            </Button>
          </Flex>
        </Flex>
      )}

      {step === 3 && (
        <Flex direction="column" justify="space-between" gap="var(--gap-8)">
          <MobileBasicSettings
            title={title}
            time={time}
            deadline={deadline}
            isValid={!showValidation.current || isBasicReady}
            shouldShake={shouldShake}
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
              onClick={handleNextStep}
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
