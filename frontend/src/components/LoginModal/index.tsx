import { useState } from 'react';
import Modal from '@/components/Modal';
import Text from '@/components/Text';
import Input from '@/components/Input';

export interface LoginModalProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}
export const LoginModal = ({ setIsOpen, isOpen }: LoginModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} position="center">
      <Modal.Background>
        <Modal.Container>
          <Modal.Header>
            <div>
              <Text variant="h2">로그인</Text>
              <Text variant="caption">시간표를 보려면 로그인이 필요해요.</Text>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div>
              <label htmlFor="">아이디</label>
              <Input />
            </div>
            <div>
              <label htmlFor="">아이디</label>
              <Input />
            </div>
          </Modal.Content>
        </Modal.Container>
      </Modal.Background>
    </Modal>
  );
};

export default LoginModal;
