import styled from '@emotion/styled';

export const HeaderCell = styled.div<{
  backgroundColor: string;
}>`
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  &:hover {
    cursor: pointer;
  }
  touch-action: none;
`;
