import { ComponentProps } from 'react';
import * as S from './pageArrowButton.styled';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PageArrowButtonProps extends ComponentProps<'button'> {}

const PageArrowButton = ({ children, ...props }: PageArrowButtonProps) => {
  return <S.Container {...props}>{children}</S.Container>;
};

export default PageArrowButton;
