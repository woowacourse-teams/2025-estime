import styled from '@emotion/styled';

export const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  gap: var(--gap-4);
`;

export const Input = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
