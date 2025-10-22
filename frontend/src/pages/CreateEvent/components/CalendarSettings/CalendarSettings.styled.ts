import { shakeScale } from '@/styles/animations/shake';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Container = styled.div<{ isValid: boolean; shouldShake: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-6);
  padding: ${({ theme }) => (theme.isMobile ? 'var(--padding-8)' : 'var(--padding-10)')};
  border-radius: var(--radius-6);
  box-shadow: var(--shadow-card);
  background-color: ${({ theme }) => theme.colors.background};

  ${({ theme, isValid }) =>
    !isValid &&
    css`
      outline: 2px solid ${theme.colors.red40};
    `}

  ${({ isValid, shouldShake }) =>
    !isValid &&
    shouldShake &&
    css`
      animation: ${shakeScale} 0.5s ease;
    `}

  @media (max-width: 430px) {
    height: 480px;
  }
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;
