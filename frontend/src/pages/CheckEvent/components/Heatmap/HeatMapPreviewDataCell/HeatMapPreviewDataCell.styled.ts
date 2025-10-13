import { hexToRgba } from '@/pages/CheckEvent/utils/getCellColor';

import styled from '@emotion/styled';

export const Container = styled.div<{
  weight: number;
  isRecommended?: boolean;
}>`
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  touch-action: manipulation;
  overflow: hidden;

  background-color: ${({ weight, theme }) =>
    weight > 0 ? hexToRgba(theme.colors.primary, weight) : theme.colors.gray10};

  &:hover {
    border: 1.5px dashed ${({ theme }) => theme.colors.gray30};
  }
`;
