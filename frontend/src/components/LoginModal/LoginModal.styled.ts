import styled from '@emotion/styled';

export const LoginLabel = styled.label<{ required?: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray40};
  &::after {
    content: ${({ required }) => (required ? "'*'" : "''")};
    color: ${({ theme }) => theme.colors.red40};
    margin-left: 0.25rem;
  }
`;
