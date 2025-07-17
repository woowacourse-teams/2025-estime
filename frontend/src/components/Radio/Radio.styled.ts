import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  gap: var(--gap-4);
`;

export const Input = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0.125rem;
`;
