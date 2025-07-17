import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.gray10};
`;

export const Content = styled.div`
  max-width: 1280px;
  height: inherit;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
