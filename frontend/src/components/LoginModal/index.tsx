import Modal from '@/components/Modal';
import Text from '@/components/Text';
import Input from '@/components/Input';
import IInfo from '@/icons/IInfo';
import Flex from '@/components/Layout/Flex';
import Button from '@/components/Button';
import * as S from './LoginModal.styled';
import Tooltip from '@/components/Tooltip';
import { useTheme } from '@emotion/react';

export interface LoginModalProps {
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  handleModalLogin: () => void;
}
export const LoginModal = ({
  isLoginModalOpen,
  setIsLoginModalOpen,
  handleModalLogin,
}: LoginModalProps) => {
  const theme = useTheme();
  return (
    <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} position="center">
      <Modal.Container>
        <Modal.Header>
          <Flex justify="space-between" align="center" gap="var(--gap-1)">
            <Tooltip content="서비스를 이용하기 위해 로그인이 필요합니다.">
              <Flex align="center" gap="var(--gap-4)">
                <Text variant="h3">로그인</Text>
                <IInfo aria-hidden="true" color={theme.colors.text} />
              </Flex>
            </Tooltip>
          </Flex>
        </Modal.Header>
        <Modal.Content>
          <Flex gap="var(--gap-6)" direction="column">
            <Flex justify="space-between" align="center" gap="var(--gap-6)">
              <Flex.Item flex={1}>
                <S.LoginLabel htmlFor="userid" required>
                  닉네임
                </S.LoginLabel>
              </Flex.Item>
              <Flex.Item flex={4}>
                <Input id="userid" placeholder="아이디를 입력해주세요." autoFocus={true} />
              </Flex.Item>
            </Flex>
            <Flex justify="space-between" align="center" gap="var(--gap-6)">
              <Flex.Item flex={1}>
                <S.LoginLabel htmlFor="user-password">비밀번호(선택)</S.LoginLabel>
              </Flex.Item>
              <Flex.Item flex={4}>
                <Input type="password" id="user-password" placeholder="비밀번호를 입력해주세요." />
              </Flex.Item>
            </Flex>
            <Flex.Item flex={1}>
              <Button color="primary" selected onClick={handleModalLogin}>
                <Text variant="body" color="gray10">
                  저장하고 계속하기
                </Text>
              </Button>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </Modal.Container>
    </Modal>
  );
};

export default LoginModal;
