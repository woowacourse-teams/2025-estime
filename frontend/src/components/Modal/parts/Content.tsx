import { ComponentProps } from 'react';
import * as S from '../Modal.styled';
interface ModalContentProps extends ComponentProps<'div'> {}

function Content({ children, ...props }: ModalContentProps) {
  return <S.ModalContent {...props}>{children}</S.ModalContent>;
}
export default Content;
