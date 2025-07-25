import Modal from '@/components/Modal';
import Text from '@/components/Text';
import Input from '@/components/Input';
import IInfo from '@/icons/IInfo';
import Flex from '@/components/Layout/Flex';
import Button from '@/components/Button';
import * as S from './LoginModal.styled';
import Tooltip from '@/components/Tooltip';
import { useTheme } from '@emotion/react';
import type { LoginData } from '@/hooks/Login/useUserLogin';

export interface LoginModalProps {
  isLoginModalOpen: boolean;
  handleCloseLoginModal: () => void;
  handleModalLogin: () => void;
  userData: LoginData;
  handleUserData: (data: LoginData) => void;
}
export const LoginModal = ({
  isLoginModalOpen,
  handleCloseLoginModal,
  handleModalLogin,
  userData,
  handleUserData,
}: LoginModalProps) => {
  const theme = useTheme();
  return (
    <Modal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} position="center">
      <S.LoginModalContainer>
        <Modal.Content>
          <S.LoginModalHeader>
            <Flex justify="space-between" align="center" gap="var(--gap-2)">
              <Tooltip content="서비스를 이용하기 위해 로그인이 필요합니다.">
                <Flex align="center" gap="var(--gap-4)">
                  <Text variant="h3">로그인</Text>
                  <IInfo aria-hidden="true" color={theme.colors.text} />
                </Flex>
              </Tooltip>
            </Flex>
          </S.LoginModalHeader>

          <Flex gap="var(--gap-6)" direction="column">
            <Flex justify="space-between" align="center" gap="var(--gap-6)">
              <Flex.Item flex={1}>
                <S.LoginLabel htmlFor="userid" required>
                  닉네임
                </S.LoginLabel>
              </Flex.Item>
              <Flex.Item flex={4}>
                <Flex direction="column" gap="var(--gap-2)">
                  <Input
                    id="userid"
                    placeholder="아이디를 입력해주세요."
                    maxLength={12}
                    autoFocus={true}
                    onChange={(e) => handleUserData({ ...userData, name: e.target.value })}
                  />
                  <Text variant="caption" color="red40" aria-hidden="true">
                    {userData.name.trim().length === 0 && '아이디를 입력해주세요.'}
                  </Text>
                </Flex>
              </Flex.Item>
            </Flex>
            <Flex justify="space-between" align="center" gap="var(--gap-6)">
              <Flex.Item flex={1}>
                <S.LoginLabel htmlFor="user-password">비밀번호(선택)</S.LoginLabel>
              </Flex.Item>
              <Flex.Item flex={4}>
                <Input
                  type="password"
                  id="user-password"
                  maxLength={8}
                  placeholder="비밀번호를 입력해주세요."
                  onChange={(e) => handleUserData({ ...userData, password: e.target.value })}
                />
              </Flex.Item>
            </Flex>
            <Flex.Item flex={1}>
              <Button
                color={userData.name.trim().length > 0 ? 'primary' : 'plum40'}
                selected={true}
                onClick={handleModalLogin}
                disabled={!userData.name.trim()}
              >
                <Text variant="button" color="background">
                  저장하고 계속하기
                </Text>
              </Button>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </S.LoginModalContainer>
    </Modal>
  );
};

export default LoginModal;
