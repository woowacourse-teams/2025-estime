import styled from '@emotion/styled';

export const Container = styled.div`
  height: calc(100vh - 80px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-6);
  box-shadow: var(--shadow-card);
`;
export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gap-6);
  align-items: center;
  justify-content: center;
  padding: var(--padding-10);
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: var(--shadow-card);
  border-radius: var(--radius-6);
`;
