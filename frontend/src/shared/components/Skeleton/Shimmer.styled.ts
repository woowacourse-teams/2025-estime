import { hexToRgba } from '@/pages/Vote/utils/getCellColor';
import { Theme } from '@/styles/theme';
import { css, keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const shimmerStyle = ({ theme }: { theme: Theme }) => css`
  background: linear-gradient(
    90deg,
    ${hexToRgba(theme.colors.text, 0.04)} 0%,
    ${hexToRgba(theme.colors.text, 0.08)} 40%,
    ${hexToRgba(theme.colors.text, 0.04)} 80%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;
