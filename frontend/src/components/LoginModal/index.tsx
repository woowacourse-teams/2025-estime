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
import { useEnterKeySubmit } from '@/hooks/useEnterKeySubmit';

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

  const { inputRef } = useEnterKeySubmit({ callback: handleModalLogin });

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
            <Flex align="center" justify="center" gap="var(--gap-6)">
              <Flex.Item flex={1}>
                <S.LoginLabel htmlFor="userid" required>
                  닉네임
                </S.LoginLabel>
              </Flex.Item>
              <Flex.Item flex={4}>
                <Flex direction="column" gap="var(--gap-4)">
                  <Input
                    id="userid"
                    placeholder="닉네임을 입력해주세요."
                    maxLength={12}
                    autoFocus={true}
                    ref={inputRef}
                    onChange={(e) => handleUserData({ ...userData, name: e.target.value })}
                  />
                  <Text
                    variant="caption"
                    color="red40"
                    aria-hidden="true"
                    opacity={userData.name.trim().length === 0}
                  >
                    닉네임을 입력해주세요.
                  </Text>
                </Flex>
              </Flex.Item>
            </Flex>

            <Flex.Item flex={1}>
              <Button
                color={userData.name.trim().length > 0 ? 'primary' : 'plum40'}
                selected={true}
                onClick={handleModalLogin}
                disabled={!userData.name.trim()}
                data-ga-id="submit-button"
              >
                <Text variant="button" color="background">
                  입장하기
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
