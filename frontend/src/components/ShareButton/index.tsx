import ILink from '@/icons/ILink';
import Button from '../Button';
import { useTheme } from '@emotion/react';
import Text from '@/components/Text';
import Flex from '@/components/Layout/Flex';

const ShareButton = ({ onClick }: { onClick: () => void }) => {
  const theme = useTheme();

  return (
    <>
      <Flex gap="var(--gap-6)" align="center">
        <Button color="primary" size="small" onClick={onClick}>
          <ILink color={theme.colors.primary} />
          <Text variant="button" color="primary">
            공유하기
          </Text>
        </Button>
      </Flex>
    </>
  );
};

export default ShareButton;
