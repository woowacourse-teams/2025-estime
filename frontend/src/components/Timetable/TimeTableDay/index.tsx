import { DateManager } from '@/utils/common/DateManager';
import Flex from '@/components/Layout/Flex';
import Text from '@/components/Text';
import * as S from './TimeTableDay.styled';

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
