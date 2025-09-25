import { css, keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const shimmerStyle = css`
  background: linear-gradient(90deg, #eeeeee 0%, #f7f7f7 40%, #eeeeee 80%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;
