import styled from '@emotion/styled';
import { FlexProps } from '.';

export const Container = styled.div<FlexProps>`
  display: flex;
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  align-items: ${({ align }) => align ?? 'stretch'};
  flex-direction: ${({ direction }) => direction ?? 'row'};
  flex-wrap: ${({ wrap }) => wrap ?? 'nowrap'};
  gap: ${({ gap }) => (gap ? `${gap}px` : '0')};
`;

export const Item = styled.div<{ flex?: number }>`
  flex: ${({ flex }) => flex ?? 'initial'};
`;
