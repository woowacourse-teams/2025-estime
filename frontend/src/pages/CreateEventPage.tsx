import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import BasicSettings from '@/components/Sections/BasicSettings';
import CalendarSettings from '@/components/Sections/CalendarSettings';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useNavigate } from 'react-router';
import useCreateRoom from '@/hooks/useCreateRoom';
import Information from '@/components/Information';
import { useTheme } from '@emotion/react';
import IInfo from '@/icons/IInfo';
import useShakeAnimation from '@/hooks/CreateRoom/useShakeAnimation';
import { useRef, useState } from 'react';
import { useToastContext } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import NotificationModal from '@/components/NotificationModal';
import { useEnterKeySubmit } from '@/hooks/useEnterKeySubmit';

const CreateEventPage = () => {
  const [notificationModal, setNotificationModal] = useState(false);
  const showValidation = useRef(false);
  const navigate = useNavigate();
  const { colors } = useTheme();
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
            <Information color="orange30">
              <IInfo color={colors.orange40} />
              <Text variant="h4" color="orange40">
                마감 기한은 약속을 생성한 시점으로부터 1일 뒤까지로 자동 설정되어 있습니다.
              </Text>
            </Information>
            <Flex justify="flex-end">
              <Button
                ref={buttonRef}
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
