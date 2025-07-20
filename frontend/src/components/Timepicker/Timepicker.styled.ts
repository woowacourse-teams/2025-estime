import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slideDown = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 200px; opacity: 1; }
`;

const slideUp = keyframes`
  from { max-height: 200px; opacity: 1; }
  to { max-height: 0; opacity: 0; }
`;

export const Container = styled.div`
  width: 100%;
  height: 2rem;
  background-color: ${({ theme }) => theme.colors.gray10};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-8);
  border-radius: var(--radius-4);
  vertical-align: middle;
  font-family: inherit;
  display: flex;
  align-items: center;
  position: relative;
`;

export const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-4);
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`;

export const List = styled.ul<{ isOpen: boolean }>`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-2);
  animation: ${({ isOpen }) => (isOpen ? slideDown : slideUp)} 0.3s ease-out forwards;
`;
export const ListItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ListItem = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: var(--padding-4);
  &:hover {
    background-color: ${({ theme }) => theme.colors.plum30};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.plum40};
  }
  transition: background-color 0.2s ease-in-out;
`;
