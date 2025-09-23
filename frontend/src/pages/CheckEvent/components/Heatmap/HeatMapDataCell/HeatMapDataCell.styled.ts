import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';

const shimmerSweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); } 
`;

export const Container = styled.div<{
  backgroundColor?: string;
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

  background-color: ${({ backgroundColor }) => backgroundColor};

  ${({ isRecommended }) =>
    isRecommended &&
    css`
      background: linear-gradient(
        135deg,
        #ffc64c 0%,
        #ffd170 25%,
        #ffc64c 50%,
        #ffba3d 75%,
        #ffc64c 100%
      );
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
