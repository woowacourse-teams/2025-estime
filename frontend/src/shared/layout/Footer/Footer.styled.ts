import styled from '@emotion/styled';

export const Container = styled.footer`
  width: 100%;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--padding-8);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;

  gap: var(--gap-8);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-8);
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-4);
`;

export const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--gap-5);
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const Anchor = styled.a`
  color: ${({ theme }) => theme.colors.gray60};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray90};
    text-decoration: underline;
  }
`;

export const Dot = styled.span`
  color: ${({ theme }) => theme.colors.gray40};
  text-align: center;
`;
