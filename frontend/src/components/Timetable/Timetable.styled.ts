import styled from '@emotion/styled';


export const Container = styled.div`
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;


export const TimetableHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TimetableContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  user-select: none;
`;

export const TimeSlotColumn = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  padding-top: var(--padding-8);
`;

export const GridContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 var(--padding-4);
  background-color: ${({ theme }) => theme.colors.background};
  user-select: none;
`;

export const HeaderCell = styled.div<{
  selectedTimes: Set<string>;
  date: string;
  timeText: string;
}>`
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ selectedTimes, date, timeText, theme }) =>
    timeText === 'Dates'
      ? theme.colors.background
      : selectedTimes.has(`${date}T${timeText}`)
        ? theme.colors.primary
        : theme.colors.gray10};
  cursor: pointer;
  padding: var(--padding-4);
  height: ${({ timeText }) => (timeText === 'Dates' ? '3rem' : '1.5rem')};
  width: 5rem;
  user-select: none;
`;

export const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  background-color: ${({ theme }) => theme.colors.background};
`;
