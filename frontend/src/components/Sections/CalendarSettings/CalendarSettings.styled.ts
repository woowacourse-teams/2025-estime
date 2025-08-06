import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-9);
  padding: var(--padding-10);
  border-radius: var(--radius-6);
  box-shadow: var(--shadow-card);
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;
