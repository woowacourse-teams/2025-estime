import styled from '@emotion/styled';
import Modal from '@/shared/components/Modal';

export const TextWrapper = styled.div`
  border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
  padding: var(--padding-6);
  border-radius: var(--radius-2);
`;

export const CopyLinkModalContainer = styled(Modal.Container)`
  padding: var(--padding-9) var(--padding-8);
`;
