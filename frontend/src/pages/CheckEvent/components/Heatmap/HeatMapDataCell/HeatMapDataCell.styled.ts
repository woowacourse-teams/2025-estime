import { hexToRgba } from '@/pages/CheckEvent/utils/getCellColor';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';

const shimmerSweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); } 
`;

export const Container = styled.div<{
  weight: number;
  isRecommended?: boolean;
}>`
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  touch-action: manipulation;
  overflow: hidden;
  transition: background-color 0.25s ease-in-out;
  background-color: ${({ weight, theme }) =>
    weight > 0 ? hexToRgba(theme.colors.primary, weight) : theme.colors.gray10};

  ${({ isRecommended, weight, theme }) =>
    isRecommended &&
    css`
      background-image: linear-gradient(
        90deg,
        #8052e1 0%,
        #9058e8 25%,
        #9c64f2 45%,
        #8a56e6 65%,
        #7a4dd9 85%,
        #8052e1 100%
      );
      background-color: ${weight > 0 ? hexToRgba(theme.colors.primary, weight) : theme.colors.gray10}};
      &::after {
        inset: -1px;
        content: '';
        position: absolute;
        width: 80%;
        pointer-events: none;
        will-change: transform;
        animation: ${shimmerSweep} 2.2s linear infinite;

        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0) 10%,
          rgba(255, 255, 255, 0.05) 20%,
          rgba(255, 255, 255, 0.1) 30%,
          rgba(255, 255, 255, 0.2) 40%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0.2) 60%,
          rgba(255, 255, 255, 0.1) 70%,
          rgba(255, 255, 255, 0.05) 80%,
          rgba(255, 255, 255, 0) 90%,
          rgba(255, 255, 255, 0) 100%
        );
        opacity: 0.7;
        filter: blur(0.5px);
      }
    `}

  &:hover {
    border: 1.5px dashed ${({ theme }) => theme.colors.gray30};
  }
`;
