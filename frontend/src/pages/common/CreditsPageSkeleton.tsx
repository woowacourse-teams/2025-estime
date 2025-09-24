import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import { credits } from '@/constants/credits';
import { SkeletonBox } from '@/shared/components/Skeleton/SkeletonBox';
import styled from '@emotion/styled';

export const CreditCardsContainer = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  padding: 1.5rem 0;
  gap: 4rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

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
      <CreditCardsContainer>
        {credits.map((_, index) => (
          <SkeletonBox.Block key={index} height="20rem" />
        ))}
      </CreditCardsContainer>
    </Wrapper>
  );
};

export default CreditsPageSkeleton;
