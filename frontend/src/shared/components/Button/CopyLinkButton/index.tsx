import Button from '..';
import { useTheme } from '@emotion/react';
import Flex from '@/shared/layout/Flex';
import ICopy from '@/assets/icons/ICopy';
import * as S from './CopyLinkButton.styled';
import ICheck from '@/assets/icons/ICheck';

const CopyLinkButton = ({ isCopied, onClick }: { isCopied: boolean; onClick: () => void }) => {
  const theme = useTheme();

  return (
    <>
      <Flex gap="var(--gap-6)" align="center">
        <Button color={isCopied ? 'green30' : 'primary'} size="x-small" onClick={onClick}>
          <S.ImageWrapper>
            {isCopied ? (
              <ICheck color={theme.colors.green30} />
            ) : (
              <ICopy color={theme.colors.primary} />
            )}
          </S.ImageWrapper>
        </Button>
      </Flex>
    </>
  );
};

export default CopyLinkButton;
