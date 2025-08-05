import styled from '@emotion/styled';
import Modal from '@/components/Modal';

export const LoginLabel = styled.label<{ required?: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray40};
  margin-bottom: 1.25rem;
  &::after {
    content: ${({ required }) => (required ? "'*'" : "''")};
    color: ${({ theme }) => theme.colors.red40};
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    margin-left: 0.25rem;
  }
`;

export const LoginModalContainer = styled(Modal.Container)`
  padding: var(--padding-8);
`;

export const LoginModalHeader = styled(Modal.Header)`
  margin-bottom: 12px;
`;
