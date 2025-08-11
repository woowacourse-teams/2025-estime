import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100vw;
  min-height: calc(100vh - 5rem - 100px);
  background-color: ${({ theme }) => ` ${theme.colors.gray10}`};
`;
