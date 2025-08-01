import styled from '@emotion/styled';

export const Container = styled.div<{
  isHeader: boolean;
  backgroundColor?: string;
}>`
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  cursor: ${({ isHeader }) => (isHeader ? 'default' : 'pointer')};
  padding: var(--padding-4);
  height: ${({ isHeader }) => (isHeader ? '3rem' : '1.5rem')};
  width: 5rem;
  user-select: none;
  background-color: ${({ backgroundColor, isHeader, theme }) =>
    backgroundColor || (isHeader ? theme.colors.background : theme.colors.gray10)};
`;
