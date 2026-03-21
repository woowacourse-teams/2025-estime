import { hexToRgba } from '@/pages/CheckEvent/utils/getCellColor';

import styled from '@emotion/styled';

export const Container = styled.div<{
  weight: number;
  isRecommended?: boolean;
  isPast?: boolean;
}>`
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  pointer-events: none;
  overflow: hidden;

  background-color: ${({ weight, isPast, theme }) => {
    if (isPast) return theme.colors.gray20;
    if (weight > 0) return hexToRgba(theme.colors.primary, weight);
    return theme.colors.background;
  }};

  opacity: ${({ isPast }) => (isPast ? 0.4 : 1)};

  &:hover {
    border: 1.5px dashed ${({ theme }) => theme.colors.gray30};
  }
`;
