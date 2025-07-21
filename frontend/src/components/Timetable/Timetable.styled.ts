import styled from '@emotion/styled';

export const GridContainer = styled.div<{ availableDates: number }>`
  display: grid;
  grid-template-columns: repeat(${({ availableDates }) => availableDates + 1}, 1fr);
  grid-auto-rows: minmax(32px, auto);
  width: 100%;
`;

export const HeaderCell = styled.div<{
  selectedTimes: Set<string>;
  date: string;
  timeText: string;
}>`
  box-sizing: border-box;
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ selectedTimes, date, timeText, theme }) =>
    selectedTimes.has(`${date} ${timeText}`) ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  padding: var(--padding-4);
`;

export const TimeLabel = styled.div<{ isHour: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ isHour, theme }) => (isHour ? theme.colors.gray20 : 'transparent')};
`;
