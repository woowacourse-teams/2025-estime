import React from 'react';
import * as S from './Wrapper.styled';

interface WrapperProps {
  maxWidth?: number;
  children: React.ReactNode;
}

const Wrapper = ({ maxWidth = 1280, children }: WrapperProps) => {
  return <S.Container maxWidth={maxWidth}>{children}</S.Container>;
};
export default Wrapper;
