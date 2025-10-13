import styled from '@emotion/styled';

export const TimetableContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  user-select: none;
`;

export const TimeSlotColumn = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  padding-top: var(--padding-8);
  position: relative;
  min-width: ${({ theme }) => (theme.isMobile ? '4rem' : '5rem')};
`;

export const GridContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 var(--padding-4);
  background-color: ${({ theme }) => theme.colors.background};
  user-select: none;
  position: relative;
`;

export const DateColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 0;
`;

export const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  transition: color 0.15s ease-in-out;

  &:nth-of-type(n) {
    border-top: 1px dashed ${({ theme }) => theme.colors.gray20};
  }

  span {
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
  }

  &.active span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    font-size: 16px;
    transform: scale(1.02);
    transition: opacity 0.15s ease-in-out;
  }
`;

export const HoverLabel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  height: 3rem;
  line-height: 3rem;
  font-size: ${({ theme }) => theme.typography.body};
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.text};
  z-index: 1;

  &.visible {
    opacity: 1;
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;

    transform: scale(1.02);
  }
`;

export const TimetableCell = styled.div`
  transition: border 0.15s ease-in-out; /* 부드럽게 변경 */

  &:hover {
    border: 1.5px dashed ${({ theme }) => theme.colors.gray30};
    cursor: pointer;
  }
`;
