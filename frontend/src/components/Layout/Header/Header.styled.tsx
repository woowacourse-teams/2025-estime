import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 5rem;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0 var(--padding-7);
`;

export const Content = styled.div`
  max-width: 1280px;
  height: inherit;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-4);
`;

export const LogoWrapper = styled.div`
  width: 6.25rem;
  height: 2rem;
`;
