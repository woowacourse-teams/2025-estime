import React, { ComponentProps } from 'react';
import * as S from './Button.styled';
import { LIGHT_THEME } from '@/styles/theme';

interface ButtonProps extends ComponentProps<'button'> {
  size?: 'small' | 'medium' | 'large';
  color: keyof typeof LIGHT_THEME.colors;
  selected?: boolean;
  children: React.ReactNode;
}

const Button = ({ size, color, selected, children, ...props }: ButtonProps) => {
  return (
    <S.Container size={size} color={color} selected={selected} {...props}>
      {children}
    </S.Container>
  );
};

export default Button;
