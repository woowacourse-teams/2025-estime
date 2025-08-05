import Wrapper from '../Layout/Wrapper';
import Text from '../Text';
import Flex from '@/components/Layout/Flex';
import { useTheme } from '@emotion/react';
import * as S from './RecommendTime.styled';
import { DateManager } from '@/utils/common/DateManager';

const RecommendTime = ({ dateTimes, isPublic }: { dateTimes: string[]; isPublic: boolean }) => {
  const { colors } = useTheme();

  const parsedDateTimes = dateTimes.map((dateTime) => {
    const [datePart, timePart] = dateTime.split('T');
    const [month, day] = datePart.split('-').slice(1);
    return {
      month: Number(month),
      day: Number(day),
      dayOfWeek: DateManager.getDayOfWeek(datePart),
      time: timePart,
    };
  });

  if (dateTimes.length === 0 || !isPublic) {
    return (
      <Wrapper
        padding="var(--padding-7)"
        backgroundColor={colors.gray20}
        borderRadius="var(--radius-4)"
      >
        <Flex direction="column" gap="var(--gap-5)">
          <Text variant="button">추천 시간대</Text>
          <Wrapper
            center={false}
            maxWidth="100%"
            backgroundColor={colors.gray10}
            borderRadius="var(--radius-4)"
            paddingTop="var(--padding-6)"
            paddingBottom="var(--padding-6)"
            paddingLeft="var(--padding-10)"
            paddingRight="var(--padding-10)"
          >
            <Flex direction="column" gap="var(--gap-2)" align="center">
              <Text>아직 충분한 시간 데이터가 없어요.</Text>
            </Flex>
          </Wrapper>
        </Flex>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      padding="var(--padding-7)"
      backgroundColor={colors.gray20}
      borderRadius="var(--radius-4)"
    >
      <Flex direction="column" gap="var(--gap-5)">
        <Text variant="button">추천 시간대</Text>

        <Wrapper center={false} maxWidth="100%">
          <S.Container>
            <Flex justify="space-around" gap="var(--gap-4)">
              {parsedDateTimes.map(({ month, day, dayOfWeek, time }, index) => (
                <Wrapper
                  key={index}
                  backgroundColor={colors.gray10}
                  borderRadius="var(--radius-4)"
                  paddingTop="var(--padding-6)"
                  paddingBottom="var(--padding-6)"
                  paddingLeft="var(--padding-10)"
                  paddingRight="var(--padding-10)"
                >
                  <Flex direction="column" align="center" gap="var(--gap-3)">
                    <Text variant="button" color="primary">
                      {index + 1}순위
                    </Text>
                    <Flex direction="column" gap="var(--gap-2)" align="center">
                      <Text>{`${month}월 ${day}일 `}</Text>
                      <Text>{dayOfWeek + '요일'}</Text>
                    </Flex>
                    <Text>{time}</Text>
                  </Flex>
                </Wrapper>
              ))}
            </Flex>
          </S.Container>
        </Wrapper>
      </Flex>
    </Wrapper>
  );
};

export default RecommendTime;
