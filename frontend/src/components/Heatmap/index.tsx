import generateTimeList from '@/utils/Calendar/generateTimeList';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';
import HeatMapCell from './HeatMapCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
interface HeatmapProps {
  roomName: string;
  time: {
    startTime: string;
    endTime: string;
  };
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
}
const Heatmap = ({ time, availableDates, roomStatistics }: HeatmapProps) => {
  const { startTime, endTime } = time;

  const startTimeInMinutes = startTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
  const endTimeInMinutes = endTime.split(':').reduce((acc, time) => acc * 60 + +time, 0);
  const interval = 30;

  const timeList = [
    { timeText: 'Dates', isHour: false },
    ...generateTimeList({ startTimeInMinutes, endTimeInMinutes, interval }),
  ];

  return (
    <Flex direction="column" gap="var(--gap-6)">
      <S.HeatMapContent>
        <S.TimeSlotColumn>
          {timeList.map(({ timeText, isHour }) => (
            <S.GridContainer key={timeText}>
              {isHour && (
                <S.TimeLabel>
                  <Text variant="body" color="text">
                    {isHour ? timeText : ''}
                  </Text>
                </S.TimeLabel>
              )}
            </S.GridContainer>
          ))}
        </S.TimeSlotColumn>
        {[...availableDates].map((date) => (
          <Wrapper key={date} center={false}>
            {timeList.map(({ timeText }) => (
              <HeatMapCell
                key={`${date}T${timeText}`}
                date={date}
                timeText={timeText}
                roomStatistics={roomStatistics}
              />
            ))}
          </Wrapper>
        ))}
      </S.HeatMapContent>
    </Flex>
  );
};
export default Heatmap;
