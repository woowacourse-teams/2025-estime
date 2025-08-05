import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';
import HeatMapCell from './HeatMapCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
interface HeatmapProps {
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
}
const Heatmap = ({ dateTimeSlots, availableDates, roomStatistics }: HeatmapProps) => {
  const timeList = [
    { timeText: 'Dates', isHour: false },
    ...dateTimeSlots.map((timeText) => ({ timeText, isHour: timeText.endsWith(':00') })),
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
