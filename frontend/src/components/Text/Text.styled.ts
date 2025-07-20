import { ColorsKey, Theme, TypographyKey } from '@/styles/theme';
import styled from '@emotion/styled';

export const Container = styled.span<{ variant: TypographyKey; color: ColorsKey }>`
  ${({ variant, theme }) => getTypographyStyle(variant, theme)};
  ${({ color, theme }) => getColor(color, theme)};
`;

const getTypographyStyle = (variant: TypographyKey, theme: Theme) => {
  const style = theme.typography[variant];

  return `
      font-size: ${style.fontSize};
      font-weight: ${style.fontWeight};
    `;
};

const getColor = (color: ColorsKey, theme: Theme) => {
  return `
      color: ${theme.colors[color]};
    `;
};
