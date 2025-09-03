import styled from '@emotion/styled';

export const Container = styled.input<{ isError?: boolean }>`
  width: 100%;
  height: 2rem;
  border-radius: var(--radius-4);
  border: 1px solid ${({ theme, isError }) => (isError ? theme.colors.red40 : theme.colors.gray20)};
  padding: var(--padding-8);
  background-color: ${({ theme }) => theme.colors.gray05};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.plum40};
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.gray50};
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
  }
`;
