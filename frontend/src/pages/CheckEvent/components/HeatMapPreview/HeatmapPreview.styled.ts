import styled from '@emotion/styled';

export const HeatmapContainer = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${({ show }) => (show ? 0.5 : 0)};
  transition: opacity 0.3s ease;
`;
