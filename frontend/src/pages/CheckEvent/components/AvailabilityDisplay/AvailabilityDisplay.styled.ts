import styled from '@emotion/styled';

export const TimeTableContainer = styled.div`
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;

export const FlipFace = styled.div`
  backface-visibility: hidden;
  width: 100%;
`;

export const BackFace = styled(FlipFace)<{ isFlipped: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  z-index: ${({ isFlipped }) => (isFlipped ? 2 : 1)};
  pointer-events: ${({ isFlipped }) => (isFlipped ? 'auto' : 'none')};
`;
