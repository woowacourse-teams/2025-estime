import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.gray10};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
