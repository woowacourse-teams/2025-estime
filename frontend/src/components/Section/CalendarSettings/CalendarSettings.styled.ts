import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-9);
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-10);
  border-radius: var(--radius-6);
  box-shadow: 0px 10px 30px rgba(33, 33, 33, 0.15);
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;
