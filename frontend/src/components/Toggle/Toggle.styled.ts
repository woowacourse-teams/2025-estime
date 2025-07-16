import styled from '@emotion/styled';

export const Container = styled.div<{ isOn: boolean }>`
  position: relative;
  width: 100%;
  height: 1.6rem;
  padding: 0.3rem 0.3rem;
  background-color: ${({ theme, isOn }) => (isOn ? theme.colors.primary : theme.colors.gray30)};
  border-radius: var(--radius-25);
  cursor: pointer;
  overflow: hidden;
`;

export const Track = styled.div<{ isOn: boolean }>`
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  transform: ${({ isOn }) => (isOn ? 'translateX(calc(100% - 1.5rem))' : 'translateX(0px)')};
`;

export const Thumb = styled.div`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ffffff;
  border-radius: 100%;
`;
