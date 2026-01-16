import styled from '@emotion/styled';

export const Container = styled.div<{
  show: boolean;
  type: 'info' | 'warning' | 'error';
  maxWidth?: string;
}>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  background: ${({ theme, type }) => {
    if (type === 'info') return theme.colors.green30;
    if (type === 'warning') return theme.colors.warningBackground;
    if (type === 'error') return theme.colors.errorBackground;
  }};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  max-width: ${({ maxWidth }) => maxWidth || '100%'};
`;
