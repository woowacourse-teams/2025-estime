import Modal from '@/components/Modal';
import Text from '@/components/Text';
import IInfo from '@/icons/IInfo';
import Flex from '@/components/Layout/Flex';
import Button from '@/components/Button';
import * as S from './EntryConfirmModal.styled';
import Tooltip from '@/components/Tooltip';
import { useTheme } from '@emotion/react';

export interface EntryConfirmModalProps {
  isEntryConfirmModalOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export const EntryConfirmModal = ({
  isEntryConfirmModalOpen,
  onConfirm,
  onCancel,
}: EntryConfirmModalProps) => {
  const theme = useTheme();

  return (
    <Modal isOpen={isEntryConfirmModalOpen} onClose={onCancel} position="center">
      <S.EntryConfirmModalContainer>
        <Modal.Content>
          <S.EntryConfirmModalHeader>
            <Flex justify="space-between" align="center" gap="var(--gap-2)">
              <Tooltip content="서비스를 이용하기 위해 로그인이 필요합니다.">
                <Flex align="center" gap="var(--gap-4)">
                  <Text variant="h3">로그인</Text>
                  <IInfo aria-hidden="true" color={theme.colors.text} />
                </Flex>
              </Tooltip>
            </Flex>
          </S.EntryConfirmModalHeader>

          <Flex gap="var(--gap-6)" direction="column">
            <Flex align="center" justify="center" gap="var(--gap-6)">
              <Flex.Item flex={4}>
                <Flex direction="column" gap="var(--gap-4)">
                  <Text variant="body">이미 시간표가 등록되어 있는 닉네임입니다.</Text>
                  <Text variant="body">이어서 수정하시겠습니까?</Text>
                </Flex>
              </Flex.Item>
            </Flex>

            <Flex.Item flex={1}>
              <Flex direction="row">
                <Button color={'plum40'} onClick={onConfirm} data-ga-id="submit-button">
                  <Text variant="button" color="background">
                    예
                  </Text>
                </Button>
                <Button color={'primary'} onClick={onCancel}>
                  <Text variant="button" color="background">
                    아니오
                  </Text>
                </Button>
              </Flex>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </S.EntryConfirmModalContainer>
    </Modal>
  );
};

export default EntryConfirmModal;
