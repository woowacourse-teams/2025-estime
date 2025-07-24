import { getDayOfWeek } from '@/utils/Calendar/getDayofWeek';
import Wrapper from '../Layout/Wrapper';
import Text from '../Text';
import Flex from '@/components/Layout/Flex';
import { useTheme } from '@emotion/react';

const RecommendTime = ({ dateTimes }: { dateTimes: string[] }) => {
  const parsedDateTimes = dateTimes.map((dateTime) => {
    const [datePart, timePart] = dateTime.split('T');
    const [month, day] = datePart.split('-').slice(1);
    return {
      month: Number(month),
      day: Number(day),
      dayOfWeek: getDayOfWeek(datePart),
      time: timePart,
    };
  });

  const { colors } = useTheme();

  return (
    <Wrapper
      maxWidth={404}
      padding="var(--padding-7)"
      backgroundColor={colors.gray20}
      borderRadius="var(--radius-4)"
    >
      <Flex direction="column" gap="var(--gap-5)">
        <Text variant="button">추천 시간대</Text>
        <Wrapper center={false} maxWidth="100%">
          <Flex justify="space-around">
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
                  <Text>{`${month}월 ${day}일 (${dayOfWeek})`}</Text>
                  <Text>{time}</Text>
                </Flex>
              </Wrapper>
            ))}
          </Flex>
        </Wrapper>
      </Flex>
    </Wrapper>
  );
};

export default RecommendTime;
