import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import BasicSettings from '@/pages/CreateEvent/components/BasicSettings';
import CalendarSettings from '@/pages/CreateEvent/components/CalendarSettings';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/pages/CreateEvent/hooks/useCreateRoom';
import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import { useRef, useState } from 'react';
import { useToastContext } from '@/shared/contexts/ToastContext';
import Modal from '@/shared/components/Modal';
import NotificationModal from '@/pages/CreateEvent/components/NotificationModal';
import useEnterKeySubmit from '@/shared/hooks/common/useEnterKeySubmit';

const CreateEventPage = () => {
  const [notificationModal, setNotificationModal] = useState(false);

  const isRoutingRef = useRef(false);
  let isRouting = isRoutingRef.current;

  const showValidation = useRef(false);
  const navigate = useNavigate();
  const { addToast } = useToastContext();
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
    isCreateRoomLoading,
  } = useCreateRoom();
  const { shouldShake, handleShouldShake } = useShakeAnimation();

  const handleValidation = () => {
    if (!isCalendarReady && !isBasicReady) {
      addToast({
        type: 'warning',
        message: '날짜와 약속 정보를 입력해주세요.',
      });
      showValidation.current = true;
      handleShouldShake();
      return false;
    }
    if (!isCalendarReady) {
      addToast({
        type: 'warning',
        message: '날짜를 선택해주세요.',
      });
      showValidation.current = true;
      handleShouldShake();
      return false;
    }
    if (!isBasicReady) {
      addToast({
        type: 'warning',
        message: '약속 정보를 입력해주세요.',
      });
      showValidation.current = true;
      handleShouldShake();
      return false;
    }
    return true;
  };

  const onSubmitSuccess = (session: string) => {
    addToast({ type: 'success', message: '방 생성이 완료되었습니다.' });
    navigate(`/check?id=${session}`, { replace: true });
  };

  //  실제 제출
  const submitAndNavigate = async () => {
    const session = await roomInfoSubmit();
    isRoutingRef.current = true;
    if (session) onSubmitSuccess(session);
  };

  // 메인 버튼 핸들러
  const handleCreateRoom = async () => {
    // 입력 검증
    if (!handleValidation()) return;

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

  const { buttonRef } = useEnterKeySubmit({ callback: handleCreateRoom });

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex justify="space-between" gap="var(--gap-9)">
        <Flex.Item flex={1}>
          <CalendarSettings
            availableDateSlots={availableDateSlots}
            isValid={!showValidation.current || isCalendarReady}
            shouldShake={shouldShake}
          />
        </Flex.Item>
        <Flex.Item flex={1}>
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
                ref={buttonRef}
                color="primary"
                selected={true}
                size="small"
                onClick={handleCreateRoom}
                data-ga-id="create-event-button"
                disabled={isCreateRoomLoading || isRouting}
              >
                <Text variant="button" color="background">
                  {isCreateRoomLoading || isRouting ? '생성 중...' : '방 만들기'}
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Flex.Item>
      </Flex>
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

export default CreateEventPage;
