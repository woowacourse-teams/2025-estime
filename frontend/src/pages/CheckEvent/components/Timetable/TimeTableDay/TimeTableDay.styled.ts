import styled from '@emotion/styled';

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray40};
  border-right: 1px solid ${({ theme }) => theme.colors.gray40};
  cursor: default;
  padding: var(--padding-4);
  height: 3rem;
  width: 100%;
  user-select: none;
  background-color: ${({ theme }) => theme.colors.background};
`;
