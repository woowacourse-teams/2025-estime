import { zIndex } from '@/constants/styles';
import styled from '@emotion/styled';

export const Container = styled.div`
  position: fixed;
  top: 100px;
  left: 50%;
  z-index: ${zIndex.toast};
`;

export const Wrapper = styled.div<{ index: number }>`
  width: fit-content;
  position: absolute;
  top: ${({ index }) => `${index * 30}px`};
  transform: translateX(-50%);
`;
