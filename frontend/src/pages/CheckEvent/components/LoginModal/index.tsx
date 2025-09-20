import Modal from '@/shared/components/Modal';
import Text from '@/shared/components/Text';
import Input from '@/shared/components/Input';
import Flex from '@/shared/layout/Flex';
import Button from '@/shared/components/Button';
import * as S from './LoginModal.styled';
import type { LoginData } from '../../hooks/useUserLogin';
import useEnterKeySubmit from '@/shared/hooks/common/useEnterKeySubmit';

export interface LoginModalProps {
  isLoginModalOpen: boolean;
  handleCloseLoginModal: () => void;
  handleModalLogin: () => void;
  userData: LoginData;
  handleUserData: (data: LoginData) => void;
  isUserLoginLoading: boolean;
}
export const LoginModal = ({
  isLoginModalOpen,
  handleCloseLoginModal,
  handleModalLogin,
  userData,
  handleUserData,
  isUserLoginLoading,
}: LoginModalProps) => {
  const { inputRef } = useEnterKeySubmit({ callback: handleModalLogin });

  return (
    <Modal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} position="center">
      <S.LoginModalContainer>
        <Modal.Content>
          <S.LoginModalHeader>
            <Text variant="h3">정보 입력</Text>
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
                    data-autofocus
                    value={userData.name}
                    onChange={(e) => handleUserData({ ...userData, name: e.target.value.trim() })}
                    onPaste={(e) => {
                      const text = e.clipboardData.getData('text');
                      e.preventDefault();
                      // https://stackoverflow.com/a/45421387
                      const trimmedText = text.split(' ').join('');
                      handleUserData({ ...userData, name: trimmedText });
                    }}
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
                disabled={!userData.name.trim() || isUserLoginLoading}
                data-ga-id="submit-button"
              >
                <Text variant="button" color="background">
                  {isUserLoginLoading ? '입장 중...' : '입장하기'}
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
