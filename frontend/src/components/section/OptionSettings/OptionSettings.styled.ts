import styled from '@emotion/styled';
import { CSSProperties } from 'react';

export const Container = styled.div`
  width: 100%;
`;

export const Wrapper = styled.div<CSSProperties>`
  width: 100%;

  display: flex;
  flex-direction: ${({ flexDirection = 'row' }) => flexDirection};
  justify-content: ${({ justifyContent = 'start' }) => justifyContent};
  align-items: ${({ alignItems = 'stretch' }) => alignItems};
  gap: ${({ gap = '0px' }) => gap};

  padding: ${({ padding = '0' }) => padding};
  border: ${({ border = 'none' }) => border};
  border-radius: ${({ borderRadius = '0rem' }) => borderRadius};
`;
