import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const ModalBackground = styled.div<{
  position?: 'center' | 'bottom';
}>`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray40};
  animation: ${fadeIn} 0.3s ease-in-out;
  justify-content: center;
  align-items: ${(props) => (props.position === 'center' ? 'center' : 'end')};
  z-index: 1000;
`;

const getSizeStyles = (size?: 'small' | 'medium' | 'large' | 'full') => {
  switch (size) {
    case 'full':
      return css`
        width: 100%;
        animation: ${zoomIn} 0.3s ease-in-out;
      `;
    case 'small':
      return css`
        min-width: min(430px, 95vw);
        animation: ${zoomIn} 0.3s ease-in-out;
      `;
    case 'medium':
      return css`
        min-width: min(520px, 95vw);
        animation: ${zoomIn} 0.3s ease-in-out;
      `;
    case 'large':
      return css`
        min-width: min(800px, 95vw);
        animation: ${zoomIn} 0.3s ease-in-out;
      `;
    default:
      return null;
  }
};

export const ModalContainer = styled.div<{
  size?: 'small' | 'medium' | 'large' | 'full';
}>`
  padding: var(--padding-8);
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: var(--radius-4);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
  align-items: flex-start;

  animation: ${zoomIn} 0.3s ease-in-out;

  ${(props) => getSizeStyles(props.size)}
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.text};
  }
  &:active {
    transform: scale(0.9);
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ModalHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
