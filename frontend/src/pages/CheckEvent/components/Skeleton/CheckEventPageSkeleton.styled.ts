import styled from '@emotion/styled';

export const TimeTableContainer = styled.div`
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;

export const TimeTableHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: ${({ theme }) => (theme.isMobile ? 0 : 'var(--padding-8)')};
`;
