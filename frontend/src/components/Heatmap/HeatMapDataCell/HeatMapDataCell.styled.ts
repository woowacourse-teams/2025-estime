import styled from '@emotion/styled';

export const Container = styled.div<{
  backgroundColor?: string;
}>`
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.colors.gray10};

  &:hover {
    border: 1.5px dashed ${({ theme }) => theme.colors.gray30};
  }
`;
