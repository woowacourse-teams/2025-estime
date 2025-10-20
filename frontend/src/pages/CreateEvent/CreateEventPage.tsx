import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import Text from '@/shared/components/Text';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import NotificationModal from '@/pages/CreateEvent/components/NotificationModal';
import CalendarSettings from '@/pages/CreateEvent/components/CalendarSettings';
import BasicSettings from '@/pages/CreateEvent/components/BasicSettings';
import useCreateRoomController from '@/pages/CreateEvent/hooks/useCreateRoomController';

const CreateEventPage = () => {
  const {
    notificationModal,
    checkNotification,
    isValid,
    animation,
    submitButtonRef,
    isRoomCreateLoading,
    handler,
  } = useCreateRoomController();

  return (
    <Wrapper
      maxWidth={1280}
      paddingTop="var(--padding-10)"
      paddingBottom="var(--padding-10)"
      fullHeight
    >
      <Flex justify="space-between" gap="var(--gap-10)">
        <Flex.Item flex={1}>
          <CalendarSettings isValid={isValid.calendar} shouldShake={animation.shake} />
        </Flex.Item>
        <Flex.Item flex={1}>
          <Flex direction="column" justify="space-between" gap="var(--gap-6)">
            <BasicSettings isValid={isValid.basic} shouldShake={animation.shake} />
            <Flex justify="flex-end">
              <Button
                ref={submitButtonRef}
                color="primary"
                selected={true}
                size="small"
                onClick={handler.createRoom}
                data-ga-id="create-event-button"
                disabled={isRoomCreateLoading}
              >
                <Text variant="button" color="background">
                  {isRoomCreateLoading ? '생성 중...' : '약속 만들기'}
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Flex.Item>
      </Flex>
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

export default CreateEventPage;
