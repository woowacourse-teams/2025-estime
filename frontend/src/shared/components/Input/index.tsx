import { ComponentProps } from 'react';
import * as S from './Input.styled';

interface InputProps extends ComponentProps<'input'> {
  isError?: boolean;
}

const Input = ({ isError = false, ...props }: InputProps) => {
  return <S.Container isError={isError} {...props} />;
};

export default Input;
