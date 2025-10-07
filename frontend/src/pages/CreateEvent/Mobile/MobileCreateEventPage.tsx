import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import IEstimeLogo from '@/assets/icons/IEstimeLogo';
import IEstimeIcon from '@/assets/icons/IEstimeIcon';
import { useTheme } from '@emotion/react';
import * as S from './MobileCreateEventPage.styled';
import CalendarSettings from '@/pages/CreateEvent/components/CalendarSettings';
import BasicSettings from '@/pages/CreateEvent/components/BasicSettings';
import Modal from '@/shared/components/Modal';
import NotificationModal from '@/pages/CreateEvent/components/NotificationModal';
import useMobileCreateRoomController from '../hooks/useMobileCreateRoomController';

const MobileCreateEventPage = () => {
  const {
    notificationModal,
    checkNotification,
    isValid,
    animation,
    isRoomCreateLoading,
    handler,
    funnel,
  } = useMobileCreateRoomController();

  const { Funnel, step, stepNext, stepPrev } = funnel;
  const theme = useTheme();

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
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <CalendarSettings isValid={isValid.calendar} shouldShake={animation.shake} />

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
                onClick={() => handler.nextStep('calendar')}
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
            <BasicSettings isValid={isValid.basic} shouldShake={animation.shake} />

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
                onClick={() => handler.nextStep('basic')}
                data-ga-id="create-event-button"
                disabled={isRoomCreateLoading}
              >
                <Text variant="button" color="background">
                  {isRoomCreateLoading ? '방 생성 중...' : '방 만들기'}
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Funnel.Step>
      </Funnel>
      <Modal
        isOpen={notificationModal.isOpen}
        onClose={() => notificationModal.setIsOpen(false)}
        position="center"
      >
        <NotificationModal
          notification={checkNotification}
          handleCreateRoom={handler.platformCreateRoom}
          isRoomCreateLoading={isRoomCreateLoading}
        />
      </Modal>
    </Wrapper>
  );
};

export default MobileCreateEventPage;
