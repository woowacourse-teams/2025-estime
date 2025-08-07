import styled from '@emotion/styled';

export const TimeTableContainer = styled.div`
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;

export const FlipCard = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  transition: transform 1s ease;
  transform-style: preserve-3d;
  transform: ${({ isFlipped }) => (isFlipped ? 'rotateY(180deg)' : 'none')};
`;

export const FlipFace = styled.div`
  backface-visibility: hidden;
  width: 100%;
`;

export const FrontFace = styled(FlipFace)<{ isFlipped: boolean }>`
  z-index: ${({ isFlipped }) => (isFlipped ? 1 : 2)};
  pointer-events: ${({ isFlipped }) => (isFlipped ? 'none' : 'auto')};
`;

export const BackFace = styled(FlipFace)<{ isFlipped: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  z-index: ${({ isFlipped }) => (isFlipped ? 2 : 1)};
  pointer-events: ${({ isFlipped }) => (isFlipped ? 'auto' : 'none')};
`;
