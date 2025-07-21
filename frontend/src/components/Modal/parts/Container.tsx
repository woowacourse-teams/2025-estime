import { ComponentProps, useContext, PropsWithChildren } from 'react';

import * as S from '../Modal.styled';
import { ModalContext } from '@/contexts/ModalContext';

interface ModalContainerProps extends PropsWithChildren, ComponentProps<'div'> {
  size?: 'small' | 'medium' | 'large';
  position?: 'center' | 'bottom';
}

function Container({ children, size = 'medium', ...props }: ModalContainerProps) {
  const ctx = useContext(ModalContext);

  const modalSize = ctx?.position === 'bottom' ? 'full' : size;

  return (
    <S.ModalContainer
      {...props}
      size={modalSize}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </S.ModalContainer>
  );
}
export default Container;
