import ILink from '@/icons/ILink';
import Button from '../Button';
import { useTheme } from '@emotion/react';
import Text from '@/components/Text';
import { useState } from 'react';
import MiniPopup from '../MiniPopup/MiniPopup';
import Flex from '@/components/Layout/Flex';

const CopyLinkButton = ({ sessionId }: { sessionId: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    const link = `${process.env.DOMAIN_URL}check?id=${sessionId}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const theme = useTheme();
  return (
    <>
      <Flex gap="var(--gap-6)" align="center">
        <Button color="primary" size="small" onClick={handleCopyLink}>
          <ILink color={theme.colors.primary} />
          <Text variant="button" color="primary">
            {'링크 복사'}
          </Text>
        </Button>
        {isCopied && (
          <MiniPopup>
            <Text variant="caption" color="background">
              {'링크 복사되었습니다.'}
            </Text>
          </MiniPopup>
        )}
      </Flex>
    </>
  );
};

export default CopyLinkButton;
