import { keyframes } from '@emotion/react';

export const shakeScale = keyframes`
0% { transform: scale(1) translateX(0); }
20% { transform: scale(1.01) translateX(-2px); }
40% { transform: scale(1.01) translateX(2px); }
60% { transform: scale(1.01) translateX(-2px); }
80% { transform: scale(1.01) translateX(2px); }
100% { transform: scale(1) translateX(0); }
`;
