import styled from '@emotion/styled';

export const TimeTableContainer = styled.div`
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;
