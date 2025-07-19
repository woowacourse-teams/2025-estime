import styled from '@emotion/styled';
import { LIGHT_THEME } from '@/styles/theme';

export const Container = styled.button<{
  color: keyof typeof LIGHT_THEME.colors;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
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
  border: 1px solid ${({ theme, color }) => theme.colors[color]};
  color: ${({ theme, selected, color }) =>
    selected ? theme.colors.background : theme.colors[color]};

  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-3);
  background-color: ${({ theme, selected, color }) =>
    selected ? theme.colors[color] : theme.colors.background};

  &:hover {
    ${({ selected, color, theme }) =>
      !selected &&
      `background-color: ${color === 'primary' ? theme.colors.plum30 : theme.colors.gray10};
      `}
  }
`;
