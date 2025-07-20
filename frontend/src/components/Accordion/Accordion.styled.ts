import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: var(--radius-6);
  padding: 0 var(--padding-7);
  box-shadow: var(--shadow-card);
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: var(--padding-8) 0;
`;

export const Icon = styled.img<{ isOpen: boolean }>`
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  transition: transform 0.3s ease;
`;

export const Content = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  overflow: hidden;
  border-top: 1px solid rgba(221, 221, 221, 0.7);
  padding: ${({ isOpen }) => (isOpen ? 'var(--padding-7) 0' : '0')};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: var(--gap-8);
`;
