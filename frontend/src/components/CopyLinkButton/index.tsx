import ILink from '@/icons/ILink';
import Button from '../Button';
import { useTheme } from '@emotion/react';
import Text from '@/components/Text';

const CopyLinkButton = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  const theme = useTheme();
  return (
    <Button color="primary" size="small" onClick={handleCopyLink}>
      <ILink color={theme.colors.primary} />
      <Text variant="body" color="primary">
        {'링크 복사'}
      </Text>
    </Button>
  );
};

export default CopyLinkButton;
