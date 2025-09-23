import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import { credits } from '@/constants/credits';
import { SkeletonBox } from '@/shared/components/Skeleton/SkeletonBox';
import * as S from './CreditsPageSkeleton.styled';

const CreditsPageSkeleton = () => {
  return (
    <Wrapper
      maxWidth={1280}
      paddingTop="var(--padding-10)"
      paddingLeft="var(--padding-6)"
      paddingRight="var(--padding-6)"
      paddingBottom="var(--padding-10)"
    >
      <Wrapper
        maxWidth="100%"
        paddingLeft="var(--padding-4)"
        paddingRight="var(--padding-4)"
        paddingBottom="var(--padding-4)"
      >
        <Flex justify="space-between" align="center" gap="var(--gap-4)">
          <SkeletonBox.Title width="30%" />
          <SkeletonBox.Button width="8rem" height="3rem" />
        </Flex>
      </Wrapper>
      <S.CreditCardsContainer>
        {credits.map((_, index) => (
          <SkeletonBox.Block key={index} height="20rem" />
        ))}
      </S.CreditCardsContainer>
    </Wrapper>
  );
};

export default CreditsPageSkeleton;
