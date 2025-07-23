import { ColorsKey } from '@/styles/theme';
import styled from '@emotion/styled';
import { background } from 'storybook/internal/theming';

export const Container = styled.div<{
  color: ColorsKey;
  backgroundColor?: string;
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
  height: 4rem;
  border-radius: var(--radius-4);
  display: flex;
  align-items: center;
  user-select: none;
  padding-left: var(--padding-5);
  border: 2px solid ${({ theme }) => theme.colors.orange30};

  gap: var(--gap-3);
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : 'var(--info-background)'};
`;
