import { ComponentProps, PropsWithChildren, useContext } from 'react';
import styled from '@emotion/styled';
import { ModalContext } from '@/contexts/ModalContext';
import * as S from '../Modal.styled';
import Text from '@/components/Text';
import IClose from '@/icons/IClose';

interface ModalHeaderProps extends PropsWithChildren, ComponentProps<'header'> {}

function Header({ children, ...props }: ModalHeaderProps) {
  const ctx = useContext(ModalContext);
  return (
    <S.ModalHeader {...props}>
      <S.HeaderTitle>
        <Text variant="h2" color="gray90">
          {children}
        </Text>
      </S.HeaderTitle>
      <S.CloseButton aria-label="모달 닫기" title="모달 닫기" onClick={ctx?.onClose} type="button">
        <IClose aria-hidden="true" />
      </S.CloseButton>
    </S.ModalHeader>
  );
}
export default Header;
