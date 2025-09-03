import { css } from '@emotion/react';
import styled from '@emotion/styled';

const dayCellRadius = 36;

interface DayCellProps {
  isPast: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isToday: boolean;
  isSelected: boolean;
  isEmpty: boolean;
  isDateBlockedByLimit: boolean;
}

export const Container = styled.div<DayCellProps>`
  user-select: none;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isPast, theme, isSunday, isSaturday, isSelected }) => {
    if (isSelected) return theme.colors.background;
    if (isPast) return theme.colors.gray20;
    if (isSunday) return theme.colors.red40;
    if (isSaturday) return theme.colors.text;
    return theme.colors.text;
  }};
  font-weight: ${({ isSaturday }) => (isSaturday ? 600 : 400)};
  border: ${({ isToday, isSelected, theme }) => {
    if (isSelected) return 'none';
    if (isToday) return `2px solid ${theme.colors.primary}`;

    return 'none';
  }};
  border-radius: ${dayCellRadius}px;
  background-color: ${({ isSelected, theme }) => {
    if (isSelected) return theme.colors.primary;
    return 'none';
  }};
  ${({ theme, isPast, isEmpty }) =>
    !theme.isMobile &&
    css`
      &:hover {
        background-color: ${isPast || isEmpty ? 'none' : theme.colors.primary};
        color: ${isEmpty ? 'inherit' : isPast ? theme.colors.gray20 : theme.colors.background};
        cursor: ${isPast || isEmpty ? 'not-allowed' : 'grab'};
      }
    `}
  transform: ${({ isSelected }) => (isSelected ? 'scale(1.05)' : 'scale(1)')};

  ${({ isDateBlockedByLimit }) =>
    isDateBlockedByLimit &&
    `
    cursor: not-allowed;
    opacity: 0.3;
  `}
`;
