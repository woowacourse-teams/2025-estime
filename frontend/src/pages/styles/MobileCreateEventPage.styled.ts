import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const rotateAnimation = keyframes`
  0%{
     transform: rotate(0deg);
    }
 100%{
     transform: rotate(360deg);
    }
`;

export const LogoWrapper = styled.div`
  display: inline-block;
  animation: ${rotateAnimation} 15s linear infinite;
  transform-origin: center center;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;
