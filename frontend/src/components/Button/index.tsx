import React, { ComponentProps } from 'react';
import * as S from './Button.styled';
import { ColorsKey } from '@/styles/theme';

interface ButtonProps extends ComponentProps<'button'> {
  size?: 'small' | 'medium' | 'large';
  color: ColorsKey;
  selected?: boolean;
  children: React.ReactNode;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

const Button = ({ size, color, selected, children, buttonRef, ...props }: ButtonProps) => {
  return (
    <S.Container ref={buttonRef} size={size} color={color} selected={selected} {...props}>
      {children}
    </S.Container>
  );
};

export default Button;
