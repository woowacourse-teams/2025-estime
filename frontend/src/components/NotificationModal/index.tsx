import Button from '../Button';
import Check from '../Check';
import Flex from '../Layout/Flex';
import Wrapper from '../Layout/Wrapper';
import Modal from '../Modal';
import Text from '../Text';
import * as S from './NotificationModal.styled';

type CheckedNotification = {
  created: boolean;
  remind: boolean;
  deadline: boolean;
};
type OptionId = keyof CheckedNotification;

const NOTIFICATION_DATA = {
  title: '연결된 디스코드 방에\n 알림을 보낼 수 있습니다.',
  options: [
    { id: 'created', label: '방생성' },
    { id: 'remind', label: '독려' },
    { id: 'deadline', label: '마감' },
  ],
} as const satisfies {
  title: string;
  options: readonly { id: OptionId; label: string }[];
};

interface NotificationState {
  value: Record<OptionId, boolean>;
  set: (id: OptionId) => void;
}

interface NotificationModalProps {
  notification: NotificationState;
  handleCreateRoom: () => void;
}
const NotificationModal = ({ notification, handleCreateRoom }: NotificationModalProps) => {
  return (
    <S.NotificationModalContainer>
      <Wrapper>
        <Flex direction="column" gap="var(--gap-7)">
          <Modal.Content>
            <Flex direction="column" gap="var(--gap-7)">
              <Text variant="h3" style={{ whiteSpace: 'pre-wrap' }}>
                {NOTIFICATION_DATA.title}
              </Text>
              <Flex gap="var(--gap-10)" justify="center">
                {NOTIFICATION_DATA.options.map(({ id, label }) => (
                  <Check id={id} key={id}>
                    <Check.Box
                      checked={notification.value[id]}
                      onChange={() => notification.set(id)}
                    />
                    <Check.Label>{label}</Check.Label>
                  </Check>
                ))}
              </Flex>
            </Flex>
          </Modal.Content>
          <Button
            color="primary"
            selected={true}
            size="auto"
            onClick={handleCreateRoom}
            data-ga-id="create-event-button"
          >
            <Text variant="button" color="background">
              방 만들기
            </Text>
          </Button>
        </Flex>
      </Wrapper>
    </S.NotificationModalContainer>
  );
};

export default NotificationModal;
