import Modal from '@/shared/components/Modal';
import Text from '@/shared/components/Text';
import Input from '@/shared/components/Input';
import Flex from '@/shared/layout/Flex';
import Button from '@/shared/components/Button';
import * as S from './LoginModal.styled';
import useEnterKeySubmit from '@/shared/hooks/common/useEnterKeySubmit';
import { useUserName, userNameStore } from '../../stores/userNameStore';

export interface LoginModalProps {
  handleModalLogin: () => void;
  isLoginLoading: boolean;
}
export const LoginModal = ({ handleModalLogin, isLoginLoading }: LoginModalProps) => {
  const { inputRef } = useEnterKeySubmit({ callback: handleModalLogin });

  const name = useUserName();

  return (
    <S.LoginModalContainer>
      <Modal.Content>
        <S.LoginModalHeader>
          <Text variant="h3">정보 입력</Text>
        </S.LoginModalHeader>

        <Flex gap="var(--gap-6)" direction="column">
          <Flex align="center" justify="center" gap="var(--gap-6)">
            <Flex.Item flex={1}>
              <S.LoginLabel htmlFor="userid" required>
                <Text color="gray40">닉네임</Text>
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
                  value={name}
                  onChange={(e) => userNameStore.setState(e.target.value.trim())}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData('text');
                    e.preventDefault();
                    const trimmedText = text.split(' ').join('');
                    userNameStore.setState(trimmedText);
                  }}
                />
                <Text
                  variant="caption"
                  color="red40"
                  aria-hidden="true"
                  opacity={name.trim().length === 0}
                >
                  닉네임을 입력해주세요.
                </Text>
              </Flex>
            </Flex.Item>
          </Flex>
          <Flex.Item flex={1}>
            <Button
              color={name.trim().length > 0 ? 'primary' : 'plum40'}
              selected={true}
              onClick={handleModalLogin}
              disabled={!name.trim() || isLoginLoading}
              data-ga-id="submit-button"
            >
              <Text variant="button" color="background">
                {isLoginLoading ? '입장 중...' : '입장하기'}
              </Text>
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </S.LoginModalContainer>
  );
};

export default LoginModal;
