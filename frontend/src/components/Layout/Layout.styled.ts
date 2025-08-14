import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100vw;
  min-height: calc(100vh - 5rem - 150px);
  background-color: ${({ theme }) => ` ${theme.colors.gray05}`};
  @media (max-width: 768px) {
    min-height: calc(100vh - 5rem - 200px);
  }
`;
