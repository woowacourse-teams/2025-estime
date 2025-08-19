import Modal from '@/components/Modal';
import Flex from '@/components/Layout/Flex';
import * as S from './CopyLinkModal.styled';
import KakaoShareButton from '../KakaoShareButton';
import CopyLinkButton from '../CopyLinkButton';
import { useState } from 'react';
import Text from '../Text';
import Wrapper from '../Layout/Wrapper';
import { useToastContext } from '@/contexts/ToastContext';
export interface CopyLinkModalProps {
  sessionId: string;
}
export const CopyLinkModal = ({ sessionId }: CopyLinkModalProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { addToast } = useToastContext();
  const link = `${process.env.DOMAIN_URL}/check?id=${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    addToast({
      type: 'success',
      message: '링크가 복사되었습니다!',
    });
  };

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '약속 시간 정하기',
        description: '지금 방에 들어와서 함께 약속 시간을 정해주세요!',
        imageUrl: `${process.env.AWS_S3_URL}/bether/fe-prod/assets/images/einstime.png`,
        link: {
          mobileWebUrl: link,
          webUrl: link,
        },
      },
    });
  };

  return (
    <S.CopyLinkModalContainer>
      <Modal.Header>
        <Text variant="h3">링크 공유하기</Text>
      </Modal.Header>
      <Modal.Content>
        <Wrapper padding="var(--padding-4)">
          <Flex direction="column" align="center" gap="var(--gap-4)">
            <KakaoShareButton onClick={handleKakaoShare} />
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
  );
};

export default CopyLinkModal;
