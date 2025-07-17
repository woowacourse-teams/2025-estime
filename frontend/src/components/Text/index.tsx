import React from 'react';
import { TypographyKey, ColorsKey } from '@/styles/theme';
import * as S from './Text.styled';

export interface TextProps {
  variant?: TypographyKey;
  color?: ColorsKey;
  children: React.ReactNode;
}

const Text = ({ variant = 'body', color = 'gray90', children }: TextProps) => {
  return (
    <S.Container variant={variant} color={color}>
      {children}
    </S.Container>
  );
};

export default Text;
