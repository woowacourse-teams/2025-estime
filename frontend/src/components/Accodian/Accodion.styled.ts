import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray10};
  border-radius: var(--radius-6);
  padding: var(--padding-8) var(--padding-7);
  box-shadow: 0px 10px 20px 0px rgba(33, 33, 33, 0.15);
`;

export const Header = styled.div`
  width: 100%;
  height: 5.625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Icon = styled.img<{ isOpen: boolean }>`
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  transition: transform 0.3s ease;
  cursor: pointer;
`;

export const Content = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: ${({ isOpen }) => (isOpen ? 'var(--padding-7) 0' : '0')};
  transition: all 0.3s ease;
`;
