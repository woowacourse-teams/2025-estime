import styled from '@emotion/styled';
import { ToastPhase, useToastTheme } from '.';
import { css, keyframes } from '@emotion/react';

export const Container = styled.div<{ phase: ToastPhase }>`
  display: flex;
  width: 350px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  background-color: ${({ theme }) => {
    const type = useToastTheme();
    return `${theme.colors[`${type}Background`]}`;
  }};
  box-shadow: var(--shadow-card);

  opacity: 0;

  animation: ${({ phase }) =>
    phase === 'visible'
      ? css`
          ${fadeInUp} 0.3s ease forwards
        `
      : phase === 'hidden'
        ? css`
            ${fadeOutUp} 0.3s ease forwards
          `
        : 'none'};
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  padding: 10.4px 16px;
  align-items: center;

  border-bottom: 2px solid
    ${({ theme }) => {
      const type = useToastTheme();
      return `${theme.colors[`${type}Border`]}`;
    }};
`;

export const Body = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  align-items: flex-start;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;
