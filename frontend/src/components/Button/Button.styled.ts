import { LIGHT_THEME } from '@/styles/theme';
import styled from '@emotion/styled';

export const Container = styled.button<{
  color: keyof typeof LIGHT_THEME.colors;
  size?: 'small' | 'medium' | 'large';
}>`
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '8rem';
      case 'medium':
        return '10rem';
      case 'large':
        return '12rem';
      default:
        return '100%';
    }
  }};
  height: 3rem;
  border-radius: var(--radius-4);
  background-color: ${({ theme, color }) => theme.colors[color]};
  border: none;
  cursor: pointer;
`;
