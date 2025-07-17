import styled from '@emotion/styled';

export const Container = styled.div<{ isOn: boolean }>`
  width: 100%;
  height: 1.6rem;
  padding: var(--padding-2);
  background-color: ${({ theme, isOn }) => (isOn ? theme.colors.primary : theme.colors.gray30)};
  border-radius: var(--radius-25);
  cursor: pointer;
  overflow: hidden;
`;

export const Track = styled.div<{ isOn: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.5s ease;
  transform: ${({ isOn }) => (isOn ? 'translateX(calc(100% - 1.3rem))' : 'translateX(0px)')};
`;

export const Thumb = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  background-color: #ffffff;
  border-radius: 100%;
`;
