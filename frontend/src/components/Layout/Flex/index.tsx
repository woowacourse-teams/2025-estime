import React from 'react';
import * as S from './Flex.styled';
import { CSSGapVar } from '@/types/designTokenType';

export interface FlexProps {
  children: React.ReactNode;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  direction?: 'row' | 'column';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: CSSGapVar;
}

export interface FlexItemProps {
  children: React.ReactNode;
  flex?: number;
}

const Flex = ({ children, ...rest }: FlexProps) => {
  return <S.Container {...rest}>{children}</S.Container>;
};

const FlexItem = ({ children, flex }: FlexItemProps) => {
  return <S.Item flex={flex}>{children}</S.Item>;
};

Flex.Item = FlexItem;

export default Flex;
