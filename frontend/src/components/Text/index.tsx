import React from 'react';
import { TypographyKey, ColorsKey } from '@/styles/theme';
import * as S from './Text.styled';
import { ComponentProps } from 'react';

export interface TextProps extends ComponentProps<'span'> {
  variant?: TypographyKey;
  color?: ColorsKey;
  opacity?: boolean;
  children: React.ReactNode;
}

const Text = ({ variant = 'body', color = 'gray90', opacity = true, children }: TextProps) => {
  return (
    <S.Container variant={variant} color={color} opacity={opacity}>
      {children}
    </S.Container>
  );
};

export default Text;
