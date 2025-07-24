import styled from '@emotion/styled';
import { zIndex } from '@/constants/styles';

export const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover > div {
    opacity: 1;
    visibility: visible;
  }
`;

export const TooltipContent = styled.div`
  position: absolute;
  z-index: ${zIndex.tooltip};
  padding: var(--padding-3) var(--padding-4);
  background-color: ${({ theme }) => theme.colors.gray80};
  color: ${({ theme }) => theme.colors.background};
  border-radius: var(--radius-3);
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  pointer-events: none;
  bottom: 50%;
  left: 110%;
  transform: translateY(50%);
`;
