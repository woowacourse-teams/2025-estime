import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import * as S from './TimeTableDay.styled';
import { DateManager } from '@/shared/utils/common/DateManager';

interface TimeTableDayProps {
  date: string;
}

const TimeTableDay = ({ date }: TimeTableDayProps) => {
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
};

export default TimeTableDay;
