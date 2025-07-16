import styled from '@emotion/styled';

export const Button = styled.button`
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
    color: ${({ theme }) => theme.colors.gray20};
    border-color: ${({ theme }) => theme.colors.gray20};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray10};
  }
`;
