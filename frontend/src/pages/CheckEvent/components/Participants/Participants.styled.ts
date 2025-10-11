import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Button = styled.button`
  border: none;
  padding: 0;
  background-color: transparent;
  line-height: 0;
  display: flex;
  justify-content: flex-end;
  padding: var(--padding-2);

  &:hover {
    cursor: pointer;
  }
`;

export const Container = styled.div<{ show: boolean }>`
  position: absolute;
  display: flex;
  width: 370px;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: var(--radius-4);
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  right: 125px;
  transform: translateY(-96%);

  &::before {
    content: '';
    position: absolute;

    right: 0;
    bottom: 0;
    transform: translateX(13px) translateY(-6px);
    border-left: 13px solid ${({ theme }) => theme.colors.primary};
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
  }

  &::after {
    content: '';
    position: absolute;

    right: 0;
    bottom: 0;
    transform: translateX(12px) translateY(-7px);
    border-left: 12px solid ${({ theme }) => theme.colors.background};
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
  }

  @media (max-width: 740px) {
    width: 250px;
  }

  @media (max-width: 640px) {
    width: 180px;
    right: 0px;
    transform: translateY(-140%);

    &::before {
      right: 30px;
      bottom: auto;
      top: 100%;
      transform: translateY(0);

      border-left: 13px solid transparent;
      border-right: 13px solid transparent;
      border-top: 13px solid ${({ theme }) => theme.colors.primary};
      border-bottom: 0;
    }

    &::after {
      right: 31px;
      bottom: auto;
      top: 100%;
      transform: translateY(-1px);

      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-top: 12px solid ${({ theme }) => theme.colors.background};
      border-bottom: 0;
    }
  }

  ${({ show }) =>
    show
      ? css`
          animation: ${appear} 0.2s ease forwards;
        `
      : css`
          animation: ${disappear} 0.2s ease forwards;
        `}
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: var(--padding-1) var(--padding-5);
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
`;

export const Body = styled.div`
  width: 100%;
  padding: var(--padding-5);
  height: calc(1.5rem * 2 + var(--padding-5));
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

export const NameList = styled.div`
  width: 100%;
  line-height: 1.5rem;
  max-height: calc(1.5rem * 2);
  overflow-y: auto;
  word-break: keep-all;
`;

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const disappear = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
