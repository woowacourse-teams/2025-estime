import styled from '@emotion/styled';
import { LIGHT_THEME } from '@/styles/theme';

export const Container = styled.button<{
  color: keyof typeof LIGHT_THEME.colors;
  size?: 'x-small' | 'small' | 'medium' | 'large';
  selected?: boolean;
}>`
  width: ${({ size }) => {
    switch (size) {
      case 'x-small':
        return '4rem';
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
  border: 1px solid
    ${({ theme, color, disabled }) => (disabled ? theme.colors.gray20 : theme.colors[color])};

  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-3);
  background-color: ${({ theme, selected, color, disabled }) => {
    if (disabled) return theme.colors.gray20;
    if (selected) return theme.colors[color];
    return theme.colors.background;
  }};

  &:hover {
    ${({ selected, color, theme, disabled }) =>
      !selected &&
      !disabled &&
      `background-color: ${color === 'primary' ? theme.colors.plum30 : theme.colors.gray10};
      `}
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
