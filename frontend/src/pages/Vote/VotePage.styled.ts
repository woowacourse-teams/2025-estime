import styled from '@emotion/styled';

export const TimeTableContainer = styled.div`
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;

export const FlipCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
`;

// 실제 회전하는 내부 래퍼
export const FlipInner = styled.div<{ isFlipped: boolean }>`
  display: grid;
  > * {
    grid-area: 1 / 1;
  }
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: ${({ isFlipped }) => (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;
