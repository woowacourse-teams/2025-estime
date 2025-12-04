import Modal from '@/shared/components/Modal';
import Text from '@/shared/components/Text';
import Flex from '@/shared/layout/Flex';
import Button from '@/shared/components/Button';
import * as S from './EntryConfirmModal.styled';
import useEnterKeySubmit from '@/shared/hooks/common/useEnterKeySubmit';
import { useModalContext } from '@/shared/contexts/ModalContext';

export interface EntryConfirmModalProps {
  onConfirm: () => Promise<void>;
}
export const EntryConfirmModal = ({ onConfirm }: EntryConfirmModalProps) => {
  const { buttonRef } = useEnterKeySubmit({ callback: onConfirm });
  const { onClose } = useModalContext();
  return (
    <S.EntryConfirmModalContainer>
      <Modal.Content>
        <S.EntryConfirmModalHeader>
          <Text variant="h3">정보 입력</Text>
        </S.EntryConfirmModalHeader>

        <Flex gap="var(--gap-7)" direction="column">
          <Flex align="center" justify="center" gap="var(--gap-6)">
            <Flex.Item flex={5}>
              <Flex direction="column" gap="var(--gap-6)">
                <Text variant="h4">이미 시간표가 등록되어 있는 닉네임입니다.</Text>
                <Text variant="h4">이어서 수정하시겠습니까?</Text>
              </Flex>
            </Flex.Item>
          </Flex>

          <Flex.Item flex={1}>
            <Flex direction="row" gap="var(--gap-4)">
              <Button ref={buttonRef} color={'primary'} selected={true} onClick={onConfirm}>
                <Text variant="button" color="gray10">
                  예
                </Text>
              </Button>
              <Button color={'primary'} onClick={onClose}>
                <Text variant="button" color="primary">
                  아니오
                </Text>
              </Button>
            </Flex>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </S.EntryConfirmModalContainer>
  );
};

export default EntryConfirmModal;
