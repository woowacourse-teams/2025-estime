import ILink from '@/assets/icons/ILink';
import Button from '..';
import { useTheme } from '@emotion/react';
import Text from '@/shared/components/Text';
import Flex from '@/shared/layout/Flex';

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
