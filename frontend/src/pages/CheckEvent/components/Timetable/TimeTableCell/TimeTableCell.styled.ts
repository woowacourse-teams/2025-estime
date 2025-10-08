import styled from '@emotion/styled';

export const HeaderCell = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray20};
  border-right: 1px solid ${({ theme }) => theme.colors.gray20};
  // 99 => 60% 불투명도
  // 즉, 실제로 보이는 heatmap-preview의 불투명도는 100% - 60% = 40% 불투명도
  background-color: ${({ theme }) => theme.colors.gray10};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-4);
  height: 1.5rem;
  width: 100%;
  user-select: none;
  touch-action: none;
  // 에니메이션은 반응보고 빼도 무관.
  will-change: background-color;
  transition: background-color 0.15s cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    cursor: pointer;
  }

  &.selected {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;
