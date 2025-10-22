import styled from '@emotion/styled';

export const Container = styled.input<{ isError: boolean }>`
  width: 100%;
  height: 2rem;
  border-radius: var(--radius-4);
  border: 1px solid ${({ theme, isError }) => (isError ? theme.colors.red40 : theme.colors.gray20)};
  padding: var(--padding-8);

  background-color: ${({ theme }) => theme.colors.gray05};
  color: ${({ theme }) => theme.colors.gray50};
  font-size: calc(${({ theme }) => theme.typography.h4.fontSize} * var(--font-scale));
  outline: none;
  color-scheme: ${({ theme }) => (theme.colors.background === '#1A1E26' ? 'dark' : 'light')};

  -webkit-appearance: none;
  appearance: none;
`;

export const HintA11y = styled.div`
  position: absolute;
  clip: rect(0, 0, 0, 0);
`;
