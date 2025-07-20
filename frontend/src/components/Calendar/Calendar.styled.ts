import styled from '@emotion/styled';
import { column, row } from '@/constants/calender';

export const Container = styled.div`
  max-width: 100%;
  max-height: 670px;
`;

export const CalendarContainer = styled.div`
  border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
  border-radius: var(--radius-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    return theme.colors.text;
  }};
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
  color: ${({ theme }) => theme.colors.text};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--gap-6);
`;
