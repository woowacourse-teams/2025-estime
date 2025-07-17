import { ComponentProps } from 'react';
import * as S from './CalendarButton.styled';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CalendarButtonProps extends ComponentProps<'button'> {}

const CalendarButton = ({ children, ...props }: CalendarButtonProps) => {
  return <S.Button {...props}>{children}</S.Button>;
};

export default CalendarButton;
