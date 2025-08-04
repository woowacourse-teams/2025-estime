import React, { ComponentProps } from 'react';
import * as S from './Wrapper.styled';
import type { CSSPaddingVar, CSSRadiusVar } from '@/types/designTokenType';

export interface WrapperProps extends ComponentProps<'div'> {
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  maxWidth?: number | 'fit-content' | 'max-content' | 'min-content' | '100%' | 'auto';
  fullHeight?: boolean;
  backgroundColor?: string;
  padding?: CSSPaddingVar;
  paddingTop?: CSSPaddingVar;
  paddingRight?: CSSPaddingVar;
  paddingBottom?: CSSPaddingVar;
  paddingLeft?: CSSPaddingVar;

  center?: boolean; // margin: 0 auto 로 가운데 정렬 여부

  borderRadius?: CSSRadiusVar;

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
