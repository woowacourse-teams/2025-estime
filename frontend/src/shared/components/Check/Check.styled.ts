// Check.styled.ts
import styled from '@emotion/styled';
import { LIGHT_THEME } from '@/styles/theme';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

export const Visual = styled.label<{
  color: keyof typeof LIGHT_THEME.colors;
  size?: 'x-small' | 'small' | 'medium' | 'large';
  selected?: boolean;
}>`
  ${({ size }) => {
    let boxSize: string;
    switch (size) {
      case 'x-small':
        boxSize = '0.5rem';
        break;
      case 'small':
        boxSize = '0.7rem';
        break;
      case 'medium':
        boxSize = '1rem';
        break;
      case 'large':
        boxSize = '1.5rem';
        break;
      default:
        boxSize = '2rem';
    }
    return `
      width: ${boxSize};
      height: ${boxSize};
    `;
  }}

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-3);

  border-radius: var(--radius-1);
  border: 1px solid ${({ theme, color }) => theme.colors[color]};
  background-color: ${({ theme, selected, color }) =>
    selected ? theme.colors[color] : theme.colors.background};

  cursor: pointer;
  user-select: none;

  &:hover {
    ${({ selected, color, theme }) =>
      !selected &&
      `background-color: ${color === 'primary' ? theme.colors.plum30 : theme.colors.gray10};`}
  }

  &[data-disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Label = styled.label`
  cursor: pointer;
  user-select: none;
`;
