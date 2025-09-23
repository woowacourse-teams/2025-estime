import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/pages/CreateEvent/hooks/useCreateRoom';
import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import { useRef, useState } from 'react';
import IEstimeLogo from '@/assets/icons/IEstimeLogo';
import { useTheme } from '@emotion/react';
import IEstimeIcon from '@/assets/icons/IEstimeIcon';
import * as S from './MobileCreateEventPage.styled';
import CalendarSettings from '@/pages/CreateEvent/components/CalendarSettings';
import BasicSettings from '@/pages/CreateEvent/components/BasicSettings';
import useFunnelWithHistory from '@/shared/hooks/Funnel/useFunnelWithHistory';
import Modal from '@/shared/components/Modal';
import NotificationModal from '@/pages/CreateEvent/components/NotificationModal';
import { showToast } from '@/shared/store/toastStore';

const STEP = ['메인 화면', '캘린더 선택 화면', '제목 및 시간 선택 화면'] as const;

const MobileCreateEventPage = () => {
  const [notificationModal, setNotificationModal] = useState(false);
  const showValidation = useRef({
    calendar: false,
    rest: false,
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const { Funnel, step, stepNext, stepPrev } = useFunnelWithHistory(STEP);
  const {
    platformType,
    title,
    availableDateSlots,
    time,
    deadline,
    notification,
    isCalendarReady,
    isBasicReady,
    roomInfoSubmit,
  } = useCreateRoom();
  const { shouldShake, handleShouldShake } = useShakeAnimation();

  const handleNextStep = async (type: 'calendar' | 'rest') => {
    if (type === 'calendar') {
      if (!isCalendarReady) {
        showToast({ type: 'warning', message: '날짜를 선택해주세요.' });
        showValidation.current.calendar = true;
        handleShouldShake();
        return; // 유효하지 않으면 종료
      }
      stepNext();
      return;
    }

    if (type === 'rest') {
      if (!isBasicReady) {
        showToast({ type: 'warning', message: '약속 정보를 입력해주세요.' });
        showValidation.current.rest = true;
        handleShouldShake();
        return;
      }
      await handleCreateRoom(); // 최종 단계는 생성으로 종료
      return;
    }
  };

  const onSubmitSuccess = (session: string) => {
    showToast({ type: 'success', message: '방 생성이 완료되었습니다.' });
    navigate(`/check?id=${session}`, { replace: true });
  };

  //  실제 제출
  const submitAndNavigate = async () => {
    const session = await roomInfoSubmit();
    if (session) onSubmitSuccess(session);
  };

  // 메인 버튼 핸들러
  const handleCreateRoom = async () => {
    // 디스코드 연동이면 모달 오픈 후 모달에서 최종 제출
    if (platformType) {
      setNotificationModal(true);
      return;
    }

    // 일반 생성 플로우
    await submitAndNavigate();
  };

  // 디스코드 핸들러
  const handleDiscordCreateRoom = async () => {
    await submitAndNavigate();
    setNotificationModal(false);
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
              isValid={!showValidation.current.calendar || isCalendarReady}
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
                onClick={() => handleNextStep('calendar')}
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
              isValid={!showValidation.current.rest || isBasicReady}
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
                onClick={() => handleNextStep('rest')}
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
      <Modal
        isOpen={notificationModal}
        onClose={() => setNotificationModal(false)}
        position="center"
      >
        <NotificationModal notification={notification} handleCreateRoom={handleDiscordCreateRoom} />
      </Modal>
    </Wrapper>
  );
};

export default MobileCreateEventPage;
