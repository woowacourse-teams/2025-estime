import styled from '@emotion/styled';

export const Container = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  background: ${({ theme }) => theme.colors.warningBackground};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;
