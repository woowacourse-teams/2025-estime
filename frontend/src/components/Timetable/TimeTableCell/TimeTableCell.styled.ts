import styled from '@emotion/styled';

export const HeaderCell = styled.div<{
  isDate: boolean;
  backgroundColor: string;
}>`
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isDate }) => (isDate ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ isDate }) => (isDate ? 'none' : 'inherit')};
  padding: var(--padding-4);
  height: ${({ isDate }) => (isDate ? '3rem' : '1.5rem')};
  width: 100%;
  user-select: none;
`;
