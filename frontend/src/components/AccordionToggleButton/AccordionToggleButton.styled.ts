import styled from '@emotion/styled';

export const Container = styled.button<{ isOpen: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--padding-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  transition: transform 0.3s ease;
`;
