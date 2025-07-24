import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Text from '@/components/Text';
import Flex from '@/components/Layout/Flex';
import Wrapper from '../Layout/Wrapper';
import IPerson from '@/icons/IPerson';
import { useTheme } from '@emotion/react';

interface LoginSuggestModalProps {
  target: HTMLDivElement | null;
  isOpen: boolean;
  onClose?: () => void;
  onLoginClick?: () => void;
}

const LoginSuggestModal = ({ target, isOpen, onClose, onLoginClick }: LoginSuggestModalProps) => {
  const theme = useTheme();
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
      blur={true}
    >
      <Modal.Container size="85%">
        <Wrapper
          backgroundColor={theme.colors.gray20}
          maxWidth="100%"
          padding="var(--padding-11)"
          borderRadius="var(--radius-4)"
        >
          <Modal.Content>
            <Flex direction="column" gap="var(--gap-6)" align="center">
              <Text variant="h2">로그인하고 내 일정을 등록하세요.</Text>
              <Text variant="body" color="gray50">
                이름과 (선택적으로) 비밀번호를 입력하여 내 응답을 저장하고 나중에 수정할 수
                있습니다.
              </Text>
              <Button color="primary" onClick={onLoginClick} selected size="medium">
                <IPerson color="currentColor" />
                <Text variant="body" color="gray10">
                  정보 입력하기
                </Text>
              </Button>
            </Flex>
          </Modal.Content>
        </Wrapper>
      </Modal.Container>
    </Modal>
  );
};

export default LoginSuggestModal;
