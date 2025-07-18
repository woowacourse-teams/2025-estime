import { ComponentProps } from 'react';
import * as S from './CalendarButton.styled';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CalendarButtonProps extends ComponentProps<'button'> {}

const CalendarButton = ({ children, ...props }: CalendarButtonProps) => {
  return <S.Container {...props}>{children}</S.Container>;
};

export default CalendarButton;
