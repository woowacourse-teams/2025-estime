import Flex from '@/shared/layout/Flex';
import Wrapper from '@/shared/layout/Wrapper';
import * as S from './CreateEventPageSkeleton.styled';
import { SkeletonBox } from '@/shared/components/Skeleton/SkeletonBox';

const CreateEventPageSkeleton = () => {
  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex justify="space-between" gap="var(--gap-9)">
        <Flex.Item flex={1}>
          <S.CalendarContainer>
            <S.TextWrapper>
              <SkeletonBox.Title width="20%" />
              <SkeletonBox.Text width="70%" />
            </S.TextWrapper>
            <S.CalendarWrapper>
              <Flex direction="column" gap="var(--gap-5)">
                <Flex direction="column" gap="var(--gap-4)">
                  <S.CalendarHeader>
                    <SkeletonBox.Title width="20%" />
                    <Flex gap="var(--gap-4)" align="center" justify="center">
                      <SkeletonBox.Button width="36px" height="36px" />
                      <SkeletonBox.Button width="36px" height="36px" />
                    </Flex>
                  </S.CalendarHeader>
                  <SkeletonBox.Text width="70%" />
                </Flex>
                <S.Calendar />
              </Flex>
            </S.CalendarWrapper>
          </S.CalendarContainer>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Flex direction="column" justify="space-between" gap="var(--gap-8)">
            <S.BasicSettingsContainer>
              <S.InfoWrapper>
                <S.TextWrapper>
                  <SkeletonBox.Title width="20%" />
                  <SkeletonBox.Text width="70%" />
                </S.TextWrapper>
                <SkeletonBox.Input />
              </S.InfoWrapper>
              <S.InfoWrapper>
                <S.TextWrapper>
                  <SkeletonBox.Title width="20%" />
                  <SkeletonBox.Text width="70%" />
                </S.TextWrapper>
                <Flex direction="column" gap="var(--gap-2)">
                  <Flex direction="row" gap="var(--gap-4)">
                    <S.Label>
                      <SkeletonBox.Text width="20%" />
                      <SkeletonBox.Input />
                    </S.Label>
                    <S.Label>
                      <SkeletonBox.Text width="20%" />
                      <SkeletonBox.Input />
                    </S.Label>
                  </Flex>
                </Flex>
              </S.InfoWrapper>
              <S.InfoWrapper>
                <S.TextWrapper>
                  <SkeletonBox.Title width="20%" />
                  <SkeletonBox.Text width="70%" />
                </S.TextWrapper>
                <Flex gap="var(--gap-4)">
                  <SkeletonBox.Input />
                  <SkeletonBox.Input />
                </Flex>
              </S.InfoWrapper>
            </S.BasicSettingsContainer>
            <Flex justify="flex-end">
              <SkeletonBox.Button width="8rem" height="3rem" />
            </Flex>
          </Flex>
        </Flex.Item>
      </Flex>
    </Wrapper>
  );
};

export default CreateEventPageSkeleton;
