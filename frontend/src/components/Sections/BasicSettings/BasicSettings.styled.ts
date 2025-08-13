import { shakeScale } from '@/styles/animations/shake';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Container = styled.div<{ isValid: boolean; shouldShake: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme.isMobile ? 'var(--gap-10)' : 'var(--gap-8)')};
  padding: ${({ theme }) => (theme.isMobile ? 'var(--padding-8)' : 'var(--padding-10)')};
  border-radius: var(--radius-6);
  max-width: 50rem;
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
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-5);
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: var(--gap-5);
  padding: var(--padding-1);
  width: 100%;
`;

export const CustomTimeWrapper = styled.div<{ selected: boolean }>`
  display: flex;
  width: 100%;
  gap: var(--gap-5);
  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  visibility: ${({ selected }) => (selected ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

export const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0.125rem;
  gap: var(--gap-3);
`;
