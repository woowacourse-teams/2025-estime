import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Button = styled.button`
  border: none;
  padding: 0;
  background-color: transparent;
  line-height: 0;
  display: flex;
  justify-content: flex-end;

  &:hover {
    cursor: pointer;
  }
`;

export const Container = styled.div<{ show: boolean }>`
  position: absolute;
  display: flex;
  width: 370px;
  flex-direction: column;
  border-radius: var(--radius-4);
  background: ${({ theme }) => theme.colors.background};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  right: calc(100% + 8px);
  bottom: 4px;

  @media (max-width: 740px) {
    width: 250px;
  }

  @media (max-width: 640px) {
    width: 180px;
    right: 0px;
    bottom: 35px;
  }

  @media (max-width: 400px) {
    width: 160px;
  }

  ${({ show }) =>
    show
      ? css`
          animation: ${appear} 0.2s ease forwards;
        `
      : css`
          animation: ${disappear} 0.2s ease forwards;
          pointer-events: none;
        `}
`;

export const Header = styled.div`
  width: 100%;
  max-height: 2.5rem;
  display: flex;
  justify-content: space-between;
  padding: var(--padding-5);
  align-items: center;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.primary};

  @media (max-width: 640px) {
    max-height: 2rem;
    padding: var(--padding-3) var(--padding-3);
  }
`;

export const Body = styled.div`
  width: 100%;
  padding: var(--padding-5);
  display: flex;
  align-items: center;
  min-width: 0;

  @media (max-width: 640px) {
    padding: var(--padding-3) var(--padding-3);
  }
`;

export const NameList = styled.div`
  width: 100%;
  line-height: 1.5rem;
  max-height: calc(1.5rem * 2);
  min-width: 0;
  overflow-y: auto;
  word-break: keep-all;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gray20};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.primary}70;
  }
`;

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const disappear = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
