import styled from '@emotion/styled';

export const TimetableContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  touch-action: none;
  user-select: none;
`;

export const TimeSlotColumn = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  padding-top: var(--padding-8);
  min-width: ${({ theme }) => (theme.isMobile ? '4rem' : '5rem')};
`;

export const GridContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 var(--padding-4);
  background-color: ${({ theme }) => theme.colors.background};
  user-select: none;
`;

export const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const DateColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 0;
`;
