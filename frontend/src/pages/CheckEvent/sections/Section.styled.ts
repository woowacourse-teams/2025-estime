import styled from '@emotion/styled';

export const FlipFace = styled.div`
  backface-visibility: hidden;

  width: 100%;
  height: 100%;
  padding: var(--padding-9);
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-card);
`;

export const FrontFace = styled(FlipFace)`
  transform: rotateY(0deg);
  z-index: 2;
`;

export const BackFace = styled(FlipFace)`
  z-index: 1;
  transform: rotateY(180deg);
`;

export const Toggle = styled.div`
  position: ${({ theme }) => (theme.isMobile ? 'absolute' : 'relative')};
  left: ${({ theme }) => (theme.isMobile ? 0 : 'none')};
  top: ${({ theme }) => (theme.isMobile ? '170%' : 'none')};
`;
