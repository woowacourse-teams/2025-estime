import styled from '@emotion/styled';

export const Container = styled.input<{ isError?: boolean }>`
  width: 100%;
  height: 2rem;
  border-radius: var(--radius-4);
  border: 1px solid ${({ theme, isError }) => (isError ? theme.colors.red40 : theme.colors.gray20)};
  padding: var(--padding-3);
  background-color: ${({ theme }) => theme.colors.gray10};

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.plum40};
  }
`;
