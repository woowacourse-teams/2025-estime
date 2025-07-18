import styled from '@emotion/styled';

export const Container = styled.button`
  user-select: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  height: 36px;
  width: 36px;
  border-radius: var(--radius-4);
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray60};
  transition: all 0.4s ease-in-out;
  &:disabled {
    color: ${({ theme }) => theme.colors.gray10};
    background-color: ${({ theme }) => theme.colors.gray10};
    border-color: ${({ theme }) => theme.colors.gray20};
    cursor: not-allowed;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray10};
  }
`;
