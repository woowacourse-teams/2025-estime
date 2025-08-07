import styled from '@emotion/styled';
import { zIndex } from '@/constants/styles';

export const Container = styled.div<{ x: number; y: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  transform: translate(-50%, 70%);
  padding: var(--padding-4) var(--padding-6);
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ theme }) => theme.colors.gray10};
  z-index: ${zIndex.tooltip};
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;
