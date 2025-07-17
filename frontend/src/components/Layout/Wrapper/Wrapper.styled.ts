import styled from '@emotion/styled';

export const Container = styled.div<{ maxWidth: number }>`
  width: 100%;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
`;
