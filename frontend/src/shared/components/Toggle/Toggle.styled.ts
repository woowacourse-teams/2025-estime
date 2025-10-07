import styled from '@emotion/styled';

export const Container = styled.div<{ isOn: boolean }>`
  width: 3rem;
  height: 1.6rem;
  padding: 0.2rem;
  background-color: ${({ theme, isOn }) => (isOn ? theme.colors.primary : theme.colors.gray30)};
  border-radius: var(--radius-25);
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

export const Track = styled.div<{ isOn: boolean }>`
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.3s ease;
  transform: ${({ isOn }) => (isOn ? 'translateX(1.4rem)' : 'translateX(0)')};
`;

export const Thumb = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  background-color: #ffffff;
  border-radius: 100%;
`;
