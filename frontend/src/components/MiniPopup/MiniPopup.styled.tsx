import styled from '@emotion/styled';

export const Container = styled.div<{ isVisible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-6) var(--padding-8);
  background-color: ${({ theme }) => theme.colors.gray80};
  color: ${({ theme }) => theme.colors.background};
  border-radius: var(--radius-3);
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  white-space: nowrap;
  height: 24px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.25s ease;
`;
