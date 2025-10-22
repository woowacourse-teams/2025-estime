import styled from '@emotion/styled';
import { WrapperProps } from '.';

export const Container = styled.div<WrapperProps>`
  position: ${({ position }) => position ?? 'relative'};
  width: 100%;
  margin: ${({ center }) => (center ? '0 auto' : '0')};
  max-width: ${({ maxWidth }) => (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth)};
  // 5rem은 헤더 높이, 80px은 푸터 높이
  height: ${({ theme, fullHeight }) => {
    if (theme.isMobile && fullHeight) {
      return `calc(100dvh - 5rem)`;
    }
    if (fullHeight) {
      return `calc(100dvh - 5rem - 80px)`;
    }
    return 'auto';
  }};
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};

  ${({ padding, paddingTop, paddingRight, paddingBottom, paddingLeft }) =>
    padding
      ? `padding: ${padding ?? '0'};`
      : `
          padding-top: ${paddingTop ?? '0'};
          padding-right: ${paddingRight ?? '0'};
          padding-bottom: ${paddingBottom ?? '0'};
          padding-left: ${paddingLeft ?? '0'};
        `}

  border-radius: ${({ borderRadius }) => borderRadius ?? '0'};
`;
