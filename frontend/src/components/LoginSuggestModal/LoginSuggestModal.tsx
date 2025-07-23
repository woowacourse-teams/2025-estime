import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Text from '@/components/Text';
import Flex from '@/components/Layout/Flex';

interface LoginSuggestModalProps {
  target: HTMLDivElement | null;
  isOpen: boolean;
  onClose?: () => void;
  onLoginClick?: () => void;
}

const LoginSuggestModal = ({ target, isOpen, onClose, onLoginClick }: LoginSuggestModalProps) => {
  if (!target) {
    return null;
  }

  return (
    <Modal
      position="inside"
      portalToWhere={target}
      isOpen={isOpen}
      onClose={onClose ?? (() => {})}
      shouldCloseOnOverlayAction={false}
    >
      <Modal.Container size="full">
        <Modal.Header>로그인 제안</Modal.Header>
        <Modal.Content style={{ height: '80%' }}>
          <Flex direction="column" gap="var(--gap-6)" align="center">
            <Text variant="body">서비스를 이용하기 위해 로그인이 필요합니다.</Text>
            <Button color="primary" onClick={onLoginClick}>
              <Text variant="body" color="gray10">
                로그인하기
              </Text>
            </Button>
          </Flex>
        </Modal.Content>
      </Modal.Container>
    </Modal>
  );
};

export default LoginSuggestModal;
