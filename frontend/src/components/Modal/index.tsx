import * as S from './Modal.styled';
import { PropsWithChildren, ComponentProps, useContext } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '@/contexts/ModalContext';
import { useEscapeClose } from '@/hooks/Modal/useEscapeClose';
import Text from '@/components/Text';
import FocusTrap from './FocusTrap';
import IClose from '@/icons/IClose';

export interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose?: () => void;
  position: 'bottom' | 'center' | 'inside';
  portalToWhere?: Element | DocumentFragment;
  blur?: boolean;
  shouldCloseOnOverlayAction?: boolean;
}
export type ModalSize = 'small' | 'medium' | 'large' | '85%';

interface ModalHeaderProps extends PropsWithChildren, ComponentProps<'header'> {}
interface ModalContainerProps extends PropsWithChildren, ComponentProps<'div'> {
  size?: ModalSize;
}
interface ModalContentProps extends PropsWithChildren, ComponentProps<'div'> {}

function Modal({
  isOpen,
  onClose,
  position = 'center',
  portalToWhere = document.body,
  blur = false,
  shouldCloseOnOverlayAction = true,
  children,
}: ModalProps) {
  useEscapeClose({ isOpen, onClose, shouldClose: shouldCloseOnOverlayAction });

  if (!isOpen) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose, shouldCloseOnOverlayAction, position }}>
      <FocusTrap>
        <S.ModalBackground
          onClick={shouldCloseOnOverlayAction ? onClose : undefined}
          position={position}
          blur={blur}
        >
          {children}
        </S.ModalBackground>
      </FocusTrap>
    </ModalContext.Provider>,
    portalToWhere
  );
}

function ModalContainer({ children, size = 'medium', ...props }: ModalContainerProps) {
  return (
    <S.ModalContainer
      {...props}
      size={size}
      onClick={(e) => {
        e.stopPropagation();
      }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </S.ModalContainer>
  );
}

function ModalContent({ children, ...props }: ModalContentProps) {
  return <S.ModalContent {...props}>{children}</S.ModalContent>;
}

function ModalHeader({ children, ...props }: ModalHeaderProps) {
  const ctx = useContext(ModalContext);
  return (
    <S.ModalHeader aria-labelledby="modal-title" {...props}>
      <S.HeaderTitle>
        <Text variant="h2" color="gray90">
          {children}
        </Text>
      </S.HeaderTitle>

      {ctx?.shouldCloseOnOverlayAction && (
        <S.CloseButton
          aria-label="모달 닫기"
          title="모달 닫기"
          onClick={ctx?.onClose}
          type="button"
        >
          <IClose aria-hidden="true" />
        </S.CloseButton>
      )}
    </S.ModalHeader>
  );
}

Modal.Container = ModalContainer;
Modal.Header = ModalHeader;
Modal.Content = ModalContent;

export default Modal;
