import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import * as S from './TimeTableDay.styled';
import { DateManager } from '@/shared/utils/common/DateManager';
import { memo } from 'react';

interface TimeTableDayProps {
  date: string;
}

const TimeTableDay = memo(({ date }: TimeTableDayProps) => {
  return (
    <S.Container>
      <Text variant="body" color="text">
        <Flex direction="column" justify="center" align="center">
          <Text>{date.split('-').slice(1).join('.')}</Text>
          <Text>({DateManager.getDayOfWeek(date)})</Text>
        </Flex>
      </Text>
    </S.Container>
  );
});

TimeTableDay.displayName = 'TimeTableDay';

export default TimeTableDay;
