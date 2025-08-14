import Modal from '@/components/Modal';
import Flex from '@/components/Layout/Flex';
import * as S from './CopyLinkModal.styled';
import KakaoShareButton from '../KakaoShareButton';
import CopyLinkButton from '../CopyLinkButton';
import { useState } from 'react';
import Text from '../Text';
import Wrapper from '../Layout/Wrapper';

export interface CopyLinkModalProps {
  isCopyLinkModalOpen: boolean;
  sessionId: string;
  onClose: () => void;
}
export const CopyLinkModal = ({ isCopyLinkModalOpen, sessionId, onClose }: CopyLinkModalProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const link = `${process.env.DOMAIN_URL}/check?id=${sessionId}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Modal isOpen={isCopyLinkModalOpen} onClose={onClose} position="center">
      <S.CopyLinkModalContainer>
        <Modal.Header>
          <Text variant="h3">링크 공유하기</Text>
        </Modal.Header>
        <Modal.Content>
          <Wrapper padding="var(--padding-4)">
            <Flex direction="column" align="center" gap="var(--gap-4)">
              <KakaoShareButton />
              <Flex direction="row" align="center" gap="var(--gap-4)">
                <S.TextWrapper>
                  <Text variant="h4" color="gray40">
                    {link}
                  </Text>
                </S.TextWrapper>
                <CopyLinkButton isCopied={isCopied} onClick={handleCopyLink} />
              </Flex>
            </Flex>
          </Wrapper>
        </Modal.Content>
      </S.CopyLinkModalContainer>
    </Modal>
  );
};

export default CopyLinkModal;
