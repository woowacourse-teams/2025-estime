import React from 'react';
import * as S from './Wrapper.styled';
import { CSSPaddingVar } from '@/types/designTokenType';

export interface WrapperProps {
  maxWidth?: number | 'fit-content' | 'max-content' | 'min-content' | '100%' | 'auto';
  fullHeight?: boolean;
  backgroundColor?: string;

  paddingTop?: CSSPaddingVar;
  paddingRight?: CSSPaddingVar;
  paddingBottom?: CSSPaddingVar;
  paddingLeft?: CSSPaddingVar;

  center?: boolean; // margin: 0 auto 로 가운데 정렬 여부

  children: React.ReactNode;
}

const Wrapper = ({ maxWidth = 'fit-content', center = true, children, ...rest }: WrapperProps) => {
  return (
    <S.Container maxWidth={maxWidth} center={center} {...rest}>
      {children}
    </S.Container>
  );
};
export default Wrapper;
