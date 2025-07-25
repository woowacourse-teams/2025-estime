import React, { ComponentProps } from 'react';
import * as S from './Button.styled';
import { ColorsKey } from '@/styles/theme';

interface ButtonProps extends ComponentProps<'button'> {
  size?: 'small' | 'medium' | 'large';
  color: ColorsKey;
  selected?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button = ({ size, color, selected, disabled, children, ...props }: ButtonProps) => {
  return (
    <S.Container size={size} color={color} selected={selected} disabled={disabled} {...props}>
      {children}
    </S.Container>
  );
};

export default Button;
