import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';
import { zIndex } from '@/constants/styles';

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
  background-color: rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.3s ease-in-out;
  justify-content: center;
  align-items: ${(props) => (props.position === 'center' ? 'center' : 'end')};
  z-index: ${zIndex.modal};
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
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-2);

  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray60};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray10};
    color: ${({ theme }) => theme.colors.gray80};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    background-color: ${({ theme }) => theme.colors.gray20};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.plum30};
    outline-offset: 2px;
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
  margin-bottom: var(--margin-6);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
  }
`;

export const HeaderTitle = styled.div`
  flex: 1;
`;
