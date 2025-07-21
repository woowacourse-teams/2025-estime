import styled from '@emotion/styled';
import { WrapperProps } from '.';

export const Container = styled.div<WrapperProps>`
  width: 100%;
  margin: ${({ center }) => (center ? '0 auto' : '0')};
  max-width: ${({ maxWidth }) => (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth)};
  height: ${({ fullHeight }) => (fullHeight ? '100vh' : 'auto')};
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};

  padding-top: ${({ paddingTop }) => paddingTop ?? '0'};
  padding-right: ${({ paddingRight }) => paddingRight ?? '0'};
  padding-bottom: ${({ paddingBottom }) => paddingBottom ?? '0'};
  padding-left: ${({ paddingLeft }) => paddingLeft ?? '0'};
`;
