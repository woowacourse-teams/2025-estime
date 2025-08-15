import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/hooks/useCreateRoom';
import useShakeAnimation from '@/hooks/CreateRoom/useShakeAnimation';
import { useRef } from 'react';
import { useToastContext } from '@/contexts/ToastContext';
import IEstimeLogo from '@/icons/IEstimeLogo';
import { useTheme } from '@emotion/react';
import IEstimeIcon from '@/icons/IEstimeIcon';
import * as S from '../styles/MobileCreateEventPage.styled';
import CalendarSettings from '@/components/Sections/CalendarSettings';
import BasicSettings from '@/components/Sections/BasicSettings';
import useFunnelWithHistory from '@/hooks/common/Funnel/useFunnelWithHistory';

const MobileCreateEventPage = () => {
  const theme = useTheme();
  const { Funnel, step, stepNext, stepPrev } = useFunnelWithHistory([
    '메인 화면',
    '캘린더 선택 화면',
    '제목 및 시간 선택 화면',
  ]);

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
    const session = await roomInfoSubmit();
    if (session) {
      addToast({
        type: 'success',
        message: '방 생성이 완료되었습니다.',
      });
      navigate(`/check?id=${session}`, { replace: true });
    }
  };

  return (
    <Wrapper maxWidth={430} padding="var(--padding-6)" borderRadius="var(--radius-4)">
      <Funnel step={step}>
        <Funnel.Step name="메인 화면">
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
                <Button color="primary" selected={true} onClick={stepNext}>
                  <Text variant="h4" color="background">
                    방 만들기
                  </Text>
                </Button>
              </S.ButtonWrapper>
            </Flex>
          </Wrapper>
        </Funnel.Step>

        <Funnel.Step name="캘린더 선택 화면">
          {' '}
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <CalendarSettings
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
                onClick={stepPrev}
              >
                <Text variant="button" color="primary">
                  이전
                </Text>
              </Button>
              <Button
                color="primary"
                selected={true}
                size="large"
                onClick={() => {
                  if (!isCalendarReady) {
                    addToast({
                      type: 'warning',
                      message: '날짜를 선택해주세요.',
                    });
                    showValidation.current = true;
                    handleShouldShake();
                    return;
                  }
                  stepNext();
                }}
              >
                <Text variant="button" color="background">
                  다음
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Funnel.Step>

        <Funnel.Step name="제목 및 시간 선택 화면">
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <BasicSettings
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
                onClick={stepPrev}
              >
                <Text variant="button" color="primary">
                  이전
                </Text>
              </Button>
              <Button
                color="primary"
                selected={true}
                size="large"
                onClick={async () => {
                  if (!isBasicReady) {
                    addToast({
                      type: 'warning',
                      message: '약속 정보를 입력해주세요.',
                    });
                    showValidation.current = true;
                    handleShouldShake();
                    return;
                  }
                  await handleCreateRoom();
                }}
                data-ga-id="create-event-button"
              >
                <Text variant="button" color="background">
                  방 만들기
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Funnel.Step>
      </Funnel>
    </Wrapper>
  );
};

export default MobileCreateEventPage;
