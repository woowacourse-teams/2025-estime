import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import * as S from './VotePageSkeleton.styled';
import { useTheme } from '@emotion/react';
import { SkeletonBox } from '@/shared/components/Skeleton/SkeletonBox';

const VotePageSkeleton = () => {
  const theme = useTheme();

  return (
    <>
      <Wrapper
        maxWidth={1280}
        paddingTop="var(--padding-11)"
        paddingBottom="var(--padding-11)"
        paddingLeft="var(--padding-7)"
        paddingRight="var(--padding-7)"
      >
        <Flex direction="column" gap="var(--gap-6)">
          <Flex gap="var(--gap-5)" justify="space-between" direction="column">
            <Flex gap="var(--gap-6)" align="center">
              <SkeletonBox.Title width="10%" />
              <SkeletonBox.Button width="8rem" height="3rem" />
            </Flex>
            <Flex gap="var(--gap-6)" justify="flex-start" align="center">
              <SkeletonBox.Text width="30%" />
            </Flex>
          </Flex>
          <S.TimeTableContainer>
            <Flex direction="column" gap="var(--gap-8)">
              <S.TimeTableHeaderContainer>
                <S.TextWrapper>
                  <SkeletonBox.Title width="30%" />
                  <SkeletonBox.Text width="50%" />
                </S.TextWrapper>
                <SkeletonBox.Button width="8rem" height="3rem" />
              </S.TimeTableHeaderContainer>
              <Flex direction="column" gap="var(--gap-4)">
                {theme.isMobile && (
                  <Flex gap="var(--gap-3)" justify="flex-end" align="center">
                    <SkeletonBox.Button width="36px" height="36px" />
                    <SkeletonBox.Button width="36px" height="36px" />
                  </Flex>
                )}
                <SkeletonBox.Block height="60rem" />
              </Flex>
            </Flex>
          </S.TimeTableContainer>
        </Flex>
      </Wrapper>
    </>
  );
};

export default VotePageSkeleton;
