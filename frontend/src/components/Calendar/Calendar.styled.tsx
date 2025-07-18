import styled from '@emotion/styled';
import { column, row } from '@/constants/calender';

const dayCellRadius = 36;

export const Container = styled.div`
  max-width: 620px;
  max-height: 670px;
`;

export const CalendarContainer = styled.div`
  border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
  border-radius: var(--radius-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 620px;
  max-height: 670px;
  padding: var(--padding-9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Grid = styled.div`
  min-width: 100%;
  min-height: 100%;
  display: grid;
  grid-template-columns: repeat(${column}, 1fr);
  grid-template-rows: repeat(${row}, 1fr);
  grid-row-gap: var(--gap-4);
  grid-column-gap: var(--gap-4);
  text-align: center;
`;

export const Weekday = styled.span<{
  isSunday: boolean;
  isSaturday: boolean;
}>`
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--gap-4);
  color: ${({ isSunday, isSaturday, theme }) => {
    if (isSunday) return theme.colors.red40;
    if (isSaturday) return theme.colors.primary;
    return theme.colors.black;
  }};
`;

export const DayCell = styled.div<{
  isPast: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isToday: boolean;
  isSelected: boolean;
  isEmpty: boolean;
}>`
  user-select: none;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isPast, theme, isSunday, isSaturday, isSelected }) => {
    if (isSelected) return theme.colors.white;
    if (isPast) return theme.colors.gray20;
    if (isSunday) return theme.colors.red40;
    if (isSaturday) return theme.colors.black;
    return theme.colors.black;
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
  &:hover {
    background-color: ${({ theme, isPast, isEmpty }) => {
      if (isPast || isEmpty) return 'none';
      return theme.colors.primary;
    }};
    color: ${({ theme, isPast, isEmpty }) => {
      if (isPast || isEmpty) return 'inherit';
      return theme.colors.white;
    }};
    cursor: ${({ isPast, isEmpty }) => (isPast || isEmpty ? 'not-allowed' : 'grab')};
  }
  transition: all 0.15s ease-in-out;
  transform: ${({ isSelected }) => (isSelected ? 'scale(1.05)' : 'scale(1)')};
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-4);
`;
export const Month = styled.p`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--gap-6);
`;
