import React, { ComponentProps } from 'react';
import * as S from './Button.styled';
import { ColorsKey } from '@/styles/theme';

interface ButtonProps extends ComponentProps<'button'> {
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'auto';
  color: ColorsKey;
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
