import styled from '@emotion/styled';
import { zIndex } from '@/constants/styles';
export const Container = styled.header`
  position: sticky;
  z-index: ${zIndex.TimeTableHeader};
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: var(--padding-8);
`;
