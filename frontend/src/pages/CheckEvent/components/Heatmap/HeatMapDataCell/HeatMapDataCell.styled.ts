import { hexToRgba } from '@/pages/CheckEvent/utils/getCellColor';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';

const shimmerSweep = keyframes`
  from { transform: translate3d(-120%, 0, 0); }
  to   { transform: translate3d(400%, 0, 0); }
`;

export const Container = styled.div<{ weight: number; isRecommended?: boolean }>`
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.gray40};
  border-right: 1px solid ${({ theme }) => theme.colors.gray40};
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  touch-action: manipulation;
  overflow: hidden;

  // 기본 요소는 배경색 애니메이션만
  transition: background-color 0.5s ease-in-out;
  background-color: ${({ weight, theme }) =>
    weight > 0 ? hexToRgba(theme.colors.primary, weight) : theme.colors.gray10};

  // before는 배경 그라디에이션

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      #8052e1 0%,
      #9058e8 25%,
      #9c64f2 45%,
      #8a56e6 65%,
      #7a4dd9 85%,
      #8052e1 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
    z-index: 0;
  }

  // after는 shimmer

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -30%;
    width: 40%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 30%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.05) 70%,
      rgba(255, 255, 255, 0) 100%
    );

    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    animation: ${shimmerSweep} 1.8s linear infinite;
    z-index: 1;
  }

  ${({ isRecommended }) =>
    isRecommended &&
    css`
      &::before,
      &::after {
        // 추천 시간대일때, 따로 opacity로 애니메이션 트리거
        opacity: 1;
      }
    `}

  &:hover {
    border: 1.5px dashed ${({ theme }) => theme.colors.gray30};
  }
`;
