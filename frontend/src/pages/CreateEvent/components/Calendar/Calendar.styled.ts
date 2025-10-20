import styled from '@emotion/styled';
import { column, row } from '@/constants/calender';

export const Container = styled.div`
  max-width: 100%;
  min-height: 450px;
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
  padding: var(--padding-6);

  @media (max-width: 430px) {
    padding: var(--padding-4);
  }
`;

export const Grid = styled.div`
  min-width: 100%;
  min-height: 100%;
  display: grid;
  grid-template-columns: repeat(${column}, 1fr);
  grid-template-rows: repeat(${row}, 1fr);
  grid-row-gap: var(--gap-3);
  grid-column-gap: var(--gap-3);
  text-align: center;

  @media (max-width: 430px) {
    grid-row-gap: var(--gap-2);
    grid-column-gap: var(--gap-2);
  }
`;

export const Weekday = styled.span<{
  isSunday: boolean;
  isSaturday: boolean;
}>`
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--gap-2);
  color: ${({ isSunday, isSaturday, theme }) => {
    if (isSunday) return theme.colors.red40;
    if (isSaturday) return theme.colors.primary;
    return theme.colors.text;
  }};
  @media (max-width: 430px) {
    margin-bottom: var(--gap-2);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-2);
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
