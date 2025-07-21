import { ComponentProps, PropsWithChildren, useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import * as S from '../Modal.styled';
import Text from '@/components/Text';
import Close from '@/icons/Close';

interface ModalHeaderProps extends PropsWithChildren, ComponentProps<'header'> {}

function Header({ children, ...props }: ModalHeaderProps) {
  const ctx = useContext(ModalContext);
  return (
    <S.ModalHeader {...props}>
      <Text variant="h2" color="gray90">
        {children}
      </Text>
      <S.CloseButton aria-label="닫기" onClick={ctx?.onClose}>
        <Close />
      </S.CloseButton>
    </S.ModalHeader>
  );
}
export default Header;
